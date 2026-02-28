"use client"

import { AppNav } from "./AppNav"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <AppNav />
      <main>{children}</main>
    </div>
  )
}
