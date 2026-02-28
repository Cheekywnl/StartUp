import type { Investor, Conversation } from "./types"

export const INVESTORS: Investor[] = [
  {
    id: 1, name: "Marcus Holt", handle: "@marcus.sequoia", firm: "Sequoia Capital",
    role: "General Partner", avatar: "MH", avatarColor: "#e91e8c",
    location: "Menlo Park, CA", focus: ["B2B SaaS", "Developer Tools", "AI Infrastructure"],
    stages: ["Series A", "Series B"], checkSize: "$8M – $15M",
    bio: "I've spent 12 years backing software founders rebuilding how enterprises operate. Former engineer, so I'll always ask about the architecture.",
    portfolio: [
      { company: "DataLayer", stage: "Series A", year: 2021, outcome: "Acquired by Salesforce" },
      { company: "FlowMetrics", stage: "Series B", year: 2022, outcome: "Active — $80M ARR" },
      { company: "Nexus API", stage: "Series A", year: 2023, outcome: "Active — Series C raised" },
    ],
    email: "marcus@sequoiacap.com", linkedin: "linkedin.com/in/marcusholt", twitter: "@marcusholt_vc",
    online: true, responseRate: "Usually responds within 24h", lastActive: "Active now",
  },
  {
    id: 2, name: "Priya Nair", handle: "@priya.a16z", firm: "Andreessen Horowitz",
    role: "General Partner", avatar: "PN", avatarColor: "#6c5ce7",
    location: "San Francisco, CA", focus: ["Enterprise Software", "Cloud Infrastructure", "Vertical SaaS"],
    stages: ["Seed", "Series A"], checkSize: "$3M – $12M",
    bio: "Before a16z I was a product leader at Stripe and Notion. I'm drawn to founders who obsess over customer problems rather than competitor features.",
    portfolio: [
      { company: "WorkflowAI", stage: "Seed", year: 2022, outcome: "Active — 3x revenue YoY" },
      { company: "Stackform", stage: "Series A", year: 2021, outcome: "Active — IPO pipeline" },
      { company: "Clarity CRM", stage: "Seed", year: 2023, outcome: "Active — $12M ARR" },
    ],
    email: "priya@a16z.com", linkedin: "linkedin.com/in/priyanair", twitter: "@priya_a16z",
    online: true, responseRate: "Usually responds within 48h", lastActive: "Active 1h ago",
  },
  {
    id: 3, name: "Sofia Reyes", handle: "@sofia.lightspeed", firm: "Lightspeed Ventures",
    role: "Partner", avatar: "SR", avatarColor: "#00b894",
    location: "New York, NY", focus: ["FinTech SaaS", "Compliance Tech", "B2B Marketplaces"],
    stages: ["Series A", "Series B"], checkSize: "$6M – $14M",
    bio: "My background is in investment banking and enterprise sales. I'm particularly interested in companies with strong enterprise contract values and expansion revenue.",
    portfolio: [
      { company: "ComplianceOS", stage: "Series A", year: 2020, outcome: "Acquired by Thomson Reuters" },
      { company: "LedgerFlow", stage: "Series B", year: 2022, outcome: "Active — $55M ARR" },
      { company: "TrustLayer", stage: "Series A", year: 2023, outcome: "Active — Series B raised" },
    ],
    email: "sofia@lsvp.com", linkedin: "linkedin.com/in/sofiareyes", twitter: "@sofia_lightspeed",
    online: false, responseRate: "Usually responds within 3 days", lastActive: "Active 3h ago",
  },
  {
    id: 4, name: "Noah Kim", handle: "@noah.accel", firm: "Accel Partners",
    role: "Partner", avatar: "NK", avatarColor: "#fd79a8",
    location: "Palo Alto, CA", focus: ["Developer Tools", "Open Source SaaS", "Security Software"],
    stages: ["Seed", "Series A", "Series B"], checkSize: "$2M – $20M",
    bio: "I've been an active open source contributor since college. I look for strong bottom-up adoption signals before betting on enterprise upside.",
    portfolio: [
      { company: "OpenShield", stage: "Seed", year: 2021, outcome: "Active — $18M ARR" },
      { company: "DevPulse", stage: "Series A", year: 2022, outcome: "Active — 200K MAU" },
      { company: "CodeAudit", stage: "Series B", year: 2023, outcome: "Active — Series C in process" },
    ],
    email: "noah@accel.com", linkedin: "linkedin.com/in/noahkim", twitter: "@noahkim_vc",
    online: false, responseRate: "Usually responds within 48h", lastActive: "Active yesterday",
  },
  {
    id: 5, name: "Ethan Brooks", handle: "@ethan.benchmark", firm: "Benchmark",
    role: "General Partner", avatar: "EB", avatarColor: "#ff7043",
    location: "San Francisco, CA", focus: ["Marketplace Software", "B2B SaaS", "Workflow Automation"],
    stages: ["Series A", "Series B"], checkSize: "$10M – $20M",
    bio: "I look for founders who are rebuilding workflows that enterprises have tolerated for too long. My best investments come from founders who intimately understand the pain.",
    portfolio: [
      { company: "WorkOS", stage: "Series A", year: 2021, outcome: "Active — $40M ARR" },
      { company: "Retool", stage: "Series B", year: 2022, outcome: "Active — Unicorn" },
      { company: "ProcureAI", stage: "Series A", year: 2023, outcome: "Active — Series B raised" },
    ],
    email: "ethan@benchmark.com", linkedin: "linkedin.com/in/ethanbrooks", twitter: "@ethanbrooks_vc",
    online: true, responseRate: "Usually responds within 24h", lastActive: "Active now",
  },
  {
    id: 6, name: "Aisha Patel", handle: "@aisha.greylock", firm: "Greylock Partners",
    role: "Partner", avatar: "AP", avatarColor: "#26c6da",
    location: "Palo Alto, CA", focus: ["AI/ML Software", "Data Infrastructure", "Developer Tools"],
    stages: ["Seed", "Series A"], checkSize: "$2M – $10M",
    bio: "My background is in ML research at Google Brain. I'm most excited about companies where the AI is the product — not just a feature layer on top of existing software.",
    portfolio: [
      { company: "VectorDB", stage: "Seed", year: 2022, outcome: "Active — 500K developers" },
      { company: "MLflow Pro", stage: "Series A", year: 2021, outcome: "Active — $22M ARR" },
      { company: "InferenceOS", stage: "Seed", year: 2023, outcome: "Active — Series A raised" },
    ],
    email: "aisha@greylock.com", linkedin: "linkedin.com/in/aishapatel", twitter: "@aisha_greylock",
    online: false, responseRate: "Usually responds within 48h", lastActive: "Active 2h ago",
  },
]

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 1, name: "Marcus Holt", handle: "marcus.sequoia", avatar: "MH",
    avatarColor: "#e91e8c", online: true, firm: "Sequoia Capital",
    lastMessage: "We're ready to move to a term sheet", lastTime: "2m", unread: 2,
    messages: [
      { id: 1, text: "Hey! Loved the demo you shared last week. The ARR growth is genuinely impressive.", fromMe: false, time: "Mon 10:02 AM" },
      { id: 2, text: "Thanks Marcus, really glad it resonated. We've had a strong quarter.", fromMe: true, time: "Mon 10:15 AM", seen: true },
      { id: 3, text: "I spoke with the partnership yesterday. There's strong interest in leading your Series A.", fromMe: false, time: "Mon 11:30 AM" },
      { id: 4, text: "That's exciting to hear. What kind of check size are you thinking?", fromMe: true, time: "Mon 11:45 AM", seen: true },
      { id: 5, text: "We're thinking $10–12M at a $55M pre-money. We think that's fair given your traction.", fromMe: false, time: "Mon 12:01 PM" },
      { id: 6, text: "We're ready to move to a term sheet whenever you are.", fromMe: false, time: "Today 9:15 AM" },
    ],
  },
  {
    id: 2, name: "Priya Nair", handle: "priya.a16z", avatar: "PN",
    avatarColor: "#6c5ce7", online: true, firm: "Andreessen Horowitz",
    lastMessage: "Can we do a partner meeting next week?", lastTime: "1h", unread: 1,
    messages: [
      { id: 1, text: "Hi! I came across your product through a portfolio founder. Really compelling positioning.", fromMe: false, time: "Fri 3:00 PM" },
      { id: 2, text: "Hi Priya, thanks for reaching out! Always happy to connect with a16z.", fromMe: true, time: "Fri 3:30 PM", seen: true },
      { id: 3, text: "Your NRR is what really got our attention. 138% is exceptional for a team at this stage.", fromMe: false, time: "Fri 4:00 PM" },
      { id: 4, text: "Can we do a partner meeting next week?", fromMe: false, time: "Today 8:45 AM" },
    ],
  },
  {
    id: 3, name: "Sofia Reyes", handle: "sofia.lightspeed", avatar: "SR",
    avatarColor: "#00b894", online: false, firm: "Lightspeed Ventures",
    lastMessage: "Let me know when you've reviewed the terms", lastTime: "3h", unread: 0,
    messages: [
      { id: 1, text: "Following up from our call — I'm sending over a draft term sheet.", fromMe: false, time: "Yesterday 2:00 PM" },
      { id: 2, text: "Got it, I'll go through it with our lawyer this week.", fromMe: true, time: "Yesterday 3:10 PM", seen: true },
      { id: 3, text: "Let me know when you've reviewed the terms and we can hop on a call.", fromMe: false, time: "Yesterday 5:00 PM" },
    ],
  },
]
