# WAPulse — Advanced WhatsApp Business Messaging Platform

A full-stack, AI-powered WhatsApp Business API platform — a self-hosted alternative to Interakt / Gupshup / WATI, built with Next.js.

![Stack](https://img.shields.io/badge/Next.js-16-black) ![Prisma](https://img.shields.io/badge/Prisma-6-2D3748) ![Tailwind](https://img.shields.io/badge/Tailwind-4-38BDF8) ![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

| Module | What it does |
| --- | --- |
| **Team Inbox** | Shared multi-agent inbox: delivery/read ticks, sentiment flags, labels, conversation search, resolve/reopen, assignee management |
| **Quick Replies** | Canned responses — type `/shortcut` in the composer for instant insertion |
| **Private Notes** | Internal team notes inside conversations, never sent to the customer |
| **AI Agent** | Auto-replies using OpenAI (optional) or the built-in intent engine — per-conversation on/off toggle |
| **AI Copilot** | One-click smart reply suggestions for agents, sentiment detection on every inbound message |
| **Chatbot Flows** | Visual multi-step button-based journeys with keyword triggers and branch navigation |
| **Team & Auto-assignment** | Agents with roles, round-robin assignment to the least-loaded agent, per-agent performance metrics |
| **Working Hours** | Business hours per weekday with automatic away messages outside hours |
| **Broadcast Campaigns** | Tag-based audience targeting, **scheduling**, **retargeting (read-not-replied)** and a sent → delivered → read → replied funnel |
| **Template Manager** | Templates with **media headers (image/video/doc)**, variables (`{{1}}`), URL/phone/quick-reply buttons — live WhatsApp-style preview |
| **Automation Rules** | Keyword auto-replies, welcome messages and AI fallback with priority ordering and hit analytics |
| **Commerce** | Product catalog, WhatsApp orders with auto-generated payment links, order lifecycle (pending → paid → shipped) |
| **Contacts CRM** | Tags, opt-in management, **CSV import/export**, search |
| **Web Widget** | Website chat button generator, wa.me click-to-chat links and QR codes |
| **Developer API** | Gupshup-style public REST API (`POST /api/v1/messages`) with API key management |
| **Outgoing Webhooks** | Push events (message.received, order.paid, campaign.completed…) to Zapier/n8n/your backend |
| **Analytics** | Message volume timeline, delivery/read rates, AI-handled count, negative sentiment alerts, agent performance |
| **WhatsApp Cloud API** | Native Meta Graph API v21 integration: text, template & interactive messages, webhook receiver with status updates |
| **Demo Mode** | The entire product works without a Meta account — sends are simulated with realistic delivery/read receipts |

## 🚀 Quick start

```bash
npm install
npm run setup    # creates SQLite DB + seeds demo data
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll land on a dashboard pre-loaded with demo conversations, campaigns and templates.

### Try it out

1. Open **Team Inbox** → pick any conversation
2. Use the amber "simulate a customer message" box:
   - type `menu` → the **chatbot flow** kicks in with buttons (reply with a button text like `Browse products` to navigate)
   - type `what is the price?` → keyword automation answers
   - type anything else → the **AI agent** replies
3. Type `/` in the composer to use **quick replies**, or hit the 📝 icon for a **private note**
4. In **Commerce**, create an order — the payment link is sent on WhatsApp automatically

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
