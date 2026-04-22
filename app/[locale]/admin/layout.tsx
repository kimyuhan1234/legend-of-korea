import { requireAdminPage } from '@/lib/auth/admin'
import { AdminLayoutClient } from './AdminLayoutClient'

interface Props {
  children: React.ReactNode
  params: { locale: string }
}

export default async function AdminLayout({ children, params }: Props) {
  // ADMIN_EMAILS 미포함이면 locale 홈으로 redirect
  await requireAdminPage(params.locale)
  return <AdminLayoutClient locale={params.locale}>{children}</AdminLayoutClient>
}
