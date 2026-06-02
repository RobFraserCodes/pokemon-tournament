import Image from "next/image"
import Link from "next/link"

const navLinks = [
  { href: "/#registration", label: "Register" },
  { href: "/#faq", label: "FAQ" },
  { href: "/leaderboard", label: "Leaderboard" },
]

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b-4 border-slate-950 bg-forest-light/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          className="inline-flex items-center gap-2.5 text-lg font-black text-slate-950 transition-colors hover:text-forest sm:text-xl"
          href="/"
        >
          <Image
            alt=""
            aria-hidden="true"
            className="size-9 shrink-0"
            height={36}
            src="/icon.svg"
            width={36}
          />
          Loch Ness Cup
        </Link>
        <nav aria-label="Main" className="flex flex-wrap items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              className="inline-flex h-10 items-center rounded-full border-2 border-slate-950/15 bg-white px-4 text-sm font-black text-slate-950 transition-colors hover:border-slate-950 hover:bg-pokemon-yellow/40"
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
