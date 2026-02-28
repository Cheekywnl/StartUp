import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: "OpenAI API key not configured. Add OPENAI_API_KEY to .env.local" },
      { status: 500 }
    )
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    if (!file) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    const openaiFormData = new FormData()
    openaiFormData.append("file", file)
    openaiFormData.append("model", "whisper-1")

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: openaiFormData,
    })

    if (!response.ok) {
      const err = await response.text()
      return NextResponse.json(
        { error: `OpenAI API error: ${err}` },
        { status: response.status }
      )
    }

    const data = (await response.json()) as { text?: string }
    return NextResponse.json({ text: data.text || "" })
  } catch (error) {
    console.error("Transcription error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Transcription failed" },
      { status: 500 }
    )
  }
}
