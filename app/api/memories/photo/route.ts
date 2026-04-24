import { createClient, createServiceClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 10 * 1024 * 1024

function extractStoragePath(url: string): string | null {
  // Supabase public URL → 버킷 내 path 추출
  // 형식: https://<project>.supabase.co/storage/v1/object/public/mission-photos/{userId}/{missionId}/{file}
  const m = url.match(/\/mission-photos\/(.+)$/)
  return m?.[1] ?? null
}

// DELETE /api/memories/photo — mission_progress.photo_url 제거 + Storage 파일 삭제
export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient()
    const supabaseAdmin = await createServiceClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })

    const { missionId } = await req.json()
    if (!missionId || typeof missionId !== 'string') {
      return NextResponse.json({ error: 'missionId가 필요합니다.' }, { status: 400 })
    }

    // 1. 대상 행 조회 + 소유권 확인
    const { data: row, error: rowErr } = await supabase
      .from('mission_progress')
      .select('photo_url')
      .eq('user_id',   user.id)
      .eq('mission_id', missionId)
      .maybeSingle()

    if (rowErr || !row) return NextResponse.json({ error: '사진을 찾을 수 없습니다.' }, { status: 404 })

    // 2. Storage 파일 삭제 (실패해도 DB 필드는 비워서 UI는 정리)
    if (row.photo_url) {
      const path = extractStoragePath(row.photo_url)
      if (path) {
        await supabaseAdmin.storage.from('mission-photos').remove([path])
      }
    }

    // 3. photo_url NULL
    const { error: updErr } = await supabase
      .from('mission_progress')
      .update({ photo_url: null })
      .eq('user_id',   user.id)
      .eq('mission_id', missionId)
    if (updErr) throw updErr

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Memories photo DELETE error:', err)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}

// PATCH /api/memories/photo — 기존 파일 삭제 + 새 파일 업로드 + photo_url 갱신
export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient()
    const supabaseAdmin = await createServiceClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const missionId = formData.get('missionId') as string | null

    if (!missionId) return NextResponse.json({ error: 'missionId가 필요합니다.' }, { status: 400 })
    if (!file) return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 })
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: '지원하지 않는 파일 형식입니다.' }, { status: 400 })
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: '파일 크기는 10MB 이하만 가능합니다.' }, { status: 400 })
    }

    // 1. 기존 행 조회 + 소유권
    const { data: row, error: rowErr } = await supabase
      .from('mission_progress')
      .select('photo_url')
      .eq('user_id',   user.id)
      .eq('mission_id', missionId)
      .maybeSingle()
    if (rowErr || !row) return NextResponse.json({ error: '미션 진행 기록이 없습니다.' }, { status: 404 })

    // 2. 새 파일 업로드
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
    const newPath = `${user.id}/${missionId}/${Date.now()}.${ext}`
    const { error: upErr } = await supabaseAdmin.storage
      .from('mission-photos')
      .upload(newPath, file, { cacheControl: '3600', upsert: false })
    if (upErr) {
      console.error('Photo replace upload error:', upErr.message)
      return NextResponse.json({ error: '새 이미지 업로드에 실패했습니다.' }, { status: 500 })
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('mission-photos')
      .getPublicUrl(newPath)

    // 3. DB 업데이트
    const { error: updErr } = await supabase
      .from('mission_progress')
      .update({ photo_url: publicUrl })
      .eq('user_id',   user.id)
      .eq('mission_id', missionId)
    if (updErr) throw updErr

    // 4. 기존 파일 정리 (업데이트 후)
    if (row.photo_url) {
      const oldPath = extractStoragePath(row.photo_url)
      if (oldPath && oldPath !== newPath) {
        await supabaseAdmin.storage.from('mission-photos').remove([oldPath])
      }
    }

    return NextResponse.json({ success: true, url: publicUrl })
  } catch (err) {
    console.error('Memories photo PATCH error:', err)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}
