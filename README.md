# WAPulse — Advanced WhatsApp Business Messaging Platform

A full-stack, AI-powered WhatsApp Business API platform — a self-hosted alternative to Interakt / Gupshup / WATI, built with Next.js.

![Stack](https://img.shields.io/badge/Next.js-16-black) ![Prisma](https://img.shields.io/badge/Prisma-6-2D3748) ![Tailwind](https://img.shields.io/badge/Tailwind-4-38BDF8) ![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

| Module | What it does |
| --- | --- |
| **Team Inbox** | Shared multi-agent inbox with real-time conversation view, delivery/read ticks, sentiment flags, resolve/reopen workflow |
| **AI Agent** | Auto-replies to customers using OpenAI (optional) or the built-in intent engine — per-conversation on/off toggle |
| **AI Copilot** | One-click smart reply suggestions for agents, sentiment detection on every inbound message |
| **Broadcast Campaigns** | Template campaigns with tag-based audience targeting and a sent → delivered → read → replied funnel |
| **Template Manager** | Create WhatsApp templates with headers, footers, variables (`{{1}}`) and buttons — with live WhatsApp-style preview |
| **Automation Rules** | Keyword auto-replies, welcome messages and AI fallback with priority ordering and hit analytics |
| **Developer API** | Gupshup-style public REST API (`POST /api/v1/messages`) with API key management |
| **Analytics** | Message volume timeline, delivery/read rates, AI-handled count, negative sentiment alerts |
| **WhatsApp Cloud API** | Native Meta Graph API v21 integration: text, template & interactive messages, webhook receiver with status updates |
| **Demo Mode** | The entire product works without a Meta account — sends are simulated with realistic delivery/read receipts |

## 🚀 Quick start

```bash
npm install
npm run setup    # creates SQLite DB + seeds demo data
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll land on a dashboard pre-loaded with demo conversations, campaigns and templates.

### Try the AI agent

1. Open **Team Inbox** → pick any conversation
2. Use the amber "simulate a customer message" box and type `what is the price?`
3. Watch the automation engine / AI agent reply instantly

## 🔌 Going live with Meta

1. Create a Meta App with the WhatsApp product and get your **Phone Number ID**, **WABA ID** and a **permanent access token**
2. Enter them in **Settings** and turn **Demo mode off**
3. Configure your webhook in the Meta dashboard:
   - Callback URL: `https://your-domain.com/api/webhook`
   - Verify token: the value from Settings (default `wapulse_verify`)
4. Subscribe to `messages` webhook fields

### Optional: GPT-powered replies

Add your OpenAI API key in **Settings → AI Agent**. Without a key, the built-in intent engine handles greetings, pricing, order tracking, refunds and handoff requests.

## 🧑‍💻 Developer API

```bash
# Generate a key in the Developer API page, then:
curl -X POST https://your-domain.com/api/v1/messages \
  -H "x-api-key: wap_YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"to": "919876543210", "type": "text", "text": "Hello from WAPulse!"}'
```

Template sends:

```json
{ "to": "919876543210", "type": "template", "template": "order_confirmation", "language": "en" }
```

## 🏗 Architecture

```
src/
├── app/(dashboard)/     # Dashboard, Inbox, Contacts, Campaigns, Templates, Automation, Developers, Settings
├── app/api/             # REST API routes (internal + public /api/v1)
│   └── webhook/         # Meta webhook: verification, inbound messages, status receipts
└── lib/
    ├── whatsapp.ts      # WhatsApp Cloud API client (Graph v21) with demo-mode simulation
    ├── ai.ts            # AI engine: OpenAI + built-in intents, suggestions, sentiment
    ├── automation.ts    # Inbound pipeline: keyword rules → AI agent fallback
    └── db.ts            # Prisma (SQLite) client
```

## 📦 Tech stack

- **Next.js 16** (App Router) + React 19 + TypeScript
- **Tailwind CSS 4** with a custom design system
- **Prisma 6** + SQLite (swap to Postgres by changing the datasource)
- **Recharts** for analytics, **Lucide** icons

## License

MIT
