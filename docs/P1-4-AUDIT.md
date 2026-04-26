# P1-4 메인 페이지 정리 + 시각 시스템 통일 — 사전 조사

**브랜치**: `feature/p1-4-main-cleanup`
**작성일**: 2026-04-25
**범위**: PRD 작업 0 (사전 조사) 결과 + PRD 와 실제 코드의 차이

---

## 1. 헤더 / 네비게이션 구조 — **현재 9개 메뉴**

[components/shared/Navbar.tsx](legend-of-korea/components/shared/Navbar.tsx) `NAV_LINKS` (5개 로케일 동일):
```ts
[
  { href: "/ootd",     label: "OOTD" },
  { href: "/food",     label: "K-Food" },
  { href: "/stay",     label: "STAY" },
  { href: "/traffic",  label: "TRAFFIC" },
  { href: "/story",    label: "QUEST" },     // ← /story 라우트
  { href: "/sights",   label: "SPOT" },
  { href: "/planner",  label: "PLANNER" },
  { href: "/memories", label: "MEMORIES" },
  { href: "/diy",      label: "DIY" },
]
```

PRD 4개 메뉴 매핑 vs 현재 9개:

| PRD 메뉴 | PRD 라우트 | 흡수해야 할 기존 메뉴 |
|---|---|---|
| Discover | `/discover` (신규) | OOTD, K-Food, STAY, TRAFFIC, SPOT |
| Quest | `/courses` (PRD) — **그러나 실제 NavbarTabs `/story` 사용** | QUEST |
| Pass | `/pass` | (단독) |
| Community | `/memories` (PRD) | MEMORIES, DIY |

**미매핑 메뉴**: PLANNER (`/planner`) — PRD 4개에 어디에도 없음. 결정 필요.

또한 `/courses` 라우트는 사용 중이지만 NavbarTabs 의 QUEST 가 `/story` 를 가리킴. **PRD 의도가 `/courses` 인지 `/story` 인지 불분명**.

---

## 2. HomeTabExplorer 사용처 — **메인 페이지 1곳만**

```
app/[locale]/page.tsx:7  ← import
app/[locale]/page.tsx:37 ← 렌더
```

→ **옵션 A (완전 삭제) 가능**. 다른 페이지에서 사용 안 함.

---

## 3. 카트 시스템 결합도 — **6개 파일**

```
lib/contexts/CartContext.tsx              — Provider + useCart 훅
components/shared/CartBadge.tsx           — 헤더 우측 아이콘
components/shared/CartSidePanel.tsx       — 우측 사이드 패널
components/features/goods/GoodsCard.tsx   — 굿즈 추가 버튼 (addItem)
components/shared/Navbar.tsx:150          — CartBadge 마운트
app/[locale]/layout.tsx:9, 96             — CartProvider + CartSidePanel
```

**환경변수로 격리 가능** — 다른 핵심 기능과 의존성 없음. `<CartSidePanel />` 과 `<CartBadge />` 만 조건부 렌더하면 베타 비활성. CartProvider 는 그대로 두고 (GoodsCard 의 useCart 안 깨지게).

---

## 4. `/discover` 라우트 — **충돌 없음** ✓

`app/[locale]/discover` 디렉토리 부재. 신규 생성 가능.

---

## 5. STAY 페이지 그라데이션 — **PRD 가정 색상과 실제 다름**

[components/features/stay/StayHero.tsx:9](legend-of-korea/components/features/stay/StayHero.tsx#L9):
```tsx
className="relative bg-gradient-to-br from-mint to-blossom ..."
```

실제 사용 토큰값 (`app/globals.css`):
- `--color-mint: #B8E8E0`
- `--color-blossom: #F5D0D0`
- `--color-mint-deep: #9DD8CE`
- `--color-blossom-deep: #F0B8B8`
- `--color-mint-light: #D4F0EB`
- `--color-blossom-light: #FAE8E8`
- `--color-lavender: #E8C8D8`  ← **이미 존재!**
- `--color-sky: #A8D4F0`
- `--color-peach: #F8E8D0`

**PRD 가정 색상값** (`#d4f4dd, #e8d5f0, #f8d7e0`) 과 **실제 토큰값** (`#B8E8E0, #E8C8D8, #F5D0D0`) **다름**. STAY 회귀 없음을 보장하려면 **실제 토큰 그대로** 사용해야 함:

```css
/* 실제로 정의해야 할 토큰 (PRD 의도 + 기존 색상 보존) */
--bg-gradient-strong: linear-gradient(135deg, var(--color-mint) 0%, var(--color-lavender) 50%, var(--color-blossom) 100%);
```

→ STAY 의 `from-mint to-blossom` (2-stop) 을 `from-mint via-lavender to-blossom` (3-stop) 로 바꾸면 **시각 변화 발생**. PRD "회귀 없음" 검수 항목과 충돌.

---

## 6. 페이지별 현재 그라데이션

| 페이지 | 현재 | PRD 의도 | 변경 |
|---|---|---|---|
| `/stay` STAY | `from-mint to-blossom` | Tier 1 강함 | ⚠️ via-lavender 추가 시 회귀 |
| `/traffic` TRAFFIC | **`from-mint to-blossom` (STAY와 동일!)** | Tier 2 옅게 | 변경 필요 |
| `/food` K-Food | `bg-mint-light` 단색 | Tier 2 옅게 | 그라데이션화 |
| `/ootd` OOTD | 단색 (`bg-cloud` 등) | Tier 2 옅게 | 그라데이션화 |
| `/sights` SPOT | 미사용 (확인 필요) | Tier 2 옅게 | 추가 |
| `/diy` DIY | 미확인 | Tier 2 옅게 | 추가 |
| `/courses`/`/story` QUEST | 미확인 | Tier 2 옅게 | 추가 |
| `/memories` | 흰 배경 | 유지 | 변경 X |
| `/planner` | 미확인 | 흰 배경 | 변경 가능 |
| `/mypage` | 미확인 | 흰 배경 | 변경 가능 |

**중요 발견**: TRAFFIC 가 STAY 와 같은 강한 그라데이션 사용 중. PRD 의도(TRAFFIC 은 정보 페이지 → Tier 2) 와 부합하려면 변경 필요.

---

## 7. 색상 토큰 시스템 — **충돌 가능성**

기존 globals.css 의 `--color-*` 시스템 (16개 토큰) 있음. PRD 가 추가하려는:
- `--bg-gradient-strong`
- `--bg-gradient-soft`
- `--bg-plain`
- `--color-mint`, `--color-mint-fg`, `--color-lavender`, `--color-pink` (이미 존재)

**충돌**: PRD 가 `--color-mint: #a8e0b8` 를 정의하는데 기존은 `#B8E8E0`. 다른 색.

**해결**: PRD 색상 hex 무시하고 기존 토큰 재사용. `--bg-gradient-*` 만 신규 정의:
```css
--bg-gradient-strong: linear-gradient(135deg, var(--color-mint) 0%, var(--color-lavender) 50%, var(--color-blossom) 100%);
--bg-gradient-soft: linear-gradient(135deg, var(--color-mint-light) 0%, white 100%);
```

---

## 8. P1-1 CTA Secondary 카피 — **미정정 상태**

```
ko: "작동 방식 보기"  → PRD 결정: "패스 살펴보기"
en: "How it works"   → PRD 결정: "See passes"
ja: "使い方を見る"     → PRD 결정: "パスを見る"
zh-CN: "了解玩法"     → PRD 결정: "查看通行证"
zh-TW: "了解玩法"     → PRD 결정: "查看通行證"
```

또한 P1-1 의 Secondary CTA 링크가 `/quest/guide` 로 가는데, PRD 카피는 "패스 살펴보기" → 링크는 `/pass` 로 가야 의미 일치.

---

## 9. 결정이 필요한 항목 (10가지)

### A. 라우트 매핑 — **HARD BLOCKER**
1. **Quest 메뉴 라우트**: `/courses` (PRD) vs `/story` (현재 NavbarTabs)?
2. **PLANNER 메뉴 처리**: PRD 4개에 부재. 어디로?
   - (a) Discover 하위에 숨김 (PRD 5개 카테고리에 추가)
   - (b) Community 하위에 (사용자 영역으로)
   - (c) 헤더에서 제거하고 마이페이지/푸터에서만 접근
3. **Community 메뉴 라우트**: `/memories` (PRD 매핑) vs 별도 `/community` (이미 존재) ?
   - 현재 `/community` 라우트 존재 (recipe, write 하위 페이지)

### B. STAY 시각 회귀 — **HARD BLOCKER**
- 현재 `from-mint to-blossom` (2-stop) 사용
- PRD 의도: `mint → lavender → blossom` (3-stop)
- 옵션:
  - (a) 회귀 허용하고 lavender 추가 (PRD 의도 우선)
  - (b) 토큰 정의 시 2-stop 유지 (회귀 0)
  - (c) 토큰 정의 후 STAY 만 별도 클래스 (`from-mint to-blossom` 그대로)

### C. CSS 변수 — **PRD 색상값 vs 기존 토큰**
- PRD: `#d4f4dd, #e8d5f0, #f8d7e0, #a8e0b8` 등
- 기존: `#B8E8E0 (mint), #E8C8D8 (lavender), #F5D0D0 (blossom)`
- → **기존 토큰 재사용** 권장 (충돌 회피, 디자인 일관성)

### D. /discover 가 흡수할 카테고리
PRD: OOTD/SPOT/K-Food/TRAFFIC/STAY (5개)
- STAY 가 가치 영역(Tier 1) 이라 별도 강조였는데 "둘러보기" 안에 묻히는 게 의도와 부합?
- 또는 STAY 만 Discover 외부 (헤더 별도 메뉴)?

### E. 카트 비활성화 범위
- **B-1**: CartBadge + CartSidePanel 만 조건부 렌더, CartProvider/Context 유지 (GoodsCard 안 깨짐)
- **B-2**: 전부 비활성, GoodsCard 의 addItem 도 비활성화

### F. HomeTabExplorer 처리
- **F-1**: 메인에서만 제거 (코드 보존)
- **F-2**: 컴포넌트 자체 삭제 (사용처 0건이므로 가능)

### G. CTA Secondary 카피 + 링크
- 카피: "작동 방식 보기" → "패스 살펴보기"
- 링크: `/quest/guide` → `/pass` ?

### H. PRD 작업 순서
- PRD 권장: 시각 시스템 → 페이지별 적용 → 헤더 재편 → 메인 정리 → 카트 → CTA
- audit 결과: **A (라우트 매핑) 와 B (STAY 회귀) 결정 후가 아니면 작업 1·2·3 모두 진행 불가**

---

## 10. 권장 진행 방안

### 결정 받은 후 단계별 진행
1. **Phase 1 (저위험, 결정 영향 적음)**:
   - P1-9: CTA Secondary 카피 정정 (G)
   - P1-8: 카트 환경변수 비활성화 (E)
   - P1-7: HomeTabExplorer 제거 (F)

2. **Phase 2 (시각 시스템, 결정 후)**:
   - P1-4: CSS 변수 토큰 정의 (C 결정 필요)
   - P1-5: 페이지별 그라데이션 적용 (B 결정 필요)

3. **Phase 3 (헤더 + /discover, 결정 후)**:
   - P1-6: 헤더 4개 재편 + /discover 신규 (A 결정 필요)

---

## 다음 액션

10번 섹션의 **A·B·C·D·E·F·G** 답변 후 단계별 진행.
가장 빠른 진입은 **Phase 1 (G·E·F)** 부터 — 이건 단순 결정.

### Phase 1 즉시 가능 결정 제안
- **G**: 카피 PRD 그대로 채택, 링크 `/pass` 로 변경 (의미 일치)
- **E**: B-1 채택 (CartBadge·CartSidePanel 만 비활성, GoodsCard 보존)
- **F**: F-2 채택 (컴포넌트 자체 삭제, 사용처 0건)

→ Phase 1 만이라도 즉시 진행 OK 면 카피·카트·HomeTabExplorer 정리부터 바로 시작 가능.
