"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useApp } from "@/context/AppContext"
import { INVESTORS } from "@/lib/data"
import type { Investor } from "@/lib/types"

export default function InvestorSignInPage() {
  const router = useRouter()
  const { setInvestorAccount } = useApp()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const investor = INVESTORS.find((i) => i.email.toLowerCase() === email.toLowerCase())
    if (investor && password) {
      setInvestorAccount(investor)
      router.push("/investors")
    } else {
      setError("Invalid email or password")
    }
  }

  const handleQuickSignIn = (investor: Investor) => {
    setInvestorAccount(investor)
    router.push("/investors")
  }

  return (
    <div style={{ padding: "40px 32px", maxWidth: "480px", margin: "0 auto", textAlign: "center" }}>
      <h1 style={{ fontSize: "28px", fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.5px" }}>
        Sign in as investor
      </h1>
      <p style={{ color: "#555", fontSize: "14px", margin: "0 0 32px" }}>
        Access the investor directory and messages
      </p>

      <form onSubmit={handleEmailSignIn} style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", textAlign: "left" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", color: "#888", marginBottom: "6px" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. marcus@sequoiacap.com"
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "#111",
                border: "1px solid #222",
                borderRadius: "10px",
                color: "#fff",
                fontSize: "14px",
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "12px", color: "#888", marginBottom: "6px" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "#111",
                border: "1px solid #222",
                borderRadius: "10px",
                color: "#fff",
                fontSize: "14px",
              }}
            />
          </div>
          {error && (
            <div style={{ color: "#f87171", fontSize: "13px" }}>{error}</div>
          )}
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "14px",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            border: "none",
            borderRadius: "12px",
            color: "#fff",
            fontSize: "15px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Sign in
        </button>
      </form>

      <div style={{ marginBottom: "16px", fontSize: "12px", color: "#555" }}>
        Or sign in as a demo profile:
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {INVESTORS.map((investor) => (
          <button
            key={investor.id}
            type="button"
            onClick={() => handleQuickSignIn(investor)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              background: "#111",
              border: "1px solid #222",
              borderRadius: "10px",
              color: "#fff",
              fontSize: "14px",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: investor.avatarColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {investor.avatar}
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>{investor.name}</div>
              <div style={{ fontSize: "12px", color: "#888" }}>{investor.firm}</div>
            </div>
          </button>
        ))}
      </div>

      <Link
        href="/"
        style={{
          display: "inline-block",
          marginTop: "24px",
          color: "#888",
          fontSize: "14px",
          textDecoration: "none",
        }}
      >
        ← Back to home
      </Link>
    </div>
  )
}
