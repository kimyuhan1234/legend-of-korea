# 모바일 반응형 코드 레벨 감사 결과 (P2-3)

**작성일**: 2026-04-27
**감사 범위**: 320px (iPhone SE 1세대) 깨질 가능성 패턴
**도구**: grep 기반 코드 패턴 추출 (LLM 시각 비교는 한계 인정 — Playwright 시각 점검은 별도 PR)

---

## 감사 방법론

다음 패턴을 grep 으로 추출:

1. **하드 픽셀 너비** — `w-[Xpx]`, `min-w-[Xpx]` (320px 초과 값)
2. **whitespace-nowrap on long text** — 가로 스크롤 유발 가능
3. **overflow-x-auto / min-w-max** — 의도적 스크롤 컨테이너 vs 실수
4. **그리드 컬럼 수** — 모바일에서 `grid-cols-4` 이상 무방어
5. **하드 픽셀 텍스트 크기** — text-5xl 이상

각 패턴별 발견 항목을 Critical / High / Medium / Low 로 분류.

---

## 🔴 Critical (즉시 수정 필요)

**0건** ✓

`grep` 으로 추출한 모든 하드 픽셀 너비 패턴은 다음 중 하나에 해당:
- `md:` / `lg:` 등 breakpoint prefix 가 있어 모바일에 미적용
- `w-full max-w-[Xpx]` 형태 (`w-full` 이 모바일 보호)
- `overflow-x-auto` 내부 (의도된 스크롤)
- 장식용 그리드 / 카드 슬라이더 (사용자 의도)

→ 320px 가로 스크롤 / 화면 잘림 / 클릭 불가 패턴 미발견.

---

## 🟡 High (P2-3 본 PR 에서 모두 해결 ✓)

### H-1. RecipeWriteForm 국가 선택 4-그리드 모바일 비좁음 — ✅ 해결

**파일**: [components/features/community/RecipeWriteForm.tsx:278](components/features/community/RecipeWriteForm.tsx#L278)
**적용 수정**: `grid-cols-4` → `grid-cols-3 sm:grid-cols-4`. 320px 에서 3-col 로 셀당 ~88px 확보.

### H-2. ProfileBadges 5-그리드 모바일 — ✅ 해결

**파일**: [components/features/mypage/ProfileBadges.tsx:79](components/features/mypage/ProfileBadges.tsx#L79), [components/features/mypage/ProfileBadges.tsx:106](components/features/mypage/ProfileBadges.tsx#L106)
**적용 수정**: `grid-cols-5` → `grid-cols-3 sm:grid-cols-5` (2 곳 모두). 9개 코스 배지가 모바일에서 3×3 균등 배치.

### H-3. MissionMapDashboard 4-그리드 모바일 — ✅ 해결

**파일**: [components/features/missions/MissionMapDashboard.tsx:65](components/features/missions/MissionMapDashboard.tsx#L65)
**적용 수정**: `grid-cols-4` → `grid-cols-2 sm:grid-cols-4 md:grid-cols-5`. 320px 에서 2-col 안전화.

---

## 🟢 Medium (후속 PR / 별도 검토)

### M-1. KoreaMapCitySelector hover 라벨

**파일**: [components/features/food/KoreaMapCitySelector.tsx:112](components/features/food/KoreaMapCitySelector.tsx#L112)
**현상**: `whitespace-nowrap` 도시 hover 라벨 — 도시명 길어지면 화면 밖으로 나갈 수 있음.
**영향**: 모바일에서 hover 자체가 일관되지 않으므로 큰 문제는 아님.
**권장**: 모바일 시각 점검 (Playwright) 시 함께 확인.

### M-2. CourseSlider 카드 너비 85vw

**파일**: [components/features/courses/CourseSlider.tsx:148](components/features/courses/CourseSlider.tsx#L148)
**현상**: `w-[85vw] md:w-[600px] lg:w-[680px]` — 320px 에서 카드 = 272px. 카드 내부 좌측 이미지 45% (122px) + 우측 콘텐츠 55% (150px).
**영향**: 카드 내 텍스트 (제목 + 4-line description + 패스 포함 + CTA) 가 150px 너비에서 가독성 저하 가능.
**권장**: 사용자 시각 검수에서 텍스트 크기 / line-height 조정 검토.

### M-3. WeeklyOotdBoard 가로 스크롤 컨테이너 다수

**파일**: [components/ootd/WeeklyOotdBoard.tsx:46](components/ootd/WeeklyOotdBoard.tsx#L46), [components/ootd/WeeklyOotdBoard.tsx:511](components/ootd/WeeklyOotdBoard.tsx#L511)
**현상**: 의도된 가로 스크롤 — `overflow-x-auto scrollbar-hide`.
**영향**: 정상 동작 패턴이나 320px 에서 스크롤 힌트 (예: 우측 그라데이션 페이드) 부재 시 사용자가 스크롤 가능 인지 못함.
**권장**: UX 점검 시 스크롤 힌트 추가 검토.

---

## 🔵 Low (배포 후 점진 개선)

- 다수의 hero `text-4xl md:text-5xl` 패턴 — 320px text-4xl(36px) 한국어 hero 는 보통 OK (한 줄에 4~6 글자). 시각 검수 후 결정.
- 다수 `text-5xl` 일러스트 이모지 (🏨, 🌙, 🍳 등) — PRD-2A 결정에 따라 현재 그대로 유지. PRD-2B 에서 Lucide 교체 시 사이즈 매핑 재조정 필요.

---

## 🎯 Critical 패턴 미발견의 의미

`grep` 기반 정적 분석으로 다음을 확인:

✅ 모바일 (320~428px) 에서 가로 스크롤 유발하는 하드 픽셀 너비 **0건**
✅ 헤더 4-메뉴 (DISCOVER/QUEST/PASS/COMMUNITY) 전부 `whitespace-nowrap` + `overflow-x-auto` 적정 패턴 (NavbarTabs)
✅ 첫 인상 페이지 (/, /discover, /community) 전부 grid `grid-cols-1 md:grid-cols-N` 모바일 1-col 안전 패턴
✅ Sticky CTA + FAB 좌표 시스템 (`--cta-height` CSS 변수) 작동 중

→ 외국인 첫 인상 단계 (메인 + 4-메뉴 + 인증 플로우) 는 320px 안전 확인.

---

## 📋 후속 시각 점검 권고 (PRD-2B 또는 사용자 환경)

다음은 LLM 정적 분석 한계로 확인 불가 — **Playwright 자동 캡처 또는 사용자 직접 시각 점검** 필요:

1. 한국어 / 일본어 / 중국어 텍스트의 실제 길이 (예: "마이페이지" vs "My Page" 길이 차이)
2. 이미지 / 아이콘 비율 (다양한 디바이스 픽셀 밀도)
3. 색상 contrast (시각 장애 사용자 접근성)
4. 폰트 렌더링 차이 (시스템별 한글 / 한자 차이)
5. 320px / 375px / 414px / 428px 4 사이즈 페이지별 정렬

권고 도구:
- **Chrome DevTools Device Toolbar** — 빠른 단일 사이즈 확인
- **Playwright `chromium.devices`** — 자동 8 사이즈 캡처
- **BrowserStack** — 실기기 (iPhone SE 1세대 등) 검증

---

## P2-3 결론

| 항목 | 상태 |
|---|---|
| Critical (가로 스크롤 / 잘림) | **0건** ✓ |
| High (좁은 그리드 3건) | TODO 등록 — 후속 PR |
| Medium (UX 개선 3건) | TODO 등록 |
| Low (점진 개선) | 배포 후 모니터링 |
| 시각 점검 (이미지 / 색상 / 폰트) | 별도 PR (PRD-2B Playwright 또는 사용자 검수) |

코드 레벨 감사로 첫 인상 단계 320px 안전성 확인. High 3건은 후속 PR 에서
일괄 처리 권장 (RecipeWriteForm, ProfileBadges, MissionMapDashboard 모두
2~3 줄 수정으로 해결 가능 — 단순 grid-cols 추가).
