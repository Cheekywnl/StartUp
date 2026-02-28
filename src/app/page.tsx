'use client'

import React, { useState, useRef, useEffect } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface PortfolioItem {
  company: string
  stage: string
  year: number
  outcome: string
}

interface Investor {
  id: number
  name: string
  handle: string
  firm: string
  role: string
  avatar: string
  avatarColor: string
  location: string
  focus: string[]
  stages: string[]
  checkSize: string
  bio: string
  portfolio: PortfolioItem[]
  email: string
  linkedin: string
  twitter: string
  online: boolean
  responseRate: string
  lastActive: string
}

interface Message {
  id: number
  text: string
  fromMe: boolean
  time: string
  seen?: boolean
}

interface Conversation {
  id: number
  name: string
  handle: string
  avatar: string
  avatarColor: string
  online: boolean
  firm: string
  lastMessage: string
  lastTime: string
  unread: number
  messages: Message[]
}

interface AccountData {
  name: string
  product: string
  description: string
  github: string
}

// ─── Data ──────────────────────────────────────────────────────────────────────

const INVESTORS: Investor[] = [
  {
    id: 1, name: "Marcus Holt", handle: "@marcus.sequoia", firm: "Sequoia Capital",
    role: "General Partner", avatar: "MH", avatarColor: "#e91e8c",
    location: "Menlo Park, CA", focus: ["B2B SaaS", "Developer Tools", "AI Infrastructure"],
    stages: ["Series A", "Series B"], checkSize: "$8M – $15M",
    bio: "I've spent 12 years backing software founders rebuilding how enterprises operate. Former engineer, so I'll always ask about the architecture.",
    portfolio: [
      { company: "DataLayer", stage: "Series A", year: 2021, outcome: "Acquired by Salesforce" },
      { company: "FlowMetrics", stage: "Series B", year: 2022, outcome: "Active — $80M ARR" },
      { company: "Nexus API", stage: "Series A", year: 2023, outcome: "Active — Series C raised" },
    ],
    email: "marcus@sequoiacap.com", linkedin: "linkedin.com/in/marcusholt", twitter: "@marcusholt_vc",
    online: true, responseRate: "Usually responds within 24h", lastActive: "Active now",
  },
  {
    id: 2, name: "Priya Nair", handle: "@priya.a16z", firm: "Andreessen Horowitz",
    role: "General Partner", avatar: "PN", avatarColor: "#6c5ce7",
    location: "San Francisco, CA", focus: ["Enterprise Software", "Cloud Infrastructure", "Vertical SaaS"],
    stages: ["Seed", "Series A"], checkSize: "$3M – $12M",
    bio: "Before a16z I was a product leader at Stripe and Notion. I'm drawn to founders who obsess over customer problems rather than competitor features.",
    portfolio: [
      { company: "WorkflowAI", stage: "Seed", year: 2022, outcome: "Active — 3x revenue YoY" },
      { company: "Stackform", stage: "Series A", year: 2021, outcome: "Active — IPO pipeline" },
      { company: "Clarity CRM", stage: "Seed", year: 2023, outcome: "Active — $12M ARR" },
    ],
    email: "priya@a16z.com", linkedin: "linkedin.com/in/priyanair", twitter: "@priya_a16z",
    online: true, responseRate: "Usually responds within 48h", lastActive: "Active 1h ago",
  },
  {
    id: 3, name: "Sofia Reyes", handle: "@sofia.lightspeed", firm: "Lightspeed Ventures",
    role: "Partner", avatar: "SR", avatarColor: "#00b894",
    location: "New York, NY", focus: ["FinTech SaaS", "Compliance Tech", "B2B Marketplaces"],
    stages: ["Series A", "Series B"], checkSize: "$6M – $14M",
    bio: "My background is in investment banking and enterprise sales. I'm particularly interested in companies with strong enterprise contract values and expansion revenue.",
    portfolio: [
      { company: "ComplianceOS", stage: "Series A", year: 2020, outcome: "Acquired by Thomson Reuters" },
      { company: "LedgerFlow", stage: "Series B", year: 2022, outcome: "Active — $55M ARR" },
      { company: "TrustLayer", stage: "Series A", year: 2023, outcome: "Active — Series B raised" },
    ],
    email: "sofia@lsvp.com", linkedin: "linkedin.com/in/sofiareyes", twitter: "@sofia_lightspeed",
    online: false, responseRate: "Usually responds within 3 days", lastActive: "Active 3h ago",
  },
  {
    id: 4, name: "Noah Kim", handle: "@noah.accel", firm: "Accel Partners",
    role: "Partner", avatar: "NK", avatarColor: "#fd79a8",
    location: "Palo Alto, CA", focus: ["Developer Tools", "Open Source SaaS", "Security Software"],
    stages: ["Seed", "Series A", "Series B"], checkSize: "$2M – $20M",
    bio: "I've been an active open source contributor since college. I look for strong bottom-up adoption signals before betting on enterprise upside.",
    portfolio: [
      { company: "OpenShield", stage: "Seed", year: 2021, outcome: "Active — $18M ARR" },
      { company: "DevPulse", stage: "Series A", year: 2022, outcome: "Active — 200K MAU" },
      { company: "CodeAudit", stage: "Series B", year: 2023, outcome: "Active — Series C in process" },
    ],
    email: "noah@accel.com", linkedin: "linkedin.com/in/noahkim", twitter: "@noahkim_vc",
    online: false, responseRate: "Usually responds within 48h", lastActive: "Active yesterday",
  },
  {
    id: 5, name: "Ethan Brooks", handle: "@ethan.benchmark", firm: "Benchmark",
    role: "General Partner", avatar: "EB", avatarColor: "#ff7043",
    location: "San Francisco, CA", focus: ["Marketplace Software", "B2B SaaS", "Workflow Automation"],
    stages: ["Series A", "Series B"], checkSize: "$10M – $20M",
    bio: "I look for founders who are rebuilding workflows that enterprises have tolerated for too long. My best investments come from founders who intimately understand the pain.",
    portfolio: [
      { company: "WorkOS", stage: "Series A", year: 2021, outcome: "Active — $40M ARR" },
      { company: "Retool", stage: "Series B", year: 2022, outcome: "Active — Unicorn" },
      { company: "ProcureAI", stage: "Series A", year: 2023, outcome: "Active — Series B raised" },
    ],
    email: "ethan@benchmark.com", linkedin: "linkedin.com/in/ethanbrooks", twitter: "@ethanbrooks_vc",
    online: true, responseRate: "Usually responds within 24h", lastActive: "Active now",
  },
  {
    id: 6, name: "Aisha Patel", handle: "@aisha.greylock", firm: "Greylock Partners",
    role: "Partner", avatar: "AP", avatarColor: "#26c6da",
    location: "Palo Alto, CA", focus: ["AI/ML Software", "Data Infrastructure", "Developer Tools"],
    stages: ["Seed", "Series A"], checkSize: "$2M – $10M",
    bio: "My background is in ML research at Google Brain. I'm most excited about companies where the AI is the product — not just a feature layer on top of existing software.",
    portfolio: [
      { company: "VectorDB", stage: "Seed", year: 2022, outcome: "Active — 500K developers" },
      { company: "MLflow Pro", stage: "Series A", year: 2021, outcome: "Active — $22M ARR" },
      { company: "InferenceOS", stage: "Seed", year: 2023, outcome: "Active — Series A raised" },
    ],
    email: "aisha@greylock.com", linkedin: "linkedin.com/in/aishapatel", twitter: "@aisha_greylock",
    online: false, responseRate: "Usually responds within 48h", lastActive: "Active 2h ago",
  },
]

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 1, name: "Marcus Holt", handle: "marcus.sequoia", avatar: "MH",
    avatarColor: "#e91e8c", online: true, firm: "Sequoia Capital",
    lastMessage: "We're ready to move to a term sheet", lastTime: "2m", unread: 2,
    messages: [
      { id: 1, text: "Hey! Loved the demo you shared last week. The ARR growth is genuinely impressive.", fromMe: false, time: "Mon 10:02 AM" },
      { id: 2, text: "Thanks Marcus, really glad it resonated. We've had a strong quarter.", fromMe: true, time: "Mon 10:15 AM", seen: true },
      { id: 3, text: "I spoke with the partnership yesterday. There's strong interest in leading your Series A.", fromMe: false, time: "Mon 11:30 AM" },
      { id: 4, text: "That's exciting to hear. What kind of check size are you thinking?", fromMe: true, time: "Mon 11:45 AM", seen: true },
      { id: 5, text: "We're thinking $10–12M at a $55M pre-money. We think that's fair given your traction.", fromMe: false, time: "Mon 12:01 PM" },
      { id: 6, text: "We're ready to move to a term sheet whenever you are.", fromMe: false, time: "Today 9:15 AM" },
    ],
  },
  {
    id: 2, name: "Priya Nair", handle: "priya.a16z", avatar: "PN",
    avatarColor: "#6c5ce7", online: true, firm: "Andreessen Horowitz",
    lastMessage: "Can we do a partner meeting next week?", lastTime: "1h", unread: 1,
    messages: [
      { id: 1, text: "Hi! I came across your product through a portfolio founder. Really compelling positioning.", fromMe: false, time: "Fri 3:00 PM" },
      { id: 2, text: "Hi Priya, thanks for reaching out! Always happy to connect with a16z.", fromMe: true, time: "Fri 3:30 PM", seen: true },
      { id: 3, text: "Your NRR is what really got our attention. 138% is exceptional for a team at this stage.", fromMe: false, time: "Fri 4:00 PM" },
      { id: 4, text: "Can we do a partner meeting next week?", fromMe: false, time: "Today 8:45 AM" },
    ],
  },
  {
    id: 3, name: "Sofia Reyes", handle: "sofia.lightspeed", avatar: "SR",
    avatarColor: "#00b894", online: false, firm: "Lightspeed Ventures",
    lastMessage: "Let me know when you've reviewed the terms", lastTime: "3h", unread: 0,
    messages: [
      { id: 1, text: "Following up from our call — I'm sending over a draft term sheet.", fromMe: false, time: "Yesterday 2:00 PM" },
      { id: 2, text: "Got it, I'll go through it with our lawyer this week.", fromMe: true, time: "Yesterday 3:10 PM", seen: true },
      { id: 3, text: "Let me know when you've reviewed the terms and we can hop on a call.", fromMe: false, time: "Yesterday 5:00 PM" },
    ],
  },
]

// ─── Pitch Assessment ─────────────────────────────────────────────────────────

function PitchAssessment({ onContinue }: { onContinue: () => void }) {
  const [step, setStep] = useState<string>("preview")
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const [blob, setBlob] = useState<Blob | null>(null)
  const [transcription, setTranscription] = useState<string | null>(null)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isStopping, setIsStopping] = useState(false)

  const liveVideoRef = useRef<HTMLVideoElement>(null)
  const previewVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (stream && liveVideoRef.current) {
      (liveVideoRef.current as HTMLVideoElement).srcObject = stream
    }
  }, [stream, step])

  useEffect(() => {
    if (blob && previewVideoRef.current) {
      previewVideoRef.current.src = URL.createObjectURL(blob)
    }
  }, [blob])

  useEffect(() => {
    if (typeof window === "undefined" || !navigator?.mediaDevices?.getUserMedia) return
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((s: MediaStream) => setStream(s))
      .catch(() => setError("Camera access denied. Please allow camera & microphone access."))
  }, [])

  const handleStartRecording = () => {
    if (!stream) return
    setError(null)
    chunksRef.current = []
    const mr = new MediaRecorder(stream, { mimeType: "video/webm" })
    mr.ondataavailable = (e: BlobEvent) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
    mr.onstop = () => {
      const recorded = new Blob(chunksRef.current, { type: "video/webm" })
      setBlob(recorded)
    }
    mr.start()
    setMediaRecorder(mr)
    setStep("recording")
  }

  const handleStopRecording = () => {
    if (!mediaRecorder) return
    setIsStopping(true)
    mediaRecorder.stop()
    stream?.getTracks().forEach(t => t.stop())
    setStep("complete")
    setIsStopping(false)
  }

  const handleReset = async () => {
    stream?.getTracks().forEach(t => t.stop())
    setStream(null)
    setMediaRecorder(null)
    chunksRef.current = []
    setBlob(null)
    setTranscription(null)
    setError(null)
    setStep("preview")
    if (typeof window !== "undefined" && navigator?.mediaDevices?.getUserMedia) {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        setStream(s)
      } catch {
        setError("Camera access denied. Please allow camera & microphone access.")
      }
    }
  }

  const handleTranscribe = async () => {
    if (!blob) return
    setIsTranscribing(true)
    setError(null)
    await new Promise(r => setTimeout(r, 2000))
    setTranscription(
      "Hi, I'm the founder of DataPulse — we're building real-time analytics infrastructure for mid-market SaaS companies. Most analytics tools today are either too slow or too expensive. We've built a pipeline that delivers sub-second query results at 80% lower cost than existing solutions. We're currently at $1.2M ARR, growing 15% month-over-month, with 12 paying enterprise customers. We're raising a $5M seed round to double our engineering team and expand into the EU market."
    )
    setStep("transcribed")
    setIsTranscribing(false)
  }

  const s = {
    card: { background: "#111", border: "1px solid #1a1a1a", borderRadius: "16px", padding: "20px 22px" },
    btn: (grad?: string) => ({
      background: grad || "linear-gradient(135deg, #405de6, #833ab4, #c13584)",
      border: "none", borderRadius: "12px", padding: "12px 24px",
      color: "#fff", fontWeight: 700, fontSize: "14px", cursor: "pointer",
    }),
    outlineBtn: {
      background: "#111", border: "1px solid #222", borderRadius: "12px",
      padding: "12px 24px", color: "#aaa", fontSize: "14px", fontWeight: 600, cursor: "pointer",
    },
  }

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 32px", borderBottom: "1px solid #111" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "linear-gradient(135deg, #667eea, #764ba2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700 }}>V</div>
          <span style={{ fontSize: "16px", fontWeight: 600 }}>VCMail</span>
        </div>
      </div>

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "48px 32px" }}>
        <div style={{ marginBottom: "36px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.5px" }}>Pitch Assessment</h1>
          <p style={{ color: "#555", fontSize: "14px", margin: 0 }}>Record your pitch and get instant AI feedback on clarity, credibility, and fundability.</p>
        </div>

        {error && (
          <div style={{ background: "#1a0505", border: "1px solid #3a0a0a", borderRadius: "12px", padding: "14px 18px", color: "#ff6b6b", fontSize: "14px", marginBottom: "20px" }}>
            {error}
          </div>
        )}

        {(step === "preview" || step === "recording") && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ position: "relative", borderRadius: "16px", overflow: "hidden", background: "#0a0a0a", border: "1px solid #1a1a1a", aspectRatio: "16/9" }}>
              <video ref={liveVideoRef} autoPlay muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }} />
              {step === "recording" && (
                <div style={{ position: "absolute", top: "16px", right: "16px", display: "flex", alignItems: "center", gap: "8px", background: "rgba(220,38,38,0.9)", backdropFilter: "blur(8px)", borderRadius: "20px", padding: "6px 14px", fontSize: "13px", fontWeight: 700 }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#fff", animation: "pulse 1s infinite" }} />
                  REC
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              {step === "preview" && (
                <button onClick={handleStartRecording} style={s.btn("linear-gradient(135deg, #dc2626, #991b1b)")}>● Start Recording</button>
              )}
              {step === "recording" && (
                <button onClick={handleStopRecording} disabled={isStopping} style={s.btn("#1f2937")}>
                  {isStopping ? "Stopping…" : "■ Stop Recording"}
                </button>
              )}
              <button onClick={handleReset} style={s.outlineBtn}>Cancel</button>
            </div>
          </div>
        )}

        {step === "complete" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ borderRadius: "16px", overflow: "hidden", background: "#0a0a0a", border: "1px solid #1a1a1a", aspectRatio: "16/9" }}>
              <video ref={previewVideoRef} controls playsInline style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }} />
            </div>
            <div style={{ ...s.card, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "14px", color: "#aaa" }}>Recording complete. Generate a transcript to send to investors.</div>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={handleTranscribe} disabled={isTranscribing} style={s.btn()}>
                {isTranscribing ? "Transcribing…" : "✦ Get Transcript"}
              </button>
              <button onClick={handleReset} style={s.outlineBtn}>Record Again</button>
            </div>
          </div>
        )}

        {step === "transcribed" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {blob && (
              <div style={{ borderRadius: "16px", overflow: "hidden", background: "#0a0a0a", border: "1px solid #1a1a1a", aspectRatio: "16/9" }}>
                <video ref={previewVideoRef} controls playsInline style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }} />
              </div>
            )}
            <div style={s.card}>
              <div style={{ fontSize: "11px", color: "#555", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "12px" }}>Transcript</div>
              <p style={{ fontSize: "15px", color: "#ddd", lineHeight: 1.8, margin: 0, whiteSpace: "pre-wrap" }}>
                {transcription || "No speech detected."}
              </p>
            </div>
            <div style={{ ...s.card, background: "#0d1117", border: "1px solid #1e3a1e" }}>
              <div style={{ fontSize: "11px", color: "#4ade80", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "12px" }}>AI Feedback</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { label: "Clarity", score: 88, note: "Strong problem definition. Consider leading with the customer pain before the technical solution." },
                  { label: "Credibility", score: 92, note: "Excellent use of specific metrics — ARR, growth rate, and customer count build trust quickly." },
                  { label: "Fundability", score: 79, note: "Clear ask and use of funds. Strengthen by highlighting competitive moat and defensibility." },
                ].map(item => (
                  <div key={item.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontSize: "13px", color: "#fff", fontWeight: 600 }}>{item.label}</span>
                      <span style={{ fontSize: "13px", color: "#4ade80", fontWeight: 700 }}>{item.score}/100</span>
                    </div>
                    <div style={{ height: "4px", background: "#1a1a1a", borderRadius: "4px", marginBottom: "6px" }}>
                      <div style={{ height: "100%", width: `${item.score}%`, background: "linear-gradient(90deg, #405de6, #00b894)", borderRadius: "4px" }} />
                    </div>
                    <div style={{ fontSize: "12px", color: "#555", lineHeight: 1.5 }}>{item.note}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={onContinue} style={s.btn()}>Browse Investors →</button>
              <button onClick={handleReset} style={s.outlineBtn}>Record Again</button>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  )
}

// ─── Investor Card ─────────────────────────────────────────────────────────────

function InvestorCard({ investor, onSelect, onMessage }: { investor: Investor; onSelect: () => void; onMessage: (e: React.MouseEvent<HTMLButtonElement>) => void }) {
  return (
    <div
      onClick={onSelect}
      style={{ background: "#111", border: "1px solid #222", borderRadius: "16px", padding: "24px", cursor: "pointer", transition: "border-color 0.2s, transform 0.15s" }}
      onMouseOver={(e: React.MouseEvent<HTMLDivElement>) => { e.currentTarget.style.borderColor = "#444"; e.currentTarget.style.transform = "translateY(-2px)" }}
      onMouseOut={(e: React.MouseEvent<HTMLDivElement>) => { e.currentTarget.style.borderColor = "#222"; e.currentTarget.style.transform = "translateY(0)" }}
    >
      <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", marginBottom: "16px" }}>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: investor.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 700, color: "#fff" }}>{investor.avatar}</div>
          {investor.online && <div style={{ position: "absolute", bottom: "2px", right: "2px", width: "12px", height: "12px", borderRadius: "50%", background: "#00e676", border: "2px solid #111" }} />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: "15px", color: "#fff" }}>{investor.name}</div>
          <div style={{ fontSize: "13px", color: "#aaa", marginTop: "2px" }}>{investor.role} · {investor.firm}</div>
          <div style={{ fontSize: "12px", color: "#555", marginTop: "2px" }}>{investor.location}</div>
        </div>
        <div style={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: "20px", padding: "4px 12px", fontSize: "11px", color: "#aaa", flexShrink: 0 }}>{investor.checkSize}</div>
      </div>
      <p style={{ color: "#888", fontSize: "13px", lineHeight: 1.6, margin: "0 0 16px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{investor.bio}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "14px" }}>
        {investor.focus.map(f => <span key={f} style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "20px", padding: "3px 10px", fontSize: "11px", color: "#ccc" }}>{f}</span>)}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: "6px" }}>
          {investor.stages.map(s => <span key={s} style={{ background: investor.avatarColor + "22", color: investor.avatarColor, borderRadius: "20px", padding: "3px 10px", fontSize: "11px", fontWeight: 600 }}>{s}</span>)}
        </div>
        <button onClick={onMessage} style={{ background: "linear-gradient(135deg, #405de6, #833ab4, #c13584)", border: "none", borderRadius: "20px", padding: "7px 16px", color: "#fff", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>✉ Message</button>
      </div>
    </div>
  )
}

// ─── Investor Detail Modal ─────────────────────────────────────────────────────

function InvestorDetail({ investor, onClose, onMessage }: { investor: Investor; onClose: () => void; onMessage: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "20px" }} onClick={onClose}>
      <div style={{ background: "#0a0a0a", border: "1px solid #222", borderRadius: "20px", width: "100%", maxWidth: "640px", maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: "28px 28px 20px", borderBottom: "1px solid #1a1a1a" }}>
          <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
            <div style={{ position: "relative" }}>
              <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: investor.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: 700, color: "#fff" }}>{investor.avatar}</div>
              {investor.online && <div style={{ position: "absolute", bottom: "3px", right: "3px", width: "14px", height: "14px", borderRadius: "50%", background: "#00e676", border: "2px solid #0a0a0a" }} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: "20px", color: "#fff" }}>{investor.name}</div>
              <div style={{ fontSize: "14px", color: "#aaa", marginTop: "3px" }}>{investor.role} · {investor.firm}</div>
              <div style={{ fontSize: "12px", color: "#555", marginTop: "2px" }}>{investor.handle} · {investor.location}</div>
              <div style={{ fontSize: "12px", color: "#00e676", marginTop: "4px" }}>{investor.online ? "● Active now" : investor.lastActive}</div>
            </div>
            <button onClick={onClose} style={{ background: "#1a1a1a", border: "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", color: "#fff", fontSize: "16px" }}>✕</button>
          </div>
        </div>
        <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "24px" }}>
          <div>
            <div style={{ fontSize: "11px", color: "#555", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "8px" }}>About</div>
            <p style={{ color: "#bbb", fontSize: "14px", lineHeight: 1.7, margin: 0 }}>{investor.bio}</p>
          </div>
          <div style={{ display: "flex", gap: "16px" }}>
            <div style={{ flex: 1, background: "#111", borderRadius: "12px", padding: "16px" }}>
              <div style={{ fontSize: "11px", color: "#555", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "8px" }}>Check Size</div>
              <div style={{ fontWeight: 700, fontSize: "16px", color: "#fff" }}>{investor.checkSize}</div>
            </div>
            <div style={{ flex: 1, background: "#111", borderRadius: "12px", padding: "16px" }}>
              <div style={{ fontSize: "11px", color: "#555", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "8px" }}>Response Time</div>
              <div style={{ fontSize: "13px", color: "#aaa" }}>{investor.responseRate}</div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: "11px", color: "#555", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "10px" }}>Focus Areas</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {investor.focus.map(f => <span key={f} style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "20px", padding: "5px 14px", fontSize: "13px", color: "#ddd" }}>{f}</span>)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "11px", color: "#555", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "10px" }}>Notable Portfolio</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {investor.portfolio.map(p => (
                <div key={p.company} style={{ background: "#111", borderRadius: "12px", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "14px", color: "#fff" }}>{p.company}</div>
                    <div style={{ fontSize: "12px", color: "#555", marginTop: "2px" }}>{p.stage} · {p.year}</div>
                  </div>
                  <div style={{ fontSize: "12px", color: "#aaa" }}>{p.outcome}</div>
                </div>
              ))}
            </div>
          </div>
          <button onClick={onMessage} style={{ background: "linear-gradient(135deg, #405de6, #833ab4, #c13584, #e1306c)", border: "none", borderRadius: "12px", padding: "14px", color: "#fff", fontWeight: 700, fontSize: "15px", cursor: "pointer", width: "100%" }}>✉ Send Message</button>
        </div>
      </div>
    </div>
  )
}

// ─── DM Chat View ──────────────────────────────────────────────────────────────

function DMChat({ conversations, activeId, setActiveId, allMessages, setAllMessages, onBack }: {
  conversations: Conversation[]
  activeId: number
  setActiveId: (id: number) => void
  allMessages: Record<number, Message[]>
  setAllMessages: React.Dispatch<React.SetStateAction<Record<number, Message[]>>>
  onBack: () => void
}) {
  const [input, setInput] = useState<string>("")
  const bottomRef = useRef<HTMLDivElement>(null)
  const active = conversations.find(c => c.id === activeId)
  const messages = allMessages[activeId] || []

  useEffect(() => {
    const el = bottomRef.current
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }, [activeId, allMessages])

  const sendMessage = () => {
    if (!input.trim()) return
    const newMsg: Message = { id: Date.now(), text: input.trim(), fromMe: true, time: "Just now", seen: false }
    setAllMessages((prev: Record<number, Message[]>) => ({ ...prev, [activeId]: [...(prev[activeId] || []), newMsg] }))
    setInput("")
  }

  if (!active) return null

  return (
    <div style={{ display: "flex", height: "100vh", background: "#000", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: "#fff" }}>
      <div style={{ width: "320px", borderRight: "1px solid #111", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #111", display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={onBack} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: "20px" }}>←</button>
          <span style={{ fontWeight: 700, fontSize: "15px" }}>Messages</span>
        </div>
        <div style={{ overflowY: "auto", flex: 1 }}>
          {conversations.map(conv => (
            <div key={conv.id} onClick={() => setActiveId(conv.id)}
              style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 20px", cursor: "pointer", background: activeId === conv.id ? "#111" : "transparent", transition: "background 0.15s" }}
              onMouseOver={(e: React.MouseEvent<HTMLDivElement>) => { if (activeId !== conv.id) e.currentTarget.style.background = "#0a0a0a" }}
              onMouseOut={(e: React.MouseEvent<HTMLDivElement>) => { if (activeId !== conv.id) e.currentTarget.style.background = "transparent" }}
            >
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: conv.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, color: "#fff" }}>{conv.avatar}</div>
                {conv.online && <div style={{ position: "absolute", bottom: "2px", right: "2px", width: "11px", height: "11px", borderRadius: "50%", background: "#00e676", border: "2px solid #000" }} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                  <span style={{ fontWeight: conv.unread > 0 ? 700 : 400, fontSize: "14px" }}>{conv.name}</span>
                  <span style={{ fontSize: "11px", color: "#555" }}>{conv.lastTime}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", color: conv.unread > 0 ? "#fff" : "#555", fontWeight: conv.unread > 0 ? 600 : 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "180px" }}>
                    {(allMessages[conv.id] || []).length > 0 ? allMessages[conv.id].slice(-1)[0].text : conv.lastMessage}
                  </span>
                  {conv.unread > 0 && <div style={{ background: "#0095f6", color: "#fff", borderRadius: "50%", width: "18px", height: "18px", fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{conv.unread}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #111", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ position: "relative" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: active.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700 }}>{active.avatar}</div>
            {active.online && <div style={{ position: "absolute", bottom: "1px", right: "1px", width: "10px", height: "10px", borderRadius: "50%", background: "#00e676", border: "2px solid #000" }} />}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "14px" }}>{active.name}</div>
            <div style={{ fontSize: "12px", color: "#555" }}>{active.firm} · {active.online ? "Active now" : "Offline"}</div>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: active.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: 700, margin: "0 auto 8px" }}>{active.avatar}</div>
            <div style={{ fontWeight: 700 }}>{active.name}</div>
            <div style={{ color: "#555", fontSize: "12px" }}>{active.firm}</div>
          </div>
          {messages.map((msg: Message, i: number) => (
            <div key={msg.id}>
              <div style={{ display: "flex", justifyContent: msg.fromMe ? "flex-end" : "flex-start", alignItems: "flex-end", gap: "8px", marginBottom: "2px" }}>
                {!msg.fromMe && <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: active.avatarColor, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "8px", fontWeight: 700 }}>{active.avatar}</div>}
                <div style={{ maxWidth: "65%", background: msg.fromMe ? "linear-gradient(135deg, #405de6, #833ab4, #c13584, #e1306c)" : "#111", color: "#fff", borderRadius: msg.fromMe ? "22px 22px 4px 22px" : "22px 22px 22px 4px", padding: "10px 14px", fontSize: "14px", lineHeight: 1.5 }}>{msg.text}</div>
              </div>
              {msg.fromMe && i === messages.length - 1 && <div style={{ textAlign: "right", fontSize: "11px", color: "#555", marginTop: "2px", paddingRight: "4px" }}>{msg.seen ? "Seen" : "Delivered"}</div>}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div style={{ padding: "12px 16px", borderTop: "1px solid #111", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ flex: 1, background: "#0a0a0a", borderRadius: "22px", border: "1px solid #222", display: "flex", alignItems: "center", padding: "8px 16px", gap: "8px" }}>
            <input
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
              placeholder="Message..."
              style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#fff", fontSize: "14px" }}
            />
            {input.trim() ? <button onClick={sendMessage} style={{ background: "none", border: "none", cursor: "pointer", color: "#0095f6", fontWeight: 700, fontSize: "14px" }}>Send</button> : <span style={{ color: "#333", fontSize: "18px" }}>👍</span>}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Account Form ─────────────────────────────────────────────────────────────

function AccountForm({ onSubmit }: { onSubmit: (data: AccountData) => void }) {
  const [form, setForm] = useState<AccountData>({ name: "", product: "", description: "", github: "" })
  const [errors, setErrors] = useState<Partial<Record<keyof AccountData, string>>>({})

  const validate = (): boolean => {
    const e: Partial<Record<keyof AccountData, string>> = {}
    if (!form.name.trim()) e.name = "Name is required"
    if (!form.product.trim()) e.product = "Product is required"
    if (!form.description.trim()) e.description = "Description is required"
    else if (form.description.length < 20) e.description = "Description must be at least 20 characters"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof AccountData]) setErrors((prev: Partial<Record<keyof AccountData, string>>) => ({ ...prev, [name]: undefined }))
  }

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 32px", borderBottom: "1px solid #111" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "linear-gradient(135deg, #667eea, #764ba2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700 }}>V</div>
          <span style={{ fontSize: "16px", fontWeight: 600 }}>VCMail</span>
        </div>
        <div />
      </div>
      <div style={{ padding: "40px 32px", maxWidth: "560px" }}>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.5px" }}>Create Account</h1>
          <p style={{ color: "#555", fontSize: "14px", margin: 0 }}>Register to connect with potential investors</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
          {([
            { label: "Full Name", name: "name" as keyof AccountData, placeholder: "e.g. Jane Smith", multiline: false },
            { label: "Product", name: "product" as keyof AccountData, placeholder: "e.g. Analytics Dashboard", multiline: false },
            { label: "Description", name: "description" as keyof AccountData, placeholder: "Describe your product (min 20 characters)...", multiline: true },
            { label: "GitHub URL", name: "github" as keyof AccountData, placeholder: "e.g. https://github.com/username/repo", multiline: false },
          ] as { label: string; name: keyof AccountData; placeholder: string; multiline: boolean }[]).map(({ label, name, placeholder, multiline }) => (
            <div key={name} style={{ background: "#111", border: `1px solid ${errors[name] ? "#ef4444" : "#1a1a1a"}`, borderRadius: "16px", padding: "16px 20px" }}>
              <div style={{ fontSize: "11px", color: errors[name] ? "#ef4444" : "#555", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "8px" }}>{label}</div>
              {multiline ? (
                <textarea name={name} value={form[name]} onChange={handleChange} placeholder={placeholder} rows={3} style={{ width: "100%", background: "none", border: "none", outline: "none", color: "#fff", fontSize: "14px", fontFamily: "inherit", resize: "none", lineHeight: 1.6 }} />
              ) : (
                <input type="text" name={name} value={form[name]} onChange={handleChange} placeholder={placeholder} style={{ width: "100%", background: "none", border: "none", outline: "none", color: "#fff", fontSize: "14px", fontFamily: "inherit" }} />
              )}
              {errors[name] && <div style={{ color: "#ef4444", fontSize: "11px", marginTop: "6px" }}>{errors[name]}</div>}
            </div>
          ))}
        </div>
        <button onClick={() => { if (validate()) onSubmit(form) }} style={{ background: "linear-gradient(135deg, #405de6, #833ab4, #c13584)", border: "none", borderRadius: "12px", padding: "14px 28px", color: "#fff", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}>Create Account →</button>
      </div>
    </div>
  )
}

// ─── Profile Page ─────────────────────────────────────────────────────────────

function ProfilePage({ account, onBack, onEdit }: { account: AccountData | null; onBack: () => void; onEdit: () => void }) {
  if (!account) return null
  const initials = account.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 32px", borderBottom: "1px solid #111" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#aaa", fontSize: "14px", cursor: "pointer" }}>← Investors</button>
        <button onClick={onEdit} style={{ background: "#111", border: "1px solid #222", borderRadius: "20px", padding: "8px 18px", color: "#aaa", fontSize: "13px", cursor: "pointer" }}>Edit Profile</button>
      </div>
      <div style={{ padding: "40px 32px", maxWidth: "720px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "40px" }}>
          <div style={{ width: "72px", height: "72px", borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg, #667eea, #764ba2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: 700, color: "#fff", boxShadow: "0 0 0 3px #000, 0 0 0 5px #333" }}>{initials}</div>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: 700, margin: "0 0 4px", letterSpacing: "-0.5px" }}>{account.name}</h1>
            <p style={{ color: "#555", fontSize: "14px", margin: 0 }}>{account.product}</p>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
          {([["Full Name", account.name], ["Product", account.product]] as [string, string][]).map(([label, val]) => (
            <div key={label} style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "16px", padding: "20px 22px" }}>
              <div style={{ fontSize: "11px", color: "#555", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "8px" }}>{label}</div>
              <div style={{ fontSize: "15px", color: "#fff", fontWeight: 600 }}>{val}</div>
            </div>
          ))}
        </div>
        <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "16px", padding: "20px 22px", marginBottom: "12px" }}>
          <div style={{ fontSize: "11px", color: "#555", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "8px" }}>Description</div>
          <div style={{ fontSize: "14px", color: "#ccc", lineHeight: 1.7 }}>{account.description}</div>
        </div>
        {account.github && (
          <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "16px", padding: "20px 22px", marginBottom: "28px" }}>
            <div style={{ fontSize: "11px", color: "#555", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "8px" }}>GitHub</div>
            <a href={account.github} target="_blank" rel="noreferrer" style={{ color: "#667eea", fontSize: "14px", textDecoration: "none", fontWeight: 500 }}>⎇ {account.github}</a>
          </div>
        )}
        <button onClick={onBack} style={{ background: "linear-gradient(135deg, #405de6, #833ab4, #c13584)", border: "none", borderRadius: "12px", padding: "14px 28px", color: "#fff", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}>Browse Investors →</button>
      </div>
    </div>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function VCMailApp() {
  const [view, setView] = useState<string>("account")
  const [accountData, setAccountData] = useState<AccountData | null>(null)
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null)
  const [search, setSearch] = useState<string>("")
  const [stageFilter, setStageFilter] = useState<string>("All")
  const [interestFilter, setInterestFilter] = useState<string>("All")
  const [activeConvId, setActiveConvId] = useState<number>(1)
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS)
  const [allMessages, setAllMessages] = useState<Record<number, Message[]>>(
    Object.fromEntries(INITIAL_CONVERSATIONS.map((c: Conversation) => [c.id, c.messages]))
  )

  const stages = ["All", "Seed", "Series A", "Series B"]
  const allInterests = ["All", ...Array.from(new Set(INVESTORS.flatMap(inv => inv.focus)))]

  const filtered = INVESTORS.filter(inv => {
    const matchSearch = inv.name.toLowerCase().includes(search.toLowerCase()) ||
      inv.firm.toLowerCase().includes(search.toLowerCase()) ||
      inv.focus.some(f => f.toLowerCase().includes(search.toLowerCase()))
    const matchStage = stageFilter === "All" || inv.stages.includes(stageFilter)
    const matchInterest = interestFilter === "All" || inv.focus.includes(interestFilter)
    return matchSearch && matchStage && matchInterest
  })

  const openMessage = (investor: Investor) => {
    setSelectedInvestor(null)
    const exists = conversations.find(c => c.name === investor.name)
    if (!exists) {
      const newConv: Conversation = { id: investor.id, name: investor.name, handle: investor.handle.replace("@", ""), avatar: investor.avatar, avatarColor: investor.avatarColor, online: investor.online, firm: investor.firm, lastMessage: "Start a conversation", lastTime: "now", unread: 0, messages: [] }
      setConversations((prev: Conversation[]) => [newConv, ...prev])
      setAllMessages((prev: Record<number, Message[]>) => ({ ...prev, [investor.id]: [] }))
    }
    setActiveConvId(investor.id)
    setView("messages")
  }

  if (view === "account") return <AccountForm onSubmit={(data) => { setAccountData(data); setView("pitch") }} />
  if (view === "pitch") return <PitchAssessment onContinue={() => { setView("directory") }} />
  if (view === "profile") return <ProfilePage account={accountData} onBack={() => setView("directory")} onEdit={() => setView("account")} />
  if (view === "messages") return <DMChat conversations={conversations} activeId={activeConvId} setActiveId={setActiveConvId} allMessages={allMessages} setAllMessages={setAllMessages} onBack={() => setView("directory")} />

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", padding: "40px 32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.5px" }}>Potential Investors</h1>
          <p style={{ color: "#555", fontSize: "14px", margin: 0 }}>{INVESTORS.length} VCs actively investing in software startups</p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {accountData && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "20px", padding: "8px 16px", cursor: "pointer" }} onClick={() => setView("profile")}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg, #667eea, #764ba2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                {accountData.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
              </div>
              <div>
                <div style={{ color: "#fff", fontSize: "13px", fontWeight: 600 }}>{accountData.name}</div>
                <div style={{ color: "#666", fontSize: "11px" }}>{accountData.product}</div>
              </div>
            </div>
          )}
          <button
            onClick={() => setView("messages")}
            style={{ background: "linear-gradient(135deg, #405de6, #833ab4, #c13584)", border: "none", borderRadius: "20px", padding: "10px 20px", color: "#fff", fontWeight: 700, fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
          >
            ✉ Messages
            {conversations.reduce((sum, c) => sum + c.unread, 0) > 0 && (
              <span style={{ background: "#ef4444", borderRadius: "50%", width: "18px", height: "18px", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {conversations.reduce((sum, c) => sum + c.unread, 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "240px", background: "#111", border: "1px solid #222", borderRadius: "10px", display: "flex", alignItems: "center", gap: "10px", padding: "10px 16px" }}>
          <span style={{ color: "#555" }}>🔍</span>
          <input placeholder="Search investors..." value={search} onChange={e => setSearch(e.target.value)} style={{ background: "none", border: "none", outline: "none", color: "#fff", fontSize: "14px", width: "100%" }} />
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {stages.map(s => (
            <button key={s} onClick={() => setStageFilter(s)} style={{ background: stageFilter === s ? "#fff" : "#111", color: stageFilter === s ? "#000" : "#aaa", border: "1px solid #222", borderRadius: "20px", padding: "8px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}>{s}</button>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: "8px", marginBottom: "28px", flexWrap: "wrap" }}>
        {allInterests.map(interest => (
          <button key={interest} onClick={() => setInterestFilter(interest)} style={{ background: interestFilter === interest ? "#fff" : "#111", color: interestFilter === interest ? "#000" : "#aaa", border: "1px solid #222", borderRadius: "20px", padding: "7px 16px", fontSize: "12px", fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}>{interest}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
        {filtered.map(inv => (
          <InvestorCard key={inv.id} investor={inv} onSelect={() => setSelectedInvestor(inv)} onMessage={(e: React.MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); openMessage(inv) }} />
        ))}
      </div>
      {filtered.length === 0 && <div style={{ textAlign: "center", color: "#555", padding: "60px", fontSize: "15px" }}>No investors match your search</div>}
      {selectedInvestor && <InvestorDetail investor={selectedInvestor} onClose={() => setSelectedInvestor(null)} onMessage={() => openMessage(selectedInvestor!)} />}
    </div>
  )
}
