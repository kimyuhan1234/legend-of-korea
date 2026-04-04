export const REGIONS = [
  { code: 'all', name: { ko: '전체', ja: '全て', en: 'All' } },
  { code: 'jeonju', name: { ko: '전주', ja: '全州', en: 'Jeonju' } },
  { code: 'tongyeong', name: { ko: '통영', ja: '統営', en: 'Tongyeong' } },
  { code: 'gyeongju', name: { ko: '경주', ja: '慶州', en: 'Gyeongju' } },
  { code: 'seoul', name: { ko: '서울', ja: 'ソウル', en: 'Seoul' } },
  { code: 'busan', name: { ko: '부산', ja: '釜山', en: 'Busan' } },
  { code: 'jeju', name: { ko: '제주', ja: '済州', en: 'Jeju' } },
];

export function getRegionName(code: string, locale: string): string {
  const region = REGIONS.find(r => r.code === code) || REGIONS[0];
  return (region.name as any)[locale] || region.name.en;
}
