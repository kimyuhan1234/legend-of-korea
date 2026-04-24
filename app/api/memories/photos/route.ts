import { createClient, createServiceClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 10 * 1024 * 1024

// ═══════════════════════════════════════════════════════════════════
// GET /api/memories/photos
// 로그인 사용자의 사진 포스트 목록 반환 (community_posts 중 photos 배열 비어있지 않은 것)
// 각 항목에 likes_count, comments_count, 내가 좋아요 눌렀는지 포함
// ═══════════════════════════════════════════════════════════════════
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })

    const { data: posts, error } = await supabase
      .from('community_posts')
      .select('id, photos, text, title, created_at, likes_count, mission_id, missions(title, courses(title))')
      .eq('user_id', user.id)
      .eq('is_hidden', false)
      .order('created_at', { ascending: false })

    if (error) throw error

    const filtered = (posts ?? []).filter((p) => {
      const photos = p.photos as unknown
      return Array.isArray(photos) && photos.length > 0
    })

    // 좋아요/댓글 집계
    const postIds = filtered.map((p) => p.id as string)

    const [likesRes, myLikesRes, commentsRes] = await Promise.all([
      postIds.length
        ? supabase.from('community_likes').select('post_id').in('post_id', postIds)
        : Promise.resolve({ data: [] as { post_id: string }[] }),
      postIds.length
        ? supabase.from('community_likes').select('post_id').in('post_id', postIds).eq('user_id', user.id)
        : Promise.resolve({ data: [] as { post_id: string }[] }),
      postIds.length
        ? supabase.from('community_comments').select('post_id').in('post_id', postIds)
        : Promise.resolve({ data: [] as { post_id: string }[] }),
    ])

    const likeCountMap = new Map<string, number>()
    for (const r of (likesRes.data ?? []) as { post_id: string }[]) {
      likeCountMap.set(r.post_id, (likeCountMap.get(r.post_id) ?? 0) + 1)
    }
    const commentCountMap = new Map<string, number>()
    for (const r of (commentsRes.data ?? []) as { post_id: string }[]) {
      commentCountMap.set(r.post_id, (commentCountMap.get(r.post_id) ?? 0) + 1)
    }
    const myLikeSet = new Set<string>((myLikesRes.data ?? []).map((r: { post_id: string }) => r.post_id))

    const photos = filtered.map((p) => {
      const photosArr = (p.photos ?? []) as string[]
      const missionsRow = p.missions as unknown as {
        title?: Record<string, string> | null
        courses?: { title?: Record<string, string> | null } | null
      } | null
      return {
        postId: p.id as string,
        photoUrl: photosArr[0],
        photos: photosArr,
        caption: (p.text as string) ?? '',
        title: (p.title as string) ?? '',
        createdAt: p.created_at as string,
        likesCount: likeCountMap.get(p.id as string) ?? (p.likes_count as number) ?? 0,
        commentsCount: commentCountMap.get(p.id as string) ?? 0,
        liked: myLikeSet.has(p.id as string),
        missionTitle: missionsRow?.title ?? null,
        courseTitle: missionsRow?.courses?.title ?? null,
      }
    })

    return NextResponse.json({ photos })
  } catch (err) {
    console.error('Memories photos GET error:', err)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}

// ═══════════════════════════════════════════════════════════════════
// POST /api/memories/photos
// 파일 업로드 + community_posts 생성 (standalone 포토 포스트)
// multipart formData { file, caption? }
// ═══════════════════════════════════════════════════════════════════
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const supabaseAdmin = await createServiceClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const captionRaw = (formData.get('caption') as string | null) ?? ''
    const caption = captionRaw.trim().slice(0, 500)

    if (!file) return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 })
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: '지원하지 않는 파일 형식입니다.' }, { status: 400 })
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: '파일 크기는 10MB 이하만 가능합니다.' }, { status: 400 })
    }

    // 1. 파일 업로드
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
    const path = `${user.id}/memories/${Date.now()}.${ext}`
    const { error: upErr } = await supabaseAdmin.storage
      .from('community-photos')
      .upload(path, file, { cacheControl: '3600', upsert: false })
    if (upErr) {
      console.error('Memories upload error:', upErr.message)
      return NextResponse.json({ error: '이미지 업로드에 실패했습니다.' }, { status: 500 })
    }
    const { data: { publicUrl } } = supabaseAdmin.storage.from('community-photos').getPublicUrl(path)

    // 2. community_posts 생성
    const { data: post, error: postErr } = await supabase
      .from('community_posts')
      .insert({
        user_id: user.id,
        photos: [publicUrl],
        text: caption || '📸',
        is_spoiler: false,
      })
      .select('id')
      .single()

    if (postErr || !post) {
      console.error('Memories post create error:', postErr?.message)
      // 파일은 남음 — 다음 재시도 때 새 경로로 올라가므로 문제 없음
      return NextResponse.json({ error: '포스트 생성에 실패했습니다.' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      postId: post.id,
      photoUrl: publicUrl,
    })
  } catch (err) {
    console.error('Memories photos POST error:', err)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}
