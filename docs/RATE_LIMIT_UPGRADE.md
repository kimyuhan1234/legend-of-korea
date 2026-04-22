# Rate Limit — Upstash 업그레이드 가이드

## 현재 구현 (메모리 Map)

- 위치: [`lib/security/rate-limit.ts`](../lib/security/rate-limit.ts)
- 자료구조: 모듈 스코프 `Map<key, timestamp[]>` (슬라이딩 윈도우)
- 통합: [`middleware.ts`](../middleware.ts)의 `/api/` 분기에서 호출
- 의존성: 0개 (순수 TypeScript)

프리셋:
| 프리셋 | 윈도우 | 최대 | 대상 |
|---|---|---|---|
| PUBLIC | 60s | 60 | `/api/tour-stays/recommend`, `/test`, `/community/ads`, `/lp/leaderboard` |
| USER | 60s | 30 | 그 외 모든 API (기본값) |
| ADMIN | 60s | 10 | `/api/admin/*`, `/api/tour-stays/refresh`, `/tag` |
| NONE (제외) | — | — | `/api/payments/*`, `/api/orders`, `/api/passes/purchase`, `/api/subscription/{create,cancel}` |

## 현재 방식의 한계

Vercel은 서버리스 환경이라 요청마다 **별도 인스턴스**로 라우팅될 수 있음:

- 동일 IP가 인스턴스 A·B 로 분산 → 각 인스턴스의 Map이 개별 카운트
- 실효 허용량 ≈ **(설정값) × (활성 인스턴스 수)**
- 소규모 스크래퍼·봇 방어엔 여전히 효과적 (인스턴스가 2~3개여도 절대 상한은 제한됨)
- **본격 DDoS·분산 공격**에는 부족 — 전역 Redis 카운터 필요

## 업그레이드 트리거

아래 중 하나 발생 시 Upstash로 이전:

- [ ] DAU 1,000 초과
- [ ] Supabase 쿼리 한도 월 50% 도달
- [ ] Vercel Analytics에서 동시 인스턴스 ≥ 2
- [ ] 실제 봇·스크래퍼 공격 로그 발견
- [ ] 프로덕션 배포 준비 완료 (recommended — 한 번에 처리)

## 업그레이드 절차

### 1. Upstash 계정·Redis 준비

1. [https://upstash.com](https://upstash.com) 가입 (GitHub SSO)
2. Console → **Create Database**
3. 설정:
   - Name: `cloud-with-you-ratelimit`
   - Type: **Regional** (Global은 쓰기 복제 지연, rate limit엔 불필요)
   - Region: `ap-northeast-1` (Tokyo, Seoul 최근접)
   - TLS: **Enabled**
4. 생성 후 `REST API` 탭에서 URL·Token 복사

### 2. 환경변수

로컬 `.env.local`:
```bash
UPSTASH_REDIS_REST_URL=https://xxx-yyy.upstash.io
UPSTASH_REDIS_REST_TOKEN=AAXXxxxxxxxxxxxxx
```

Vercel Dashboard → Project → Settings → Environment Variables 에도 동일하게 Production/Preview 모두 등록.

### 3. 패키지 설치

```bash
pnpm add @upstash/ratelimit @upstash/redis
```

### 4. `lib/security/rate-limit.ts` 교체

```typescript
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

const limiters = {
  PUBLIC: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(60, '1 m'), analytics: true, prefix: 'rl:public' }),
  USER:   new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(30, '1 m'), analytics: true, prefix: 'rl:user' }),
  ADMIN:  new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, '1 m'), analytics: true, prefix: 'rl:admin' }),
} as const

export type RateLimitPresetKey = keyof typeof limiters

export interface RateLimitResult {
  ok: boolean
  remaining: number
  retryAfter: number
}

export async function checkRateLimit(key: string, preset: RateLimitPresetKey): Promise<RateLimitResult> {
  const { success, remaining, reset } = await limiters[preset].limit(key)
  const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000))
  return { ok: success, remaining, retryAfter }
}
```

### 5. `rate-limit-guard.ts` 를 async 로 변경

```typescript
export async function rateLimitGuard(request: NextRequest, preset: RateLimitPreset): Promise<NextResponse | null> {
  const ip = getRequestIP(request)
  const result = await checkRateLimit(`${preset}:${ip}`, preset)
  // ... 이하 동일
}
```

### 6. `middleware.ts` await 적용

```typescript
const limited = await rateLimitGuard(request, preset)
if (limited) return limited
```

### 7. 검증

여러 터미널에서 동시에 70회 호출:
```bash
for i in {1..70}; do
  curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/tour-stays/recommend
done | sort | uniq -c
```

- 메모리 Map 방식: 인스턴스가 2개면 **~120**까지 200 응답 (각 60)
- Upstash 방식: **정확히 60**만 200, 나머지 429 ← 전역 일관성 ✓

Upstash Console → `cloud-with-you-ratelimit` → **Data Browser** 에서 `rl:public:*` 키 실시간 확인.

## 참고

- Upstash 무료 티어: 10,000 요청/일 (rate limit 체크 1회 = 1 요청)
- 1 DAU ≈ 사용자당 ~50 API 호출 가정 시, 무료 티어로 약 **200 DAU까지 커버**
- 초과 시 유료 ($0.2 per 100K requests, 매우 저렴)
