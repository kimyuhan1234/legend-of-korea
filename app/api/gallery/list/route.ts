import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getActivePass } from '@/lib/auth/pass'

export const dynamic = 'force-dynamic'

export interface GalleryPhoto {
  name: string
  id: string | null
  signedUrl: string | null
}

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const activePass = await getActivePass(user?.id ?? null)
    const hasPass = activePass !== null

    const admin = await createServiceClient()
    const { data: files, error } = await admin.storage
      .from('gallery')
      .list('', { sortBy: { column: 'created_at', order: 'desc' } })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const photos = (files ?? []).filter(
      (f) => !f.name.startsWith('.') && f.name !== '.emptyFolderPlaceholder',
    )

    if (!hasPass) {
      // 비구독자: 파일명만 반환 (URL 없음 → 원본 접근 불가)
      return NextResponse.json({
        hasPass: false,
        photos: photos.map((f) => ({ name: f.name, id: f.id, signedUrl: null })),
      })
    }

    // 구독자: signed URL 발급 (1시간)
    const signedPhotos: GalleryPhoto[] = await Promise.all(
      photos.map(async (file) => {
        const { data } = await admin.storage
          .from('gallery')
          .createSignedUrl(file.name, 3600)
        return { name: file.name, id: file.id, signedUrl: data?.signedUrl ?? null }
      }),
    )

    return NextResponse.json({ hasPass: true, photos: signedPhotos })
  } catch (err) {
    console.error('[gallery/list]', err)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
