import { redirect } from "next/navigation"

import { AdminLoginForm } from "@/components/admin/admin-login-form"
import { isAdminAuthenticated } from "@/lib/admin/session"

export const metadata = {
  title: "Admin login | Loch Ness Cup",
}

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin/registrations")
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#dbeafe_0%,#f5f3e8_55%,#fff9c4_100%)] px-4 py-10">
      <div className="w-full max-w-md rounded-[2rem] border-4 border-slate-950 bg-white p-8 shadow-[10px_10px_0_#2563eb]">
        <p className="text-sm font-black uppercase tracking-wide text-pokemon-red">
          Admin access
        </p>
        <h1 className="mt-3 text-3xl font-black text-slate-950">Loch Ness Cup</h1>
        <p className="mt-3 text-base leading-7 text-slate-700">
          Sign in to review registrations and run the tournament draw.
        </p>
        <div className="mt-6">
          <AdminLoginForm />
        </div>
      </div>
    </main>
  )
}
