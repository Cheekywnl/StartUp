"use client"

import Link from "next/link"
import type { Investor } from "@/lib/types"

interface InvestorDetailProps {
  investor: Investor
  onClose: () => void
}

export function InvestorDetail({ investor, onClose }: InvestorDetailProps) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#0a0a0a",
          border: "1px solid #222",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "640px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: "28px 28px 20px", borderBottom: "1px solid #1a1a1a" }}>
          <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  background: investor.avatarColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {investor.avatar}
              </div>
              {investor.online && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "3px",
                    right: "3px",
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    background: "#00e676",
                    border: "2px solid #0a0a0a",
                  }}
                />
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: "20px", color: "#fff" }}>{investor.name}</div>
              <div style={{ fontSize: "14px", color: "#aaa", marginTop: "3px" }}>
                {investor.role} · {investor.firm}
              </div>
              <div style={{ fontSize: "12px", color: "#555", marginTop: "2px" }}>
                {investor.handle} · {investor.location}
              </div>
              <div style={{ fontSize: "12px", color: "#00e676", marginTop: "4px" }}>
                {investor.online ? "● Active now" : investor.lastActive}
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "#1a1a1a",
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                cursor: "pointer",
                color: "#fff",
                fontSize: "16px",
              }}
            >
              ✕
            </button>
          </div>
        </div>
        <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "24px" }}>
          <div>
            <div
              style={{
                fontSize: "11px",
                color: "#555",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: "8px",
              }}
            >
              About
            </div>
            <p style={{ color: "#bbb", fontSize: "14px", lineHeight: 1.7, margin: 0 }}>{investor.bio}</p>
          </div>
          <div style={{ display: "flex", gap: "16px" }}>
            <div style={{ flex: 1, background: "#111", borderRadius: "12px", padding: "16px" }}>
              <div
                style={{
                  fontSize: "11px",
                  color: "#555",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                Check Size
              </div>
              <div style={{ fontWeight: 700, fontSize: "16px", color: "#fff" }}>{investor.checkSize}</div>
            </div>
            <div style={{ flex: 1, background: "#111", borderRadius: "12px", padding: "16px" }}>
              <div
                style={{
                  fontSize: "11px",
                  color: "#555",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                Response Time
              </div>
              <div style={{ fontSize: "13px", color: "#aaa" }}>{investor.responseRate}</div>
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: "11px",
                color: "#555",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: "10px",
              }}
            >
              Focus Areas
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {investor.focus.map((f) => (
                <span
                  key={f}
                  style={{
                    background: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    borderRadius: "20px",
                    padding: "5px 14px",
                    fontSize: "13px",
                    color: "#ddd",
                  }}
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: "11px",
                color: "#555",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: "10px",
              }}
            >
              Notable Portfolio
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {investor.portfolio.map((p) => (
                <div
                  key={p.company}
                  style={{
                    background: "#111",
                    borderRadius: "12px",
                    padding: "14px 16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "14px", color: "#fff" }}>{p.company}</div>
                    <div style={{ fontSize: "12px", color: "#555", marginTop: "2px" }}>
                      {p.stage} · {p.year}
                    </div>
                  </div>
                  <div style={{ fontSize: "12px", color: "#aaa" }}>{p.outcome}</div>
                </div>
              ))}
            </div>
          </div>
          <Link
            href={`/messages?id=${investor.id}`}
            style={{
              background: "linear-gradient(135deg, #405de6, #833ab4, #c13584, #e1306c)",
              border: "none",
              borderRadius: "12px",
              padding: "14px",
              color: "#fff",
              fontWeight: 700,
              fontSize: "15px",
              cursor: "pointer",
              width: "100%",
              textAlign: "center",
              textDecoration: "none",
              display: "block",
            }}
          >
            ✉ Send Message
          </Link>
        </div>
      </div>
    </div>
  )
}
