"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useApp } from "@/context/AppContext"
import { THEMES } from "@/lib/themes"

const navLinksLoggedOut = [
  { href: "/create-account", label: "Create Account" },
  { href: "/assessment", label: "Assessment" },
  { href: "/investors", label: "Funding" },
  { href: "/summary", label: "Summary" },
  { href: "/history", label: "Feedback" },
  { href: "/messages", label: "Messages" },
]

const navLinksFounderLoggedIn: { href: string; label: string; isLogout?: boolean }[] = [
  { href: "/", label: "Home" },
  { href: "/assessment", label: "Assessment" },
  { href: "/investors", label: "Funding" },
  { href: "/summary", label: "Summary" },
  { href: "/history", label: "Feedback" },
  { href: "/messages", label: "Messages" },
  { href: "", label: "Log out", isLogout: true },
]

const navLinksInvestorLoggedIn: { href: string; label: string; isLogout?: boolean }[] = [
  { href: "/investors", label: "Founders Feed" },
  { href: "/messages", label: "Messages" },
  { href: "", label: "Log out", isLogout: true },
]

export function AppNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { accountData, investorAccount, setInvestorAccount, setAccountData, conversations, themeId, devInvestorsUnlocked, setDevInvestorsUnlocked } = useApp()
  const isLoggedOut = !accountData && !investorAccount
  const theme = THEMES[themeId] ?? THEMES["timeline"]
  const links = investorAccount
    ? navLinksInvestorLoggedIn
    : accountData
      ? navLinksFounderLoggedIn
      : navLinksLoggedOut
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
        {!investorAccount && (
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
        )}
        {investorAccount ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: investorAccount.avatarColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "14px",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {investorAccount.avatar}
            </div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 600 }}>{investorAccount.name}</div>
              <div style={{ fontSize: "11px", color: theme.textMuted }}>{investorAccount.firm}</div>
            </div>
          </div>
        ) : accountData ? (
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
            href="/create-account"
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
            title="Create Account"
          >
            V
          </Link>
        )}
      </div>
      <nav style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
        {links.map((link, i) => {
          const isLogout = "isLogout" in link && link.isLogout
          const isCreateAccount = isLoggedOut && link.href === "/create-account"
          const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
          const isMessages = link.href === "/messages"
          const isClickable = isLoggedOut ? isCreateAccount : !isLogout
          const linkColor = isLoggedOut && !isCreateAccount
            ? (isActive ? "#666" : "#555")
            : isActive || isCreateAccount
              ? theme.text
              : theme.textMuted
          const linkBg = isLoggedOut && !isCreateAccount
            ? (isActive ? "#1a1a1a" : "transparent")
            : isActive || isCreateAccount
              ? theme.activeBg
              : "transparent"
          const baseStyle = {
            padding: "8px 14px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 600,
            textDecoration: "none",
            color: linkColor,
            background: linkBg,
            display: "flex",
            alignItems: "center",
            gap: "6px",
            ...(!isClickable && { cursor: "not-allowed", pointerEvents: "none" as const }),
          }
          if (isLogout) {
            return (
              <button
                key={`logout-${i}`}
                type="button"
                onClick={() => {
                  if (investorAccount) setInvestorAccount(null)
                  else setAccountData(null)
                  router.push("/create-account")
                }}
                style={{
                  ...baseStyle,
                  border: "none",
                  cursor: "pointer",
                  pointerEvents: "auto",
                  fontFamily: "inherit",
                }}
              >
                {link.label}
              </button>
            )
          }
          if (!isClickable) {
            return (
              <span key={`${link.href}-${link.label}-${i}`} style={baseStyle}>
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
              </span>
            )
          }
          return (
            <Link key={`${link.href}-${link.label}-${i}`} href={link.href} style={baseStyle}>
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
