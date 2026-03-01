import type { HistoryData, HistoryEntry, HistoryFeedbackItem } from "./types"

/** Flatten history into a single array of entries, newest first */
export function getAllEntries(history: HistoryData): HistoryEntry[] {
  return Object.entries(history)
    .flatMap(([date, entries]) => entries.map((e) => ({ ...e, date })))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

/** Get average score for a feedback label across all entries */
export function getAverageScore(history: HistoryData, label: string): number {
  const entries = getAllEntries(history)
  if (entries.length === 0) return 0
  const scores = entries.flatMap((e) => e.feedback.filter((f) => f.label === label).map((f) => f.score))
  if (scores.length === 0) return 0
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
}

/** Get all scores by label for trend analysis */
export function getScoresByLabel(history: HistoryData): Record<string, number[]> {
  const entries = getAllEntries(history)
  const byLabel: Record<string, number[]> = {}
  for (const entry of entries) {
    for (const f of entry.feedback) {
      if (!byLabel[f.label]) byLabel[f.label] = []
      byLabel[f.label].push(f.score)
    }
  }
  return byLabel
}

/** Summary stats for the Summary tab */
export interface HistorySummary {
  totalRecordings: number
  dateRange: { first: string; last: string } | null
  avgScores: Record<string, number>
  weakestArea: string | null
  strongestArea: string | null
  recentNotes: HistoryFeedbackItem[]
  trend: "improving" | "declining" | "stable" | null
}

export function getHistorySummary(history: HistoryData): HistorySummary {
  const entries = getAllEntries(history)

  if (entries.length === 0) {
    return {
      totalRecordings: 0,
      dateRange: null,
      avgScores: {},
      weakestArea: null,
      strongestArea: null,
      recentNotes: [],
      trend: null,
    }
  }

  const dates = entries.map((e) => e.timestamp)
  const dateRange = {
    first: dates[dates.length - 1],
    last: dates[0],
  }

  const byLabel = getScoresByLabel(history)
  const avgScores: Record<string, number> = {}
  for (const [label, scores] of Object.entries(byLabel)) {
    avgScores[label] = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  }

  const entriesWithScores = Object.entries(avgScores)
  const weakestArea =
    entriesWithScores.length > 0
      ? entriesWithScores.reduce((a, b) => (a[1] < b[1] ? a : b))[0]
      : null
  const strongestArea =
    entriesWithScores.length > 0
      ? entriesWithScores.reduce((a, b) => (a[1] > b[1] ? a : b))[0]
      : null

  const recentNotes = entries
    .slice(0, 5)
    .flatMap((e) => e.feedback)
    .filter((f) => f.note)

  let trend: "improving" | "declining" | "stable" | null = null
  if (entries.length >= 3) {
    const scoreFor = (e: HistoryEntry) => {
      if (e.overallScore != null && e.overallScore > 0) return e.overallScore
      if (e.feedback.length === 0) return 0
      return e.feedback.reduce((a, f) => a + f.score, 0) / e.feedback.length
    }
    const firstHalf = entries.slice(-Math.ceil(entries.length / 2))
    const secondHalf = entries.slice(0, Math.floor(entries.length / 2))
    const avgFirst = firstHalf.reduce((s, e) => s + scoreFor(e), 0) / firstHalf.length
    const avgSecond = secondHalf.reduce((s, e) => s + scoreFor(e), 0) / secondHalf.length
    const diff = avgSecond - avgFirst
    if (diff > 2) trend = "improving"
    else if (diff < -2) trend = "declining"
    else trend = "stable"
  }

  return {
    totalRecordings: entries.length,
    dateRange,
    avgScores,
    weakestArea,
    strongestArea,
    recentNotes,
    trend,
  }
}

/** Checklist items derived from pitch summary, to inject into timeline phases */
export interface SummaryChecklistItem {
  id: string
  label: string
  group: string
}

/** Map summary dimension to phase index (0-based). Fundraising = 3. */
function phaseForDimension(label: string): number {
  const map: Record<string, number> = {
    Clarity: 0,        // Ideation
    Credibility: 1,    // Build MVP
    "Investor Fit": 3, // Fundraising
    Ask: 3,            // Fundraising
    Consistency: 3,   // Fundraising
  }
  return map[label] ?? 3
}

/** Get summary-derived checklist items per phase. Keys are phase indices (0-4). */
export function getSummaryPhaseItems(history: HistoryData): Record<number, SummaryChecklistItem[]> {
  const summary = getHistorySummary(history)
  const byPhase: Record<number, SummaryChecklistItem[]> = {}

  const add = (phaseIdx: number, item: SummaryChecklistItem) => {
    if (!byPhase[phaseIdx]) byPhase[phaseIdx] = []
    byPhase[phaseIdx].push(item)
  }

  if (summary.weakestArea) {
    const phase = phaseForDimension(summary.weakestArea)
    add(phase, {
      id: `fb-weak-${summary.weakestArea.replace(/\s/g, "-")}`,
      label: `Focus on improving ${summary.weakestArea}`,
      group: "Pitch Feedback",
    })
  }

  const lowScores = Object.entries(summary.avgScores)
    .filter(([, score]) => score < 80)
    .sort((a, b) => a[1] - b[1])
  for (const [label] of lowScores) {
    if (label !== summary.weakestArea) {
      const phase = phaseForDimension(label)
      add(phase, {
        id: `fb-score-${label.replace(/\s/g, "-")}`,
        label: `Address feedback on ${label}`,
        group: "Pitch Feedback",
      })
    }
  }

  summary.recentNotes.forEach((note, i) => {
    const phase = phaseForDimension(note.label)
    add(phase, {
      id: `fb-note-${i}`,
      label: `${note.label}: ${note.note}`,
      group: "Pitch Feedback",
    })
  })

  if (summary.strongestArea) {
    const phase = phaseForDimension(summary.strongestArea)
    add(phase, {
      id: `fb-strong-${summary.strongestArea.replace(/\s/g, "-")}`,
      label: `Keep strengthening ${summary.strongestArea}`,
      group: "Pitch Feedback",
    })
  }

  return byPhase
}
