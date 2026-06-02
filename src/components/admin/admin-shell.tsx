import Link from "next/link"

import { logoutAdmin } from "@/app/actions/admin/auth"

const adminLinks = [
  { href: "/admin/registrations", label: "Registrations" },
  { href: "/admin/tournament", label: "Tournament" },
  { href: "/leaderboard", label: "Public leaderboard" },
]

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-forest-light">
      <header className="border-b-4 border-slate-950 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-pokemon-red">
              Admin
            </p>
            <h1 className="text-2xl font-black text-slate-950">Loch Ness Cup</h1>
          </div>
          <nav aria-label="Admin" className="flex flex-wrap items-center gap-2">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                className="inline-flex h-10 items-center rounded-full border-2 border-slate-950/15 bg-forest-light px-4 text-sm font-black text-slate-950 transition-colors hover:bg-pokemon-yellow/40"
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
            <form action={logoutAdmin}>
              <button
                className="inline-flex h-10 items-center rounded-full border-2 border-slate-950 bg-slate-950 px-4 text-sm font-black text-white transition-colors hover:bg-forest"
                type="submit"
              >
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
}
