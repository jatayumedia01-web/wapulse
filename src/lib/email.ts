/**
 * Email sending via Resend. Falls back to console log in demo mode.
 */

const RESEND_KEY = process.env.RESEND_API_KEY ?? "";
const FROM = process.env.EMAIL_FROM ?? "WAPulse <noreply@wapulse.io>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

async function send(to: string, subject: string, html: string) {
  if (!RESEND_KEY) {
    console.log(`[EMAIL DEMO] To: ${to}\nSubject: ${subject}\nBody: ${html.replace(/<[^>]+>/g, " ")}`);
    return;
  }
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to, subject, html }),
  });
}

export async function sendVerifyEmail(to: string, name: string, token: string) {
  const url = `${APP_URL}/auth/verify-email?token=${token}`;
  await send(to, "Verify your WAPulse account", `
    <h2>Welcome to WAPulse, ${name}!</h2>
    <p>Click the button below to verify your email and activate your account.</p>
    <a href="${url}" style="display:inline-block;background:#10b981;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Verify Email</a>
    <p style="color:#888;font-size:12px;">Link expires in 24 hours. If you didn't create an account, ignore this email.</p>
  `);
}

export async function sendPasswordResetEmail(to: string, name: string, token: string) {
  const url = `${APP_URL}/auth/reset-password?token=${token}`;
  await send(to, "Reset your WAPulse password", `
    <h2>Password Reset Request</h2>
    <p>Hi ${name}, click the button below to reset your password.</p>
    <a href="${url}" style="display:inline-block;background:#6366f1;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Reset Password</a>
    <p style="color:#888;font-size:12px;">Link expires in 1 hour. If you didn't request this, ignore this email.</p>
  `);
}

export async function sendWelcomeEmail(to: string, name: string, orgName: string) {
  await send(to, `Welcome to WAPulse — ${orgName} is live!`, `
    <h2>You're all set, ${name}! 🎉</h2>
    <p>Your WAPulse workspace <strong>${orgName}</strong> is ready. Connect your WhatsApp Business number and start messaging your customers.</p>
    <a href="${APP_URL}/onboarding/connect-whatsapp" style="display:inline-block;background:#10b981;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Set up WhatsApp</a>
  `);
}

export async function sendInvitationEmail(to: string, orgName: string, inviterName: string, token: string) {
  const url = `${APP_URL}/auth/accept-invite?token=${token}`;
  await send(to, `You're invited to join ${orgName} on WAPulse`, `
    <h2>You've been invited!</h2>
    <p><strong>${inviterName}</strong> has invited you to join <strong>${orgName}</strong> on WAPulse — the WhatsApp Business platform.</p>
    <a href="${url}" style="display:inline-block;background:#10b981;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Accept Invitation</a>
    <p style="color:#888;font-size:12px;">This invitation expires in 7 days.</p>
  `);
}

export async function sendUsageWarningEmail(to: string, name: string, resource: string, pct: number) {
  await send(to, `WAPulse: ${resource} usage at ${pct}%`, `
    <h2>Usage Alert</h2>
    <p>Hi ${name}, your <strong>${resource}</strong> usage has reached <strong>${pct}%</strong> of your plan limit.</p>
    <p>Upgrade your plan to avoid interruptions.</p>
    <a href="${APP_URL}/billing" style="display:inline-block;background:#f59e0b;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Upgrade Plan</a>
  `);
}
