"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useApp } from "@/context/AppContext"

export default function HomePage() {
  const router = useRouter()
  const { accountData } = useApp()

  useEffect(() => {
    if (accountData) {
      router.replace("/investors")
    }
  }, [accountData, router])

  return (
    <div style={{ padding: "48px 32px", maxWidth: "560px", margin: "0 auto", textAlign: "center" }}>
      <h1 style={{ fontSize: "32px", fontWeight: 700, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
        Welcome to VCMail
      </h1>
      <p style={{ color: "#555", fontSize: "16px", margin: "0 0 32px", lineHeight: 1.6 }}>
        Create your account, record your pitch, and connect with potential investors.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" }}>
        <Link
          href="/create-account"
          style={{
            background: "linear-gradient(135deg, #405de6, #833ab4, #c13584)",
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
            color: "#888",
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
