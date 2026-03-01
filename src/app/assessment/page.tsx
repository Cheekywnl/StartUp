"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useApp } from "@/context/AppContext"
import { getHistoryForAccount, getHistorySummary } from "@/lib/history"
import { REVIEW_DIMENSIONS } from "@/lib/review/rubric"
import { ASSESSMENT_TYPES, HACKATHON_CATEGORIES, HACKATHON_JUDGING_CRITERIA } from "@/lib/assessment-types"

export default function AssessmentInfoPage() {
  const router = useRouter()
  const { accountData, history, workOnNote, assessmentType, setAssessmentType, isHydrated } = useApp()
  const displayHistory = getHistoryForAccount(history, accountData)
  const summary = getHistorySummary(displayHistory)
  const [githubSummary, setGithubSummary] = useState<string | null>(null)

  useEffect(() => {
    if (accountData?.github && typeof window !== "undefined") {
      fetch(`/api/github?url=${encodeURIComponent(accountData.github)}`)
        .then((r) => r.json())
        .then((d: { summary?: string }) => setGithubSummary(d.summary ?? null))
        .catch(() => setGithubSummary(null))
    }
  }, [accountData?.github])

  useEffect(() => {
    if (isHydrated && !accountData) {
      router.replace("/create-account")
    }
  }, [isHydrated, accountData, router])

  if (!isHydrated || !accountData) return null

  const firstName = accountData.name.split(" ")[0] || accountData.name
  const isHackathon = assessmentType.startsWith("hackathon-")
  const hackathonCategory =
    isHackathon && assessmentType in HACKATHON_CATEGORIES
      ? HACKATHON_CATEGORIES[assessmentType as keyof typeof HACKATHON_CATEGORIES]
      : null

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "48px 32px" }}>
      <div style={{ marginBottom: "32px", display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.5px" }}>
            Welcome, {firstName}
          </h1>
          <p style={{ color: "#555", fontSize: "14px", margin: 0 }}>
            Ready to practice your pitch? Here&apos;s what we&apos;ll cover.
          </p>
        </div>
        <div
          style={{
            background: "#111",
            border: "1px solid #1a1a1a",
            borderRadius: "12px",
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span style={{ fontSize: "11px", color: "#555", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Assessment
          </span>
          <select
            value={assessmentType}
            onChange={(e) => setAssessmentType(e.target.value as typeof assessmentType)}
            style={{
              background: "#0a0a0a",
              border: "1px solid #333",
              borderRadius: "8px",
              padding: "6px 12px",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              minWidth: "160px",
            }}
          >
            {ASSESSMENT_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Confirm details - Are you ready to present */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.06))",
          border: "1px solid rgba(99,102,241,0.2)",
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "24px",
        }}
      >
        <h2
          style={{
            fontSize: "13px",
            color: "#a5b4fc",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: "16px",
          }}
        >
          Are you ready to present {accountData.product}?
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <span style={{ fontSize: "11px", color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Your description
            </span>
            <p style={{ fontSize: "14px", color: "#e0e7ff", lineHeight: 1.6, margin: "6px 0 0" }}>
              {accountData.description}
            </p>
          </div>
          {accountData.github && (
            <div>
              <span style={{ fontSize: "11px", color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Repo summary
              </span>
              <p
                style={{
                  fontSize: "13px",
                  color: "#c7d2fe",
                  lineHeight: 1.6,
                  margin: "6px 0 0",
                  whiteSpace: "pre-wrap",
                  maxHeight: "120px",
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 5,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {githubSummary ?? "Loading…"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Hackathon category brief (when Hackathon 1/2/3 selected) */}
      {hackathonCategory && (
        <div
          style={{
            background: "linear-gradient(135deg, rgba(167,139,250,0.08), rgba(139,92,246,0.06))",
            border: "1px solid rgba(167,139,250,0.3)",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "24px",
          }}
        >
          <h2
            style={{
              fontSize: "14px",
              color: "#a78bfa",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            Warwick Finance Societies Fintech Hackathon
          </h2>
          <div style={{ fontSize: "18px", fontWeight: 700, color: "#fff", marginBottom: "12px" }}>
            {hackathonCategory.title}
          </div>
          <p style={{ fontSize: "14px", color: "#c4b5fd", lineHeight: 1.6, margin: "0 0 12px" }}>
            {hackathonCategory.problem}
          </p>
          <p style={{ fontSize: "14px", color: "#e9d5ff", fontWeight: 600, lineHeight: 1.6, margin: 0 }}>
            {hackathonCategory.challenge}
          </p>
        </div>
      )}

      {/* Scoring criteria */}
      <div
        style={{
          background: "#111",
          border: "1px solid #1a1a1a",
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "24px",
        }}
      >
        <h2
          style={{
            fontSize: "12px",
            color: "#555",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginBottom: "16px",
          }}
        >
          {isHackathon ? "You will be judged on" : "How You'll Be Scored"}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {(isHackathon ? HACKATHON_JUDGING_CRITERIA : REVIEW_DIMENSIONS).map((d) => (
            <div key={d.id}>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#fff", marginBottom: "4px" }}>
                {d.label}
              </div>
              <div style={{ fontSize: "13px", color: "#888", lineHeight: 1.5 }}>{d.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Previous scores summary */}
      {summary.totalRecordings > 0 && Object.keys(summary.avgScores).length > 0 && (
        <div
          style={{
            background: "#111",
            border: "1px solid #1a1a1a",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "24px",
          }}
        >
          <h2
            style={{
              fontSize: "12px",
              color: "#555",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            Summary
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            {Object.entries(summary.avgScores).map(([label, score]) => (
              <div
                key={label}
                style={{
                  padding: "10px 16px",
                  background: "#0a0a0a",
                  borderRadius: "10px",
                  border: "1px solid #1a1a1a",
                }}
              >
                <span style={{ fontSize: "12px", color: "#888", display: "block" }}>{label}</span>
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: score >= 85 ? "#4ade80" : score >= 70 ? "#fbbf24" : "#f87171",
                  }}
                >
                  {score}/100
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* What to work on (editable from home) */}
      <div
        style={{
          background: "#111",
          border: "1px solid #1a1a1a",
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "24px",
        }}
      >
        <h2
          style={{
            fontSize: "12px",
            color: "#555",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}
        >
          Note
        </h2>
        <p style={{ fontSize: "14px", color: "#ccc", lineHeight: 1.6, margin: 0 }}>
          {workOnNote || "Add what to work on from your home screen."}
        </p>
      </div>

      {/* Proceed button */}
      <div style={{ marginTop: "8px" }}>
        <Link
          href={`/assessment/record?type=${assessmentType}`}
          style={{
            display: "inline-block",
            background: "linear-gradient(135deg, #405de6, #833ab4, #c13584)",
            border: "none",
            borderRadius: "14px",
            padding: "18px 36px",
            color: "#fff",
            fontWeight: 700,
            fontSize: "17px",
            textDecoration: "none",
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(99,102,241,0.3)",
          }}
        >
          Okay, Let&apos;s Go! →
        </Link>
      </div>
    </div>
  )
}
