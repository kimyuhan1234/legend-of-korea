export interface CityCoord {
  id: string
  name: { ko: string; en: string; ja: string }
  lat: number
  lon: number
}

export const CITY_COORDS: CityCoord[] = [
  { id: 'seoul', name: { ko: '서울', en: 'Seoul', ja: 'ソウル' }, lat: 37.5665, lon: 126.9780 },
  { id: 'busan', name: { ko: '부산', en: 'Busan', ja: '釜山' }, lat: 35.1796, lon: 129.0756 },
  { id: 'jeju', name: { ko: '제주', en: 'Jeju', ja: '済州' }, lat: 33.4996, lon: 126.5312 },
  { id: 'gyeongju', name: { ko: '경주', en: 'Gyeongju', ja: '慶州' }, lat: 35.8562, lon: 129.2247 },
  { id: 'jeonju', name: { ko: '전주', en: 'Jeonju', ja: '全州' }, lat: 35.8242, lon: 127.1480 },
  { id: 'tongyeong', name: { ko: '통영', en: 'Tongyeong', ja: '統営' }, lat: 34.8544, lon: 128.4333 },
  { id: 'cheonan', name: { ko: '천안', en: 'Cheonan', ja: '天安' }, lat: 36.8151, lon: 127.1139 },
  { id: 'yongin', name: { ko: '용인', en: 'Yongin', ja: '龍仁' }, lat: 37.2411, lon: 127.1776 },
  { id: 'icheon', name: { ko: '이천', en: 'Icheon', ja: '利川' }, lat: 37.2720, lon: 127.4350 },
]
