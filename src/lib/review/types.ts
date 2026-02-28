/** Single dimension score (e.g. Clarity, Credibility) */
export interface ReviewScore {
  label: string
  score: number
  note: string
}

/** Full review output from the pipeline */
export interface ReviewResult {
  scores: ReviewScore[]
  redFlags: string[]
  advice: string[]
  overallScore: number
}
