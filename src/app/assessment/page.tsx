"use client"

import React, { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AssessmentPage() {
  const router = useRouter()
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
    await new Promise((r) => setTimeout(r, 2000))
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
              style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }}
            />
          </div>
          <div style={{ ...s.card, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "14px", color: "#aaa" }}>
              Recording complete. Generate a transcript to send to investors.
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={handleTranscribe} disabled={isTranscribing} style={s.btn()}>
              {isTranscribing ? "Transcribing…" : "✦ Get Transcript"}
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
                style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }}
              />
            </div>
          )}
          <div style={s.card}>
            <div
              style={{
                fontSize: "11px",
                color: "#555",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: "12px",
              }}
            >
              Transcript
            </div>
            <p style={{ fontSize: "15px", color: "#ddd", lineHeight: 1.8, margin: 0, whiteSpace: "pre-wrap" }}>
              {transcription || "No speech detected."}
            </p>
          </div>
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
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                {
                  label: "Clarity",
                  score: 88,
                  note: "Strong problem definition. Consider leading with the customer pain before the technical solution.",
                },
                {
                  label: "Credibility",
                  score: 92,
                  note: "Excellent use of specific metrics — ARR, growth rate, and customer count build trust quickly.",
                },
                {
                  label: "Fundability",
                  score: 79,
                  note: "Clear ask and use of funds. Strengthen by highlighting competitive moat and defensibility.",
                },
              ].map((item) => (
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
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={() => router.push("/investors")} style={s.btn()}>
              Browse Investors →
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
