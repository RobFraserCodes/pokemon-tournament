"use client"

import { Check, Copy, Mail, Share2 } from "lucide-react"
import { useEffect, useRef, useState, type RefObject } from "react"
import { createPortal } from "react-dom"

import { getTournamentShareContent } from "@/lib/event-details"
import { cn } from "@/lib/utils"

type ShareTournamentButtonProps = {
  className?: string
  label?: string
  variant?: "primary" | "secondary" | "compact"
}

type ShareContent = ReturnType<typeof getTournamentShareContent>

type MenuPosition = {
  top: number
  left: number
}

const socialLinks: {
  id: string
  label: string
  getHref: (content: ShareContent) => string
  icon: typeof Share2
}[] = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    getHref: ({ url, text }) =>
      `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
    icon: Share2,
  },
  {
    id: "facebook",
    label: "Facebook",
    getHref: ({ url }) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    icon: Share2,
  },
  {
    id: "x",
    label: "X",
    getHref: ({ url, text }) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    icon: Share2,
  },
  {
    id: "email",
    label: "Email",
    getHref: ({ url, text, title }) =>
      `mailto:?subject=${encodeURIComponent(`${title} registration`)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`,
    icon: Mail,
  },
]

function ShareMenu({
  copied,
  menuRef,
  onCopyLink,
  onClose,
  onNativeShare,
  position,
  shareContent,
  supportsNativeShare,
}: {
  copied: boolean
  menuRef: RefObject<HTMLDivElement | null>
  onCopyLink: () => void
  onClose: () => void
  onNativeShare: () => void
  position: MenuPosition
  shareContent: ShareContent
  supportsNativeShare: boolean
}) {
  return (
    <div
      ref={menuRef}
      className="fixed z-[100] min-w-[15rem] rounded-2xl border-4 border-slate-950 bg-white p-3 shadow-[8px_8px_0_#2563eb]"
      style={{ top: position.top, left: position.left }}
    >
      <p className="px-2 pb-2 text-xs font-black uppercase tracking-wide text-pokemon-red">
        Share the tournament
      </p>
      <div className="grid gap-1">
        {socialLinks.map((link) => {
          const Icon = link.icon

          return (
            <a
              key={link.id}
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold text-slate-950 transition-colors hover:bg-pokemon-yellow/40"
              href={link.getHref(shareContent)}
              onClick={onClose}
              rel="noopener noreferrer"
              target={link.id === "email" ? undefined : "_blank"}
            >
              <Icon className="size-4 text-pokemon-blue" aria-hidden="true" />
              {link.label}
            </a>
          )
        })}
        <button
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-bold text-slate-950 transition-colors hover:bg-pokemon-yellow/40"
          onClick={onCopyLink}
          type="button"
        >
          {copied ? (
            <Check className="size-4 text-emerald-600" aria-hidden="true" />
          ) : (
            <Copy className="size-4 text-pokemon-blue" aria-hidden="true" />
          )}
          {copied ? "Link copied!" : "Copy link"}
        </button>
        {supportsNativeShare ? (
          <button
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-bold text-slate-950 transition-colors hover:bg-pokemon-yellow/40"
            onClick={onNativeShare}
            type="button"
          >
            <Share2 className="size-4 text-pokemon-blue" aria-hidden="true" />
            More sharing options
          </button>
        ) : null}
      </div>
    </div>
  )
}

export function ShareTournamentButton({
  className,
  label = "Share with friends",
  variant = "secondary",
}: ShareTournamentButtonProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [shareContent, setShareContent] = useState<ShareContent | null>(null)
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null)
  const [supportsNativeShare, setSupportsNativeShare] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setShareContent(getTournamentShareContent(window.location.origin))
    setSupportsNativeShare(typeof navigator !== "undefined" && "share" in navigator)
  }, [])

  function updateMenuPosition() {
    if (!containerRef.current) {
      return
    }

    const rect = containerRef.current.getBoundingClientRect()
    setMenuPosition({
      top: rect.bottom + 12,
      left: rect.left,
    })
  }

  useEffect(() => {
    if (!menuOpen) {
      return
    }

    updateMenuPosition()
    window.addEventListener("resize", updateMenuPosition)
    window.addEventListener("scroll", updateMenuPosition, true)

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node

      if (
        containerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return
      }

      setMenuOpen(false)
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      window.removeEventListener("resize", updateMenuPosition)
      window.removeEventListener("scroll", updateMenuPosition, true)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [menuOpen])

  const buttonClassName = cn(
    "inline-flex h-14 items-center justify-center gap-2 rounded-full px-8 text-base font-black transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pokemon-yellow/80",
    variant === "primary" &&
      "bg-pokemon-red text-white shadow-xl hover:bg-pokemon-red/90",
    variant === "secondary" &&
      "border-2 border-slate-950/25 bg-white text-slate-950 hover:bg-pokemon-yellow/40",
    variant === "compact" &&
      "h-11 border-2 border-slate-950/25 bg-white px-5 text-sm text-slate-950 hover:bg-pokemon-yellow/40",
    className
  )

  function handleShare() {
    if (!shareContent) {
      return
    }

    if (menuOpen) {
      setMenuOpen(false)
      return
    }

    updateMenuPosition()
    setMenuOpen(true)
  }

  async function handleNativeShare() {
    if (!shareContent || !navigator.share) {
      return
    }

    try {
      await navigator.share({
        title: shareContent.title,
        text: shareContent.text,
        url: shareContent.url,
      })
      setMenuOpen(false)
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return
      }
    }
  }

  async function handleCopyLink() {
    if (!shareContent) {
      return
    }

    try {
      await navigator.clipboard.writeText(shareContent.url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt("Copy this link:", shareContent.url)
    }
  }

  return (
    <>
      <div className="relative" ref={containerRef}>
        <button className={buttonClassName} onClick={handleShare} type="button">
          <Share2 className="size-5" aria-hidden="true" />
          {label}
        </button>
      </div>

      {menuOpen && shareContent && menuPosition
        ? createPortal(
            <ShareMenu
              copied={copied}
              menuRef={menuRef}
              onClose={() => setMenuOpen(false)}
              onCopyLink={handleCopyLink}
              onNativeShare={handleNativeShare}
              position={menuPosition}
              shareContent={shareContent}
              supportsNativeShare={supportsNativeShare}
            />,
            document.body
          )
        : null}
    </>
  )
}
