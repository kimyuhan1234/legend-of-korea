import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  // Auth check
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Parse form data
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const missionId = formData.get('missionId') as string | null;
  const courseId = formData.get('courseId') as string | null;

  if (!file || !missionId) {
    return NextResponse.json(
      { error: 'file and missionId are required' },
      { status: 400 }
    );
  }

  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: 'Invalid file type. Allowed: JPEG, PNG, WebP' },
      { status: 400 }
    );
  }

  // Validate file size
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: 'File too large. Maximum: 5MB' },
      { status: 400 }
    );
  }

  // Build storage path
  const ext = file.type === 'image/webp' ? 'webp' : file.type === 'image/png' ? 'png' : 'jpg';
  const storagePath = `mission-photos/${user.id}/${missionId}-${Date.now()}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const supabaseAdmin = await createServiceClient();

  const { error: uploadError } = await supabaseAdmin.storage
    .from('mission-photos')
    .upload(storagePath, buffer, { contentType: file.type, upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: 'Storage upload failed' }, { status: 500 });
  }

  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from('mission-photos').getPublicUrl(storagePath);

  // Upsert mission_progress record
  const { error: dbError } = await supabaseAdmin.from('mission_progress').upsert(
    {
      user_id: user.id,
      mission_id: missionId,
      course_id: courseId ?? null,
      status: 'in_progress',
      photo_url: publicUrl,
      started_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,mission_id' }
  );

  if (dbError) {
    return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 });
  }

  return NextResponse.json({ success: true, photoUrl: publicUrl });
}
