import type { AccountData } from "@/lib/types"
import type { Investor } from "@/lib/types"
import { REVIEW_DIMENSIONS } from "./rubric"

export function buildReviewPrompt(
  account: AccountData | null,
  transcript: string,
  githubSummary: string | null,
  investor: Investor | null
): string {
  const investorContext = investor
    ? `
INVESTOR CRITERIA (score against what this investor cares about):
- Name: ${investor.name}
- Firm: ${investor.firm}
- Bio: ${investor.bio}
- Focus areas: ${investor.focus.join(", ")}
- Stages: ${investor.stages.join(", ")}
`
    : ""

  return `You are a brutally honest VC advisor. Review this founder's pitch and give realistic, critical feedback.

PROFILE:
- Name: ${account?.name ?? "Not provided"}
- Product: ${account?.product ?? "Not provided"}
- Description: ${account?.description ?? "Not provided"}
- GitHub: ${account?.github ?? "Not provided"}
${githubSummary ? `\nGITHUB SUMMARY:\n${githubSummary}` : ""}

PITCH TRANSCRIPT:
${transcript}
${investorContext}

SCORING RUBRIC (1-100 per dimension, be harsh and realistic):
${REVIEW_DIMENSIONS.map((d) => `- ${d.label}: ${d.description}`).join("\n")}

Respond with ONLY valid JSON in this exact format (no markdown, no extra text):
{
  "scores": [
    {"label": "Clarity", "score": <1-100>, "note": "<1-2 sentences>"},
    {"label": "Credibility", "score": <1-100>, "note": "<1-2 sentences>"},
    {"label": "Investor Fit", "score": <1-100>, "note": "<1-2 sentences>"},
    {"label": "Ask", "score": <1-100>, "note": "<1-2 sentences>"},
    {"label": "Consistency", "score": <1-100>, "note": "<1-2 sentences>"}
  ],
  "redFlags": ["<issue 1>", "<issue 2>"],
  "advice": ["<actionable advice 1>", "<actionable advice 2>"],
  "overallScore": <1-100>
}

Be direct. Call out: vague claims, mismatches between description and transcript, missing metrics, weak GitHub, unclear ask.`
}
