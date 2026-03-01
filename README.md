# StartUp — Pitch Coach for Founders

**StartUp** helps early-stage founders validate ideas and nail their pitch—whether at a hackathon, with an investor, or at a demo day. Record a 60-second pitch, get AI-powered feedback, and move from practice to outreach in one place.

Built for the **Warwick Finance Societies Fintech Hackathon** (Category 3: Solution for Startups).

---

## Why We Built This

Startups face a common problem: you get one shot to make an impression. Most founders underprepare. They wing it. They don’t know how they sound until it’s too late.

We built StartUp because we wanted a tool that actually helps founders *create* and *validate* their startups—not just pitch to investors. By recording, transcribing, and scoring pitches with AI, founders can:

- **Validate ideas** — See how clear and compelling their pitch sounds before they step on stage
- **Improve fast** — Get scores, red flags, and concrete advice on every recording
- **Practice for real events** — Use hackathon-specific categories and judging criteria
- **Move to outreach** — Access an investor directory and messaging when they’re ready

StartUp is the pitch coach and investor hub founders need before they ever walk into a room.

---

## Features

- **Create Account** — Register with name, product, description, and GitHub
- **Pitch Assessment** — Record a 60-second video pitch; AI transcribes and scores you on clarity, credibility, investor fit, your ask, and consistency
- **Hackathon Modes** — Practice for Warwick Fintech Hackathon categories:
  - **Data in Finance** — Tools using financial data for decision-making
  - **Financial Inclusion** — Apps that help people manage money and access financial services
  - **Solution for Startups** — Tools to aid with creating startups (our category)
- **Feedback & Progress** — Track scores over time, see red flags, and get actionable advice
- **Investor Directory** — Browse VCs by stage and focus (unlock with a strong pitch score)
- **Messages** — DM investors and manage conversations in-app

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/Cheekywnl/StartUp.git
cd StartUp
npm install
```

### 2. Add your OpenAI API key

StartUp uses OpenAI's Whisper API for pitch transcription and GPT for feedback. You need your own API key.

1. Get a key at [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create a `.env.local` file in the project root (copy from `.env.example` if needed)
3. Add your key:

```
OPENAI_API_KEY=sk-your-key-here
```

**Important:** Never commit `.env.local`—it's in `.gitignore`. Each developer needs their own key.

### 3. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---


## Hackathon Fit

StartUp aligns with **Category 3: Solution for Startups**:

## License

MIT
