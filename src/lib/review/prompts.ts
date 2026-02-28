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

CRITICAL: Be SPECIFIC. Every note, red flag, and piece of advice MUST reference concrete evidence:
- Quote or paraphrase specific phrases from the transcript (e.g. "When you said 'X', you didn't follow up with...")
- If GitHub summary is provided, reference specific points from it (e.g. "Your README mentions Y but the pitch never addressed it")
- Call out exact mismatches (e.g. "Profile says 'B2B SaaS' but transcript focused on consumer use cases")

PROFILE:
- Name: ${account?.name ?? "Not provided"}
- Product: ${account?.product ?? "Not provided"}
- Description: ${account?.description ?? "Not provided"}
- GitHub: ${account?.github ?? "Not provided"}
${githubSummary ? `\nGITHUB / REPO SUMMARY:\n${githubSummary}\n\nUse this when scoring Consistency and Credibility. Reference specific repo details (tech stack, features, docs) when they contradict or support the pitch.` : "\n(No GitHub provided — score Consistency based on profile vs transcript only.)"}

PITCH TRANSCRIPT:
"""
${transcript}
"""
${investorContext}

SCORING RUBRIC (1-100 per dimension, be harsh and realistic):
${REVIEW_DIMENSIONS.map((d) => `- ${d.label}: ${d.description}`).join("\n")}

Respond with ONLY valid JSON in this exact format (no markdown, no extra text):
{
  "scores": [
    {"label": "Clarity", "score": <1-100>, "note": "<1-2 sentences citing a specific phrase or moment from the transcript>"},
    {"label": "Credibility", "score": <1-100>, "note": "<1-2 sentences citing metrics mentioned or missing, or GitHub evidence>"},
    {"label": "Investor Fit", "score": <1-100>, "note": "<1-2 sentences citing investor criteria or transcript alignment>"},
    {"label": "Ask", "score": <1-100>, "note": "<1-2 sentences citing what they said about funding/use of funds>"},
    {"label": "Consistency", "score": <1-100>, "note": "<1-2 sentences citing profile vs transcript, or transcript vs GitHub mismatches>"}
  ],
  "redFlags": ["<specific issue with transcript quote or GitHub reference>", "..."],
  "advice": ["<actionable advice tied to a specific weak point you identified>", "..."],
  "overallScore": <1-100>
}

RULES:
- Notes must cite the transcript or GitHub. No generic feedback like "improve clarity."
- Red flags must be specific (e.g. "Said 'we're growing fast' with no numbers" not "vague traction").
- Advice must be actionable and tied to something you observed (e.g. "Add ARR when you mention 'revenue' — you said it at 0:45 but gave no figure").`
}
