"use client"

import Link from "next/link"
import { useApp } from "@/context/AppContext"
import { MainDashboard } from "@/components/MainDashboard"
import { THEMES } from "@/lib/themes"

export default function HomePage() {
  const { accountData, isHydrated, themeId } = useApp()
  const theme = THEMES[themeId]

  if (!isHydrated) return null

  if (accountData) {
    return <MainDashboard />
  }

  return (
    <div style={{ padding: "48px 32px", maxWidth: "560px", margin: "0 auto", textAlign: "center" }}>
      <h1 style={{ fontSize: "32px", fontWeight: 700, margin: "0 0 12px", letterSpacing: "-0.5px", color: theme.text }}>
        Welcome to VCMail
      </h1>
      <p style={{ color: theme.textMuted, fontSize: "16px", margin: "0 0 32px", lineHeight: 1.6 }}>
        Create your account, record your pitch, and connect with potential investors.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" }}>
        <Link
          href="/create-account"
          style={{
            background: `linear-gradient(135deg, ${theme.accentStart}, ${theme.accentEnd})`,
            border: "none",
            borderRadius: "12px",
            padding: "16px 32px",
            color: "#fff",
            fontWeight: 700,
            fontSize: "16px",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Get Started →
        </Link>
        <Link
          href="/investors"
          style={{
            color: theme.textMuted,
            fontSize: "14px",
            textDecoration: "none",
          }}
        >
          Skip to Investors
        </Link>
      </div>
    </div>
  )
}
