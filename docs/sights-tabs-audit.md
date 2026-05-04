# /sights 5개 탭 차이점 전수조사

작성: 2026-05-04 / 코드 기반 / commit `f276912` 기준

---

## 1. 현황 요약 (3줄)

- **5개 탭 모두 동일 spot 데이터(`getAllSpots()` ~2,040 entries)를 사용**, 차이는 **시각 형태 + 필터 축**
- **"지도" 탭은 KakaoMap 미사용** — 17+ 광역 작은 이모지 카드 그리드일 뿐. 핸드오버 보고서의 "KakaoMap + 선호도 점수" 기재는 **틀림** (운영자 의심 정확)
- **지도 ↔ 도시별 본질적 중복** (둘 다 광역 카드 → spot list). 나머지 3탭(AI큐레이션/축제/카테고리)은 차별화된 진입축으로 보존 가치 있음

---

## 2. 탭별 상세

### 2-1. AI 큐레이션 (`curation`) — `StyleSlider` + `CurationResult`
- **i18n 라벨**: ko `AI 큐레이션` / ja `AIキュレーション` / en `AI Curation` / zh-CN `AI策展` / zh-TW `AI策展`
- **아이콘**: `Sparkles` (lucide)
- **렌더링**: 2단계 — phase=swipe 시 [StyleSlider.tsx](components/features/spots/StyleSlider.tsx) (5축 슬라이더 + 동행자 선택) → phase=result 시 [CurationResult.tsx](components/features/spots/CurationResult.tsx) (TOP 3 도시 + 매칭 spot)
- **데이터**: `spots` + 사용자 입력 `UserPreference` → `calculateCityScores(preference)` 17 광역 점수화 → `scoreSpots()` 매칭 spot 정렬
- **레이아웃**: 슬라이더 + 동행자 칩 → 결과 화면(레이더 차트 + 도시 카드 + spot 그리드 + 매칭 이유 prose)
- **인터랙션**: 5축 슬라이더 조절 + 동행자 선택 → 자동 점수 재계산 (실시간 미리보기) → "결과 보기" → 결과 페이지
- **차별화 가치**: **사용자 입력 기반 개인화 큐레이션** — 다른 4탭에 없는 유일 기능. PASS 게이팅(`PassBlurOverlay`)으로 결과 일부만 노출.

### 2-2. 지도 (`map`) — `SpotMapView`
- **i18n**: ko `지도` / ja `マップ` / en `Map` / zh-CN `地图` / zh-TW `地圖`
- **아이콘**: `Map` (lucide)
- **렌더링**: [SpotMapView.tsx](components/features/spots/SpotMapView.tsx) — 117줄
- **데이터**: `spots` + `CITIES` (cities.ts 23개 = 17 광역 + 시군구 6개)
- **레이아웃**:
  - 헤더 `🗺️ 지도에서 찾기` + 부제
  - **3-col 작은 이모지 카드 23개** (`grid-cols-3`) — 이모지 + 도시명 + spot 수
  - 클릭 시 해당 도시 spot 카테고리별(hotspot/landmark/festival) 3-col 카드
- **인터랙션**: 카드 토글 (다시 클릭하면 해제), 광역+시군구 모두 별개 카드
- **region 필터 로직**: `s.region === selectedCity` (정확 매칭, 시 단위 합산 X)
- **🚨 핵심 발견**: **`KakaoMap` 컴포넌트 미사용**. 라벨/이모지(🗺️)는 "지도"지만 실제로는 카드 그리드. lib/kakao-map.ts SDK 로드 안 함. 진짜 지도 시각화 X.
- **차별화 가치**: 작은 이모지 카드 + spot 수 즉시 노출 (시군구 단위 별개 카드) — 도시별 탭과 본질적 중복. **유일 차별점은 시군구 6 카드를 별도로 노출**.

### 2-3. 축제 (`festival`) — `FestivalCalendar`
- **i18n**: ko `축제` / ja `フェスティバル` / en `Festivals` / zh-CN `节庆` / zh-TW `節慶`
- **아이콘**: `Calendar` (lucide)
- **렌더링**: [FestivalCalendar.tsx](components/features/spots/FestivalCalendar.tsx)
- **데이터**: `spots.filter(s => s.category === 'festival')` + `eventStartDate`/`eventEndDate` 파싱
- **레이아웃**: 월 단위 캘린더 (year/month state) + 좌우 화살표 네비 + region 필터 + 축제 카드 list
- **인터랙션**: 월 이동(이전/다음), region 칩 토글, 축제별 status(`ongoing`/`upcoming`/`ended`) 색상 구분
- **차별화 가치**: **시간축(월별)** + **status(현재 진행/예정/종료)** — 다른 4탭에 없는 유일 시간 기반 뷰. 사용자가 여행 일정에 맞는 축제 찾기 적합.

### 2-4. 카테고리 (`category`) — `SpotCategoryView`
- **i18n**: ko `카테고리` / ja `カテゴリ` / en `Category` / zh-CN `分类` / zh-TW `分類`
- **아이콘**: `Folder` (lucide)
- **렌더링**: [SpotCategoryView.tsx](components/features/spots/SpotCategoryView.tsx)
- **데이터**: `spots.filter(s => s.category === category && (region ? s.region === region : true))`
- **레이아웃**: 카테고리 탭 3개(hotspot/landmark/festival) + 카운트 + 도시 chip 필터(전체+CITIES) → spot 카드 3-col
- **인터랙션**: 카테고리 탭 클릭(region 자동 리셋) + 도시 칩 가로 스크롤 → 다중 필터링
- **region 필터 로직**: `s.region === region` (정확 매칭, 시 단위 합산 X)
- **차별화 가치**: **카테고리 우선축 + 도시 보조 필터** — 도시별 탭(도시 우선축)과 정반대 진입. 사용자가 "축제만 보고 싶다"/"명소만 보고 싶다" 의도일 때 적합.

### 2-5. 도시별 (`city`) — `SpotCityView`
- **i18n**: ko `도시별` / ja `都市別` / en `By City` / zh-CN `按城市` / zh-TW `按城市`
- **아이콘**: `Building2` (lucide)
- **렌더링**: [SpotCityView.tsx](components/features/spots/SpotCityView.tsx) — `f276912` 작업으로 2단계 네비게이션 재작성
- **데이터**: `spots` + `CITY_TO_PROVINCE` 시 → 광역 reverse map (시 단위 spot 자동 합산)
- **레이아웃**:
  - 1단계: **17 광역 큰 이미지 카드 그리드** (`grid-cols-2 sm:cols-3 md:cols-4`) — 한복 일러스트 + 그라데이션 오버레이 + 도시명 + spot 수
  - 2단계: 16:9 광역 헤더 이미지 + vibe 카피 + 카테고리별 spot list + 미션 CTA
- **인터랙션**: 카드 클릭 → setSelectedCity → spot list / "← 다른 광역" 버튼 → 카드 그리드 복귀 (URL 무변경)
- **region 필터 로직**: `getProvinceFor(s.region) === selectedCity` — **시 단위 region(jeonju/gyeongju/...) 부모 광역에 자동 합산**
- **차별화 가치**: 큰 이미지 카드 + 한국 무드 강화(한복 일러스트) + 광역 vibe 카피 + 미션 CTA + 시→광역 합산 → 외국인 첫 진입 친화적

---

## 3. 중복 판정

### 3-1. 지도 vs 도시별 — **본질적 중복**
| 항목 | 지도 | 도시별 |
|---|---|---|
| 데이터 | spots | spots |
| 그리드 | 3-col 작은 이모지 카드 | 4-col 큰 이미지 카드 |
| 카드 수 | 23 (17 광역 + 시군구 6) | **17** (광역만, 시 단위 자동 합산) |
| 클릭 결과 | 같은 페이지 spot list | 같은 페이지 spot list |
| 시 단위 합산 | ❌ 별개 카드 | ✅ 부모 광역에 합산 |
| KakaoMap | ❌ 미사용 | ❌ 미사용 |
| 한국 무드 | 이모지 (★) | 한복 일러스트 + vibe (★★★★) |
| 미션 연결 | ❌ | ✅ 미션 CTA |

**판정**: **도시별이 지도의 상위 호환**. 지도 탭의 유일 차별점인 "시군구 6 별개 카드"는 도시별이 시→광역 합산으로 흡수. KakaoMap이 들어가지 않은 한 본질적 중복.

### 3-2. 카테고리 vs 도시별 — **차별화됨, 보존 권장**
- 진입축이 정반대 (카테고리 우선 vs 도시 우선). 사용자 의도에 따른 선택.
- 단점: 카테고리 탭의 도시 chip이 23개라 가로 스크롤 부담 큼.

### 3-3. 카테고리 vs 축제 — **차별화됨, 보존 권장**
- 축제는 카테고리의 한 종류이지만, **시간축(월 캘린더) + status**를 추가 제공. 카테고리 탭의 축제 필터로는 시간 기반 탐색 불가.

### 3-4. AI 큐레이션 vs 나머지 — **차별화됨, 보존 필수**
- AI 큐레이션은 **사용자 입력 → 매칭** (다른 4탭은 spot 자체 탐색).
- 메타 탭 성격으로 핵심 가치 명확. PASS 게이팅 콘텐츠로 결제 동선과도 연결.

---

## 4. 통합 권장안

### 권장 구조: 5탭 → **4탭**

```
Before:                          After:
├ AI 큐레이션  ← 보존              ├ AI 큐레이션
├ 지도        ← 도시별로 통합  →  ├ 축제 (시간축)
├ 축제        ← 보존              ├ 카테고리 (카테고리 우선축)
├ 카테고리    ← 보존              └ 도시별 (도시 우선축, 17 광역 이미지 카드)
└ 도시별      ← 보존
```

### 통합 작업 시 변경 사항
1. [SpotsClient.tsx](components/features/spots/SpotsClient.tsx) `TABS` 배열에서 `map` 항목 제거 (5 → 4)
2. `SpotMapView.tsx` 파일 삭제 OR 비활성 보관 (다른 곳에서 import 0건이면 삭제)
3. 메시지 5개국어 `spots.tab.map` 키 제거 (또는 보존 — 사용 안 함)
4. 기본 활성 탭(`useState<TabId>('curation')`)은 그대로 (curation 첫 진입 변경 없음)

### 운영자 결정 필요 (★ 본 보고서의 핵심)

**Q1. 지도 탭 처리 방향?**
- **A안**: 지도 탭 **완전 제거** → 도시별 단일화. 가장 깔끔. 사용자 인지 부담 ↓.
- **B안**: 지도 탭 **유지하되 진짜 KakaoMap 추가** → 17 광역 마커 + 클릭 시 spot 표시. 차별화 명확하지만 신규 작업 비용 발생 (KakaoMap SDK 이미 lib/kakao-map.ts 존재해 비용 ↓).
- **C안**: 지도 탭 그대로 유지 (작은 이모지 카드 — 시군구 단위 진입점) → 도시별과 별개 가치로 보존. 권장 X (운영자 의심대로 중복).

**Q2. 카테고리 탭의 도시 chip 23개 → 17개로 축소?**
- 도시별과 동일한 시→광역 합산 로직 적용 가능. 가로 스크롤 부담 ↓.

**Q3. 축제 탭의 region 필터에도 시→광역 합산 적용?**
- 현재는 `s.region === region` 정확 매칭. 적용 시 광역 칩만 23 → 17.

---

## 부록 — 코드 위치 / 컴포넌트 트리

### 컴포넌트 트리
```
SpotsClient (client component)
├ TABS 배열 (5개)
├ phase state ('swipe' | 'result') — curation 탭 전용
├ activeTab state ('curation' | 'map' | 'festival' | 'category' | 'city')
├ preference state (curation 입력)
├ Hero (bg-tier-soft)
├ TabNav (sticky top-0, 5 버튼 가로 스크롤)
└ TabContent
    ├ curation:
    │   ├ phase=swipe → StyleSlider (5축 + 동행자 + 실시간 미리보기 레이더)
    │   └ phase=result → CurationResult (TOP 3 도시 + spot 매칭 + PassBlurOverlay)
    ├ map → SpotMapView (3-col 23 이모지 카드 → spot list)
    ├ festival → FestivalCalendar (월 캘린더 + region 칩 + 축제 카드)
    ├ category → SpotCategoryView (3 카테고리 탭 + 도시 칩 + 3-col 카드)
    └ city → SpotCityView (4-col 17 이미지 카드 → 광역 헤더 + spot list)
```

### 핵심 파일
- [components/features/spots/SpotsClient.tsx](components/features/spots/SpotsClient.tsx) — 5탭 컨테이너 (line 24-30 `TABS` 배열)
- [components/features/spots/SpotMapView.tsx](components/features/spots/SpotMapView.tsx) (117줄) — "지도" 탭, **KakaoMap 미사용**
- [components/features/spots/SpotCityView.tsx](components/features/spots/SpotCityView.tsx) — "도시별" (`f276912`로 재작성)
- [components/features/spots/SpotCategoryView.tsx](components/features/spots/SpotCategoryView.tsx) — "카테고리"
- [components/features/spots/FestivalCalendar.tsx](components/features/spots/FestivalCalendar.tsx) — "축제"
- [components/features/spots/StyleSlider.tsx](components/features/spots/StyleSlider.tsx) + [CurationResult.tsx](components/features/spots/CurationResult.tsx) — "AI 큐레이션"
- [lib/curation/cities.ts](lib/curation/cities.ts) — `CITIES` 23개 (17 광역 + 시군구 6 레거시)
- [lib/curation/scoring.ts](lib/curation/scoring.ts) — `calculateCityScores` 큐레이션 점수화

### 핸드오버 보고서 정정 사항
[docs/mentoring-handover.md](docs/mentoring-handover.md):**3-3. /sights — 5 탭 정보 집약 페이지**의 `map: SpotMapView (KakaoMap + 선호도 점수)` 기재는 **틀림**.
- 정정: `map: SpotMapView (3-col 이모지 카드 그리드, KakaoMap 미사용)`
- 운영자 의심대로 핸드오버 보고서가 코드와 일치하지 않는 부분이 발견된 두 번째 사례 (이전: 헤더 QUEST 탭 라벨 / ZEP audit 보고서 부재).

---

**보고서 끝.** 본 보고서 기반 운영자 결정 후 별도 사양으로 통합 작업 진행 권장.
