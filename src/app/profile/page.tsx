"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useApp } from "@/context/AppContext"

export default function ProfilePage() {
  const router = useRouter()
  const { accountData, isHydrated } = useApp()

  useEffect(() => {
    if (isHydrated && !accountData) {
      router.replace("/create-account")
    }
  }, [isHydrated, accountData, router])

  if (!isHydrated || !accountData) return null

  const initials = accountData.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div style={{ padding: "40px 32px", maxWidth: "720px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
        <Link
          href="/investors"
          style={{
            background: "none",
            border: "none",
            color: "#aaa",
            fontSize: "14px",
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          ← Investors
        </Link>
        <Link
          href="/create-account"
          style={{
            background: "#111",
            border: "1px solid #222",
            borderRadius: "20px",
            padding: "8px 18px",
            color: "#aaa",
            fontSize: "13px",
            textDecoration: "none",
          }}
        >
          Edit Profile
        </Link>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "40px" }}>
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            flexShrink: 0,
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "22px",
            fontWeight: 700,
            color: "#fff",
            boxShadow: "0 0 0 3px #000, 0 0 0 5px #333",
          }}
        >
          {initials}
        </div>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 700, margin: "0 0 4px", letterSpacing: "-0.5px" }}>
            {accountData.name}
          </h1>
          <p style={{ color: "#555", fontSize: "14px", margin: 0 }}>{accountData.product}</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
        {(
          [
            ["Full Name", accountData.name],
            ["Product", accountData.product],
          ] as [string, string][]
        ).map(([label, val]) => (
          <div
            key={label}
            style={{
              background: "#111",
              border: "1px solid #1a1a1a",
              borderRadius: "16px",
              padding: "20px 22px",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                color: "#555",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: "8px",
              }}
            >
              {label}
            </div>
            <div style={{ fontSize: "15px", color: "#fff", fontWeight: 600 }}>{val}</div>
          </div>
        ))}
      </div>

      <div
        style={{
          background: "#111",
          border: "1px solid #1a1a1a",
          borderRadius: "16px",
          padding: "20px 22px",
          marginBottom: "12px",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            color: "#555",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginBottom: "8px",
          }}
        >
          Description
        </div>
        <div style={{ fontSize: "14px", color: "#ccc", lineHeight: 1.7 }}>{accountData.description}</div>
      </div>

      {accountData.github && (
        <div
          style={{
            background: "#111",
            border: "1px solid #1a1a1a",
            borderRadius: "16px",
            padding: "20px 22px",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              color: "#555",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            GitHub
          </div>
          <a
            href={accountData.github}
            target="_blank"
            rel="noreferrer"
            style={{
              color: "#667eea",
              fontSize: "14px",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            ⎇ {accountData.github}
          </a>
        </div>
      )}

      <Link
        href="/investors"
        style={{
          background: "linear-gradient(135deg, #405de6, #833ab4, #c13584)",
          border: "none",
          borderRadius: "12px",
          padding: "14px 28px",
          color: "#fff",
          fontWeight: 700,
          fontSize: "14px",
          cursor: "pointer",
          textDecoration: "none",
          display: "inline-block",
        }}
      >
        Browse Investors →
      </Link>
    </div>
  )
}
