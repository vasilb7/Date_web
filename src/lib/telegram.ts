export const getTelegramConfig = () => {
  const envProcess = typeof globalThis !== "undefined" ? (globalThis as any).process : undefined;
  const token =
    envProcess?.env?.TELEGRAM_BOT_TOKEN ||
    import.meta.env.TELEGRAM_BOT_TOKEN ||
    "8638109260:AAHvL68HYUgzVAEbFpo_nOFJ2O4I5mk2y8o";

  const chatId =
    envProcess?.env?.TELEGRAM_CHAT_ID ||
    import.meta.env.TELEGRAM_CHAT_ID ||
    "-1003974171920";

  return { token, chatId };
};

export async function sendTelegramNotification(
  message: string,
  parseMode: "HTML" | "Markdown" = "HTML"
): Promise<boolean> {
  try {
    const { token, chatId } = getTelegramConfig();
    if (!token || !chatId) {
      console.warn("Telegram bot token or chat ID is missing");
      return false;
    }

    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: parseMode,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Telegram API response error:", errorText);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Failed to send Telegram notification:", err);
    return false;
  }
}

export async function notifyInviteSubmission(invite: {
  name?: string | null;
  phone?: string | null;
  place?: string | null;
  date?: string | null;
  time?: string | null;
  special_wish?: string | null;
}) {
  const lines = [
    `💌 <b>Нов потвърден отговор за среща!</b>`,
    ``,
    `👤 <b>Име:</b> ${invite.name || "Не е посочено"}`,
    `📞 <b>Телефон:</b> ${invite.phone || "Не е посочен"}`,
    `📍 <b>Място:</b> ${invite.place || "Не е избрано"}`,
    `📅 <b>Дата:</b> ${invite.date || "Не е избрана"}`,
    `⏰ <b>Час:</b> ${invite.time || "Не е избран"}`,
  ];

  if (invite.special_wish) {
    lines.push(`✨ <b>Специално желание:</b> ${invite.special_wish}`);
  }

  const nowFormatted = new Date().toLocaleString("bg-BG", {
    timeZone: "Europe/Sofia",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  lines.push(``);
  lines.push(`🕒 <i>Записано на: ${nowFormatted}</i>`);

  return sendTelegramNotification(lines.join("\n"));
}

export async function notifyVisitorEnter(visitor: {
  ip?: string;
  device?: string;
  browser?: string;
  os?: string;
  currentPage?: string;
  referrer?: string | null;
}) {
  const lines = [
    `👀 <b>Ново посещение в сайта!</b>`,
    ``,
    `📱 <b>Устройство:</b> ${visitor.device || "Неизвестно"} (${visitor.os || "OS"}, ${visitor.browser || "Browser"})`,
    `🌐 <b>Страница:</b> ${visitor.currentPage || "/"}`,
  ];

  if (visitor.referrer) {
    lines.push(`🔗 <b>Източник:</b> ${visitor.referrer}`);
  }

  const nowFormatted = new Date().toLocaleString("bg-BG", {
    timeZone: "Europe/Sofia",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  lines.push(`🕒 <i>Време: ${nowFormatted}</i>`);

  return sendTelegramNotification(lines.join("\n"));
}
