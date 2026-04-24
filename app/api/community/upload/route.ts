import { createClient, createServiceClient } from '@/lib/supabase/server'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 10 * 1024 * 1024

function safeFilename(name: string): string {
  const ext = (name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '')
  return `${Date.now()}.${ext || 'jpg'}`
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const supabaseAdmin = await createServiceClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: '로그인이 필요합니다.' }, { status: 401 })

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return Response.json({ error: '파일이 없습니다.' }, { status: 400 })

    if (!ALLOWED_TYPES.includes(file.type)) {
      return Response.json(
        { error: '지원하지 않는 파일 형식입니다. (JPEG/PNG/WebP만 가능)' },
        { status: 400 },
      )
    }

    if (file.size > MAX_SIZE) {
      return Response.json({ error: '파일 크기는 10MB 이하만 가능합니다.' }, { status: 400 })
    }

    const filePath = `${user.id}/posts/${safeFilename(file.name)}`

    const { error: upErr } = await supabaseAdmin.storage
      .from('community-photos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (upErr) {
      console.error('Community upload error:', upErr.message)
      return Response.json({ error: '이미지 업로드에 실패했습니다.' }, { status: 500 })
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('community-photos')
      .getPublicUrl(filePath)

    return Response.json({ success: true, url: publicUrl, publicUrl, path: filePath })
  } catch (err) {
    console.error('Community upload route error:', err)
    return Response.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
