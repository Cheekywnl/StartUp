export interface PortfolioItem {
  company: string
  stage: string
  year: number
  outcome: string
}

export interface Investor {
  id: number
  name: string
  handle: string
  firm: string
  role: string
  avatar: string
  avatarColor: string
  location: string
  focus: string[]
  stages: string[]
  checkSize: string
  bio: string
  portfolio: PortfolioItem[]
  email: string
  linkedin: string
  twitter: string
  online: boolean
  responseRate: string
  lastActive: string
}

export interface Message {
  id: number
  text: string
  fromMe: boolean
  time: string
  seen?: boolean
}

export interface Conversation {
  id: number
  name: string
  handle: string
  avatar: string
  avatarColor: string
  online: boolean
  firm: string
  lastMessage: string
  lastTime: string
  unread: number
  messages: Message[]
}

export interface AccountData {
  name: string
  product: string
  description: string
  github: string
}

export interface HistoryFeedbackItem {
  label: string
  score: number
  note: string
}

export interface HistoryEntry {
  timestamp: string
  account: AccountData | null
  transcript: string
  feedback: HistoryFeedbackItem[]
  redFlags?: string[]
  advice?: string[]
  overallScore?: number
  /** Base64 data URL of a frame captured from the pitch video */
  thumbnail?: string
  /** Assessment type (pitch-deck, hackathon-1, etc.) */
  assessmentType?: string
}

export type HistoryData = Record<string, HistoryEntry[]>
