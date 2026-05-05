import { createClient } from '@/lib/supabase/server'

export interface AvatarCategory {
  id: string
  level_required: number
  slug: string
  display_order: number
  default_filename: string | null
}

export interface AvatarImage {
  id: string
  category_id: string
  filename: string
  display_order: number
  is_default: boolean
}

export interface AvatarUserState {
  current_level: number
  selected_avatar_image_id: string | null
  selected_avatar_filename: string | null
  selected_avatar_slug: string | null
}

/**
 * 10 카테고리 + 카테고리당 default 사진 + 모든 사진 list 를 한 번에 로드.
 * 057 미적용 환경에서는 빈 배열 반환 — 호출처가 v1 fallback 처리.
 */
export async function loadAvatarCatalog(): Promise<{
  categories: AvatarCategory[]
  images: AvatarImage[]
}> {
  const supabase = await createClient()

  // avatar_categories + 각 카테고리 default filename
  const [{ data: catData, error: catErr }, { data: imgData, error: imgErr }] = await Promise.all([
    supabase
      .from('avatar_categories')
      .select('id, level_required, slug, display_order')
      .order('level_required', { ascending: true })
      .returns<Array<{ id: string; level_required: number; slug: string; display_order: number }>>(),
    supabase
      .from('avatar_images')
      .select('id, category_id, filename, display_order, is_default')
      .order('display_order', { ascending: true })
      .returns<AvatarImage[]>(),
  ])

  if (catErr || imgErr || !catData || !imgData) {
    // 057 미적용 또는 RLS 거부 시 — 빈 catalog
    return { categories: [], images: [] }
  }

  const defaultByCat = new Map<string, string>()
  for (const i of imgData) {
    if (i.is_default) defaultByCat.set(i.category_id, i.filename)
  }

  const categories: AvatarCategory[] = catData.map((c) => ({
    ...c,
    default_filename: defaultByCat.get(c.id) ?? null,
  }))

  return { categories, images: imgData }
}

/**
 * 현재 로그인 사용자의 아바타 상태 조회.
 * - selected_avatar_image_id 있으면 join 으로 filename + slug 채움
 * - 없으면 본인 레벨 카테고리의 default 사진 자동 매핑 (NULL 보관)
 *
 * 057 미적용 환경 → null 반환 (호출처 v1 fallback)
 */
export async function getAvatarUserState(): Promise<AvatarUserState | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: userRow, error } = await supabase
    .from('users')
    .select('current_level, selected_avatar_image_id')
    .eq('id', user.id)
    .maybeSingle<{ current_level: number | null; selected_avatar_image_id: string | null }>()

  if (error || !userRow) return null

  const currentLevel = Math.min(Math.max(userRow.current_level ?? 1, 1), 10)
  let filename: string | null = null
  let slug: string | null = null

  if (userRow.selected_avatar_image_id) {
    const { data: imgRow } = await supabase
      .from('avatar_images')
      .select('filename, avatar_categories(slug)')
      .eq('id', userRow.selected_avatar_image_id)
      .maybeSingle<{ filename: string; avatar_categories: { slug: string } | null }>()
    if (imgRow) {
      filename = imgRow.filename
      slug = imgRow.avatar_categories?.slug ?? null
    }
  }

  // selected 가 없거나 join 실패 → 본인 레벨 카테고리 default 자동 매핑
  if (!filename || !slug) {
    const { data: defRow } = await supabase
      .from('avatar_categories')
      .select('slug, avatar_images(filename, is_default)')
      .eq('level_required', currentLevel)
      .maybeSingle<{ slug: string; avatar_images: Array<{ filename: string; is_default: boolean }> }>()
    if (defRow) {
      const def = defRow.avatar_images?.find((i) => i.is_default)
      if (def) {
        filename = def.filename
        slug = defRow.slug
      }
    }
  }

  return {
    current_level: currentLevel,
    selected_avatar_image_id: userRow.selected_avatar_image_id,
    selected_avatar_filename: filename,
    selected_avatar_slug: slug,
  }
}
