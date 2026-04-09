import Link from 'next/link'

export default function GlobalNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-[#F5F0E8]">
      <div className="text-8xl mb-8">👹</div>
      <h1 className="text-3xl font-bold text-[#111] mb-4">404 - 페이지를 찾을 수 없습니다</h1>
      <p className="text-lg text-[#3a3028] mb-8">요청하신 페이지가 존재하지 않습니다.</p>
      <Link
        href="/ko"
        className="px-8 py-3 rounded-xl bg-[#F5F3EF] text-white font-bold hover:bg-[#243a63] transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </div>
  )
}
