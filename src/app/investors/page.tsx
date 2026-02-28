"use client"

import { useState } from "react"
import { INVESTORS } from "@/lib/data"
import type { Investor } from "@/lib/types"
import { InvestorCard } from "@/components/InvestorCard"
import { InvestorDetail } from "@/components/InvestorDetail"

export default function InvestorsPage() {
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null)
  const [search, setSearch] = useState<string>("")
  const [stageFilter, setStageFilter] = useState<string>("All")
  const [interestFilter, setInterestFilter] = useState<string>("All")

  const stages = ["All", "Seed", "Series A", "Series B"]
  const allInterests = ["All", ...Array.from(new Set(INVESTORS.flatMap((inv) => inv.focus)))]

  const filtered = INVESTORS.filter((inv) => {
    const matchSearch =
      inv.name.toLowerCase().includes(search.toLowerCase()) ||
      inv.firm.toLowerCase().includes(search.toLowerCase()) ||
      inv.focus.some((f) => f.toLowerCase().includes(search.toLowerCase()))
    const matchStage = stageFilter === "All" || inv.stages.includes(stageFilter)
    const matchInterest = interestFilter === "All" || inv.focus.includes(interestFilter)
    return matchSearch && matchStage && matchInterest
  })

  return (
    <div style={{ padding: "40px 32px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.5px" }}>
          Potential Investors
        </h1>
        <p style={{ color: "#555", fontSize: "14px", margin: 0 }}>
          {INVESTORS.length} VCs actively investing in software startups
        </p>
      </div>

      <div style={{ display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
        <div
          style={{
            flex: 1,
            minWidth: "240px",
            background: "#111",
            border: "1px solid #222",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 16px",
          }}
        >
          <span style={{ color: "#555" }}>🔍</span>
          <input
            placeholder="Search investors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: "none",
              border: "none",
              outline: "none",
              color: "#fff",
              fontSize: "14px",
              width: "100%",
            }}
          />
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {stages.map((s) => (
            <button
              key={s}
              onClick={() => setStageFilter(s)}
              style={{
                background: stageFilter === s ? "#fff" : "#111",
                color: stageFilter === s ? "#000" : "#aaa",
                border: "1px solid #222",
                borderRadius: "20px",
                padding: "8px 16px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: "8px", marginBottom: "28px", flexWrap: "wrap" }}>
        {allInterests.map((interest) => (
          <button
            key={interest}
            onClick={() => setInterestFilter(interest)}
            style={{
              background: interestFilter === interest ? "#fff" : "#111",
              color: interestFilter === interest ? "#000" : "#aaa",
              border: "1px solid #222",
              borderRadius: "20px",
              padding: "7px 16px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {interest}
          </button>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "16px",
        }}
      >
        {filtered.map((inv) => (
          <InvestorCard
            key={inv.id}
            investor={inv}
            onSelect={() => setSelectedInvestor(inv)}
          />
        ))}
      </div>
      {filtered.length === 0 && (
        <div style={{ textAlign: "center", color: "#555", padding: "60px", fontSize: "15px" }}>
          No investors match your search
        </div>
      )}
      {selectedInvestor && (
        <InvestorDetail
          investor={selectedInvestor}
          onClose={() => setSelectedInvestor(null)}
        />
      )}
    </div>
  )
}
