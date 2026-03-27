import { Navbar } from "@/components/shared/Navbar"

interface LocaleLayoutProps {
  children: React.ReactNode
  params: { locale: string }
}

export default function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const locale = params.locale || "ko"

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex flex-col" lang={locale}>
      <Navbar locale={locale} />
      <main className="flex-1">{children}</main>
      <footer className="bg-[#1B2A4A] text-white/70 text-xs text-center py-6 mt-auto">
        © 2025 Legend of Korea · 한국의 전설을 따라서
      </footer>
    </div>
  )
}
