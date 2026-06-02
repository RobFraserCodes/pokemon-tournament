import { requireAdmin } from "@/app/actions/admin/auth"
import { AdminShell } from "@/components/admin/admin-shell"

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdmin()

  return <AdminShell>{children}</AdminShell>
}
