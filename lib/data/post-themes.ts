// lib/data/post-themes.ts
// 추억남기기 피드의 테마(주제) 필터 정의 — 기존 도시(region) 필터를 대체.
// community_posts.theme 컬럼(migration 039)에 매칭되는 id 값 사용.

export type PostTheme =
  | 'all'      // 필터 전용 (실제 저장 값 아님)
  | 'food'
  | 'spot'
  | 'stay'
  | 'mission'
  | 'culture'
  | 'shopping'
  | 'tip'

export interface PostThemeDef {
  id: PostTheme
  emoji: string
  label: { ko: string; en: string; ja: string; 'zh-CN': string; 'zh-TW': string }
}

export const POST_THEMES: PostThemeDef[] = [
  { id: 'all',      emoji: '📋',  label: { ko: '전체',     en: 'All',      ja: 'すべて',       'zh-CN': '全部',       'zh-TW': '全部' } },
  { id: 'food',     emoji: '🍜',  label: { ko: '맛집',     en: 'Food',     ja: 'グルメ',       'zh-CN': '美食',       'zh-TW': '美食' } },
  { id: 'spot',     emoji: '📍',  label: { ko: '관광지',   en: 'Spots',    ja: '観光地',       'zh-CN': '景点',       'zh-TW': '景點' } },
  { id: 'stay',     emoji: '🏨',  label: { ko: '숙소',     en: 'Stay',     ja: '宿泊',         'zh-CN': '住宿',       'zh-TW': '住宿' } },
  { id: 'mission',  emoji: '🎯',  label: { ko: '미션',     en: 'Mission',  ja: 'ミッション',    'zh-CN': '任务',       'zh-TW': '任務' } },
  { id: 'culture',  emoji: '🎨',  label: { ko: '문화체험', en: 'Culture',  ja: '文化体験',      'zh-CN': '文化体验',   'zh-TW': '文化體驗' } },
  { id: 'shopping', emoji: '🛍️',  label: { ko: '쇼핑',     en: 'Shopping', ja: 'ショッピング', 'zh-CN': '购物',       'zh-TW': '購物' } },
  { id: 'tip',      emoji: '💡',  label: { ko: '팁/정보',  en: 'Tips',     ja: 'ヒント',       'zh-CN': '攻略',       'zh-TW': '攻略' } },
]

// 사용자 선택 가능한 테마 (all 제외) — 글 작성 폼에서 사용
export const SELECTABLE_THEMES = POST_THEMES.filter((t) => t.id !== 'all')

export const VALID_THEME_IDS = new Set<string>(POST_THEMES.map((t) => t.id))

export function getThemeLabel(id: string | null | undefined, locale: string): string {
  if (!id) return ''
  const theme = POST_THEMES.find((t) => t.id === id)
  if (!theme) return ''
  return theme.label[locale as keyof typeof theme.label] || theme.label.en || theme.label.ko
}

export function getThemeEmoji(id: string | null | undefined): string {
  if (!id) return ''
  return POST_THEMES.find((t) => t.id === id)?.emoji ?? ''
}
