/** Scoring dimensions for pitch review */
export const REVIEW_DIMENSIONS = [
  {
    id: "clarity",
    label: "Clarity",
    description: "Is the problem explained in under 30 seconds? Clear value prop? Minimal jargon?",
  },
  {
    id: "credibility",
    label: "Credibility",
    description: "Specific metrics? Traction? Team credibility? Customer references?",
  },
  {
    id: "fit",
    label: "Investor Fit",
    description: "Does this match the investor's focus, stage, and portfolio?",
  },
  {
    id: "ask",
    label: "Ask",
    description: "Clear use of funds? Realistic terms? Defined round size?",
  },
  {
    id: "consistency",
    label: "Consistency",
    description: "Does profile/description match transcript? Does transcript match GitHub?",
  },
] as const
