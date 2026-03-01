import { NextRequest, NextResponse } from "next/server"
import { buildReviewPrompt } from "@/lib/review/prompts"
import type { ReviewResult } from "@/lib/review/types"
import type { AccountData } from "@/lib/types"
import { INVESTORS } from "@/lib/data"
import { DEFAULT_ASSESSMENT_TYPE } from "@/lib/assessment-types"
import type { AssessmentTypeId } from "@/lib/assessment-types"

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: "OpenAI API key not configured" },
      { status: 500 }
    )
  }

  try {
    const body = (await request.json()) as {
      account: AccountData | null
      transcript: string
      investorId?: number
      assessmentType?: AssessmentTypeId
    }

    const { account, transcript, investorId, assessmentType = DEFAULT_ASSESSMENT_TYPE } = body
    if (!transcript?.trim()) {
      return NextResponse.json({ error: "Transcript required" }, { status: 400 })
    }

    let githubSummary: string | null = null
    if (account?.github) {
      try {
        const base = request.nextUrl.origin
        const ghRes = await fetch(`${base}/api/github?url=${encodeURIComponent(account.github)}`)
        const ghData = (await ghRes.json()) as { summary?: string }
        githubSummary = ghData.summary ?? null
      } catch {
        /* ignore */
      }
    }

    const investor = investorId ? INVESTORS.find((i) => i.id === investorId) ?? null : null
    const prompt = buildReviewPrompt(account, transcript, githubSummary, investor, assessmentType)

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.3,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json(
        { error: `OpenAI error: ${err}` },
        { status: res.status }
      )
    }

    const data = (await res.json()) as { choices?: { 0?: { message?: { content?: string } } } }
    const content = data.choices?.[0]?.message?.content
    if (!content) {
      return NextResponse.json({ error: "No response from OpenAI" }, { status: 500 })
    }

    const review = JSON.parse(content) as ReviewResult

    if (!review.scores || !Array.isArray(review.scores)) {
      return NextResponse.json({ error: "Invalid review format" }, { status: 500 })
    }

    review.redFlags = review.redFlags ?? []
    review.advice = review.advice ?? []
    review.overallScore = review.overallScore ?? Math.round(review.scores.reduce((a, s) => a + s.score, 0) / review.scores.length)

    return NextResponse.json(review)
  } catch (error) {
    console.error("Review error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Review failed" },
      { status: 500 }
    )
  }
}
