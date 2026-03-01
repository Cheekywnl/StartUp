"use client"

import { AppNav } from "./AppNav"
import { useApp } from "@/context/AppContext"
import { THEMES } from "@/lib/themes"

export function AppShell({ children }: { children: React.ReactNode }) {
  const { themeId } = useApp()
  const theme = THEMES[themeId] ?? THEMES["timeline"]

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: theme.bg,
        color: theme.text,
        fontFamily: theme.fontFamily,
      }}
    >
      <AppNav />
      <main style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>{children}</main>
    </div>
  )
}
