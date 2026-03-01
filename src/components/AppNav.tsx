"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useApp } from "@/context/AppContext"
import { THEMES } from "@/lib/themes"

const navLinksLoggedOut = [
  { href: "/create-account", label: "Create Account" },
  { href: "/assessment", label: "Assessment" },
  { href: "/investors", label: "Investors" },
  { href: "/summary", label: "Summary" },
  { href: "/history", label: "Feedback" },
  { href: "/messages", label: "Messages" },
]

const navLinksLoggedIn = [
  { href: "/", label: "Home" },
  { href: "/assessment", label: "Assessment" },
  { href: "/investors", label: "Investors" },
  { href: "/summary", label: "Summary" },
  { href: "/history", label: "Feedback" },
  { href: "/messages", label: "Messages" },
]

export function AppNav() {
  const pathname = usePathname()
  const { accountData, conversations, themeId, devInvestorsUnlocked, setDevInvestorsUnlocked } = useApp()
  const theme = THEMES[themeId] ?? THEMES["timeline"]
  const baseLinks = accountData ? navLinksLoggedIn : navLinksLoggedOut
  const links = devInvestorsUnlocked
    ? baseLinks.flatMap((link) =>
        link.href === "/assessment"
          ? [link, { href: "/investor-page", label: "Investor Page" }]
          : [link]
      )
    : baseLinks
  const unreadCount = conversations.reduce((sum, c) => sum + c.unread, 0)

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 24px",
        borderBottom: `1px solid ${theme.border}`,
        background: theme.bgSecondary,
        flexWrap: "wrap",
        gap: "12px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: "40px" }}>
        <button
          type="button"
          onClick={() => setDevInvestorsUnlocked(!devInvestorsUnlocked)}
          title={devInvestorsUnlocked ? "Investors unlocked (dev)" : "Unlock investors (dev)"}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "36px",
            height: "36px",
            borderRadius: "8px",
            background: devInvestorsUnlocked ? "rgba(34, 197, 94, 0.2)" : theme.activeBg,
            border: `1px solid ${devInvestorsUnlocked ? "#22c55e" : theme.border}`,
            color: devInvestorsUnlocked ? "#22c55e" : theme.textMuted,
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          {devInvestorsUnlocked ? "🔓" : "🔒"}
        </button>
        {accountData ? (
          <Link
            href="/profile"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none",
              color: theme.text,
            }}
            title="Profile"
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${theme.accentStart}, ${theme.accentEnd})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "14px",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {accountData.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 600 }}>{accountData.name}</div>
              <div style={{ fontSize: "11px", color: theme.textMuted }}>{accountData.product}</div>
            </div>
          </Link>
        ) : (
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: theme.activeBg,
              border: `1px solid ${theme.border}`,
              textDecoration: "none",
              color: theme.textMuted,
              fontSize: "14px",
              fontWeight: 700,
            }}
            title="Home"
          >
            V
          </Link>
        )}
      </div>
      <nav style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
        {links.map((link, i) => {
          const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
          const isMessages = link.href === "/messages"
          return (
            <Link
              key={`${link.href}-${link.label}-${i}`}
              href={link.href}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                textDecoration: "none",
                color: isActive ? theme.text : theme.textMuted,
                background: isActive ? theme.activeBg : "transparent",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              {link.label}
              {isMessages && unreadCount > 0 && (
                <span
                  style={{
                    background: "#ef4444",
                    borderRadius: "50%",
                    width: "16px",
                    height: "16px",
                    fontSize: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
