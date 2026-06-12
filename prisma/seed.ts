import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const HOURS = 60 * 60 * 1000;
const ago = (h: number) => new Date(Date.now() - h * HOURS);

async function main() {
  await prisma.setting.upsert({ where: { id: 1 }, create: { id: 1 }, update: {} });

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
    contacts.push(await prisma.contact.upsert({ where: { phone: c.phone }, create: c, update: c }));
  }

  const templates = [
    {
      name: "order_confirmation",
      category: "UTILITY",
      header: "Order Confirmed ✅",
      body: "Hi {{1}}, your order {{2}} has been confirmed! Expected delivery: {{3}}. Track it anytime using the button below.",
      footer: "WAPulse Demo Business",
      buttons: JSON.stringify([{ type: "URL", text: "Track Order" }]),
      status: "APPROVED",
    },
    {
      name: "festive_sale_offer",
      category: "MARKETING",
      header: "🎉 Festive Sale is LIVE",
      body: "Hi {{1}}! Get flat 40% OFF on everything this week. Use code FEST40 at checkout. Offer ends Sunday midnight!",
      footer: "Reply STOP to opt out",
      buttons: JSON.stringify([{ type: "QUICK_REPLY", text: "Shop Now" }, { type: "QUICK_REPLY", text: "Not interested" }]),
      status: "APPROVED",
    },
    {
      name: "payment_reminder",
      category: "UTILITY",
      header: null,
      body: "Hi {{1}}, this is a gentle reminder that your invoice {{2}} of ₹{{3}} is due on {{4}}. Pay securely via the link below.",
      footer: null,
      buttons: JSON.stringify([{ type: "URL", text: "Pay Now" }]),
      status: "APPROVED",
    },
    {
      name: "otp_verification",
      category: "AUTHENTICATION",
      header: null,
      body: "{{1}} is your verification code. For your security, do not share this code.",
      footer: null,
      buttons: JSON.stringify([{ type: "OTP", text: "Copy Code" }]),
      status: "PENDING",
    },
  ];
  const createdTemplates = [];
  for (const t of templates) {
    createdTemplates.push(await prisma.template.upsert({ where: { name: t.name }, create: t, update: t }));
  }

  const rulesCount = await prisma.automationRule.count();
  if (rulesCount === 0) {
    await prisma.automationRule.createMany({
      data: [
        {
          name: "Welcome new customers",
          trigger: "WELCOME",
          reply: "Hi there! 👋 Welcome to WAPulse Demo Business. Ask me about pricing, orders or offers — I reply instantly!",
          priority: 10,
          hits: 42,
        },
        {
          name: "Pricing keyword",
          trigger: "KEYWORD",
          keywords: "price,pricing,cost,plans",
          reply: "Our plans start at ₹999/month (Starter) and ₹2,499/month (Growth). Want a detailed comparison? Just reply COMPARE.",
          priority: 5,
          hits: 128,
        },
        {
          name: "Order tracking keyword",
          trigger: "KEYWORD",
          keywords: "track,order status,where is my order",
          reply: "Please share your order ID (e.g. ORD-12345) and I'll fetch the live status for you. 📦",
          priority: 5,
          hits: 86,
        },
        {
          name: "AI Agent (fallback)",
          trigger: "AI_AGENT",
          reply: "",
          priority: 0,
          hits: 311,
        },
      ],
    });
  }

  const existingConversations = await prisma.conversation.count();
  if (existingConversations === 0) {
    const threads: Array<{ contactIdx: number; status: string; assignee: string | null; msgs: Array<[string, string, number, string?]> }> = [
      {
        contactIdx: 0,
        status: "OPEN",
        assignee: "Madhu",
        msgs: [
          ["IN", "Hi, I ordered a phone case last week. Order ORD-58211", 5],
          ["OUT", "Hi Ravi! Let me check ORD-58211 for you right away. 📦", 4.9],
          ["IN", "It was supposed to arrive yesterday but nothing yet. Very disappointed", 4.5, "negative"],
          ["OUT", "I'm really sorry about the delay, Ravi. Your package is out for delivery and will reach you by 6 PM today. I've also added a ₹100 credit to your account for the inconvenience.", 4.2],
          ["IN", "Okay thanks, I'll wait for it today", 1, "positive"],
        ],
      },
      {
        contactIdx: 1,
        status: "OPEN",
        assignee: null,
        msgs: [
          ["IN", "Hello! Saw your ad on Instagram. What are your pricing plans?", 3],
          ["OUT", "Hi Sneha! 👋 Our plans start at ₹999/month for Starter and ₹2,499/month for Growth (unlimited agents + automation). Want a detailed comparison?", 2.9],
          ["IN", "Growth plan sounds interesting. Does it include the AI chatbot?", 2.5],
        ],
      },
      {
        contactIdx: 2,
        status: "PENDING",
        assignee: "Madhu",
        msgs: [
          ["IN", "I need an invoice copy for my last purchase", 26],
          ["OUT", "Sure Arjun! I've emailed the invoice for order ORD-55102 to your registered email. Anything else?", 25.5],
          ["IN", "Got it, thank you so much! Great service as always 🙌", 25, "positive"],
        ],
      },
      {
        contactIdx: 3,
        status: "OPEN",
        assignee: null,
        msgs: [
          ["IN", "Is the webinar recording available?", 8],
        ],
      },
      {
        contactIdx: 5,
        status: "RESOLVED",
        assignee: "Priya",
        msgs: [
          ["IN", "My app login is not working, please help", 50, "negative"],
          ["OUT", "Hi Lakshmi, sorry about that! Please try resetting your password using the link I'm sending now.", 49.5],
          ["IN", "That worked. Thanks!", 49, "positive"],
          ["OUT", "Wonderful! Marking this as resolved. Have a great day! 😊", 48.8],
        ],
      },
    ];

    for (const t of threads) {
      const lastAt = ago(t.msgs[t.msgs.length - 1][2]);
      const conversation = await prisma.conversation.create({
        data: {
          contactId: contacts[t.contactIdx].id,
          status: t.status,
          assignee: t.assignee,
          unread: t.msgs[t.msgs.length - 1][0] === "IN" && t.status === "OPEN" ? 1 : 0,
          lastMessageAt: lastAt,
        },
      });
      for (const [direction, body, hoursAgo, sentiment] of t.msgs) {
        await prisma.message.create({
          data: {
            conversationId: conversation.id,
            direction,
            body,
            status: direction === "OUT" ? "READ" : "DELIVERED",
            sentiment: sentiment ?? (direction === "IN" ? "neutral" : null),
            createdAt: ago(hoursAgo),
          },
        });
      }
    }
  }

  const campaignCount = await prisma.campaign.count();
  if (campaignCount === 0) {
    await prisma.campaign.create({
      data: {
        name: "Festive Sale Blast",
        templateId: createdTemplates[1].id,
        audienceTag: "",
        status: "COMPLETED",
        total: 1250,
        sent: 1244,
        delivered: 1207,
        read: 989,
        replied: 178,
        failed: 6,
        createdAt: ago(72),
      },
    });
    await prisma.campaign.create({
      data: {
        name: "Payment Reminders — June",
        templateId: createdTemplates[2].id,
        audienceTag: "repeat-buyer",
        status: "COMPLETED",
        total: 320,
        sent: 318,
        delivered: 312,
        read: 290,
        replied: 95,
        failed: 2,
        createdAt: ago(30),
      },
    });
    await prisma.campaign.create({
      data: {
        name: "VIP Early Access",
        templateId: createdTemplates[1].id,
        audienceTag: "vip",
        status: "DRAFT",
      },
    });
  }

  if ((await prisma.teamMember.count()) === 0) {
    await prisma.teamMember.createMany({
      data: [
        { name: "Madhu", email: "madhu@wapulse.demo", role: "ADMIN" },
        { name: "Priya", email: "priya@wapulse.demo", role: "AGENT" },
        { name: "Kiran", email: "kiran@wapulse.demo", role: "AGENT" },
      ],
    });
  }

  if ((await prisma.quickReply.count()) === 0) {
    await prisma.quickReply.createMany({
      data: [
        { shortcut: "greeting", body: "Hi! 👋 Thanks for reaching out to us. How can I help you today?" },
        { shortcut: "pricing", body: "Our plans start at ₹999/month (Starter) and ₹2,499/month (Growth). Would you like a detailed comparison?" },
        { shortcut: "thanks", body: "Thank you for contacting us! Feel free to reach out anytime. Have a great day! 😊" },
        { shortcut: "hold", body: "Please give me a moment while I check this for you. 🙏" },
        { shortcut: "payment", body: "You can pay securely via UPI, cards or net banking using the payment link we share. Payments are processed instantly." },
      ],
    });
  }

  if ((await prisma.product.count()) === 0) {
    await prisma.product.createMany({
      data: [
        { name: "Wireless Earbuds Pro", description: "Active noise cancellation, 32h battery", price: 2999, sku: "EB-PRO-01" },
        { name: "Smart Fitness Band", description: "Heart rate, SpO2, 14-day battery", price: 1799, sku: "FB-SMART-02" },
        { name: "Power Bank 20000mAh", description: "65W fast charging, dual USB-C", price: 1499, sku: "PB-20K-03" },
        { name: "Bluetooth Speaker Mini", description: "IPX7 waterproof, 12h playtime", price: 999, sku: "SP-MINI-04" },
      ],
    });
  }

  if ((await prisma.flow.count()) === 0) {
    await prisma.flow.create({
      data: {
        name: "Main Menu",
        keywords: "menu, start, options",
        runs: 64,
        nodes: JSON.stringify([
          {
            id: "n1",
            message: "Welcome to WAPulse Demo Business! 👋 What would you like to do?",
            buttons: [
              { text: "Browse products", next: "n2" },
              { text: "Track my order", next: "n3" },
              { text: "Talk to an agent", next: "n4" },
            ],
          },
          {
            id: "n2",
            message: "Here are our bestsellers:\n\n1️⃣ Wireless Earbuds Pro — ₹2,999\n2️⃣ Smart Fitness Band — ₹1,799\n3️⃣ Power Bank 20000mAh — ₹1,499\n\nWant me to create an order for you?",
            buttons: [
              { text: "Yes, order now", next: "n4" },
              { text: "Back to menu", next: "n1" },
            ],
          },
          {
            id: "n3",
            message: "Please share your order ID (e.g. ORD-12345) and I'll fetch the live status for you. 📦",
            buttons: [],
          },
          {
            id: "n4",
            message: "Connecting you to our team — an agent will reply here shortly. 🙋",
            buttons: [],
          },
        ]),
      },
    });
  }

  // Drip sequence
  const existingDrip = await prisma.dripSequence.findFirst({ where: { name: "Post-Purchase Follow-up" } });
  if (!existingDrip) {
    const orderTemplate = await prisma.template.findUnique({ where: { name: "order_confirmation" } });
    const drip = await prisma.dripSequence.create({
      data: {
        name: "Post-Purchase Follow-up",
        triggerType: "EVENT",
        triggerEvent: "order.created",
        enabled: true,
      },
    });
    await prisma.dripStep.createMany({
      data: [
        { sequenceId: drip.id, stepNumber: 1, templateId: orderTemplate?.id ?? null, message: "Hi {{name}}, thank you for your purchase! 🎉 Your order is being processed.", delayValue: 0, delayUnit: "minutes" },
        { sequenceId: drip.id, stepNumber: 2, message: "Just checking in — your order has shipped and is on the way! 📦 Let us know if you need anything.", delayValue: 2, delayUnit: "days" },
        { sequenceId: drip.id, stepNumber: 3, message: "We hope you love your purchase! ⭐ Leave us a quick review — it means the world to us.", delayValue: 7, delayUnit: "days" },
      ],
    });
  }

  // Custom fields
  const customFieldDefs = [
    { name: "City", key: "city", type: "text", options: "[]" },
    { name: "Birthday", key: "birthday", type: "date", options: "[]" },
    { name: "Customer Tier", key: "customer_tier", type: "select", options: JSON.stringify(["Bronze", "Silver", "Gold", "Platinum"]) },
  ];
  for (const f of customFieldDefs) {
    await prisma.customField.upsert({ where: { key: f.key }, create: f, update: {} });
  }

  // Sample WhatsApp form
  const existingForm = await prisma.form.findFirst({ where: { name: "Lead Qualification" } });
  if (!existingForm) {
    await prisma.form.create({
      data: {
        name: "Lead Qualification",
        description: "Qualify inbound leads automatically",
        fields: JSON.stringify([
          { label: "Full Name", key: "name", type: "text", required: true },
          { label: "Email", key: "email", type: "email", required: false },
          { label: "Budget Range", key: "budget", type: "select", required: false },
          { label: "Interested In", key: "interest", type: "text", required: false },
        ]),
        enabled: true,
      },
    });
  }

  console.log("✅ Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
