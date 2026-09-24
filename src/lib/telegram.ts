const DEFAULT_TOKEN_PARTS = ["8638109260", "AAHvL68HYUgzVAEbFpo_nOFJ2O4I5mk2y8o"];
const DEFAULT_CHAT_ID = "-1003974171920";

export const getTelegramConfig = (runtimeEnv?: Record<string, any>) => {
  const envProcess = typeof globalThis !== "undefined" ? (globalThis as any).process : undefined;
  const globalEnv = typeof globalThis !== "undefined" ? (globalThis as any) : undefined;

  let token =
    runtimeEnv?.TELEGRAM_BOT_TOKEN ||
    envProcess?.env?.TELEGRAM_BOT_TOKEN ||
    globalEnv?.TELEGRAM_BOT_TOKEN ||
    import.meta.env.TELEGRAM_BOT_TOKEN;

  // Auto-correct in case token was saved with '0' (zero) instead of 'O'
  if (typeof token === "string" && token.includes("nOFJ204")) {
    token = token.replace("nOFJ204", "nOFJ2O4");
  }

  if (!token || typeof token !== "string" || !token.trim()) {
    token = DEFAULT_TOKEN_PARTS.join(":");
  }

  const chatId =
    runtimeEnv?.TELEGRAM_CHAT_ID ||
    envProcess?.env?.TELEGRAM_CHAT_ID ||
    globalEnv?.TELEGRAM_CHAT_ID ||
    import.meta.env.TELEGRAM_CHAT_ID ||
    DEFAULT_CHAT_ID;

  return { token: token.trim(), chatId: String(chatId).trim() };
};

export async function sendTelegramNotification(
  message: string,
  parseMode: "HTML" | "Markdown" = "HTML",
  runtimeEnv?: Record<string, any>
): Promise<boolean> {
  try {
    const { token, chatId } = getTelegramConfig(runtimeEnv);
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

export async function notifyInviteSubmission(
  invite: {
    name?: string | null;
    phone?: string | null;
    place?: string | null;
    date?: string | null;
    time?: string | null;
    special_wish?: string | null;
    ip?: string | null;
  },
  runtimeEnv?: Record<string, any>
) {
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

  if (invite.ip) {
    lines.push(`🌐 <b>IP адрес:</b> <code>${invite.ip}</code>`);
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

  return sendTelegramNotification(lines.join("\n"), "HTML", runtimeEnv);
}

export async function notifyVisitorEnter(
  visitor: {
    ip?: string;
    device?: string;
    browser?: string;
    os?: string;
    currentPage?: string;
    referrer?: string | null;
  },
  runtimeEnv?: Record<string, any>
) {
  const lines = [
    `👀 <b>Ново посещение в сайта!</b>`,
    ``,
    `🌐 <b>IP адрес:</b> <code>${visitor.ip || "Неизвестен"}</code>`,
    `📱 <b>Устройство:</b> ${visitor.device || "Неизвестно"} (${visitor.os || "OS"}, ${visitor.browser || "Browser"})`,
    `📄 <b>Начална страница:</b> ${visitor.currentPage || "/"}`,
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

  return sendTelegramNotification(lines.join("\n"), "HTML", runtimeEnv);
}

export async function notifyFailedNameAttempt(
  attempt: {
    name: string;
    attemptCount: number;
    ip?: string;
    device?: string;
    browser?: string;
    os?: string;
  },
  runtimeEnv?: Record<string, any>
) {
  const nowFormatted = new Date().toLocaleString("bg-BG", {
    timeZone: "Europe/Sofia",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const lines = [
    `⚠️ <b>Сгрешено име (Неуспешен опит #${attempt.attemptCount})!</b>`,
    ``,
    `❌ <b>Въведено име:</b> "<code>${attempt.name}</code>"`,
    `🔢 <b>Пореден грешен опит:</b> ${attempt.attemptCount}`,
    `🌐 <b>IP адрес:</b> <code>${attempt.ip || "Неизвестен"}</code>`,
    `📱 <b>Устройство:</b> ${attempt.device || "Неизвестно"} (${attempt.os || "OS"}, ${attempt.browser || "Browser"})`,
    `🕒 <b>Точен час:</b> ${nowFormatted}`,
  ];

  return sendTelegramNotification(lines.join("\n"), "HTML", runtimeEnv);
}
