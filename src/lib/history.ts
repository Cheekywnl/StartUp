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
    const firstHalf = entries.slice(-Math.ceil(entries.length / 2))
    const secondHalf = entries.slice(0, Math.floor(entries.length / 2))
    const avgFirst =
      firstHalf.reduce((s, e) => s + e.feedback.reduce((a, f) => a + f.score, 0) / e.feedback.length, 0) /
      firstHalf.length
    const avgSecond =
      secondHalf.reduce((s, e) => s + e.feedback.reduce((a, f) => a + f.score, 0) / e.feedback.length, 0) /
      secondHalf.length
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
