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
        background: theme.bg,
        color: theme.text,
        fontFamily: theme.fontFamily,
      }}
    >
      <AppNav />
      <main>{children}</main>
    </div>
  )
}
