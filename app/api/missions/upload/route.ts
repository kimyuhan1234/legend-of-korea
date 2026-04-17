import { createClient, createServiceClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const supabaseAdmin = await createServiceClient();
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const missionId = formData.get('missionId') as string;

    if (!file || !missionId) {
      return Response.json({ error: '파일과 미션 ID가 필요합니다.' }, { status: 400 });
    }

    // 파일 타입 검증
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!ALLOWED_TYPES.includes(file.type)) {
      return Response.json({ error: '지원하지 않는 파일 형식입니다. (JPG, PNG, WEBP, GIF만 가능)' }, { status: 400 });
    }

    // 파일 크기 검증 (10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return Response.json({ error: '파일 크기는 10MB 이하만 가능합니다.' }, { status: 400 });
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Response.json({ error: '로그인이 필요합니다.' }, { status: 401 });

    const timestamp = Date.now();
    const ext = file.name.split('.').pop() || 'jpg';
    const filePath = `${user.id}/${missionId}/${timestamp}.${ext}`;

    // Upload to Supabase Storage (service role로 RLS 우회)
    const { error } = await supabaseAdmin.storage
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
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('mission-photos')
      .getPublicUrl(filePath);

    return Response.json({ 
      success: true, 
      url: publicUrl, 
      publicUrl, 
      path: filePath 
    });

  } catch (error) {
    console.error('Upload API Error:', error);
    return Response.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
