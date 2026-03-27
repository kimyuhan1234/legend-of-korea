import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// Note: Next.js 14 App Router uses NextRequest/NextResponse
// We will use standard Supabase Storage upload or return a signed URL/path
export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const missionId = formData.get('missionId') as string;

    if (!file || !missionId) {
      return Response.json({ error: '파일과 미션 ID가 필요합니다.' }, { status: 400 });
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Response.json({ error: '로그인이 필요합니다.' }, { status: 401 });

    const timestamp = Date.now();
    const ext = file.name.split('.').pop() || 'jpg';
    const filePath = `${user.id}/${missionId}/${timestamp}.${ext}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('mission-photos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Storage Upload Error:', error);
      return Response.json({ error: '이미지 업로드에 실패했습니다.' }, { status: 500 });
    }

    // Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('mission-photos')
      .getPublicUrl(filePath);

    return Response.json({ success: true, url: publicUrl, path: filePath });

  } catch (error) {
    console.error('Upload API Error:', error);
    return Response.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
