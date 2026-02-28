"use client"

import Link from "next/link"
import type { Investor } from "@/lib/types"

interface InvestorCardProps {
  investor: Investor
  onSelect: () => void
}

export function InvestorCard({ investor, onSelect }: InvestorCardProps) {
  return (
    <div
      onClick={onSelect}
      style={{
        background: "#111",
        border: "1px solid #222",
        borderRadius: "16px",
        padding: "24px",
        cursor: "pointer",
        transition: "border-color 0.2s, transform 0.15s",
      }}
      onMouseOver={(e: React.MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.borderColor = "#444"
        e.currentTarget.style.transform = "translateY(-2px)"
      }}
      onMouseOut={(e: React.MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.borderColor = "#222"
        e.currentTarget.style.transform = "translateY(0)"
      }}
    >
      <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", marginBottom: "16px" }}>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: investor.avatarColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
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
                bottom: "2px",
                right: "2px",
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: "#00e676",
                border: "2px solid #111",
              }}
            />
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: "15px", color: "#fff" }}>{investor.name}</div>
          <div style={{ fontSize: "13px", color: "#aaa", marginTop: "2px" }}>
            {investor.role} · {investor.firm}
          </div>
          <div style={{ fontSize: "12px", color: "#555", marginTop: "2px" }}>{investor.location}</div>
        </div>
        <div
          style={{
            background: "#1a1a1a",
            border: "1px solid #333",
            borderRadius: "20px",
            padding: "4px 12px",
            fontSize: "11px",
            color: "#aaa",
            flexShrink: 0,
          }}
        >
          {investor.checkSize}
        </div>
      </div>
      <p
        style={{
          color: "#888",
          fontSize: "13px",
          lineHeight: 1.6,
          margin: "0 0 16px",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {investor.bio}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "14px" }}>
        {investor.focus.map((f) => (
          <span
            key={f}
            style={{
              background: "#1a1a1a",
              border: "1px solid #2a2a2a",
              borderRadius: "20px",
              padding: "3px 10px",
              fontSize: "11px",
              color: "#ccc",
            }}
          >
            {f}
          </span>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: "6px" }}>
          {investor.stages.map((s) => (
            <span
              key={s}
              style={{
                background: investor.avatarColor + "22",
                color: investor.avatarColor,
                borderRadius: "20px",
                padding: "3px 10px",
                fontSize: "11px",
                fontWeight: 600,
              }}
            >
              {s}
            </span>
          ))}
        </div>
        <Link
          href={`/messages?id=${investor.id}`}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "linear-gradient(135deg, #405de6, #833ab4, #c13584)",
            border: "none",
            borderRadius: "20px",
            padding: "7px 16px",
            color: "#fff",
            fontSize: "12px",
            fontWeight: 700,
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          ✉ Message
        </Link>
      </div>
    </div>
  )
}
