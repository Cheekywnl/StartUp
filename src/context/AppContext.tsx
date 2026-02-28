"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { AccountData, Conversation, Message, HistoryData, HistoryEntry } from "@/lib/types"
import { INITIAL_CONVERSATIONS } from "@/lib/data"

const STORAGE_ACCOUNT = "vcmail_account"
const STORAGE_CONVERSATIONS = "vcmail_conversations"
const STORAGE_MESSAGES = "vcmail_messages"
const STORAGE_HISTORY = "vcmail_history"

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
  isHydrated: boolean
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

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [accountData, setAccountDataState] = useState<AccountData | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS)
  const [allMessages, setAllMessages] = useState<Record<number, Message[]>>(
    Object.fromEntries(INITIAL_CONVERSATIONS.map((c) => [c.id, c.messages]))
  )
  const [history, setHistory] = useState<HistoryData>({})
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setAccountDataState(loadAccount())
    setConversations(loadConversations())
    setAllMessages(loadMessages())
    setHistory(loadHistory())
    setHydrated(true)
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
        isHydrated: hydrated,
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
