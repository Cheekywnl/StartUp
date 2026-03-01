"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/context/AppContext"
import { getAllEntries } from "@/lib/history"
import type { AccountData } from "@/lib/types"

const FOUNDER_ID_BASE = 10000
const FOUNDER_AVATAR_COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#14b8a6", "#f59e0b"]

const EXAMPLE_USER: AccountData = {
  name: "Ethan Lim",
  product: "Calorie tracking app",
  description:
    "A smart calorie tracking app that helps users reach their health goals through AI-powered meal logging, barcode scanning, and personalized nutrition insights. Integrates with wearables and fitness apps to provide a complete picture of daily activity and dietary habits.",
  github: "https://github.com/EthanLL",
}

const EXAMPLE_THUMBNAIL =
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=640&q=80"

function getScore(entry: { overallScore?: number; feedback: { score: number }[] }): number | null {
  if (entry.overallScore != null && entry.overallScore > 0) return entry.overallScore
  if (entry.feedback.length === 0) return null
  return Math.round(entry.feedback.reduce((a, f) => a + f.score, 0) / entry.feedback.length)
}

export default function InvestorPage() {
  const router = useRouter()
  const { history, devInvestorsUnlocked, conversations, setConversations, setAllMessages } = useApp()
  const entries = getAllEntries(history)

  const usersWithAccount = entries.filter((e) => e.account != null) as (typeof entries[0] & {
    account: AccountData
    thumbnail?: string
  })[]
  const seen = new Set<string>()
  const uniqueUsers = usersWithAccount.filter((e) => {
    const key = `${e.account.name}|${e.account.product}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
  const baseDisplayUsers: { account: AccountData; score: number | null; index: number; thumbnail?: string }[] = [
    { account: EXAMPLE_USER, score: 85, index: 0, thumbnail: EXAMPLE_THUMBNAIL },
    ...uniqueUsers
      .filter((e) => `${e.account.name}|${e.account.product}` !== `${EXAMPLE_USER.name}|${EXAMPLE_USER.product}`)
      .map((e, i) => ({ account: e.account, score: getScore(e), index: i + 1, thumbnail: e.thumbnail })),
  ]

  const [sortByScoreDesc, setSortByScoreDesc] = useState(false)
  const displayUsers = sortByScoreDesc
    ? [...baseDisplayUsers].sort((a, b) => {
        const sa = a.score ?? -1
        const sb = b.score ?? -1
        return sb - sa
      })
    : baseDisplayUsers

  const handleSendMessage = (account: AccountData, index: number) => {
    const founderId = FOUNDER_ID_BASE + index
    const exists = conversations.find((c) => c.id === founderId)
    if (!exists) {
      const initials = account.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
      const avatarColor = FOUNDER_AVATAR_COLORS[index % FOUNDER_AVATAR_COLORS.length]
      setConversations((prev) => [
        {
          id: founderId,
          name: account.name,
          handle: account.product,
          avatar: initials,
          avatarColor,
          online: false,
          firm: account.product,
          lastMessage: "Start a conversation",
          lastTime: "now",
          unread: 0,
          messages: [],
        },
        ...prev,
      ])
      setAllMessages((prev) => ({ ...prev, [founderId]: [] }))
    }
    router.push(`/messages?id=${founderId}`)
  }

  if (!devInvestorsUnlocked) {
    return (
      <div style={{ padding: "40px 32px", maxWidth: "560px", margin: "0 auto", textAlign: "center" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.5px" }}>
          Investor Page
        </h1>
        <p style={{ color: "#555", fontSize: "14px", margin: "0 0 24px" }}>
          Unlock this page using the lock button in the nav to view users who have taken the assessment.
        </p>
      </div>
    )
  }

  return (
    <div style={{ padding: "40px 32px", maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
      <div style={{ marginBottom: "24px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.5px" }}>
            Founders Feed
          </h1>
          <p style={{ color: "#555", fontSize: "14px", margin: 0 }}>
            {displayUsers.length} founder{displayUsers.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSortByScoreDesc((prev) => !prev)}
          style={{
            background: sortByScoreDesc ? "rgba(99, 102, 241, 0.2)" : "#111",
            border: `1px solid ${sortByScoreDesc ? "#6366f1" : "#222"}`,
            borderRadius: "10px",
            padding: "10px 18px",
            color: sortByScoreDesc ? "#6366f1" : "#aaa",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {sortByScoreDesc ? "✓ Sorted by score" : "Sort by score ↓"}
        </button>
      </div>

      {displayUsers.length === 0 ? (
        <div
          style={{
            background: "#111",
            border: "1px solid #222",
            borderRadius: "16px",
            padding: "48px",
            textAlign: "center",
            color: "#555",
          }}
        >
          <p style={{ margin: "0 0 16px", fontSize: "16px" }}>No users have taken the assessment yet.</p>
          <p style={{ margin: 0, fontSize: "14px" }}>Assessments with account data will appear here.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {displayUsers.map(({ account, score, index, thumbnail }, i) => (
            <div
              key={`${account.name}-${account.product}-${i}`}
              style={{
                background: "#111",
                border: "1px solid #222",
                borderRadius: "16px",
                padding: "24px",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  width: "100%",
                  aspectRatio: "16/9",
                  borderRadius: "12px",
                  overflow: "hidden",
                  background: "#0a0a0a",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt={`${account.name} pitch`}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    style={{
                      color: "#444",
                      fontSize: "14px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span style={{ fontSize: "32px" }}>🎬</span>
                    <span>Pitch thumbnail</span>
                  </div>
                )}
              </div>
              <div style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
                {account.product}
              </div>
              <div style={{ fontSize: "14px", color: "#888", marginBottom: "12px" }}>
                {account.name}
              </div>
              <div style={{ fontSize: "14px", color: "#ccc", lineHeight: 1.6, marginBottom: "12px" }}>
                {account.description}
              </div>
              {account.github && (
                <a
                  href={account.github}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: "#667eea",
                    fontSize: "14px",
                    textDecoration: "none",
                    fontWeight: 500,
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  ⎇ {account.github}
                </a>
              )}
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: score != null ? (score >= 85 ? "#4ade80" : score >= 70 ? "#fbbf24" : "#f87171") : "#666",
                  marginBottom: "12px",
                }}
              >
                Score: {score != null ? `${score}/100` : "—"}
              </div>
              <button
                type="button"
                onClick={() => handleSendMessage(account, index)}
                style={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  border: "none",
                  borderRadius: "10px",
                  padding: "10px 18px",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Send message to founder
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
