/**
 * Color schemes for the app. Timeline (dark) is default; timelineLight is light/white mode.
 */
export type ThemeId = "timeline" | "timelineLight"

export interface Theme {
  id: ThemeId
  name: string
  /** Page/shell background */
  bg: string
  /** Cards, secondary surfaces */
  bgSecondary: string
  /** Tertiary surfaces (inputs, hover) */
  bgTertiary: string
  /** Primary text */
  text: string
  /** Muted/secondary text */
  textMuted: string
  /** Borders */
  border: string
  /** Accent gradient start */
  accentStart: string
  /** Accent gradient end */
  accentEnd: string
  /** Active/highlight background */
  activeBg: string
  /** Font family */
  fontFamily: string
}

/** EntrepreneurTimeline theme — dark indigo/purple (default) */
export const THEME_TIMELINE: Theme = {
  id: "timeline",
  name: "Timeline",
  bg: "#080810",
  bgSecondary: "#0f0f1a",
  bgTertiary: "#1a1a2e",
  text: "#e8e8f4",
  textMuted: "#5a5a7a",
  border: "#2a2a45",
  accentStart: "#6060a0",
  accentEnd: "#8b5cf6",
  activeBg: "rgba(255,255,255,.08)",
  fontFamily: "'Syne', 'Segoe UI', sans-serif",
}

/** Light/white mode variant of timeline */
export const THEME_TIMELINE_LIGHT: Theme = {
  id: "timelineLight",
  name: "Timeline Light",
  bg: "#f8f8ff",
  bgSecondary: "#fff",
  bgTertiary: "#e8e8f4",
  text: "#1a1a2e",
  textMuted: "#5a5a7a",
  border: "#d0d0e0",
  accentStart: "#6366f1",
  accentEnd: "#8b5cf6",
  activeBg: "rgba(99,102,241,.12)",
  fontFamily: "'Syne', 'Segoe UI', sans-serif",
}

export const THEMES: Record<ThemeId, Theme> = {
  timeline: THEME_TIMELINE,
  timelineLight: THEME_TIMELINE_LIGHT,
}
