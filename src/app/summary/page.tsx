"use client"

import Link from "next/link"
import { useApp } from "@/context/AppContext"
import { getHistoryForAccount, getHistorySummary } from "@/lib/history"

export default function SummaryPage() {
  const { history, accountData } = useApp()
  const displayHistory = getHistoryForAccount(history, accountData)
  const summary = getHistorySummary(displayHistory)

  if (summary.totalRecordings === 0) {
    return (
      <div style={{ padding: "40px 32px", maxWidth: "680px", margin: "0 auto", textAlign: "center" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.5px" }}>
          Summary
        </h1>
        <p style={{ color: "#555", fontSize: "14px", margin: "0 0 32px" }}>
          Your pitch insights will appear here after you record.
        </p>
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
          <p style={{ margin: "0 0 16px", fontSize: "16px" }}>No recordings yet.</p>
          <Link
            href="/assessment"
            style={{
              color: "#667eea",
              fontSize: "14px",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Record your first pitch →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: "40px 32px", maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
      <h1 style={{ fontSize: "28px", fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.5px" }}>
        Summary
      </h1>
      <p style={{ color: "#555", fontSize: "14px", margin: "0 0 32px" }}>
        Insights from {summary.totalRecordings} recording{summary.totalRecordings !== 1 ? "s" : ""}
        {summary.dateRange &&
          ` (${new Date(summary.dateRange.last).toLocaleDateString()} – ${new Date(summary.dateRange.first).toLocaleDateString()})`}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
        {/* Trend */}
        {summary.trend && (
          <div
            style={{
              background: summary.trend === "improving" ? "#0d1f0d" : summary.trend === "declining" ? "#1f0d0d" : "#111",
              border: `1px solid ${summary.trend === "improving" ? "#1e3a1e" : summary.trend === "declining" ? "#3a1e1e" : "#222"}`,
              borderRadius: "16px",
              padding: "20px 24px",
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
              Trend
            </div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color:
                  summary.trend === "improving"
                    ? "#4ade80"
                    : summary.trend === "declining"
                      ? "#f87171"
                      : "#aaa",
              }}
            >
              {summary.trend === "improving" && "↑ Improving — your scores are going up"}
              {summary.trend === "declining" && "↓ Declining — focus on consistency"}
              {summary.trend === "stable" && "→ Stable — keep practicing"}
            </div>
          </div>
        )}

        {/* Average scores */}
        <div
          style={{
            background: "#111",
            border: "1px solid #222",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              color: "#555",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            Average Scores
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {Object.entries(summary.avgScores).map(([label, score]) => (
              <div key={label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "14px", color: "#fff", fontWeight: 600 }}>{label}</span>
                  <span
                    style={{
                      fontSize: "14px",
                      color: score >= 85 ? "#4ade80" : score >= 70 ? "#fbbf24" : "#f87171",
                      fontWeight: 700,
                    }}
                  >
                    {score}/100
                  </span>
                </div>
                <div
                  style={{
                    height: "8px",
                    background: "#1a1a1a",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${score}%`,
                      background:
                        score >= 85
                          ? "linear-gradient(90deg, #22c55e, #4ade80)"
                          : score >= 70
                            ? "linear-gradient(90deg, #eab308, #fbbf24)"
                            : "linear-gradient(90deg, #ef4444, #f87171)",
                      borderRadius: "8px",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Focus areas */}
        {(summary.weakestArea || summary.strongestArea) && (
          <div
            style={{
              background: "#111",
              border: "1px solid #222",
              borderRadius: "16px",
              padding: "24px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px",
            }}
          >
            {summary.strongestArea && (
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#555",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Strongest
                </div>
                <div style={{ fontSize: "15px", color: "#4ade80", fontWeight: 600, marginBottom: "4px" }}>
                  {summary.strongestArea}
                </div>
                <div style={{ fontSize: "12px", color: "#555" }}>Keep it up</div>
              </div>
            )}
            {summary.weakestArea && (
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#555",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Focus on
                </div>
                <div style={{ fontSize: "15px", color: "#f87171", fontWeight: 600, marginBottom: "4px" }}>
                  {summary.weakestArea}
                </div>
                <div style={{ fontSize: "12px", color: "#555" }}>Practice this area</div>
              </div>
            )}
          </div>
        )}

        {/* Recent feedback notes */}
        {summary.recentNotes.length > 0 && (
          <div
            style={{
              background: "#111",
              border: "1px solid #222",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                color: "#555",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: "16px",
              }}
            >
              Recent Feedback
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {summary.recentNotes.slice(0, 5).map((note, i) => (
                <div
                  key={i}
                  style={{
                    background: "#0a0a0a",
                    border: "1px solid #1a1a1a",
                    borderRadius: "12px",
                    padding: "14px 16px",
                    fontSize: "13px",
                    color: "#ddd",
                    lineHeight: 1.5,
                  }}
                >
                  <span style={{ color: "#4ade80", fontWeight: 600, marginRight: "8px" }}>{note.label}:</span>
                  {note.note}
                </div>
              ))}
            </div>
          </div>
        )}

        <Link
          href="/history"
          style={{
            color: "#667eea",
            fontSize: "14px",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          View full feedback →
        </Link>
      </div>
    </div>
  )
}
