'use client'

import { PROVINCE_AREA_CODES } from '@/lib/tour-api/area-codes'

type FilterLocale = 'ko' | 'en' | 'ja' | 'zh-CN' | 'zh-TW'

const UI_TEXT: Record<FilterLocale, { region: string; type: string; all: string }> = {
  ko: { region: '지역', type: '숙소 타입', all: '전체' },
  en: { region: 'Region', type: 'Type', all: 'All' },
  ja: { region: '地域', type: 'タイプ', all: 'すべて' },
  'zh-CN': { region: '地区', type: '类型', all: '全部' },
  'zh-TW': { region: '地區', type: '類型', all: '全部' },
}

// 영어/일본어 지역명은 areaCode만 표시 (간결함)
const REGION_NAME_MAP: Record<FilterLocale, Record<string, string>> = {
  ko: {
    '1': '서울', '2': '인천', '3': '대전', '4': '대구', '5': '광주', '6': '부산', '7': '울산',
    '8': '세종', '31': '경기', '32': '강원', '33': '충북', '34': '충남', '35': '경북',
    '36': '경남', '37': '전북', '38': '전남', '39': '제주',
  },
  en: {
    '1': 'Seoul', '2': 'Incheon', '3': 'Daejeon', '4': 'Daegu', '5': 'Gwangju', '6': 'Busan', '7': 'Ulsan',
    '8': 'Sejong', '31': 'Gyeonggi', '32': 'Gangwon', '33': 'Chungbuk', '34': 'Chungnam', '35': 'Gyeongbuk',
    '36': 'Gyeongnam', '37': 'Jeonbuk', '38': 'Jeonnam', '39': 'Jeju',
  },
  ja: {
    '1': 'ソウル', '2': '仁川', '3': '大田', '4': '大邱', '5': '光州', '6': '釜山', '7': '蔚山',
    '8': '世宗', '31': '京畿', '32': '江原', '33': '忠北', '34': '忠南', '35': '慶北',
    '36': '慶南', '37': '全北', '38': '全南', '39': '済州',
  },
  'zh-CN': {
    '1': '首尔', '2': '仁川', '3': '大田', '4': '大邱', '5': '光州', '6': '釜山', '7': '蔚山',
    '8': '世宗', '31': '京畿', '32': '江原', '33': '忠北', '34': '忠南', '35': '庆北',
    '36': '庆南', '37': '全北', '38': '全南', '39': '济州',
  },
  'zh-TW': {
    '1': '首爾', '2': '仁川', '3': '大田', '4': '大邱', '5': '光州', '6': '釜山', '7': '蔚山',
    '8': '世宗', '31': '京畿', '32': '江原', '33': '忠北', '34': '忠南', '35': '慶北',
    '36': '慶南', '37': '全北', '38': '全南', '39': '濟州',
  },
}

// 표준 숙소 타입 9종 (TourAPI cat3 매핑 + "기타")
const STAY_TYPES = ['관광호텔', '한옥', '펜션', '게스트하우스', '리조트', '콘도미니엄', '모텔', '유스호스텔', '민박']

interface Props {
  locale: string
  area: string | null
  stayType: string | null
  onAreaChange: (code: string | null) => void
  onTypeChange: (type: string | null) => void
}

export function StayFilters({ locale, area, stayType, onAreaChange, onTypeChange }: Props) {
  const lc = (locale as FilterLocale) in UI_TEXT ? (locale as FilterLocale) : 'en'
  const t = UI_TEXT[lc]
  const regionNames = REGION_NAME_MAP[lc]

  const regionChips = [
    { code: null as string | null, name: t.all },
    ...Object.values(PROVINCE_AREA_CODES).map((p) => ({
      code: String(p.areaCode),
      name: regionNames[String(p.areaCode)] ?? p.nameKo,
    })),
  ]

  const typeChips = [{ code: null as string | null, name: t.all }, ...STAY_TYPES.map((v) => ({ code: v, name: v }))]

  return (
    <div className="space-y-3">
      <div>
        <p className="text-[10px] font-black text-stone uppercase tracking-widest mb-2">{t.region}</p>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {regionChips.map((chip) => {
            const active = area === chip.code
            return (
              <button
                key={chip.code ?? 'all-region'}
                type="button"
                onClick={() => onAreaChange(chip.code)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  active
                    ? 'bg-mint-deep text-white'
                    : 'bg-white border border-mist text-slate hover:border-mint-deep'
                }`}
              >
                {chip.name}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <p className="text-[10px] font-black text-stone uppercase tracking-widest mb-2">{t.type}</p>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {typeChips.map((chip) => {
            const active = stayType === chip.code
            return (
              <button
                key={chip.code ?? 'all-type'}
                type="button"
                onClick={() => onTypeChange(chip.code)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  active
                    ? 'bg-blossom-deep text-white'
                    : 'bg-white border border-mist text-slate hover:border-blossom-deep'
                }`}
              >
                {chip.name}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
