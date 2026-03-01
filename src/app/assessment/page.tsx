"use client"

import React, { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/context/AppContext"

async function transcribeWithOpenAI(blob: Blob): Promise<string> {
  const formData = new FormData()
  formData.append("file", blob, "recording.webm")

  const res = await fetch("/api/transcribe", {
    method: "POST",
    body: formData,
  })

  const data = (await res.json()) as { text?: string; error?: string }
  if (!res.ok) {
    throw new Error(data.error || "Transcription failed")
  }
  return data.text?.trim() || ""
}

export default function AssessmentPage() {
  const router = useRouter()
  const { accountData, addToHistory, exportHistoryJson } = useApp()
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

  const blobUrlRef = useRef<string | null>(null)
  const [previewReady, setPreviewReady] = useState(false)

  useEffect(() => {
    setPreviewReady(false)
    if (blob && previewVideoRef.current) {
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current)
      blobUrlRef.current = URL.createObjectURL(blob)
      previewVideoRef.current.src = blobUrlRef.current
    }
  }, [blob, step])

  useEffect(() => () => {
    if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined" || !navigator?.mediaDevices?.getUserMedia) return
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((s: MediaStream) => setStream(s))
      .catch(() => setError("Camera access denied. Please allow camera & microphone access."))
  }, [])

  const handleStartRecording = () => {
    if (!stream) return
    setError(null)
    chunksRef.current = []
    const mr = new MediaRecorder(stream, { mimeType: "video/webm" })
    mr.ondataavailable = (e: BlobEvent) => {
      if (e.data.size > 0) chunksRef.current.push(e.data)
    }
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
    stream?.getTracks().forEach((t) => t.stop())
    setStep("complete")
    setIsStopping(false)
  }

  const handleReset = async () => {
    stream?.getTracks().forEach((t) => t.stop())
    setStream(null)
    setMediaRecorder(null)
    chunksRef.current = []
    setBlob(null)
    setTranscription(null)
    setFeedback(null)
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

  const [feedback, setFeedback] = useState<{
    scores: { label: string; score: number; note: string }[]
    redFlags: string[]
    advice: string[]
    overallScore: number
  } | null>(null)

  const handleTranscribe = async () => {
    if (!blob) return
    setIsTranscribing(true)
    setError(null)
    setFeedback(null)

    try {
      const transcriptText = await transcribeWithOpenAI(blob)
      setTranscription(transcriptText || "No speech detected.")
      setStep("transcribed")

      const reviewRes = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          account: accountData,
          transcript: transcriptText || "No speech detected.",
        }),
      })

      const reviewData = (await reviewRes.json()) as {
        scores?: { label: string; score: number; note: string }[]
        redFlags?: string[]
        advice?: string[]
        overallScore?: number
        error?: string
      }

      const fallbackFeedback = {
        scores: [
          { label: "Clarity", score: 0, note: "Review unavailable" },
          { label: "Credibility", score: 0, note: "Review unavailable" },
          { label: "Investor Fit", score: 0, note: "Review unavailable" },
          { label: "Ask", score: 0, note: "Review unavailable" },
          { label: "Consistency", score: 0, note: "Review unavailable" },
        ],
        redFlags: [] as string[],
        advice: [] as string[],
        overallScore: 0,
      }

      if (!reviewRes.ok) {
        setError(reviewData.error || "Review failed")
        setFeedback(fallbackFeedback)
        addToHistory({
          timestamp: new Date().toISOString(),
          account: accountData,
          transcript: transcriptText || "No speech detected.",
          feedback: fallbackFeedback.scores,
          redFlags: fallbackFeedback.redFlags,
          advice: fallbackFeedback.advice,
          overallScore: fallbackFeedback.overallScore,
        })
      } else {
        const reviewFeedback = {
          scores: reviewData.scores ?? [],
          redFlags: reviewData.redFlags ?? [],
          advice: reviewData.advice ?? [],
          overallScore: reviewData.overallScore ?? 0,
        }
        setFeedback(reviewFeedback)
        addToHistory({
          timestamp: new Date().toISOString(),
          account: accountData,
          transcript: transcriptText || "No speech detected.",
          feedback: reviewFeedback.scores,
          redFlags: reviewFeedback.redFlags,
          advice: reviewFeedback.advice,
          overallScore: reviewFeedback.overallScore,
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transcription failed. Please try again.")
    } finally {
      setIsTranscribing(false)
    }
  }

  const handleBrowseInvestors = () => {
    router.push("/investors")
  }

  const s = {
    card: { background: "#111", border: "1px solid #1a1a1a", borderRadius: "16px", padding: "20px 22px" },
    btn: (grad?: string) => ({
      background: grad || "linear-gradient(135deg, #405de6, #833ab4, #c13584)",
      border: "none",
      borderRadius: "12px",
      padding: "12px 24px",
      color: "#fff",
      fontWeight: 700,
      fontSize: "14px",
      cursor: "pointer",
    }),
    outlineBtn: {
      background: "#111",
      border: "1px solid #222",
      borderRadius: "12px",
      padding: "12px 24px",
      color: "#aaa",
      fontSize: "14px",
      fontWeight: 600,
      cursor: "pointer",
    },
  }

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "48px 32px" }}>
      <div style={{ marginBottom: "36px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.5px" }}>
          Pitch Assessment
        </h1>
        <p style={{ color: "#555", fontSize: "14px", margin: 0 }}>
          Record your pitch and get instant AI feedback on clarity, credibility, and fundability.
        </p>
      </div>

      {error && (
        <div
          style={{
            background: "#1a0505",
            border: "1px solid #3a0a0a",
            borderRadius: "12px",
            padding: "14px 18px",
            color: "#ff6b6b",
            fontSize: "14px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      {(step === "preview" || step === "recording") && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              position: "relative",
              borderRadius: "16px",
              overflow: "hidden",
              background: "#0a0a0a",
              border: "1px solid #1a1a1a",
              aspectRatio: "16/9",
            }}
          >
            <video
              ref={liveVideoRef}
              autoPlay
              muted
              playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }}
            />
            {step === "recording" && (
              <div
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(220,38,38,0.9)",
                  backdropFilter: "blur(8px)",
                  borderRadius: "20px",
                  padding: "6px 14px",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#fff",
                    animation: "pulse 1s infinite",
                  }}
                />
                REC
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            {step === "preview" && (
              <button
                onClick={handleStartRecording}
                style={s.btn("linear-gradient(135deg, #dc2626, #991b1b)")}
              >
                ● Start Recording
              </button>
            )}
            {step === "recording" && (
              <button onClick={handleStopRecording} disabled={isStopping} style={s.btn("#1f2937")}>
                {isStopping ? "Stopping…" : "■ Stop Recording"}
              </button>
            )}
            <button onClick={handleReset} style={s.outlineBtn}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {step === "complete" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              position: "relative",
              borderRadius: "16px",
              overflow: "hidden",
              background: "#0a0a0a",
              border: "1px solid #1a1a1a",
              aspectRatio: "16/9",
            }}
          >
            <video
              ref={previewVideoRef}
              controls
              playsInline
              onLoadedData={() => setPreviewReady(true)}
              style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }}
            />
            {!previewReady && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "#0a0a0a",
                  zIndex: 1,
                }}
              />
            )}
          </div>
          <div style={{ ...s.card, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "14px", color: "#aaa" }}>
              Recording complete. Generate a transcript to send to investors.
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={handleTranscribe} disabled={isTranscribing} style={s.btn()}>
              {isTranscribing ? "Transcribing…" : "✦ Review Pitch"}
            </button>
            <button onClick={handleReset} style={s.outlineBtn}>
              Record Again
            </button>
          </div>
        </div>
      )}

      {step === "transcribed" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {blob && (
            <div
              style={{
                position: "relative",
                borderRadius: "16px",
                overflow: "hidden",
                background: "#0a0a0a",
                border: "1px solid #1a1a1a",
                aspectRatio: "16/9",
              }}
            >
              <video
                ref={previewVideoRef}
                controls
                playsInline
                onLoadedData={() => setPreviewReady(true)}
                style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }}
              />
              {!previewReady && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "#0a0a0a",
                    zIndex: 1,
                  }}
                />
              )}
            </div>
          )}
          <div style={{ ...s.card, background: "#0d1117", border: "1px solid #1e3a1e" }}>
            <div
              style={{
                fontSize: "11px",
                color: "#4ade80",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: "12px",
              }}
            >
              AI Feedback
            </div>
            {feedback ? (
              <>
                {feedback.overallScore > 0 && (
                  <div style={{ marginBottom: "16px", fontSize: "14px", color: "#aaa" }}>
                    Overall score: <strong style={{ color: "#4ade80" }}>{feedback.overallScore}/100</strong>
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {feedback.scores.map((item) => (
                    <div key={item.label}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ fontSize: "13px", color: "#fff", fontWeight: 600 }}>{item.label}</span>
                        <span style={{ fontSize: "13px", color: "#4ade80", fontWeight: 700 }}>{item.score}/100</span>
                      </div>
                      <div
                        style={{
                          height: "4px",
                          background: "#1a1a1a",
                          borderRadius: "4px",
                          marginBottom: "6px",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${item.score}%`,
                            background: "linear-gradient(90deg, #405de6, #00b894)",
                            borderRadius: "4px",
                          }}
                        />
                      </div>
                      <div style={{ fontSize: "12px", color: "#555", lineHeight: 1.5 }}>{item.note}</div>
                    </div>
                  ))}
                </div>
                {feedback.redFlags && feedback.redFlags.length > 0 && (
                  <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid #1e3a1e" }}>
                    <div style={{ fontSize: "11px", color: "#f87171", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "8px" }}>
                      Red flags
                    </div>
                    <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "13px", color: "#ddd", lineHeight: 1.6 }}>
                      {feedback.redFlags.map((flag, i) => (
                        <li key={i}>{flag}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {feedback.advice && feedback.advice.length > 0 && (
                  <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid #1e3a1e" }}>
                    <div style={{ fontSize: "11px", color: "#60a5fa", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "8px" }}>
                      Advice
                    </div>
                    <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "13px", color: "#ddd", lineHeight: 1.6 }}>
                      {feedback.advice.map((adv, i) => (
                        <li key={i}>{adv}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div style={{ color: "#666", fontSize: "14px" }}>Loading AI feedback…</div>
            )}
          </div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {feedback && feedback.overallScore >= 80 ? (
              <button onClick={handleBrowseInvestors} style={s.btn()}>
                Browse Investors →
              </button>
            ) : feedback ? (
              <button onClick={() => router.push("/")} style={s.btn()}>
                Return to Home
              </button>
            ) : null}
            <button onClick={exportHistoryJson} style={s.outlineBtn}>
              ↓ Export history.json
            </button>
            <button onClick={handleReset} style={s.outlineBtn}>
              Record Again
            </button>
          </div>
        </div>
      )}
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  )
}
