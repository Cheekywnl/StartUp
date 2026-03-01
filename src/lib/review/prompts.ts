import type { AccountData } from "@/lib/types"
import type { Investor } from "@/lib/types"
import type { AssessmentTypeId } from "@/lib/assessment-types"
import { HACKATHON_CATEGORIES } from "@/lib/assessment-types"
import { REVIEW_DIMENSIONS } from "./rubric"

type HackathonCategory = { title: string; problem: string; challenge: string }

function buildHackathonReviewPrompt(
  account: AccountData | null,
  transcript: string,
  githubSummary: string | null,
  category: HackathonCategory
): string {
  return `You are a brutally honest university hackathon judge. Review this team's pitch and give realistic, critical feedback. This is a student hackathon — hold them to high standards. No sugar-coating.

CRITICAL — CATEGORY FIT: This team entered ${category.title}. Their pitch and solution MUST directly address this category. If they are solving a different problem (e.g. a Data in Finance idea when they're in Financial Inclusion), that is a MAJOR failure. Penalise heavily (scores 30–50) and make it the first red flag. Give clear feedback on how they missed the brief.

CATEGORY BRIEF (they must hit this):
- Problem: ${category.problem}
- Challenge: ${category.challenge}

CRITICAL: Be SPECIFIC. Every note, red flag, and piece of advice MUST reference concrete evidence:
- Quote or paraphrase specific phrases from the transcript (e.g. "When you said 'X', you didn't explain how it addresses financial inclusion")
- If GitHub summary is provided, reference specific points from it (e.g. "Your README mentions Y but the pitch never addressed it")
- Call out exact mismatches (e.g. "You claimed to help people manage money but the demo showed a trading dashboard for investors")

PROFILE:
- Name: ${account?.name ?? "Not provided"}
- Product: ${account?.product ?? "Not provided"}
- Description: ${account?.description ?? "Not provided"}
- GitHub: ${account?.github ?? "Not provided"}
${githubSummary ? `\nGITHUB / REPO SUMMARY:\n${githubSummary}\n\nUse this when scoring Technical Execution and Problem and impact. Reference specific repo details (tech stack, code quality, features, docs) when they contradict or support the pitch. Does the repo show a solution that fits THIS category?` : "\n(No GitHub provided — score Technical Execution based on what they claim in the transcript only. Penalise if they mention 'we built X' but provide no evidence.)"}

PITCH TRANSCRIPT:
"""
${transcript}
"""

SCORING RUBRIC (1-100 per dimension, be harsh — this is a competitive hackathon):
- Problem and impact: Does the solution DIRECTLY address the category problem above? Is it clearly about ${category.title.split(": ")[1] ?? "this category"}? If they're off-topic, score 20–40. What's the potential impact?
- Innovation and originality: How novel is the approach? Is it a copy of existing tools or does it bring a fresh angle? Call out derivative ideas.
- Technical execution: Quality of implementation. Use the GitHub summary — does the code match the pitch? Right tech choices? Any red flags in the repo?
- Functionality and completion: Does it actually work? How complete is it? Did they ship something usable or is it a half-baked demo?
- Presentation and clarity: Is the pitch coherent? Can you understand the problem, solution, and demo in 60 seconds? Minimal jargon? Clear structure?

Respond with ONLY valid JSON in this exact format (no markdown, no extra text):
{
  "scores": [
    {"label": "Problem and impact", "score": <1-100>, "note": "<1-2 sentences citing transcript or GitHub — did they hit the category brief?>"},
    {"label": "Innovation and originality", "score": <1-100>, "note": "<1-2 sentences citing specific evidence>"},
    {"label": "Technical execution", "score": <1-100>, "note": "<1-2 sentences citing GitHub or transcript claims>"},
    {"label": "Functionality and completion", "score": <1-100>, "note": "<1-2 sentences citing what they demonstrated>"},
    {"label": "Presentation and clarity", "score": <1-100>, "note": "<1-2 sentences citing transcript structure or clarity>"}
  ],
  "redFlags": ["<specific issue — if off-topic for category, list this FIRST>", "..."],
  "advice": ["<actionable advice tied to a specific weak point — if off-topic, advise how to align with the category>", "..."],
  "overallScore": <1-100>
}

RULES:
- Notes must cite the transcript or GitHub. No generic feedback.
- If they missed the category brief, make it the first red flag and give concrete advice on how to align.
- Red flags must be specific (e.g. "Claimed 'ML-powered' but repo has no model or API calls" not "vague tech claims").
- Be brutal. University hackathons have strong teams — mediocre work should score 50–60, not 80.
- Ignore funding, investors, runway, or business model. That's not what hackathons judge.`
}

export function buildReviewPrompt(
  account: AccountData | null,
  transcript: string,
  githubSummary: string | null,
  investor: Investor | null,
  assessmentType: AssessmentTypeId = "pitch-deck"
): string {
  const isHackathon = assessmentType === "hackathon-1" || assessmentType === "hackathon-2" || assessmentType === "hackathon-3"
  const category = isHackathon ? HACKATHON_CATEGORIES[assessmentType as keyof typeof HACKATHON_CATEGORIES] : null

  if (isHackathon && category) {
    return buildHackathonReviewPrompt(account, transcript, githubSummary, category)
  }

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
