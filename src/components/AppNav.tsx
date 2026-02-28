"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useApp } from "@/context/AppContext"

const navLinks = [
  { href: "/create-account", label: "Create Account" },
  { href: "/assessment", label: "Assessment" },
  { href: "/investors", label: "Investors" },
  { href: "/profile", label: "Profile" },
  { href: "/messages", label: "Messages" },
]

export function AppNav() {
  const pathname = usePathname()
  const { accountData, conversations } = useApp()
  const unreadCount = conversations.reduce((sum, c) => sum + c.unread, 0)

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 24px",
        borderBottom: "1px solid #111",
        background: "#000",
        flexWrap: "wrap",
        gap: "12px",
      }}
    >
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", color: "#fff" }}>
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "8px",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            fontWeight: 700,
          }}
        >
          V
        </div>
        <span style={{ fontSize: "16px", fontWeight: 600 }}>VCMail</span>
      </Link>
      <nav style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
        {navLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
          const isMessages = link.href === "/messages"
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                textDecoration: "none",
                color: isActive ? "#fff" : "#888",
                background: isActive ? "#222" : "transparent",
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
      {accountData && (
        <Link
          href="/profile"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "20px",
            padding: "8px 16px",
            textDecoration: "none",
            color: "#fff",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
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
            <div style={{ fontSize: "13px", fontWeight: 600 }}>{accountData.name}</div>
            <div style={{ color: "#666", fontSize: "11px" }}>{accountData.product}</div>
          </div>
        </Link>
      )}
    </header>
  )
}
