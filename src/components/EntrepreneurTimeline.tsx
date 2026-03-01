"use client"

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { getSummaryPhaseItems } from "@/lib/history";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ChecklistItem {
  id: string | number;
  label: string;
  group?: string;
  checked?: boolean;
}

interface Milestone {
  id: string | number;
  phase: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  checklist: {
    title: string;
    description: string;
    items: ChecklistItem[];
  };
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const MILESTONES: Milestone[] = [
  {
    id: 1,
    phase: "Phase 01",
    title: "Ideation & Validation",
    description: "Turn a spark into a proven concept with real market signal.",
    icon: "💡",
    color: "#f59e0b",
    checklist: {
      title: "Ideation & Validation",
      description: "Validate before you build. Every checkbox here saves weeks later.",
      items: [
        { id: "v1", label: "Define the problem you're solving", group: "Problem" },
        { id: "v2", label: "Write a one-sentence value proposition", group: "Problem" },
        { id: "v3", label: "Identify your target customer persona", group: "Market" },
        { id: "v4", label: "Run 10 customer discovery interviews", group: "Market" },
        { id: "v5", label: "Analyze 3 direct competitors", group: "Market" },
        { id: "v6", label: "Create a simple landing page", group: "Validation" },
        { id: "v7", label: "Collect 50 email sign-ups or pre-orders", group: "Validation" },
        { id: "v8", label: "Document key assumptions to test", group: "Validation" },
      ],
    },
  },
  {
    id: 2,
    phase: "Phase 02",
    title: "Build the MVP",
    description: "Craft the smallest product that delivers core value.",
    icon: "🔨",
    color: "#10b981",
    checklist: {
      title: "Build the MVP",
      description: "Ship fast, learn faster. Only build what you can't avoid.",
      items: [
        { id: "m1", label: "Define MVP feature scope (must-haves only)", group: "Scoping" },
        { id: "m2", label: "Create wireframes or a prototype", group: "Scoping" },
        { id: "m3", label: "Set up version control & project repo", group: "Engineering" },
        { id: "m4", label: "Build core feature #1", group: "Engineering" },
        { id: "m5", label: "Build core feature #2", group: "Engineering" },
        { id: "m6", label: "Set up CI/CD pipeline", group: "Engineering" },
        { id: "m7", label: "Conduct internal QA pass", group: "Quality" },
        { id: "m8", label: "Deploy to staging environment", group: "Quality" },
        { id: "m9", label: "Beta test with 5 real users", group: "Quality" },
      ],
    },
  },
  {
    id: 3,
    phase: "Phase 03",
    title: "Launch & Acquire",
    description: "Get your first paying customers and prove the business model.",
    icon: "🚀",
    color: "#6366f1",
    checklist: {
      title: "Launch & Acquire",
      description: "A launch isn't a moment — it's a sustained effort. Start here.",
      items: [
        { id: "l1", label: "Write launch blog post / press release", group: "Content" },
        { id: "l2", label: "Schedule social media campaign", group: "Content" },
        { id: "l3", label: "Submit to Product Hunt", group: "Distribution" },
        { id: "l4", label: "Post in 5 relevant communities", group: "Distribution" },
        { id: "l5", label: "Set up Google Analytics / Mixpanel", group: "Analytics" },
        { id: "l6", label: "Define North Star metric", group: "Analytics" },
        { id: "l7", label: "Close first 10 paying customers", group: "Revenue" },
        { id: "l8", label: "Document acquisition cost per channel", group: "Revenue" },
      ],
    },
  },
  {
    id: 4,
    phase: "Phase 04",
    title: "Fundraising",
    description: "Build investor confidence with traction, narrative, and proof.",
    icon: "💰",
    color: "#ec4899",
    checklist: {
      title: "Fundraising",
      description: "Investors fund teams and traction. Show both clearly.",
      items: [
        { id: "f1", label: "Build a 12-slide pitch deck", group: "Materials" },
        { id: "f2", label: "Prepare 3-year financial model", group: "Materials" },
        { id: "f3", label: "Write executive summary (1 page)", group: "Materials" },
        { id: "f4", label: "Research 50 target investors", group: "Outreach" },
        { id: "f5", label: "Get 10 warm introductions", group: "Outreach" },
        { id: "f6", label: "Send first batch of outreach emails", group: "Outreach" },
        { id: "f7", label: "Complete 20 investor meetings", group: "Process" },
        { id: "f8", label: "Receive and review first term sheet", group: "Process" },
        { id: "f9", label: "Close funding round", group: "Process" },
      ],
    },
  },
  {
    id: 5,
    phase: "Phase 05",
    title: "Scale & Grow",
    description: "Systematize what works and expand to new markets.",
    icon: "📈",
    color: "#14b8a6",
    checklist: {
      title: "Scale & Grow",
      description: "Growth isn't magic — it's repeatable systems. Build them now.",
      items: [
        { id: "s1", label: "Hire first 3 full-time employees", group: "Team" },
        { id: "s2", label: "Define org chart & reporting structure", group: "Team" },
        { id: "s3", label: "Document core business processes", group: "Operations" },
        { id: "s4", label: "Implement CRM system", group: "Operations" },
        { id: "s5", label: "Launch second acquisition channel", group: "Growth" },
        { id: "s6", label: "Achieve MoM revenue growth > 15%", group: "Growth" },
        { id: "s7", label: "Explore expansion to new segment / market", group: "Growth" },
        { id: "s8", label: "Set up quarterly OKR framework", group: "Strategy" },
        { id: "s9", label: "Conduct first board meeting", group: "Strategy" },
      ],
    },
  },
];

// ─── Checklist Sub-component ──────────────────────────────────────────────────
function ChecklistPanel({
  milestone,
  onClose,
}: {
  milestone: Milestone;
  onClose: () => void;
}) {
  const { checklist, color } = milestone;

  const [checked, setChecked] = useState<Set<string | number>>(
    () => new Set(checklist.items.filter((i) => i.checked).map((i) => i.id))
  );

  const toggle = (id: string | number) =>
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const total = checklist.items.length;
  const done = checked.size;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  const groups = checklist.items.reduce<Record<string, ChecklistItem[]>>((acc, item) => {
    const key = item.group ?? "General";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <>
      <div style={panelStyles.backdrop} onClick={onClose} />
      <aside style={panelStyles.panel} className="checklist-panel">
        <style>{panelCss}</style>

        {/* Panel header */}
        <div style={{ ...panelStyles.panelHeader, borderBottomColor: `${color}33` }}>
          <div>
            <span style={{ ...panelStyles.phase, color }}>{milestone.phase}</span>
            <h2 style={panelStyles.panelTitle}>{checklist.title}</h2>
            <p style={panelStyles.panelDesc}>{checklist.description}</p>
          </div>
          <button type="button" style={panelStyles.closeBtn} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Progress */}
        <div style={panelStyles.progressWrap}>
          <div style={panelStyles.progressMeta}>
            <span style={panelStyles.progressLabel}>{done} / {total} tasks</span>
            <span style={{ ...panelStyles.progressPct, color }}>{pct}%</span>
          </div>
          <div style={panelStyles.progressTrack}>
            <div
              style={{
                ...panelStyles.progressFill,
                width: `${pct}%`,
                background: pct === 100
                  ? "linear-gradient(90deg,#4ade80,#22c55e)"
                  : `linear-gradient(90deg,${color}88,${color})`,
                transition: "width .4s cubic-bezier(.4,0,.2,1)",
              }}
            />
          </div>
        </div>

        {/* Items */}
        <div style={panelStyles.body}>
          {Object.entries(groups).map(([group, items]) => (
            <section key={group} style={panelStyles.group}>
              <h3 style={panelStyles.groupLabel}>{group}</h3>
              <ul style={panelStyles.list}>
                {items.map((item, idx) => {
                  const isChecked = checked.has(item.id);
                  return (
                    <li
                      key={item.id}
                      className="task-row"
                      style={{
                        ...panelStyles.row,
                        animationDelay: `${idx * 35}ms`,
                      }}
                      onClick={() => toggle(item.id)}
                    >
                      <span
                        style={{
                          ...panelStyles.checkbox,
                          ...(isChecked
                            ? { background: color, borderColor: color }
                            : {}),
                        }}
                      >
                        {isChecked && (
                          <svg viewBox="0 0 12 10" fill="none" style={panelStyles.checkIcon}>
                            <path
                              d="M1 5l3.5 3.5L11 1"
                              stroke="white"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>
                      <span
                        style={{
                          ...panelStyles.itemLabel,
                          ...(isChecked ? panelStyles.itemDone : {}),
                        }}
                      >
                        {item.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}

          {pct === 100 && (
            <div style={{ ...panelStyles.allDone, borderColor: `${color}44`, color: color }}>
              🎉 Phase complete — time to move forward!
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

// ─── Main Timeline Component ──────────────────────────────────────────────────
export default function EntrepreneurTimeline() {
  const [active, setActive] = useState<string | number | null>(null);
  const { history, workOnNote, setWorkOnNote, accountData } = useApp();
  const summaryItems = getSummaryPhaseItems(history);

  const milestones = MILESTONES.map((m, phaseIdx) => {
    const extraItems = summaryItems[phaseIdx] ?? [];
    const checklistItems = [
      ...m.checklist.items,
      ...extraItems.map((item) => ({
        id: item.id,
        label: item.label,
        group: item.group,
      })),
    ];
    return {
      ...m,
      checklist: {
        ...m.checklist,
        items: checklistItems,
      },
    };
  });

  const activeMilestone = milestones.find((m) => m.id === active) ?? null;

  return (
    <div className="timeline-page" style={timelineStyles.page}>
      <style>{timelineCss}</style>

      {/* Hero */}
      <header style={timelineStyles.hero}>
        <p style={timelineStyles.eyebrow}>{accountData?.product ?? "VCMail"}</p>
        <h1 style={timelineStyles.heroTitle}>
          From Idea<br />to Scale
        </h1>
        <p style={timelineStyles.heroSub}>
          Five phases. Every milestone you need to build a fundable, scalable startup.
          Click any phase to open its checklist.
        </p>
      </header>

      {/* What to work on - editable */}
      <section style={workOnStyles.section}>
        <label style={workOnStyles.label}>What to work on</label>
        <textarea
          value={workOnNote ?? ""}
          onChange={(e) => setWorkOnNote(e.target.value)}
          placeholder="e.g. Improve clarity in the first 30 seconds, add specific metrics for credibility..."
          style={workOnStyles.textarea}
          rows={3}
        />
      </section>

      {/* Timeline */}
      <div style={timelineStyles.timeline}>
        {/* Vertical line */}
        <div style={timelineStyles.line} />

        {milestones.map((m, idx) => {
          const isRight = idx % 2 === 0;
          return (
            <div
              key={m.id}
              style={{
                ...timelineStyles.entry,
                flexDirection: isRight ? "row" : "row-reverse",
                animationDelay: `${idx * 120}ms`,
              }}
              className="timeline-entry"
            >
              {/* Card */}
              <div style={timelineStyles.cardSide}>
                <button
                  type="button"
                  className="milestone-card"
                  style={{
                    ...timelineStyles.card,
                    textAlign: isRight ? "right" : "left",
                  }}
                  onClick={() => setActive(m.id)}
                >
                  <span style={{ ...timelineStyles.phaseTag, color: m.color }}>
                    {m.phase}
                  </span>
                  <h2 style={timelineStyles.cardTitle}>
                    <span style={timelineStyles.cardIcon}>{m.icon}</span> {m.title}
                  </h2>
                  <p style={timelineStyles.cardDesc}>{m.description}</p>
                  <span
                    style={{
                      ...timelineStyles.openBtn,
                      background: `${m.color}18`,
                      color: m.color,
                      border: `1px solid ${m.color}44`,
                    }}
                  >
                    Open Checklist →
                  </span>
                </button>
              </div>

              {/* Node */}
              <div style={timelineStyles.nodeSide}>
                <button
                  type="button"
                  className="milestone-node"
                  style={{
                    ...timelineStyles.node,
                    border: `2px solid ${m.color}`,
                    boxShadow: `0 0 20px ${m.color}44`,
                  }}
                  onClick={() => setActive(m.id)}
                  aria-label={`Open ${m.title}`}
                >
                  <span style={timelineStyles.nodeIcon}>{m.icon}</span>
                </button>
              </div>

              {/* Spacer */}
              <div style={timelineStyles.cardSide} />
            </div>
          );
        })}
      </div>

      {/* Checklist Panel */}
      {activeMilestone && (
        <ChecklistPanel
          milestone={activeMilestone}
          onClose={() => setActive(null)}
        />
      )}
    </div>
  );
}

// ─── What to work on styles ────────────────────────────────────────────────────
const workOnStyles: Record<string, React.CSSProperties> = {
  section: {
    maxWidth: 900,
    margin: "0 auto",
    padding: "0 24px 32px",
  },
  label: {
    display: "block",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.15em",
    textTransform: "uppercase" as const,
    color: "#6366f1",
    marginBottom: 10,
  },
  textarea: {
    width: "100%",
    padding: "16px 20px",
    background: "rgba(255,255,255,.03)",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: 14,
    color: "#e8e8f4",
    fontSize: 14,
    fontFamily: "inherit",
    lineHeight: 1.6,
    resize: "vertical" as const,
    minHeight: 80,
    outline: "none",
  },
};

// ─── Timeline Styles ──────────────────────────────────────────────────────────
const timelineStyles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#080810",
    fontFamily: "'Syne', 'Segoe UI', sans-serif",
    color: "#e8e8f4",
    overflowX: "hidden",
  },
  hero: {
    textAlign: "center",
    padding: "80px 24px 48px",
    position: "relative",
  },
  eyebrow: {
    margin: "0 0 12px",
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.2em",
    textTransform: "uppercase" as const,
    color: "#555570",
  },
  heroTitle: {
    margin: "0 0 16px",
    fontSize: "clamp(52px, 8vw, 96px)",
    fontWeight: 800,
    lineHeight: 1,
    letterSpacing: "-0.03em",
    background: "linear-gradient(135deg, #f8f8ff 30%, #6060a0 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  heroSub: {
    margin: "0 auto",
    maxWidth: 480,
    fontSize: 15,
    color: "#5a5a7a",
    lineHeight: 1.7,
  },
  timeline: {
    position: "relative",
    maxWidth: 900,
    margin: "0 auto",
    padding: "20px 24px 80px",
    display: "flex",
    flexDirection: "column",
    gap: 0,
  },
  line: {
    position: "absolute",
    left: "50%",
    top: 0,
    bottom: 0,
    width: 1,
    background: "linear-gradient(to bottom, transparent, #2a2a45 10%, #2a2a45 90%, transparent)",
    transform: "translateX(-50%)",
  },
  entry: {
    display: "flex",
    alignItems: "center",
    gap: 0,
    marginBottom: 0,
    animation: "fadeUp .5s ease both",
  },
  cardSide: {
    flex: 1,
    padding: "20px 28px",
  },
  nodeSide: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    flexShrink: 0,
    zIndex: 2,
  },
  node: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    background: "#0d0d18",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "transform .2s, box-shadow .2s",
    flexShrink: 0,
  },
  nodeIcon: {
    fontSize: 20,
    lineHeight: 1,
  },
  card: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    padding: "24px 28px",
    background: "rgba(255,255,255,.03)",
    border: "1px solid rgba(255,255,255,.07)",
    borderRadius: 18,
    cursor: "pointer",
    width: "100%",
    transition: "background .2s, border-color .2s, transform .2s",
    color: "inherit",
  },
  phaseTag: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.15em",
    textTransform: "uppercase" as const,
  },
  cardTitle: {
    margin: "4px 0 2px",
    fontSize: 20,
    fontWeight: 700,
    letterSpacing: "-0.02em",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  cardIcon: {
    fontSize: 20,
  },
  cardDesc: {
    margin: 0,
    fontSize: 13,
    color: "#707090",
    lineHeight: 1.5,
  },
  openBtn: {
    display: "inline-block",
    marginTop: 10,
    padding: "6px 14px",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.02em",
    transition: "opacity .15s",
  },
};

const timelineCss = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');

  .timeline-page { box-sizing: border-box; }
  .timeline-page * { box-sizing: border-box; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .milestone-card {
    background: rgba(255,255,255,.03) !important;
  }
  .milestone-card:hover {
    background: rgba(255,255,255,.06) !important;
    border-color: rgba(255,255,255,.14) !important;
    transform: translateY(-2px) !important;
  }
  .milestone-node:hover {
    transform: scale(1.15) !important;
  }
`;

// ─── Panel Styles ─────────────────────────────────────────────────────────────
const panelStyles: Record<string, React.CSSProperties> = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.7)",
    backdropFilter: "blur(4px)",
    zIndex: 40,
    animation: "fadeIn .2s ease",
  },
  panel: {
    position: "fixed",
    top: 0,
    right: 0,
    bottom: 0,
    width: "min(480px, 100vw)",
    background: "#0f0f1a",
    borderLeft: "1px solid rgba(255,255,255,.08)",
    zIndex: 50,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    animation: "slideIn .3s cubic-bezier(.4,0,.2,1)",
  },
  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "28px 28px 20px",
    borderBottom: "1px solid",
    flexShrink: 0,
  },
  phase: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.15em",
    textTransform: "uppercase" as const,
    display: "block",
    marginBottom: 4,
  },
  panelTitle: {
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: "-0.02em",
    color: "#f0f0ff",
    margin: "0 0 4px",
  },
  panelDesc: {
    fontSize: 13,
    color: "#606078",
    lineHeight: 1.5,
    maxWidth: 320,
  },
  closeBtn: {
    background: "rgba(255,255,255,.06)",
    border: "1px solid rgba(255,255,255,.1)",
    borderRadius: 8,
    color: "#888",
    fontSize: 14,
    width: 32,
    height: 32,
    cursor: "pointer",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
    transition: "background .15s, color .15s",
  },
  progressWrap: {
    padding: "16px 28px",
    borderBottom: "1px solid rgba(255,255,255,.05)",
    flexShrink: 0,
  },
  progressMeta: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: { fontSize: 12, color: "#555570" },
  progressPct: { fontSize: 12, fontWeight: 700 },
  progressTrack: {
    height: 5,
    borderRadius: 99,
    background: "rgba(255,255,255,.06)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 99,
  },
  body: {
    flex: 1,
    overflowY: "auto",
    padding: "16px 28px 28px",
  },
  group: {
    marginBottom: 24,
  },
  groupLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.15em",
    textTransform: "uppercase" as const,
    color: "#3c3c58",
    marginBottom: 8,
    paddingLeft: 2,
  },
  list: {
    listStyle: "none",
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,.05)",
    background: "rgba(255,255,255,.02)",
    cursor: "pointer",
    userSelect: "none" as const,
    animation: "fadeUp .3s ease both",
    transition: "background .15s, border-color .15s",
  },
  checkbox: {
    flexShrink: 0,
    width: 18,
    height: 18,
    borderRadius: 5,
    border: "1.5px solid rgba(255,255,255,.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background .2s, border-color .2s",
  },
  checkIcon: { width: 11, height: 9 },
  itemLabel: {
    fontSize: 14,
    color: "#c0c0d8",
    lineHeight: 1.4,
    transition: "color .2s",
  },
  itemDone: {
    color: "#3a3a54",
    textDecoration: "line-through",
  },
  allDone: {
    marginTop: 8,
    padding: "14px 18px",
    borderRadius: 12,
    border: "1px solid",
    fontSize: 14,
    fontWeight: 500,
    background: "rgba(255,255,255,.02)",
    animation: "fadeUp .4s ease both",
    textAlign: "center" as const,
  },
};

const panelCss = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes slideIn {
    from { transform: translateX(100%); }
    to   { transform: translateX(0); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .task-row:hover {
    background: rgba(255,255,255,.05) !important;
    border-color: rgba(255,255,255,.1) !important;
  }
  .checklist-panel::-webkit-scrollbar { width: 4px; }
  .checklist-panel::-webkit-scrollbar-track { background: transparent; }
  .checklist-panel::-webkit-scrollbar-thumb { background: #2a2a44; border-radius: 4px; }
`;
