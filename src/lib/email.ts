/**
 * Email notification helper (SMTP via fetch-compatible providers).
 * Supports Resend API (recommended) or any SMTP via nodemailer when installed.
 *
 * Resend env vars:
 *   RESEND_API_KEY       - API key from resend.com
 *   CONTACT_EMAIL_TO     - recipient inbox
 *   CONTACT_EMAIL_FROM   - verified sender (e.g. onboarding@resend.dev for testing)
 *
 * SMTP env vars (alternative — requires nodemailer):
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_EMAIL_TO, CONTACT_EMAIL_FROM
 */

import type { InquiryPayload } from './telegram';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_EMAIL_TO = process.env.CONTACT_EMAIL_TO;
const CONTACT_EMAIL_FROM = process.env.CONTACT_EMAIL_FROM || 'onboarding@resend.dev';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildPlainText(inquiry: InquiryPayload): string {
  const lines = [
    'New Contact Inquiry',
    '',
    `Name: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
  ];

  if (inquiry.phone) lines.push(`Phone: ${inquiry.phone}`);
  if (inquiry.service) lines.push(`Service: ${inquiry.service}`);

  lines.push('', 'Message:', inquiry.message);
  lines.push(
    '',
    `Submitted: ${new Date().toLocaleString('en-ET', { timeZone: 'Africa/Addis_Ababa' })}`
  );

  return lines.join('\n');
}

function buildHtml(inquiry: InquiryPayload): string {
  const rows = [
    `<tr><td style="padding:8px 12px;font-weight:bold;color:#334155;">Name</td><td style="padding:8px 12px;">${escapeHtml(inquiry.name)}</td></tr>`,
    `<tr><td style="padding:8px 12px;font-weight:bold;color:#334155;">Email</td><td style="padding:8px 12px;"><a href="mailto:${escapeHtml(inquiry.email)}">${escapeHtml(inquiry.email)}</a></td></tr>`,
  ];

  if (inquiry.phone) {
    rows.push(
      `<tr><td style="padding:8px 12px;font-weight:bold;color:#334155;">Phone</td><td style="padding:8px 12px;">${escapeHtml(inquiry.phone)}</td></tr>`
    );
  }

  if (inquiry.service) {
    rows.push(
      `<tr><td style="padding:8px 12px;font-weight:bold;color:#334155;">Service</td><td style="padding:8px 12px;">${escapeHtml(inquiry.service)}</td></tr>`
    );
  }

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#0f172a;margin-bottom:16px;">New Contact Inquiry</h2>
      <table style="width:100%;border-collapse:collapse;background:#f8fafc;border-radius:8px;">
        ${rows.join('')}
      </table>
      <div style="margin-top:20px;padding:16px;background:#ecfdf5;border-left:4px solid #10b981;border-radius:4px;">
        <p style="margin:0 0 8px;font-weight:bold;color:#334155;">Message</p>
        <p style="margin:0;white-space:pre-wrap;color:#1e293b;">${escapeHtml(inquiry.message)}</p>
      </div>
      <p style="margin-top:20px;font-size:12px;color:#64748b;">
        Submitted ${escapeHtml(new Date().toLocaleString('en-ET', { timeZone: 'Africa/Addis_Ababa' }))}
      </p>
    </div>
  `.trim();
}

async function sendViaResend(inquiry: InquiryPayload): Promise<boolean> {
  if (!RESEND_API_KEY || !CONTACT_EMAIL_TO) return false;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `"Lamed Construction" <${CONTACT_EMAIL_FROM}>`,
      to: [CONTACT_EMAIL_TO],
      reply_to: inquiry.email,
      subject: `New Contact Inquiry from ${inquiry.name}`,
      text: buildPlainText(inquiry),
      html: buildHtml(inquiry),
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('[Email/Resend] send failed:', err);
    return false;
  }

  return true;
}

async function sendViaSmtp(inquiry: InquiryPayload): Promise<boolean> {
  const SMTP_HOST = process.env.SMTP_HOST;
  const SMTP_PORT = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const SMTP_USER = process.env.SMTP_USER;
  const SMTP_PASS = process.env.SMTP_PASS;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_EMAIL_TO) return false;

  try {
    // @ts-ignore
    const nodemailerModule = await import(/* webpackIgnore: true */ 'nodemailer');
    const nodemailer = nodemailerModule.default || nodemailerModule;
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    await transporter.sendMail({
      from: `"Lamed Construction" <${CONTACT_EMAIL_FROM || SMTP_USER}>`,
      to: CONTACT_EMAIL_TO,
      replyTo: inquiry.email,
      subject: `New Contact Inquiry from ${inquiry.name}`,
      text: buildPlainText(inquiry),
      html: buildHtml(inquiry),
    });

    return true;
  } catch (err) {
    if (err instanceof Error && (err.message.includes('Cannot find module') || (err as any).code === 'MODULE_NOT_FOUND')) {
      console.warn('[Email/SMTP] nodemailer is not installed. To use SMTP, run: npm install nodemailer');
      return false;
    }
    console.error('[Email/SMTP] send failed:', err);
    return false;
  }
}

export async function sendEmailNotification(inquiry: InquiryPayload): Promise<void> {
  const hasResend = Boolean(RESEND_API_KEY && CONTACT_EMAIL_TO);
  const hasSmtp = Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      CONTACT_EMAIL_TO
  );

  if (!hasResend && !hasSmtp) {
    console.warn('[Email] No email provider configured (Resend or SMTP). Skipping notification.');
    return;
  }

  try {
    if (hasResend) {
      await sendViaResend(inquiry);
    } else {
      await sendViaSmtp(inquiry);
    }
  } catch (err) {
    console.error('[Email] Network error:', err);
  }
}
