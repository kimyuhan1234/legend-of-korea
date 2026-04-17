import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  try {
    // formData를 먼저 파싱 (request body 스트림은 1번만 읽을 수 있음)
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const missionId = formData.get('missionId') as string | null

    if (!file || !missionId) {
      return NextResponse.json({ error: 'file and missionId are required' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 })
    }

    // 인증 확인
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Storage 업로드
    const ext = file.type === 'image/webp' ? 'webp' : file.type === 'image/png' ? 'png' : 'jpg'
    const storagePath = `${user.id}/${missionId}-${Date.now()}.${ext}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const supabaseAdmin = await createServiceClient()

    const { error: uploadError } = await supabaseAdmin.storage
      .from('mission-photos')
      .upload(storagePath, buffer, { contentType: file.type, upsert: false })

    if (uploadError) {
      return NextResponse.json({ error: 'Storage upload failed', detail: uploadError.message }, { status: 500 })
    }

    const { data: { publicUrl } } = supabaseAdmin.storage.from('mission-photos').getPublicUrl(storagePath)

    // DB 저장
    const { error: dbError } = await supabaseAdmin.from('mission_progress').upsert(
      {
        user_id: user.id,
        mission_id: missionId,
        status: 'in_progress',
        photo_url: publicUrl,
        started_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,mission_id' }
    )

    if (dbError) {
      return NextResponse.json({ error: 'Failed to save progress', detail: dbError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, photoUrl: publicUrl })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    const stack = err instanceof Error ? err.stack : ''
    console.error('[mission-register] FATAL:', msg, stack)
    return NextResponse.json({ error: 'Server error', detail: msg }, { status: 500 })
  }
}
