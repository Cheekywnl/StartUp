"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/context/AppContext"
import { getAllEntries } from "@/lib/history"
import { getAssessmentTypeLabel } from "@/lib/assessment-types"
import type { AccountData, HistoryEntry } from "@/lib/types"

const FOUNDER_ID_BASE = 10000
const FOUNDER_AVATAR_COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#14b8a6", "#f59e0b"]

function makeHardcodedFounder(account: AccountData, entryOverrides: Partial<Omit<HistoryEntry, "account">>): { account: AccountData; entry: HistoryEntry } {
  const entry: HistoryEntry = {
    timestamp: new Date().toISOString(),
    account,
    transcript: "",
    feedback: [],
    ...entryOverrides,
  }
  return { account, entry }
}

const HARDCODED_ETHAN: { account: AccountData; entry: HistoryEntry } = makeHardcodedFounder(
  {
    name: "Ethan Lim",
    product: "Calorie tracking app",
    description:
      "A smart calorie tracking app that helps users reach their health goals through AI-powered meal logging, barcode scanning, and personalized nutrition insights.",
    github: "https://github.com/EthanLL",
  },
  {
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    transcript:
      "Hi, I'm Ethan. We're building a smart calorie tracking app that helps users reach their health goals. Our AI-powered meal logging and barcode scanning make it easy to track nutrition.",
    feedback: [
      { label: "Problem clarity", score: 88, note: "Clear pain point." },
      { label: "Solution fit", score: 82, note: "AI integration is compelling." },
      { label: "Market size", score: 80, note: "Health tech market is large." },
    ],
    redFlags: ["Early traction not yet validated"],
    advice: ["Consider adding social features for accountability"],
    overallScore: 85,
    thumbnail: "https://picsum.photos/seed/calorie-app/640/360",
    assessmentType: "pitch-deck",
  }
)

function getScore(entry: { overallScore?: number; feedback: { score: number }[] }): number | null {
  if (entry.overallScore != null && entry.overallScore > 0) return entry.overallScore
  if (entry.feedback.length === 0) return null
  return Math.round(entry.feedback.reduce((a, f) => a + f.score, 0) / entry.feedback.length)
}

type FoundersFeedProps = { title?: string; defaultSortMode?: "date" | "score" }

export function FoundersFeed({ title = "Founders Feed", defaultSortMode = "date" }: FoundersFeedProps) {
  const router = useRouter()
  const { history, conversations, setConversations, setAllMessages } = useApp()
  const entries = getAllEntries(history)

  const usersWithAccount = entries.filter((e) => e.account != null) as (typeof entries[0] & {
    account: AccountData
    thumbnail?: string
  })[]

  // Stable founderId per unique (name, product) for messaging
  const founderIdMap = new Map<string, number>()
  let nextFounderId = 0
  const getFounderId = (account: AccountData) => {
    const key = `${account.name}|${account.product}`
    if (!founderIdMap.has(key)) founderIdMap.set(key, FOUNDER_ID_BASE + nextFounderId++)
    return founderIdMap.get(key)!
  }

  // Show every locally stored recording as its own card (no deduplication), always include Ethan's example
  const ethanCard = {
    account: HARDCODED_ETHAN.account,
    score: getScore(HARDCODED_ETHAN.entry),
    index: -1,
    founderId: FOUNDER_ID_BASE,
    thumbnail: HARDCODED_ETHAN.entry.thumbnail,
    entry: HARDCODED_ETHAN.entry,
    timestamp: HARDCODED_ETHAN.entry.timestamp,
    assessmentType: HARDCODED_ETHAN.entry.assessmentType ?? "pitch-deck",
  }
  const realCards = usersWithAccount.map((e, i) => ({
    account: e.account,
    score: getScore(e),
    index: i,
    founderId: getFounderId(e.account),
    thumbnail: e.thumbnail,
    entry: e as HistoryEntry,
    timestamp: e.timestamp,
    assessmentType: (e as HistoryEntry).assessmentType ?? "pitch-deck",
  }))
  const baseDisplayUsers: {
    account: AccountData
    score: number | null
    index: number
    founderId: number
    thumbnail?: string
    entry: HistoryEntry | null
    timestamp: string
    assessmentType: string
  }[] = [ethanCard, ...realCards]

  type SortMode = "date" | "score"
  const [sortMode, setSortMode] = useState<SortMode>(defaultSortMode)
  const [summaryEntry, setSummaryEntry] = useState<{ account: AccountData; entry: HistoryEntry; founderId: number } | null>(null)

  const displayUsers = [...baseDisplayUsers].sort((a, b) => {
    if (sortMode === "score") {
      const sa = a.score ?? -1
      const sb = b.score ?? -1
      return sb - sa
    }
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  })

  const cycleSort = () => setSortMode((prev) => (prev === "date" ? "score" : "date"))

  function formatDate(ts: string): string {
    const d = new Date(ts)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSummaryEntry(null)
    }
    if (summaryEntry) {
      window.addEventListener("keydown", onKeyDown)
      return () => window.removeEventListener("keydown", onKeyDown)
    }
  }, [summaryEntry])

  const handleSendMessage = (account: AccountData, founderId: number) => {
    const exists = conversations.find((c) => c.id === founderId)
    if (!exists) {
      const initials = account.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
      const avatarColor = FOUNDER_AVATAR_COLORS[founderId % FOUNDER_AVATAR_COLORS.length]
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

  return (
    <div style={{ padding: "40px 32px", maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
      <div style={{ marginBottom: "24px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.5px" }}>
            {title}
          </h1>
          <p style={{ color: "#555", fontSize: "14px", margin: 0 }}>
            {displayUsers.length} recording{displayUsers.length !== 1 ? "s" : ""} stored locally
          </p>
        </div>
        <button
          type="button"
          onClick={cycleSort}
          style={{
            background: "rgba(99, 102, 241, 0.2)",
            border: "1px solid #6366f1",
            borderRadius: "10px",
            padding: "10px 18px",
            color: "#6366f1",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {sortMode === "date" ? "✓ Sorted by date" : "✓ Sorted by score"}
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
          <p style={{ margin: "0 0 16px", fontSize: "16px" }}>No founders have taken the assessment yet.</p>
          <p style={{ margin: 0, fontSize: "14px" }}>Assessments with account data will appear here.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {displayUsers.map(({ account, score, index, thumbnail, entry, timestamp, assessmentType, founderId }, i) => (
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
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <span style={{ fontSize: "14px", color: "#888" }}>{account.name}</span>
                <span style={{ fontSize: "12px", color: "#555" }}>·</span>
                <span style={{ fontSize: "13px", color: "#666" }}>{formatDate(timestamp)}</span>
                <span style={{ fontSize: "12px", color: "#555" }}>·</span>
                <span
                  style={{
                    fontSize: "11px",
                    color: assessmentType.startsWith("hackathon") ? "#a78bfa" : "#666",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {getAssessmentTypeLabel(assessmentType)}
                </span>
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
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {entry && (
                  <button
                    type="button"
                    onClick={() => setSummaryEntry({ account, entry, founderId })}
                    style={{
                      background: "transparent",
                      border: "1px solid #444",
                      borderRadius: "10px",
                      padding: "10px 18px",
                      color: "#aaa",
                      fontSize: "14px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    View interview summary
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleSendMessage(account, founderId)}
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
            </div>
          ))}
        </div>
      )}

      {summaryEntry && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="summary-title"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "24px",
          }}
          onClick={() => setSummaryEntry(null)}
        >
          <div
            style={{
              background: "#111",
              border: "1px solid #333",
              borderRadius: "16px",
              maxWidth: "640px",
              width: "100%",
              maxHeight: "85vh",
              overflow: "auto",
              textAlign: "left",
              padding: "28px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
              <h2 id="summary-title" style={{ fontSize: "22px", fontWeight: 700, color: "#fff", margin: 0 }}>
                Interview summary — {summaryEntry.account.product}
              </h2>
              <button
                type="button"
                onClick={() => setSummaryEntry(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#888",
                  fontSize: "20px",
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                ×
              </button>
            </div>
            <p style={{ color: "#888", fontSize: "14px", margin: "0 0 20px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              {summaryEntry.account.name}
              <span
                style={{
                  fontSize: "11px",
                  color: (summaryEntry.entry.assessmentType ?? "pitch-deck").startsWith("hackathon") ? "#a78bfa" : "#555",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {getAssessmentTypeLabel(summaryEntry.entry.assessmentType)}
              </span>
            </p>

            {summaryEntry.entry.transcript && (
              <section style={{ marginBottom: "24px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#aaa", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Transcript
                </h3>
                <p style={{ color: "#ccc", fontSize: "15px", lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>
                  {summaryEntry.entry.transcript}
                </p>
              </section>
            )}

            {summaryEntry.entry.feedback && summaryEntry.entry.feedback.length > 0 && (
              <section style={{ marginBottom: "24px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#aaa", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Key points
                </h3>
                <ul style={{ margin: 0, paddingLeft: "20px", color: "#ccc", fontSize: "14px", lineHeight: 1.8 }}>
                  {summaryEntry.entry.feedback.map((f, i) => (
                    <li key={i}>
                      <strong style={{ color: "#fff" }}>{f.label}</strong> ({f.score}/100): {f.note}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {summaryEntry.entry.redFlags && summaryEntry.entry.redFlags.length > 0 && (
              <section style={{ marginBottom: "24px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#f87171", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Red flags
                </h3>
                <ul style={{ margin: 0, paddingLeft: "20px", color: "#ccc", fontSize: "14px", lineHeight: 1.8 }}>
                  {summaryEntry.entry.redFlags.map((flag, i) => (
                    <li key={i}>{flag}</li>
                  ))}
                </ul>
              </section>
            )}

            {summaryEntry.entry.advice && summaryEntry.entry.advice.length > 0 && (
              <section style={{ marginBottom: "24px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#4ade80", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Advice
                </h3>
                <ul style={{ margin: 0, paddingLeft: "20px", color: "#ccc", fontSize: "14px", lineHeight: 1.8 }}>
                  {summaryEntry.entry.advice.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </section>
            )}

            <button
              type="button"
              onClick={() => {
                setSummaryEntry(null)
                handleSendMessage(summaryEntry.account, summaryEntry.founderId)
              }}
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
        </div>
      )}
    </div>
  )
}
