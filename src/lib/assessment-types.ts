/** Assessment type IDs used for routing and API */
export type AssessmentTypeId = "pitch-deck" | "hackathon-1" | "hackathon-2" | "hackathon-3"

export const ASSESSMENT_TYPES: { id: AssessmentTypeId; label: string }[] = [
  { id: "pitch-deck", label: "Pitch Deck (Default)" },
  { id: "hackathon-1", label: "Hackathon 1" },
  { id: "hackathon-2", label: "Hackathon 2" },
  { id: "hackathon-3", label: "Hackathon 3" },
]

export const DEFAULT_ASSESSMENT_TYPE: AssessmentTypeId = "pitch-deck"

/** Warwick Finance Societies Fintech Hackathon – judging criteria for all hackathon categories */
export const HACKATHON_JUDGING_CRITERIA = [
  { id: "problem-impact", label: "Problem and impact", description: "How well does the solution address a real problem? What is the potential impact?" },
  { id: "innovation", label: "Innovation and originality", description: "How novel and creative is the approach? Does it bring a fresh perspective?" },
  { id: "technical", label: "Technical execution", description: "Quality of implementation, architecture, and technical decisions." },
  { id: "functionality", label: "Functionality and completion", description: "Does it work end-to-end? How complete is the solution?" },
  { id: "presentation", label: "Presentation and clarity", description: "How clearly is the idea communicated? Is the pitch compelling and easy to follow?" },
] as const

/** Hackathon category briefs (Warwick Finance Societies Fintech Hackathon) */
export const HACKATHON_CATEGORIES: Record<Exclude<AssessmentTypeId, "pitch-deck">, { title: string; problem: string; challenge: string }> = {
  "hackathon-1": {
    title: "Category 1: Data in Finance",
    problem: "Financial markets generate vast amounts of data, yet turning that information into meaningful insight remains a challenge.",
    challenge: "Build a tool using financial data to inform decision-making or identify opportunities.",
  },
  "hackathon-2": {
    title: "Category 2: Financial Inclusion",
    problem: "Managing money and accessing essential financial services remains complex and uneven for many people.",
    challenge: "Design an application or tool that helps people better manage their finances or access essential financial services.",
  },
  "hackathon-3": {
    title: "Category 3: Solution for Startups",
    problem: "Startups are becoming an increasingly powerful force in today's economic landscape, yet behind every new venture lies uncertainty.",
    challenge: "Build a tool to aid with creating these startups.",
  },
}

export function getAssessmentTypeLabel(id: AssessmentTypeId | string | undefined): string {
  if (!id) return "Pitch Deck (Default)"
  const found = ASSESSMENT_TYPES.find((t) => t.id === id)
  return found?.label ?? (id === "pitch-deck" ? "Pitch Deck (Default)" : id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()))
}
