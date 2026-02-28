"use client"

import Link from "next/link"
import { useApp } from "@/context/AppContext"
import type { HistoryEntry } from "@/lib/types"

export default function HistoryPage() {
  const { history, exportHistoryJson } = useApp()

  const dates = Object.keys(history).sort((a, b) => b.localeCompare(a))
  const totalEntries = dates.reduce((sum, d) => sum + history[d].length, 0)

  return (
    <div style={{ padding: "40px 32px", maxWidth: "800px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.5px" }}>
            Recording History
          </h1>
          <p style={{ color: "#555", fontSize: "14px", margin: 0 }}>
            {totalEntries} recording{totalEntries !== 1 ? "s" : ""} stored locally
          </p>
        </div>
        <button
          onClick={exportHistoryJson}
          disabled={totalEntries === 0}
          style={{
            background: totalEntries === 0 ? "#333" : "linear-gradient(135deg, #405de6, #833ab4, #c13584)",
            border: "none",
            borderRadius: "12px",
            padding: "12px 24px",
            color: "#fff",
            fontWeight: 700,
            fontSize: "14px",
            cursor: totalEntries === 0 ? "not-allowed" : "pointer",
          }}
        >
          ↓ Download history.json
        </button>
      </div>

      {dates.length === 0 ? (
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
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {dates.map((date) => (
            <div
              key={date}
              style={{
                background: "#111",
                border: "1px solid #222",
                borderRadius: "16px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid #1a1a1a",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {new Date(date + "T12:00:00").toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                {history[date].map((entry: HistoryEntry, i: number) => (
                  <div
                    key={i}
                    style={{
                      background: "#0a0a0a",
                      border: "1px solid #1a1a1a",
                      borderRadius: "12px",
                      padding: "16px",
                    }}
                  >
                    <div style={{ fontSize: "11px", color: "#555", marginBottom: "8px" }}>
                      {new Date(entry.timestamp).toLocaleTimeString()}
                      {entry.account && ` · ${entry.account.name} (${entry.account.product})`}
                    </div>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "#ccc",
                        lineHeight: 1.6,
                        margin: "0 0 12px",
                        whiteSpace: "pre-wrap",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {entry.transcript}
                    </p>
                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                      {entry.feedback.map((f) => (
                        <span
                          key={f.label}
                          style={{
                            background: "#1a1a1a",
                            borderRadius: "8px",
                            padding: "4px 10px",
                            fontSize: "11px",
                            color: "#4ade80",
                          }}
                        >
                          {f.label}: {f.score}/100
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
