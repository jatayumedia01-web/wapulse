import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const HOURS = 60 * 60 * 1000;
const ago = (h: number) => new Date(Date.now() - h * HOURS);

async function main() {
  // ── 1. Organisation ─────────────────────────────────────────────
  const org = await prisma.organization.upsert({
    where: { slug: "demo-org" },
    create: {
      name: "Demo Business",
      slug: "demo-org",
      plan: "GROWTH",
    },
    update: {},
  });

  // ── 1b. Settings ─────────────────────────────────────────────────
  await prisma.setting.upsert({
    where: { orgId: org.id },
    create: {
      orgId: org.id,
      businessName: "Demo Business",
      verifyToken: "wp_demo_verify",
      demoMode: true,
      onboarded: true,
      phoneNumberId: "DEMO_PHONE_ID",
      wabaId: "DEMO_WABA_ID",
      accessToken: "DEMO_ACCESS_TOKEN",
      aiPersona: "You are a friendly, concise customer support agent for Demo Business.",
      awayMessage: "Thanks for reaching out! We'll reply within business hours.",
    },
    update: { onboarded: true },
  });

  // ── 1c. Subscription ─────────────────────────────────────────────
  const existingSub = await prisma.subscription.findFirst({ where: { orgId: org.id } });
  if (!existingSub) {
    await prisma.subscription.create({
      data: {
        orgId: org.id,
        plan: "GROWTH",
        status: "ACTIVE",
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 3600 * 1000),
      },
    });
  }

  // ── 2. Admin user ────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash("admin1234", 12);
  const adminUser = await prisma.user.upsert({
    where: { orgId_email: { orgId: org.id, email: "admin@wapulse.app" } },
    create: {
      orgId: org.id,
      name: "Admin User",
      email: "admin@wapulse.app",
      passwordHash,
      role: "ADMIN",
      emailVerified: true,
    },
    update: {},
  });
  console.log("Admin user:", adminUser.id);

  // ── 3. Contacts ───────────────────────────────────────────────────
  const contactsData = [
    { phone: "919876543210", name: "Ravi Kumar", email: "ravi@example.com", tags: "vip,repeat-buyer" },
    { phone: "919812345678", name: "Sneha Reddy", email: "sneha@example.com", tags: "lead" },
    { phone: "917702345678", name: "Arjun Mehta", email: "arjun@example.com", tags: "vip" },
    { phone: "918885551234", name: "Priya Sharma", email: "priya@example.com", tags: "lead,webinar" },
    { phone: "919998887776", name: "Vikram Singh", email: null, tags: "repeat-buyer" },
    { phone: "917013579246", name: "Lakshmi Devi", email: "lakshmi@example.com", tags: "support" },
    { phone: "919445566778", name: "Mohammed Irfan", email: null, tags: "lead" },
    { phone: "918123456789", name: "Ananya Iyer", email: "ananya@example.com", tags: "vip,webinar" },
  ];
  const contacts = [];
  for (const c of contactsData) {
    contacts.push(await prisma.contact.upsert({
      where: { orgId_phone: { orgId: org.id, phone: c.phone } },
      create: { ...c, orgId: org.id },
      update: {},
    }));
  }

  // ── 4. Templates ──────────────────────────────────────────────────
  const templatesData = [
    {
      name: "order_confirmation", category: "UTILITY", header: "Order Confirmed ✅",
      body: "Hi {{1}}, your order {{2}} has been confirmed! Expected delivery: {{3}}.",
      footer: "Demo Business", buttons: JSON.stringify([{ type: "URL", text: "Track Order" }]), status: "APPROVED",
    },
    {
      name: "festive_sale_offer", category: "MARKETING", header: "🎉 Festive Sale is LIVE",
      body: "Hi {{1}}! Get flat 40% OFF on everything this week. Use code FEST40 at checkout.",
      status: "APPROVED",
    },
    {
      name: "appointment_reminder", category: "UTILITY",
      body: "Hello {{1}}, this is a reminder about your appointment on {{2}} at {{3}}.",
      buttons: JSON.stringify([{ type: "QUICK_REPLY", text: "Confirm" }, { type: "QUICK_REPLY", text: "Reschedule" }]),
      status: "APPROVED",
    },
    {
      name: "payment_link", category: "UTILITY", header: "💳 Payment Due",
      body: "Hi {{1}}, your payment of ₹{{2}} is due. Click below to pay securely.",
      buttons: JSON.stringify([{ type: "URL", text: "Pay Now" }]), status: "APPROVED",
    },
    {
      name: "welcome_message", category: "MARKETING", header: "Welcome! 🎉",
      body: "Hi {{1}}! Welcome to Demo Business. We're thrilled to have you! Reply 'HELP' for assistance.",
      status: "APPROVED",
    },
  ];
  const templates = [];
  for (const t of templatesData) {
    templates.push(await prisma.template.upsert({
      where: { orgId_name: { orgId: org.id, name: t.name } },
      create: { ...t, orgId: org.id },
      update: {},
    }));
  }

  // ── 5. Conversations & messages ───────────────────────────────────
  const existingConvos = await prisma.conversation.count({ where: { orgId: org.id } });
  if (existingConvos === 0) {
    const convoData = [
      { contactIdx: 0, status: "OPEN",     assignee: "Priya S.", labels: "vip,urgent", msgs: [
        { dir: "IN",  body: "Hi! I placed order #1234 but haven't received any updates.", ago: 5 },
        { dir: "OUT", body: "Hi Ravi! Let me check on that for you right away.", ago: 4.5, author: "Priya S." },
        { dir: "IN",  body: "Sure, it's 12 Main St, Bangalore 560001", ago: 4 },
        { dir: "OUT", body: "Got it! Your order is out for delivery today.", ago: 3.5, author: "Priya S." },
      ]},
      { contactIdx: 1, status: "PENDING",  assignee: "Rahul M.", labels: "lead", msgs: [
        { dir: "IN",  body: "I saw your festive sale ad. What products are included?", ago: 2 },
        { dir: "OUT", body: "Hi Sneha! Our entire catalogue is 40% off this week.", ago: 1.8, author: "Rahul M." },
        { dir: "IN",  body: "Yes please!", ago: 1.5 },
      ]},
      { contactIdx: 2, status: "RESOLVED", assignee: "Priya S.", labels: "vip", msgs: [
        { dir: "IN",  body: "Can I get an invoice for my last purchase?", ago: 24 },
        { dir: "OUT", body: "Of course Arjun! I'll email it to you right now.", ago: 23, author: "Priya S." },
        { dir: "IN",  body: "Thank you! Got it.", ago: 22 },
      ]},
      { contactIdx: 3, status: "OPEN", msgs: [
        { dir: "IN",  body: "How do I register for the upcoming webinar?", ago: 1 },
      ]},
      { contactIdx: 4, status: "OPEN", msgs: [
        { dir: "IN",  body: "Is the blue hoodie available in XL?", ago: 0.5 },
      ]},
    ];
    for (const c of convoData) {
      const contact = contacts[c.contactIdx];
      const convo = await prisma.conversation.create({
        data: { orgId: org.id, contactId: contact.id, status: c.status ?? "OPEN", assignee: c.assignee ?? null, labels: c.labels ?? "", lastMessageAt: ago(0.1) },
      });
      for (const m of c.msgs ?? []) {
        const msgAuthor = (m as { author?: string }).author;
        await prisma.message.create({
          data: { conversationId: convo.id, direction: m.dir, body: m.body, author: m.dir === "OUT" ? (msgAuthor ?? "Bot") : null, status: "READ", createdAt: ago(m.ago) },
        });
      }
    }
  }

  // ── 6. Campaigns ──────────────────────────────────────────────────
  const existingCampaigns = await prisma.campaign.count({ where: { orgId: org.id } });
  if (existingCampaigns === 0) {
    const campaignsData = [
      { name: "Festive Sale Blast",    templateIdx: 1, audienceTag: "vip",          status: "COMPLETED", total: 450, sent: 450, delivered: 438, read: 312, replied: 67, failed: 12 },
      { name: "Appointment Reminders", templateIdx: 2, audienceTag: "",             status: "COMPLETED", total: 120, sent: 120, delivered: 118, read: 98,  replied: 23, failed: 2  },
      { name: "Payment Recovery",      templateIdx: 3, audienceTag: "lead",         status: "RUNNING",   total: 200, sent: 180, delivered: 175, read: 90,  replied: 15, failed: 5  },
      { name: "New Year Campaign",     templateIdx: 4, audienceTag: "repeat-buyer", status: "SCHEDULED", scheduledAt: new Date(Date.now() + 2 * 24 * 3600 * 1000), total: 600 },
    ];
    for (const c of campaignsData) {
      const { templateIdx, ...rest } = c;
      await prisma.campaign.create({ data: { ...rest, orgId: org.id, templateId: templates[templateIdx].id } });
    }
  }

  // ── 7. Automation Rules ───────────────────────────────────────────
  const existingRules = await prisma.automationRule.count({ where: { orgId: org.id } });
  if (existingRules === 0) {
    const rules = [
      { name: "Help Keyword",   trigger: "KEYWORD", keywords: "help,support,assist", reply: "Hi! I'm here to help. Type:\n1️⃣ Order status\n2️⃣ Returns\n3️⃣ Talk to agent", hits: 234 },
      { name: "Price Inquiry",  trigger: "KEYWORD", keywords: "price,cost,rate,pricing", reply: "Check our latest pricing at https://demo.wapulse.app/pricing 🏷️", hits: 89 },
      { name: "Hours Inquiry",  trigger: "KEYWORD", keywords: "timing,hours,open,close", reply: "We're open Mon–Sat, 9 AM to 7 PM IST.", hits: 45 },
    ];
    for (const r of rules) {
      await prisma.automationRule.create({ data: { ...r, orgId: org.id } });
    }
  }

  // ── 8. Quick Replies ──────────────────────────────────────────────
  const qrs = [
    { shortcut: "/thanks", body: "Thank you for reaching out! Is there anything else I can help you with? 😊" },
    { shortcut: "/hours",  body: "Our business hours are Monday–Saturday, 9 AM to 7 PM IST." },
    { shortcut: "/refund", body: "I'll process your refund right away! It will reflect in 5–7 business days." },
    { shortcut: "/track",  body: "You can track your order at https://demo.wapulse.app/track" },
  ];
  for (const q of qrs) {
    await prisma.quickReply.upsert({
      where: { orgId_shortcut: { orgId: org.id, shortcut: q.shortcut } },
      create: { ...q, orgId: org.id },
      update: {},
    });
  }

  // ── 9. Team Members ───────────────────────────────────────────────
  const team = [
    { name: "Priya Sharma", email: "priya@demo.app", role: "ADMIN" },
    { name: "Rahul Mehta",  email: "rahul@demo.app", role: "AGENT" },
    { name: "Kavita Nair",  email: "kavita@demo.app", role: "AGENT" },
  ];
  for (const t of team) {
    await prisma.teamMember.upsert({
      where: { orgId_email: { orgId: org.id, email: t.email } },
      create: { ...t, orgId: org.id },
      update: {},
    });
  }

  // ── 10. Products ──────────────────────────────────────────────────
  const existingProducts = await prisma.product.count({ where: { orgId: org.id } });
  if (existingProducts === 0) {
    const products = [
      { name: "Premium Hoodie", price: 1499, currency: "INR", sku: "HOD-001", inStock: true },
      { name: "Casual T-Shirt",  price: 699,  currency: "INR", sku: "TSH-002", inStock: true },
      { name: "Denim Jeans",     price: 2499, currency: "INR", sku: "JNS-003", inStock: false },
      { name: "Winter Jacket",   price: 3999, currency: "INR", sku: "JKT-004", inStock: true },
    ];
    for (const p of products) {
      await prisma.product.create({ data: { ...p, orgId: org.id } });
    }
  }

  // ── 11. Drip Sequence ─────────────────────────────────────────────
  const existingDrip = await prisma.dripSequence.count({ where: { orgId: org.id } });
  if (existingDrip === 0) {
    await prisma.dripSequence.create({
      data: {
        orgId: org.id, name: "New Lead Nurture", triggerType: "TAG", triggerTag: "lead", enabled: true,
        steps: { create: [
          { stepNumber: 1, message: "Hey {{name}}! Thanks for showing interest.", delayValue: 0,  delayUnit: "hours" },
          { stepNumber: 2, message: "Hi {{name}}, did you get a chance to explore?",   delayValue: 24, delayUnit: "hours" },
          { stepNumber: 3, message: "Last chance! Our special offer expires soon.",     delayValue: 48, delayUnit: "hours" },
        ]},
      },
    });
  }

  // ── 12. Custom Fields ─────────────────────────────────────────────
  const cfields = [
    { name: "Lead Score", key: "lead_score", type: "number" },
    { name: "City",       key: "city",       type: "text" },
    { name: "Industry",   key: "industry",   type: "select", options: JSON.stringify(["Retail", "Healthcare", "Education", "Finance", "Other"]) },
    { name: "Birthday",   key: "birthday",   type: "date" },
  ];
  for (const cf of cfields) {
    await prisma.customField.upsert({
      where: { orgId_key: { orgId: org.id, key: cf.key } },
      create: { ...cf, orgId: org.id },
      update: {},
    });
  }

  // ── 13. Usage Log ─────────────────────────────────────────────────
  const month = new Date().toISOString().slice(0, 7);
  await prisma.usageLog.upsert({
    where: { orgId_month: { orgId: org.id, month } },
    create: { orgId: org.id, month, contacts: 8, messagesSent: 1240, campaigns: 4, apiCalls: 320 },
    update: {},
  });

  // ── 14. Sample Form ───────────────────────────────────────────────
  const existingForms = await prisma.form.count({ where: { orgId: org.id } });
  if (existingForms === 0) {
    await prisma.form.create({
      data: {
        orgId: org.id,
        name: "Lead Qualification Form",
        description: "Collect basic info from new leads",
        fields: JSON.stringify([
          { id: "f1", label: "Your Name",    type: "text",   required: true },
          { id: "f2", label: "Business Type", type: "select", required: true, options: ["D2C", "Service", "SaaS", "Other"] },
          { id: "f3", label: "Team Size",    type: "number", required: false },
        ]),
        enabled: true,
      },
    });
  }

  console.log("✅ Seed complete.");
  console.log("🔑 Login: admin@wapulse.app / admin1234");
}

main().catch(console.error).finally(() => prisma.$disconnect());
