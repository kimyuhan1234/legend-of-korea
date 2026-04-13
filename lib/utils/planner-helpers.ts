// 플래너 공통 헬퍼 — PlannerFinalPlan, PlannerPreview 등에서 공유

type ItemType = 'food' | 'stay' | 'diy' | 'quest' | 'ootd' | 'goods' | 'transport' | 'surprise'

interface PlanItem {
  id: string
  item_type: ItemType
  item_data: Record<string, unknown>
}

// ── i18n 텍스트 추출 ──
function extractI18n(field: unknown, locale: string): string {
  if (typeof field === 'string') return field
  if (field && typeof field === 'object') {
    const obj = field as Record<string, string>
    return obj[locale] || obj.ko || obj.en || ''
  }
  return ''
}

// ── 아이템 이름 추출 (모든 item_type 대응) ──
export function getItemName(item: PlanItem, locale: string): string {
  const d = item.item_data
  if (!d) return item.item_type

  // 1. OOTD — checkedItems 합성
  if (item.item_type === 'ootd') {
    const checked = d.checkedItems as Array<{ name?: string; icon?: string }> | undefined
    if (checked && checked.length > 0) {
      return checked.map((c) => c.name || c.icon || '').filter(Boolean).join(', ') || 'OOTD'
    }
    return 'OOTD'
  }

  // 2. transport — from → to (TYPE)
  if (item.item_type === 'transport') {
    const from = extractI18n(d.from, locale)
    const to = extractI18n(d.to, locale)
    const typeName = typeof d.type === 'string' ? d.type.toUpperCase() : ''
    if (from && to) return `${from} → ${to} (${typeName})`
    // fallback to name field
    const name = extractI18n(d.name, locale)
    if (name) return name
  }

  // 3. name 필드 (가장 흔함: food, stay, goods, kfood-spot, diy 등)
  if (d.name) {
    const n = extractI18n(d.name, locale)
    if (n) return n
  }

  // 4. foodName (taste-match, ai-dupe 등)
  if (d.foodName) {
    const n = extractI18n(d.foodName, locale)
    if (n) return n
  }

  // 5. courseName (quest)
  if (d.courseName) {
    const n = extractI18n(d.courseName, locale)
    if (n) return n
  }

  // 6. kitName (quest kit)
  if (d.kitName) {
    const n = extractI18n(d.kitName, locale)
    if (n) return n
  }

  // 7. nameKey (diy workshop — key는 번역 시스템에서 사용하지만 여기선 그대로)
  if (d.nameKey) {
    const n = extractI18n(d.nameKey, locale)
    if (n) return n
  }

  // 8. productName (goods)
  if (d.productName) {
    const n = extractI18n(d.productName, locale)
    if (n) return n
  }

  // 9. stayName / hotelName
  if (d.stayName) {
    const n = extractI18n(d.stayName, locale)
    if (n) return n
  }
  if (d.hotelName) return String(d.hotelName)

  // 10. title
  if (d.title) {
    const n = extractI18n(d.title, locale)
    if (n) return n
  }

  // 11. speciality (kfood-spot)
  if (d.speciality) {
    const n = extractI18n(d.speciality, locale)
    if (n) return n
  }

  // 12. 최종 폴백: item_data의 첫 번째 짧은 문자열 값
  const firstString = Object.values(d).find(
    (v) => typeof v === 'string' && v.length > 1 && v.length < 50
  )
  if (firstString) return firstString as string

  return item.item_type
}

// ── 도시 필터 (교통/OOTD는 도시 무관) ──
export function filterItemsByCity(items: PlanItem[], cityId: string): PlanItem[] {
  if (!cityId) return items
  return items.filter((item) => {
    // 교통, OOTD는 도시 무관 — 항상 포함
    if (['transport', 'ootd'].includes(item.item_type)) return true

    // 아이템 데이터에서 도시 코드 추출
    const d = item.item_data
    const itemCity = (d.cityId || d.city_id || d.region || d.regionCode) as string | undefined

    // 도시 정보 없으면 일단 포함
    if (!itemCity) return true

    return itemCity === cityId
  })
}

// ── 교통편 도착 시간 기반 1일차 시작 시간 계산 ──
export function getFirstDayStartTime(transportItems: PlanItem[]): string {
  const goingTransport = transportItems.find(
    (i) => i.item_data?.direction === 'going'
  )
  if (!goingTransport) return '09:00'

  const arrivalTime =
    (goingTransport.item_data.arrivalTime as string) ||
    (goingTransport.item_data.estimatedArrival as string)
  if (!arrivalTime) return '09:00'

  const [h, m] = arrivalTime.split(':').map(Number)
  if (isNaN(h) || isNaN(m)) return '09:00'

  // 도착 후 30분 여유, 30분 단위 올림
  const totalMin = h * 60 + m + 30
  const roundedMin = Math.ceil(totalMin / 30) * 30
  const startH = Math.floor(roundedMin / 60) % 24
  const startM = roundedMin % 60

  return `${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')}`
}

// ── 마지막날 종료 시간 (오는편 출발 1시간 전) ──
export function getLastDayEndTime(transportItems: PlanItem[]): string {
  const returningTransport = transportItems.find(
    (i) => i.item_data?.direction === 'returning'
  )
  if (!returningTransport) return '20:00'

  const departureTime =
    (returningTransport.item_data.departureTime as string) ||
    (returningTransport.item_data.time as string)
  if (!departureTime) return '20:00'

  const [h, m] = departureTime.split(':').map(Number)
  if (isNaN(h) || isNaN(m)) return '20:00'

  // 출발 1시간 전까지만 일정
  const endMin = h * 60 + m - 60
  if (endMin < 540) return '09:00' // 최소 9시

  const endH = Math.floor(endMin / 60)
  return `${String(endH).padStart(2, '0')}:00`
}
