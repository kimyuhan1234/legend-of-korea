# Legend of Korea — UI/UX Design Document

> 최종 수정: 2026-04-07 (v2 — 프리미엄 리모델링)
> 스택: Next.js 14 App Router + Tailwind CSS 4 + shadcn/ui

---

## 1. 디자인 토큰

### 색상 (v2 — 과일바구니 프리미엄)

| 토큰 | HEX | 용도 |
|------|-----|------|
| `primary` | `#FF6B35` | CTA 버튼, 강조 태그, 핵심 하이라이트 (코랄-오렌지) |
| `primary-hover` | `#E55A24` | 버튼 hover 상태 |
| `sky` | `#63B3ED` | 서브 악센트, 섹션 배경 포인트, 테두리 (스카이-블루) |
| `background` | `#FFFFFF` | 페이지 기본 배경 (화이트) |
| `surface` | `#FFFFFF` | 카드, 모달 배경 |
| `greige` | `#F5F3EF` | 푸터, 보조 섹션 배경 (그레이지) |
| `section-alt` | `#FFF7F4` | 코랄 틴트 섹션 (히어로 주변) |
| `display` | `#111111` | 디스플레이 헤딩 (거의 검정) |
| `text-body` | `#374151` | 본문 텍스트 (gray-700) |
| `text-secondary` | `#6B7280` | 서브 설명 텍스트 (gray-500) |
| `text-muted` | `#9CA3AF` | 비활성, placeholder (gray-400) |
| `border-light` | `#F3F4F6` | 카드 구분선, 아주 연한 테두리 |
| `success` | `#10B981` | 성공 상태 |
| `error` | `#EF4444` | 에러 상태 |

> **제거된 컬러**: `#1B2A4A`(네이비), `#2D1B69`(퍼플), `#D4A843`(골드), `#F5F0E8`(크림)

### 그라디언트 (v2)

```css
/* 히어로 이미지 오버레이 — 가볍게 */
background: linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%);

/* CTA 버튼 */
background: linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%);

/* 스카이 배너 */
background: linear-gradient(135deg, #EBF8FF 0%, #DBEAFE 100%);

/* 카드 hover 글로우 */
box-shadow: 0 20px 60px rgba(255, 107, 53, 0.12);
```

### 타이포그래피 (v2)

| 용도 | 폰트 패밀리 | 클래스 |
|------|------------|--------|
| 디스플레이 헤딩 (히어로, 섹션 제목) | Playfair Display | `font-display text-4xl md:text-5xl font-bold` |
| 한국어/일본어 헤딩 | Noto Serif KR / Noto Serif JP | `font-serif font-bold` |
| 서브 헤딩 | Inter | `text-2xl font-semibold` |
| 본문 | Inter / Noto Sans KR | `text-base font-normal leading-relaxed` |
| UI 레이블 / 버튼 | Inter | `text-sm font-semibold tracking-wide` |
| 뱃지 | Inter | `text-xs font-bold uppercase tracking-wider` |

### 여백 (v2 — 숨통 트기)

| 용도 | 클래스 |
|------|--------|
| 섹션 상하 패딩 | `py-20 md:py-28` |
| 컨테이너 좌우 | `max-w-7xl mx-auto px-6 md:px-10` |
| 카드 내부 | `p-7 md:p-8` |
| 섹션 간 헤딩 마진 | `mb-4` (서브타이틀), `mb-14` (카드그리드) |

### 카드 스타일 (v2)

```tsx
// 기본 카드 (테두리 없음, 소프트 섀도우)
className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.06)]
           hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]
           transition-all duration-300 overflow-hidden"

// 비활성 카드
className="bg-white rounded-3xl shadow-sm opacity-50 cursor-not-allowed overflow-hidden"
```

---

## 2. 공통 컴포넌트 패턴 (v2)

### 히어로 섹션
```tsx
<section className="relative h-screen overflow-hidden bg-[#111]">
  <Image fill className="object-cover brightness-90" />
  {/* 가벼운 하단 그라디언트만 */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white text-center">
    <h1 className="font-display text-5xl font-bold mb-4">...</h1>
    <p className="text-white/80 text-lg">...</p>
  </div>
</section>
```

### CTA 버튼
```tsx
// Primary
<button className="px-8 py-3.5 rounded-full bg-[#FF6B35] text-white font-semibold
                   hover:bg-[#E55A24] shadow-lg shadow-orange-200
                   transition-all duration-200 hover:-translate-y-0.5">
  탐색하기
</button>
```

### 섹션 헤딩
```tsx
<div className="text-center mb-14">
  <span className="inline-block px-4 py-1.5 rounded-full bg-orange-50 text-[#FF6B35]
                   text-xs font-bold uppercase tracking-widest mb-4">
    Category
  </span>
  <h2 className="font-display text-4xl font-bold text-[#111] leading-tight">
    섹션 제목
  </h2>
</div>
```

### 탭 네비게이션
- 활성 탭: `border-b-2 border-[#FF6B35] text-[#FF6B35]`
- 비활성 탭: `text-gray-500 hover:text-[#111]`

---

## 3. 페이지별 라우트 구조

(이전 v1과 동일 — 생략)

---

## 4. 색상 마이그레이션 가이드

| 구버전 컬러 | 신버전 컬러 | 용도 |
|-------------|------------|------|
| `#2D1B69` (헤더 bg) | `transparent / white` | Navbar 배경 |
| `#1B2A4A` (강조텍스트) | `#111111` | 제목 텍스트 |
| `#D4A843` (액센트) | `#FF6B35` | CTA, 강조 |
| `#F5F0E8` (크림 배경) | `#FFFFFF` | 페이지 배경 |
| `#2D1B69` (푸터 bg) | `#F5F3EF` | 푸터 (그레이지) |
| `border-[#e8ddd0]` | `border-[#F3F4F6]` | 카드 테두리 |

---

## 5. 폰트 로드 방법

```tsx
// app/layout.tsx
<link href="https://fonts.googleapis.com/css2?
  family=Playfair+Display:wght@600;700;800&
  family=Noto+Sans+KR:wght@400;500;700;900&
  family=Noto+Sans+JP:wght@400;500;700;900&
  display=swap" rel="stylesheet" />
```

```css
/* globals.css */
.font-display { font-family: 'Playfair Display', 'Noto Serif KR', serif; }
```

---

## 6. 이미지 에셋 경로 규칙

(이전 v1과 동일)

---

## 7. 다국어 UI 처리 원칙

(이전 v1과 동일)

---

## 8. 접근성 & SEO 원칙

(이전 v1과 동일)