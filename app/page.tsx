import { redirect } from 'next/navigation'

// 루트 '/' 접근 시 기본 언어(ko)로 리다이렉트
// 실제로는 middleware가 먼저 처리하지만 fallback으로 유지
export default function RootPage() {
  redirect('/ko')
}