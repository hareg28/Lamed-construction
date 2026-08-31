/**
 * Telegram Bot API helper.
 * Requires env vars:
 *   TELEGRAM_BOT_TOKEN  - your bot token from @BotFather
 *   TELEGRAM_CHAT_ID    - the chat / group / channel ID to send to
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const TELEGRAM_API = BOT_TOKEN
  ? `https://api.telegram.org/bot${BOT_TOKEN}`
  : null;

export interface InquiryPayload {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
}

function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, (c) => `\\${c}`);
}

function buildMessage(inquiry: InquiryPayload): string {
  const lines: string[] = [
    `📬 *New Contact Inquiry*`,
    ``,
    `👤 *Name:* ${escapeMarkdown(inquiry.name)}`,
    `📧 *Email:* ${escapeMarkdown(inquiry.email)}`,
  ];

  if (inquiry.phone) {
    lines.push(`📱 *Phone:* ${escapeMarkdown(inquiry.phone)}`);
  }

  if (inquiry.service) {
    lines.push(`🏗 *Service:* ${escapeMarkdown(inquiry.service)}`);
  }

  lines.push(``, `💬 *Message:*`, escapeMarkdown(inquiry.message));
  lines.push(``, `🕒 ${escapeMarkdown(new Date().toLocaleString('en-ET', { timeZone: 'Africa/Addis_Ababa' }))}`);

  return lines.join('\n');
}

export async function sendTelegramNotification(inquiry: InquiryPayload): Promise<void> {
  if (!TELEGRAM_API || !CHAT_ID) {
    // Silently skip if not configured — dev/test environments
    console.warn('[Telegram] BOT_TOKEN or CHAT_ID not set, skipping notification.');
    return;
  }

  try {
    const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: buildMessage(inquiry),
        parse_mode: 'MarkdownV2',
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[Telegram] sendMessage failed:', err);
    }
  } catch (err) {
    // Never let a Telegram failure break the contact form
    console.error('[Telegram] Network error:', err);
  }
}
