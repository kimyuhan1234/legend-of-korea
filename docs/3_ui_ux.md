# Legend of Korea — UI/UX Design Document

> 최종 수정: 2026-04-07  
> 스택: Next.js 14 App Router + Tailwind CSS 4 + shadcn/ui

---

## 1. 디자인 토큰

### 색상

| 토큰 | HEX | 용도 |
|------|-----|------|
| `primary` | `#1B2A4A` | 헤더, 강조 텍스트, 주요 배경 |
| `accent` | `#D4A843` | CTA 버튼, 뱃지, 포인트 컬러 |
| `background` | `#F5F0E8` | 페이지 기본 배경 (크림색) |
| `surface` | `#FFFFFF` | 카드, 모달 배경 |
| `border` | `#e8ddd0` | 카드 테두리, 구분선 |
| `text-secondary` | `#7a6a58` | 설명 텍스트, 서브 레이블 |
| `text-muted` | `#a8998a` | 비활성, placeholder |

### 그라디언트

```css
/* 히어로 섹션 배경 */
background: #1B2A4A;

/* 이미지 위 오버레이 */
background: linear-gradient(to top, rgba(27,42,74,0.6), transparent);

/* accent 글로우 */
background: rgba(212,168,67,0.2);
border: 1px solid rgba(212,168,67,0.3);
```

### 타이포그래피

| 용도 | 클래스 |
|------|--------|
| 페이지 제목 | `text-3xl md:text-4xl font-black` |
| 섹션 제목 | `text-xl font-black text-[#1B2A4A]` |
| 카드 제목 | `text-lg font-bold` |
| 본문 | `text-sm text-[#7a6a58] leading-relaxed` |
| 뱃지/라벨 | `text-xs font-medium` |

### 반응형 브레이크포인트

| 이름 | 값 |
|------|-----|
| sm | 640px |
| md | 768px |
| lg | 1024px |
| max-width | `max-w-6xl mx-auto px-4` |

---

## 2. 공통 컴포넌트

### 히어로 섹션 패턴
```tsx
<section className="bg-[#1B2A4A] text-white py-14">
  <div className="max-w-6xl mx-auto px-4 text-center">
    {/* 뱃지 */}
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                    bg-[#D4A843]/20 border border-[#D4A843]/30 mb-5">
      <span className="text-[#D4A843] text-sm font-medium">{badge}</span>
    </div>
    {/* 제목 */}
    <h1 className="text-3xl md:text-4xl font-black mb-4 whitespace-pre-line">
      {title}
    </h1>
    {/* 서브타이틀 */}
    <p className="text-white/70 text-lg whitespace-pre-line max-w-xl mx-auto">
      {subtitle}
    </p>
  </div>
</section>
```

### 카드 (클릭 가능)
```tsx
<Link className="group bg-white rounded-3xl border border-[#e8ddd0]
                 hover:border-[#D4A843]/50 hover:shadow-md
                 transition-all overflow-hidden">
  {/* 이미지 영역 h-44 */}
  {/* 콘텐츠 p-5 */}
</Link>
```

### 카드 (비활성 / 준비 중)
```tsx
<div className="bg-white rounded-3xl border border-[#e8ddd0]/60
                overflow-hidden opacity-60 cursor-not-allowed">
  {/* 이미지에 grayscale 클래스 추가 */}
  {/* 준비 중 뱃지: "🕐 준비 중" */}
</div>
```

### 탭 네비게이션 (FoodTabNav 패턴)
- 탭 클릭 시 `href` 이동 방식 (Server Component 친화적)
- 활성 탭: `border-b-2 border-[#D4A843] text-[#1B2A4A]`
- 비활성 탭: `text-[#7a6a58] hover:text-[#1B2A4A]`

---

## 3. 페이지별 라우트 구조

```
app/
└── [locale]/           # ko | ja | en
    ├── page.tsx                    # 메인 랜딩
    ├── story/
    │   ├── page.tsx               # 스토리 (미션 키트 탐색)
    │   └── tabs/
    │       ├── CoursesTab.tsx     # 코스 목록 탭
    │       └── ...
    ├── food/
    │   ├── dupe/
    │   │   ├── page.tsx           # 지역 선택 (9개 도시 그리드)
    │   │   └── [region]/
    │   │       └── page.tsx       # 해당 지역 음식 듀프 목록
    │   ├── flag-cooking/
    │   │   └── page.tsx           # 국기별 퓨전 레시피 (12개국 68개)
    │   ├── spots/
    │   │   └── page.tsx           # 전국 맛집 스팟
    │   ├── stay/
    │   │   └── page.tsx           # 추천 숙소
    │   └── sights/
    │       └── page.tsx           # 관광지
    ├── community/
    │   ├── page.tsx               # 커뮤니티 목록
    │   └── [postId]/
    │       └── page.tsx           # 게시글 상세
    └── auth/
        └── callback/
            └── route.ts           # OAuth 콜백
```

---

## 4. 페이지별 UI 설계

### 4.1 메인 랜딩 (`/`)

**섹션 구성:**
1. Hero — 전래동화 분위기의 배경 + 서비스 태그라인
2. 코스 미리보기 — 활성 코스 카드 (최대 3개)
3. 서비스 특징 3단 구성 (미션 / LP / 커뮤니티)
4. CTA — "지금 코스 탐색하기"

---

### 4.2 스토리 / 코스 탐색 (`/story`)

**탭 구성:**
- 미션 키트 코스 (CoursesTab)
- 여행 일정 제안
- 미션 프리뷰

**CoursesTab 동작:**
- Supabase에서 전체 코스 조회 (`USING (true)` RLS)
- `is_active = true` → 정상 카드 (구매 버튼 활성)
- `is_active = false` → "준비 중" 뱃지 카드 (구매 버튼 비활성)
- 가격 표시: `price_1p`원 (1인) / `price_2p`원 (2인)

---

### 4.3 음식 듀프 지역 선택 (`/food/dupe`)

**레이아웃:** `grid sm:grid-cols-2 lg:grid-cols-3 gap-5`

**도시 카드 (9개):**
| 도시 | 코드 | 아이콘 | 상태 |
|------|------|--------|------|
| 전주 | jeonju | 🏛️ | foods > 0 (활성) |
| 서울 | seoul | 🏙️ | foods > 0 (활성) |
| 통영 | tongyeong | 🌊 | foods > 0 (활성) |
| 제주 | jeju | 🏝️ | foods > 0 (활성) |
| 부산 | busan | 🌉 | foods > 0 (활성) |
| 경주 | gyeongju | 👑 | foods > 0 (활성) |
| 천안 | cheonan | 🌰 | foods > 0 (활성) |
| 용인 | yongin | 🏘️ | foods > 0 (활성) |
| 이천 | icheon | 🍚 | foods > 0 (활성) |

**카드 클릭 → `/food/dupe/[region]`**  
foods가 비어있으면 상세 페이지에서 "콘텐츠 준비 중" 안내 (크래시 없음)

---

### 4.4 음식 듀프 상세 (`/food/dupe/[region]`)

**구성:**
1. 지역 히어로 이미지 + 이름
2. 음식 카드 그리드 (foods 배열 기반)
3. 음식 클릭 → 모달 or 상세 뷰:
   - 음식 이름 (3개국어)
   - storyDescription
   - tasteProfile 레이더 차트
   - dupes 목록 (외국 음식 매칭)
   - similarityPercent 시각화

**빈 foods 처리:**
```tsx
{region.foods.length === 0
  ? <EmptyState icon="🍽️" text={t.comingSoon} />
  : <FoodGrid foods={region.foods} />
}
```

---

### 4.5 국기 퓨전 레시피 (`/food/flag-cooking`)

**히어로 서브타이틀:** "12개국 × 한국 식재료로 만든 창작 퓨전 레시피 68가지"

**12개국 탭/필터:**
`jp` `it` `mx` `th` `us` `fr` `in` `vn` `cn` `id` `es` `my`

**레시피 카드:** 이미지 + 이름 + difficulty + cookTime

---

### 4.6 커뮤니티 기록관 (`/community`)

**게시글 카드:** 썸네일 + 제목 + 작성자 닉네임 + 코스명 + 날짜 + 좋아요  
**작성 조건:** 로그인 필요  
**댓글 API:** `POST/GET /api/community/posts/[postId]/comments`

---

## 5. 컴포넌트 트리 (주요)

```
components/
├── features/
│   ├── food/
│   │   ├── FoodTabNav.tsx         # 음식 섹션 탭 (dupe/flagcooking/spots/stay/sights)
│   │   └── TasteRadarChart.tsx    # tasteProfile 레이더 차트
│   ├── story/
│   │   └── CourseCard.tsx         # 코스 카드 컴포넌트
│   └── community/
│       ├── PostCard.tsx
│       └── CommentList.tsx
├── shared/
│   ├── LocaleLink.tsx             # locale-aware Link
│   ├── EmptyState.tsx             # 콘텐츠 없을 때 표시
│   └── LocaleSwitcher.tsx         # ko/ja/en 전환 버튼
└── ui/                            # shadcn 컴포넌트
    ├── button.tsx
    ├── card.tsx
    ├── dialog.tsx
    ├── tabs.tsx
    └── ...
```

---

## 6. 이미지 에셋 경로 규칙

| 종류 | 경로 패턴 | 예시 |
|------|-----------|------|
| 지역 대표 이미지 | `/images/village/{이름}.jpg` or `.png` | `/images/village/seoul.jpg` |
| 음식 듀프 이미지 | `/images/food/{도시3자}-{음식영문}.jpg` | `/images/food/seo-samgyeopsal.jpg` |
| 퓨전 레시피 (신규) | `/images/food/{한국어파일명}.png` | `/images/food/마라떡볶이.png` |
| 퓨전 레시피 (구버전) | `/images/flagfd/{국가코드}-{번호}.png` | `/images/flagfd/jp-001.png` |
| 코스 썸네일 | Supabase Storage URL | |
| 커뮤니티 사진 | Supabase Storage `community-photos` 버킷 | |

---

## 7. 다국어 UI 처리 원칙

1. **정적 데이터**: `lib/data/*.ts`의 `{ ko, ja, en }` 객체에서 `field[locale]` 방식으로 접근
2. **UI 문자열**: `/messages/{locale}.json` + `useTranslations()` 훅 사용
3. **날짜/숫자**: `locale` 기반 `Intl.DateTimeFormat`, `Intl.NumberFormat` 사용
4. **이미지 alt**: 반드시 해당 locale 텍스트로 설정

---

## 8. 접근성 & SEO 원칙

- 모든 `<Image>`에 의미 있는 `alt` 필수
- `<h1>` 페이지당 1개
- 서버 컴포넌트에서 `generateMetadata()` 반드시 정의
- `<Link>` prefetch 기본 활용 (Next.js 기본값)
- 다국어 `hreflang` 태그 (`next-intl` 자동 처리)
