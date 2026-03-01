"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useApp } from "@/context/AppContext"
import { INVESTORS } from "@/lib/data"
import type { Message } from "@/lib/types"

function MessagesContent() {
  const searchParams = useSearchParams()
  const idParam = searchParams ? searchParams.get("id") : null
  const { conversations, allMessages, setConversations, setAllMessages } = useApp()

  const [activeId, setActiveId] = useState<number>(() => {
    const n = idParam ? parseInt(idParam, 10) : conversations[0]?.id ?? 1
    return isNaN(n) ? conversations[0]?.id ?? 1 : n
  })
  const [input, setInput] = useState<string>("")
  const bottomRef = useRef<HTMLDivElement>(null)

  const active = conversations.find((c) => c.id === activeId)
  const messages = allMessages[activeId] || []

  useEffect(() => {
    if (idParam) {
      const n = parseInt(idParam, 10)
      if (!isNaN(n)) setActiveId(n)
    }
  }, [idParam])

  useEffect(() => {
    if (!idParam) return
    const convId = parseInt(idParam, 10)
    if (isNaN(convId)) return
    const investor = INVESTORS.find((i) => i.id === convId)
    if (investor) {
      const exists = conversations.find((c) => c.name === investor.name)
      if (!exists) {
        const newConv = {
          id: investor.id,
          name: investor.name,
          handle: investor.handle.replace("@", ""),
          avatar: investor.avatar,
          avatarColor: investor.avatarColor,
          online: investor.online,
          firm: investor.firm,
          lastMessage: "Start a conversation",
          lastTime: "now",
          unread: 0,
          messages: [],
        }
        setConversations((prev) => [newConv, ...prev])
        setAllMessages((prev) => ({ ...prev, [investor.id]: [] }))
      }
    }
    setActiveId(convId)
  }, [idParam, conversations, setConversations, setAllMessages])

  useEffect(() => {
    const el = bottomRef.current
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }, [activeId, allMessages])

  const sendMessage = () => {
    if (!input.trim()) return
    const newMsg: Message = {
      id: Date.now(),
      text: input.trim(),
      fromMe: true,
      time: "Just now",
      seen: false,
    }
    setAllMessages((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), newMsg],
    }))
    setInput("")
  }

  if (!active) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#555" }}>
        <p>No conversations yet. <Link href="/investors" style={{ color: "#667eea" }}>Browse investors</Link> to start messaging.</p>
      </div>
    )
  }

  return (
    <div
      style={{
        display: "flex",
        height: "calc(100vh - 60px)",
        background: "#000",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: "#fff",
      }}
    >
      <div
        style={{
          width: "320px",
          borderRight: "1px solid #111",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #111",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <Link
            href="/investors"
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              fontSize: "20px",
              textDecoration: "none",
            }}
          >
            ←
          </Link>
          <span style={{ fontWeight: 700, fontSize: "15px" }}>Messages</span>
        </div>
        <div style={{ overflowY: "auto", flex: 1 }}>
          {conversations.map((conv) => (
            <Link
              key={conv.id}
              href={`/messages?id=${conv.id}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 20px",
                cursor: "pointer",
                background: activeId === conv.id ? "#111" : "transparent",
                transition: "background 0.15s",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: conv.avatarColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  {conv.avatar}
                </div>
                {conv.online && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "2px",
                      right: "2px",
                      width: "11px",
                      height: "11px",
                      borderRadius: "50%",
                      background: "#00e676",
                      border: "2px solid #000",
                    }}
                  />
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                  <span style={{ fontWeight: conv.unread > 0 ? 700 : 400, fontSize: "14px" }}>{conv.name}</span>
                  <span style={{ fontSize: "11px", color: "#555" }}>{conv.lastTime}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span
                    style={{
                      fontSize: "12px",
                      color: conv.unread > 0 ? "#fff" : "#555",
                      fontWeight: conv.unread > 0 ? 600 : 400,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "180px",
                    }}
                  >
                    {(allMessages[conv.id] || []).length > 0
                      ? allMessages[conv.id].slice(-1)[0].text
                      : conv.lastMessage}
                  </span>
                  {conv.unread > 0 && (
                    <div
                      style={{
                        background: "#0095f6",
                        color: "#fff",
                        borderRadius: "50%",
                        width: "18px",
                        height: "18px",
                        fontSize: "11px",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {conv.unread}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div
          style={{
            padding: "14px 20px",
            borderBottom: "1px solid #111",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: active.avatarColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              {active.avatar}
            </div>
            {active.online && (
              <div
                style={{
                  position: "absolute",
                  bottom: "1px",
                  right: "1px",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "#00e676",
                  border: "2px solid #000",
                }}
              />
            )}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "14px" }}>{active.name}</div>
            <div style={{ fontSize: "12px", color: "#555" }}>
              {active.firm} · {active.online ? "Active now" : "Offline"}
            </div>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: active.avatarColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                fontWeight: 700,
                margin: "0 auto 8px",
              }}
            >
              {active.avatar}
            </div>
            <div style={{ fontWeight: 700 }}>{active.name}</div>
            <div style={{ color: "#555", fontSize: "12px" }}>{active.firm}</div>
          </div>
          {messages.map((msg: Message, i: number) => (
            <div key={msg.id}>
              <div
                style={{
                  display: "flex",
                  justifyContent: msg.fromMe ? "flex-end" : "flex-start",
                  alignItems: "flex-end",
                  gap: "8px",
                  marginBottom: "2px",
                }}
              >
                {!msg.fromMe && (
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: active.avatarColor,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "8px",
                      fontWeight: 700,
                    }}
                  >
                    {active.avatar}
                  </div>
                )}
                <div
                  style={{
                    maxWidth: "65%",
                    background: msg.fromMe
                      ? "linear-gradient(135deg, #405de6, #833ab4, #c13584, #e1306c)"
                      : "#111",
                    color: "#fff",
                    borderRadius: msg.fromMe ? "22px 22px 4px 22px" : "22px 22px 22px 4px",
                    padding: "10px 14px",
                    fontSize: "14px",
                    lineHeight: 1.5,
                  }}
                >
                  {msg.text}
                </div>
              </div>
              {msg.fromMe && i === messages.length - 1 && (
                <div
                  style={{
                    textAlign: "right",
                    fontSize: "11px",
                    color: "#555",
                    marginTop: "2px",
                    paddingRight: "4px",
                  }}
                >
                  {msg.seen ? "Seen" : "Delivered"}
                </div>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div
          style={{
            padding: "12px 16px",
            borderTop: "1px solid #111",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              flex: 1,
              background: "#0a0a0a",
              borderRadius: "22px",
              border: "1px solid #222",
              display: "flex",
              alignItems: "center",
              padding: "8px 16px",
              gap: "8px",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
              placeholder="Message..."
              style={{
                flex: 1,
                background: "none",
                border: "none",
                outline: "none",
                color: "#fff",
                fontSize: "14px",
              }}
            />
            {input.trim() ? (
              <button
                onClick={sendMessage}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#0095f6",
                  fontWeight: 700,
                  fontSize: "14px",
                }}
              >
                Send
              </button>
            ) : (
              <span style={{ color: "#333", fontSize: "18px" }}>👍</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div style={{ padding: "40px", textAlign: "center", color: "#555" }}>Loading messages...</div>}>
      <MessagesContent />
    </Suspense>
  )
}
