"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { AccountData, Conversation, Message } from "@/lib/types"
import { INITIAL_CONVERSATIONS } from "@/lib/data"

const STORAGE_ACCOUNT = "vcmail_account"
const STORAGE_CONVERSATIONS = "vcmail_conversations"
const STORAGE_MESSAGES = "vcmail_messages"

interface AppContextValue {
  accountData: AccountData | null
  setAccountData: (data: AccountData | null) => void
  conversations: Conversation[]
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>
  allMessages: Record<number, Message[]>
  setAllMessages: React.Dispatch<React.SetStateAction<Record<number, Message[]>>>
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

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [accountData, setAccountDataState] = useState<AccountData | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS)
  const [allMessages, setAllMessages] = useState<Record<number, Message[]>>(
    Object.fromEntries(INITIAL_CONVERSATIONS.map((c) => [c.id, c.messages]))
  )
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setAccountDataState(loadAccount())
    setConversations(loadConversations())
    setAllMessages(loadMessages())
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

  return (
    <AppContext.Provider
      value={{
        accountData,
        setAccountData,
        conversations,
        setConversations,
        allMessages,
        setAllMessages,
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
