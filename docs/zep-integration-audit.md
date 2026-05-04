# ZEP 연동 현황 전수조사

작성: 2026-05-04 / 코드 기반 / commit `492bb58` 기준

---

## 1. 현황 요약 (3줄)

- **UI: 95% 완성** — 컴포넌트 3개(`ZepBanner`/`ZepMeetingButton`/`ZepAccessModal`) + 13개 zone 데이터 + 5개국어 i18n + 5곳 사용처 모두 디자인·인터랙션 완성
- **데이터: 정적 50% + 외부 0%** — `zep-spaces.ts`에 13 zone 메타(이름·설명·이모지·위치 안내) 풀 5개국어 작성됨, **그러나 핵심 `spaceUrl: "https://zep.us/play/YOUR_SPACE_ID_HERE"` placeholder + `password` 하드코딩** → 외부 ZEP space 미연동
- **백엔드: 0% 완성** — ZEP API route 0건 / DB `zep_*` 컬럼 0건 / 환경변수 0건 / 외부 ZEP API 호출 코드 0건

**한 줄 평**: 시각적·UX·다국어는 production-ready. **외부 ZEP 계정으로 실제 space 1개 만들고 URL을 `zep-spaces.ts`에 넣기만 하면 즉시 작동**. 단, 입장 비밀번호 하드코딩·dead-link 1건·로깅 부재 등 운영 시점 cleanup 필요.

---

## 2. 구현된 부분 (동작하는 기능)

### 2-1. UI 컴포넌트 (3개, 완성)
1. **`components/features/quest/ZepBanner.tsx`** (182줄) — 패스 미보유 사용자용 풀 애니메이션 배너
   - 어두운 배경(`from-[#1a1a2e] to-[#16213e]`) + 도트 격자 + 3 아바타 + 점선 연결 + 채팅 버블 회전 + 기능 아이콘 글로우
   - CTA: `Link href="/{locale}/pass"` — **정상 작동** (`8c780bf` 커밋에서 dead-link 수정 완료)
   - 5개 keyframes: `zepFloatRight/zepFloatLeft/zepDrift/zepChatIn/zepIconGlow`
   - 3개 locale 지원 (ko/ja/en) — zh-CN/zh-TW 폴백 (en)

2. **`components/features/quest/ZepMeetingButton.tsx`** (154줄) — 코스별 입장 버튼
   - `hasPurchased=true` 분기: 미니 애니메이션 프리뷰(2 아바타 좌우 floating + 대화 버블) + "ZEP 입장하기" 버튼 → **`ZepAccessModal` 모달 정상 trigger**
   - `hasPurchased=false` 분기: 잠금 UI + dead-link CTA (아래 `3-2` 참조)
   - 3개 keyframes: `zmbRight/zmbLeft/zmbBubble`
   - 코스별 zone 자동 매칭: `getZepZoneByCourseId(courseId)` — 매칭 없으면 `null` 렌더링 (defensive)

3. **`components/features/quest/ZepAccessModal.tsx`** (179줄) — 입장 안내 모달
   - 4단계 안내(접속 → 비밀번호 → 아바타 → 구역 이동) + zone 위치 안내 + 비밀번호 클립보드 복사 + 팁/경고 박스
   - **Placeholder 감지**: `zepSpace.spaceUrl.includes('YOUR_SPACE_ID')` true → 입장 버튼 disabled + "🔧 ZEP 스페이스 준비 중입니다" 표시 (운영자가 URL 교체하면 자동으로 활성)
   - 외부 진입: `window.open(zepSpace.spaceUrl, '_blank', 'noopener,noreferrer')` — 정상 패턴
   - 3개 locale 지원 (ko/ja/en) — zh-CN/zh-TW 폴백 (en)

### 2-2. 데이터 (`lib/data/zep-spaces.ts` 273줄)
- 단일 `zepSpace` 객체 (통합 스페이스 1개) + **13 zones**:
  - `lobby` (입구)
  - 9 코스 zone: `jeonju`/`tongyeong`/`cheonan`/`yongin`/`icheon`/`gyeongju`/`busan`/`seoul`/`jeju` — courses.region과 1:1 매핑
  - 1 이벤트 zone: `gyeongdo-seoul` (경찰과 도둑)
  - `lounge` (자유 라운지)
- 각 zone: `id`, `courseId`, `name`(5개국어), `description`(5개국어), `emoji`, `areaGuide`(5개국어 — "로비에서 왼쪽 위" 같은 ZEP 스페이스 내 위치 안내)
- 헬퍼: `getZepZoneByCourseId(courseId)` — courses.region 기반 zone 조회

### 2-3. 사용처 (5곳, 모두 작동)
| 위치 | 컴포넌트 | 분기 |
|---|---|---|
| `/courses/[courseId]` | ZepMeetingButton (패스 보유) / ZepBanner (미보유) | `hasPass` 기반 |
| `/quest/gyeongdo` | 동일 패턴 | `hasPass` |
| `/courses/[id]/purchase/success` | ZepMeetingButton `hasPurchased={true}` 강제 | 결제 직후 안내 |
| `/story` SpecialEventTab | ZepBanner only | 비로그인 진입점 |
| `/mypage` | ZepMeetingButton `hasPurchased={true}` 강제 | 마이페이지 진입 |

### 2-4. i18n (`messages/*.json` `zep` namespace)
- 5개국어 모두 `zep` 네임스페이스 존재 (en.json:1918, ja:1918, ko:?, zh-CN:?, zh-TW:?)
- 키: `step1~step4`, `tip`, `enterZep`, `desc`, `locked`, 그리고 `mypage.zepTitle`/`zepDesc` (메타버스 카드)
- **단, 컴포넌트 내부 inline LABEL 객체가 우선 사용 중** (i18n messages는 보조) — ZepBanner/ZepMeetingButton/ZepAccessModal 모두 `LABEL = { ko, en, ja }` inline 패턴, zh-CN/zh-TW는 en 폴백

---

## 3. 미구현 / Dead

### 3-1. 핵심 미연동 (Production-blocking)

| 항목 | 현재 값 | 영향 |
|---|---|---|
| `zepSpace.spaceUrl` | `"https://zep.us/play/YOUR_SPACE_ID_HERE"` | **모든 입장 버튼 비활성** (placeholder 감지로 disabled). 운영자가 실제 ZEP space 만들고 URL 교체하면 즉시 활성 |
| `zepSpace.password` | `"legendofkorea2026"` 하드코딩 | 코드에 박혀 있음. 비밀번호 변경 시 코드 수정 필요. 또한 `'use client'` 파일에 있어 **클라이언트 번들에 노출** (보안 X) |
| ZEP space 자체 | 미생성 | 운영자 ZEP 계정으로 13 zone 레이아웃을 가진 1개 통합 space 만들어야 함 |

### 3-2. ZepMeetingButton 비보유 분기 dead-link
[ZepMeetingButton.tsx:144-146](components/features/quest/ZepMeetingButton.tsx#L144):
```tsx
onClick={() =>
  document.getElementById('kit-purchase')?.scrollIntoView({ behavior: 'smooth' })
}
```
- `#kit-purchase` element는 **PRD-PRICING-2026-001 (hotfix v5)에서 이미 제거됨**
- 클릭해도 아무 일도 안 일어남 (silent fail)
- ZepBanner는 `8c780bf`에서 `Link href="/pass"`로 수정됐으나 **ZepMeetingButton은 누락** — 이전 보고서에서도 명시 ("ZepMeetingButton(별개 컴포넌트)도 동일 dead-link 패턴 보유하지만 본 작업 범위 외")

### 3-3. 백엔드 부재
- ZEP 관련 API route **0건** (`app/api/`)
- Supabase 53 migration에 `zep_*` 컬럼 / `zep_spaces` 테이블 **0건**
- 환경변수 `ZEP_*` / `NEXT_PUBLIC_ZEP_*` **0건** (.env.example에도 부재)
- 외부 ZEP API 호출 코드 **0건** (`fetch(zep.us/api...)` 등)

### 3-4. 인증/권한/로깅 미구현
- ZEP 입장 시 **`hasActivePass()` 검증은 페이지 레벨에서만**:
  - `/courses/[id]` 페이지가 `hasPass` 분기로 ZepMeetingButton/ZepBanner 결정
  - `/mypage` `/purchase/success`는 `hasPurchased={true}` **하드코딩** — 마이페이지 진입자에게 무조건 ZEP 표시 (실제 패스 검증 없음)
- ZEP 입장 로깅 **없음** (DB 테이블 없음, 분석 X)
- 동시 접속자 제한 **없음** — ZEP 자체 기능에 의존
- 비밀번호 노출 제어 **없음** — `'use client'` 컴포넌트에 평문 박혀 있어 비구매자도 view-source로 확인 가능

### 3-5. zh-CN/zh-TW 카피 부재
- ZepBanner/ZepMeetingButton/ZepAccessModal — inline LABEL이 `ko/en/ja` 3종만, zh-CN/zh-TW 사용자는 영어로 폴백
- messages/zep namespace에는 5개국어 존재하나 컴포넌트가 사용 안 함 (이중 i18n 불일치)
- zep-spaces.ts zone 메타데이터는 5개국어 풀 작성 (zh-CN/zh-TW optional 표시지만 모든 zone에 채워짐)

---

## 4. 갭 분석 — 진짜 ZEP 연동 완성하려면

### 4-1. 외부 ZEP 작업 (운영자 영역)
1. **ZEP 비즈니스 계정** (zep.us) 생성/확보
2. **단일 통합 space 1개 생성** — 13 zone 레이아웃 (lobby + 9 코스 + gyeongdo-seoul + lounge)
3. **각 zone의 위치 안내** (`areaGuide` 필드)에 맞게 ZEP 내부 좌표 배치 — 예: "전주 도깨비 구역" = "로비에서 왼쪽 위"
4. **space URL 추출** — `https://zep.us/play/{space_id}` 형식
5. **입장 비밀번호 설정** (ZEP 자체 기능)
6. (선택) ZEP API 키 발급 — 동시 접속자 모니터링·자동 입장·아바타 커스터마이징 등 고급 기능 시

### 4-2. 코드 작업 (Claude Code 영역)

**필수 (5분)**:
- `zep-spaces.ts` `spaceUrl` placeholder → 실제 URL 교체

**Production cleanup (30분)**:
- 비밀번호 보안 격상: client 노출 제거 → API route(`/api/zep/access?courseId=X`) 통해 패스 보유 검증 후 비밀번호 + URL 반환. 환경변수 `ZEP_SPACE_PASSWORD` 분리.
- ZepMeetingButton 미보유 분기 dead-link → `Link href="/pass"` 수정 (ZepBanner와 동일 패턴)
- zh-CN/zh-TW 카피 4종 컴포넌트 inline LABEL에 추가 OR messages/*.json 사용으로 통일

**선택 (1~2시간)**:
- `zep_access_logs` 테이블 + `/api/zep/access` route 로깅 (분석용)
- 동시 접속자 표시 (ZEP API webhook)
- mypage ZepMeetingButton의 `hasPurchased={true}` 하드코딩 → 실제 `hasActivePass()` 결과 사용

### 4-3. 보안 진단
- 현재: 비밀번호 평문 + 클라이언트 번들 노출. 비구매자가 source 보면 비밀번호 확인 가능 → ZEP space는 **누구나 입장 가능**한 상태
- 영향: 콘텐츠 가치 하락 (구독 동기 약화)
- 권장: 4-2 cleanup의 비밀번호 격상 작업이 사실상 **production 필수**

---

## 5. 권장 다음 작업 (우선순위)

### 우선순위 1 — 최소 가동 (운영자 + Claude Code 30분)
**ZEP space 1개 생성 + URL 교체 + dead-link 1건 fix**:
1. 운영자: ZEP 계정으로 13 zone space 생성 → URL 확보
2. Claude Code: `zep-spaces.ts:22` `spaceUrl` 한 줄 교체 + ZepMeetingButton dead-link → `/pass` Link 변경 (ZepBanner 동일 패턴)
3. 검증: `/courses/jeonju` 진입 → ZepMeetingButton 클릭 → ZepAccessModal "ZEP 입장하기" 버튼 활성 → 새 탭 ZEP space 열림

### 우선순위 2 — 비밀번호 보안 격상 (Claude Code 1시간)
**`/api/zep/access` API route + 환경변수 분리**:
- `ZEP_SPACE_PASSWORD` env var (서버 전용)
- API route에서 `hasActivePass(userId)` 검증 후 password 반환
- ZepAccessModal client → fetch API → 비밀번호 동적 조회
- `zep-spaces.ts`의 `password` 필드 제거

### 우선순위 3 — zh-CN/zh-TW 카피 + mypage 검증 강화 (30분)
**4국어 → 5국어 + 하드코딩 정리**:
- 3 컴포넌트 inline LABEL에 zh-CN/zh-TW 4종 추가
- mypage/purchase-success의 `hasPurchased={true}` → 실제 `hasActivePass()` 결과 전달

---

## 부록 — 상세 데이터

### A. inline keyframes 8종 (참고)
**ZepBanner.tsx 5개**:
- `zepFloatRight` 6s — 아바타 1 (왼쪽 → 오른쪽 떠다님)
- `zepFloatLeft` 6s — 아바타 2 (오른쪽 → 왼쪽)
- `zepDrift` 8s + 1s delay — 아바타 3 (대각선 표류)
- `zepChatIn` 2s — 채팅 버블 fade-in/out
- `zepIconGlow` 2s × 0/0.6/1.2s delay — 기능 아이콘(🎤📹🕹️) 순차 글로우

**ZepMeetingButton.tsx 3개**:
- `zmbRight` 3s — 미니 아바타 A 우 floating
- `zmbLeft` 3s — 미니 아바타 B 좌 floating
- `zmbBubble` 3s — 대화 버블 scale + opacity

**진단**: dead-link 청소 시 keyframes는 보존 권장 — UI 가치가 외부 연동 상태와 무관하게 유효 (시각적 매력도 유지).

### B. 외부 URL 참조
- `zep-spaces.ts:22` `https://zep.us/play/YOUR_SPACE_ID_HERE` (placeholder)
- 그 외 ZEP 도메인(`zep.us`) 참조 0건

### C. 알려진 이슈 vs 현황 (mentoring-handover 기준)
| 핸드오버 기재 | 현재 상태 |
|---|---|
| ZepBanner dead-link → /pass (`8c780bf`) | ✅ 완료 |
| ZepMeetingButton dead-link 잔존 청소 (Pre-Launch TODO) | ❌ 미완료 (line 144-146) |

### D. 현황 한 페이지 요약 (멘토용)
```
ZEP UI:        ████████████████████  95%  (컴포넌트 3 + 13 zone + 5국어 + 5사용처)
ZEP 데이터:    ██████████░░░░░░░░░░  50%  (메타 풀 + URL placeholder)
ZEP 백엔드:    ░░░░░░░░░░░░░░░░░░░░   0%  (API/DB/env 모두 부재)
ZEP 외부 연동: ░░░░░░░░░░░░░░░░░░░░   0%  (실제 ZEP space 미생성)
```

---

**보고서 끝.**
