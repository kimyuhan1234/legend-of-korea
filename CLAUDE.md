# Legend of Korea - 프로젝트 컨텍스트

## 서비스 개요
한국 전래동화 IP를 활용한 "전설 미션 키트" 기획·판매 + QR 기반 셀프 미션 웹 서비스.
1인 창업, 자본금 1,000만원, 천안 거주, 전주 도깨비 코스 우선.

## 기술 스택
- Next.js 14 App Router + TypeScript
- Tailwind CSS 4 + shadcn/ui
- Supabase (PostgreSQL + Auth + Storage)
- Vercel 배포
- pnpm

## 핵심 기능 (우선순위)
1. Must: 코스 탐색 + 키트 구매 (Toss/Stripe 결제)
2. Must: QR 셀프 미션 엔진
3. Must: LP·티어 시스템
4. Must: 웹 커뮤니티 기록관
5. Must: 제휴 연결 (추천 숙소·교통 외부 링크)
6. Must: 다국어 (한국어·일본어, 이후 영어)
7. Should: 전설 상점 (LP → 쿠폰 교환)

## 다국어 구조
- next-intl 사용
- 기본 locale: ko
- 지원 locale: ko, ja, en
- /messages/ko.json, /messages/ja.json, /messages/en.json

## DB
- Supabase PostgreSQL
- 테이블: users, courses, kit_products, orders, missions, mission_progress, lp_transactions, tiers, community_posts, affiliate_links, affiliate_clicks, b2b_orders

## 디렉토리 규칙
- app/[locale]/ → 다국어 라우팅
- components/ui/ → shadcn 컴포넌트
- components/shared/ → 공통 컴포넌트
- components/features/ → 기능별 컴포넌트
- lib/ → 유틸리티, Supabase 클라이언트, 타입 정의
- messages/ → 다국어 JSON
