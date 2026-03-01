"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { AccountData, Conversation, Message, HistoryData, HistoryEntry } from "@/lib/types"
import type { ThemeId } from "@/lib/themes"
import { INITIAL_CONVERSATIONS } from "@/lib/data"

const STORAGE_ACCOUNT = "vcmail_account"
const STORAGE_CONVERSATIONS = "vcmail_conversations"
const STORAGE_MESSAGES = "vcmail_messages"
const STORAGE_HISTORY = "vcmail_history"
const STORAGE_THEME = "vcmail_theme"
const STORAGE_WORK_ON = "vcmail_work_on"
const STORAGE_DEV_INVESTORS = "vcmail_dev_investors_unlocked"

interface AppContextValue {
  accountData: AccountData | null
  setAccountData: (data: AccountData | null) => void
  conversations: Conversation[]
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>
  allMessages: Record<number, Message[]>
  setAllMessages: React.Dispatch<React.SetStateAction<Record<number, Message[]>>>
  history: HistoryData
  addToHistory: (entry: HistoryEntry) => void
  exportHistoryJson: () => void
  themeId: ThemeId
  setThemeId: (id: ThemeId) => void
  workOnNote: string
  setWorkOnNote: (note: string) => void
  isHydrated: boolean
  devInvestorsUnlocked: boolean
  setDevInvestorsUnlocked: (unlocked: boolean) => void
}

const AppContext = createContext<AppContextValue | null>(null)

function loadAccount(): AccountData | null {
  if (typeof window === "undefined") return null
  try {
    const s = localStorage.getItem(STORAGE_ACCOUNT)
    return s ? JSON.parse(s) : null
  } catch {
    return null
  }
}

function loadConversations(): Conversation[] {
  if (typeof window === "undefined") return INITIAL_CONVERSATIONS
  try {
    const s = localStorage.getItem(STORAGE_CONVERSATIONS)
    return s ? JSON.parse(s) : INITIAL_CONVERSATIONS
  } catch {
    return INITIAL_CONVERSATIONS
  }
}

function loadMessages(): Record<number, Message[]> {
  if (typeof window === "undefined") return Object.fromEntries(INITIAL_CONVERSATIONS.map((c) => [c.id, c.messages]))
  try {
    const s = localStorage.getItem(STORAGE_MESSAGES)
    return s ? JSON.parse(s) : Object.fromEntries(INITIAL_CONVERSATIONS.map((c) => [c.id, c.messages]))
  } catch {
    return Object.fromEntries(INITIAL_CONVERSATIONS.map((c) => [c.id, c.messages]))
  }
}

function loadHistory(): HistoryData {
  if (typeof window === "undefined") return {}
  try {
    const s = localStorage.getItem(STORAGE_HISTORY)
    return s ? JSON.parse(s) : {}
  } catch {
    return {}
  }
}

function loadTheme(): ThemeId {
  if (typeof window === "undefined") return "timeline"
  try {
    const s = localStorage.getItem(STORAGE_THEME)
    return s === "timelineLight" ? "timelineLight" : "timeline"
  } catch {
    return "timeline"
  }
}

function loadWorkOnNote(): string {
  if (typeof window === "undefined") return ""
  try {
    return localStorage.getItem(STORAGE_WORK_ON) ?? ""
  } catch {
    return ""
  }
}

function loadDevInvestorsUnlocked(): boolean {
  if (typeof window === "undefined") return false
  try {
    return localStorage.getItem(STORAGE_DEV_INVESTORS) === "1"
  } catch {
    return false
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [accountData, setAccountDataState] = useState<AccountData | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS)
  const [allMessages, setAllMessages] = useState<Record<number, Message[]>>(
    Object.fromEntries(INITIAL_CONVERSATIONS.map((c) => [c.id, c.messages]))
  )
  const [history, setHistory] = useState<HistoryData>({})
  const [themeId, setThemeIdState] = useState<ThemeId>("timeline")
  const [workOnNote, setWorkOnNoteState] = useState<string>("")
  const [devInvestorsUnlocked, setDevInvestorsUnlockedState] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setAccountDataState(loadAccount())
    setConversations(loadConversations())
    setAllMessages(loadMessages())
    setHistory(loadHistory())
    setThemeIdState(loadTheme())
    setWorkOnNoteState(loadWorkOnNote())
    setHydrated(true)
  }, [])

  const setWorkOnNote = useCallback((note: string) => {
    setWorkOnNoteState(note)
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_WORK_ON, note)
    }
  }, [])

  const setThemeId = useCallback((id: ThemeId) => {
    setThemeIdState(id)
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_THEME, id)
    }
  }, [])

  const setDevInvestorsUnlocked = useCallback((unlocked: boolean) => {
    setDevInvestorsUnlockedState(unlocked)
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_DEV_INVESTORS, unlocked ? "1" : "0")
    }
  }, [])

  const setAccountData = useCallback((data: AccountData | null) => {
    setAccountDataState(data)
    if (typeof window !== "undefined") {
      if (data) localStorage.setItem(STORAGE_ACCOUNT, JSON.stringify(data))
      else localStorage.removeItem(STORAGE_ACCOUNT)
    }
  }, [])

  useEffect(() => {
    if (!hydrated) return
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_CONVERSATIONS, JSON.stringify(conversations))
    }
  }, [conversations, hydrated])

  useEffect(() => {
    if (!hydrated) return
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_MESSAGES, JSON.stringify(allMessages))
    }
  }, [allMessages, hydrated])

  useEffect(() => {
    if (!hydrated) return
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_HISTORY, JSON.stringify(history))
    }
  }, [history, hydrated])

  const addToHistory = useCallback((entry: HistoryEntry) => {
    const dateKey = entry.timestamp.slice(0, 10)
    setHistory((prev) => {
      const dayEntries = prev[dateKey] || []
      return { ...prev, [dateKey]: [...dayEntries, entry] }
    })
  }, [])

  const exportHistoryJson = useCallback(() => {
    const json = JSON.stringify(history, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "history.json"
    a.click()
    URL.revokeObjectURL(url)
  }, [history])

  return (
    <AppContext.Provider
      value={{
        accountData,
        setAccountData,
        conversations,
        setConversations,
        allMessages,
        setAllMessages,
        history,
        addToHistory,
        exportHistoryJson,
        themeId,
        setThemeId,
        workOnNote,
        setWorkOnNote,
        isHydrated: hydrated,
        devInvestorsUnlocked,
        setDevInvestorsUnlocked,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}
