import type { APIRoute } from "astro";
import { notifyFailedNameAttempt } from "../../lib/telegram";
import { getSupabaseAdmin } from "../../lib/supabase";

export const prerender = false;

function parseUserAgent(ua: string) {
  let device = "Desktop";
  let os = "Unknown OS";
  let browser = "Unknown Browser";

  if (/Mobile|Android|iP(hone|od)/i.test(ua)) {
    device = "Mobile";
  } else if (/iPad|Tablet/i.test(ua)) {
    device = "Tablet";
  }

  if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/Windows NT/i.test(ua)) os = "Windows";
  else if (/Mac OS X/i.test(ua)) os = "macOS";
  else if (/Linux/i.test(ua)) os = "Linux";

  if (/Edg/i.test(ua)) browser = "Edge";
  else if (/Chrome/i.test(ua) && !/Chromium|Edg/i.test(ua)) browser = "Chrome";
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = "Safari";
  else if (/Firefox/i.test(ua)) browser = "Firefox";
  else if (/Opera|OPR/i.test(ua)) browser = "Opera";

  return { device, os, browser };
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const runtimeEnv = (locals as any)?.runtime?.env;
    const rawIp =
      request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      request.headers.get("x-client-ip") ||
      "127.0.0.1";

    const userAgent = request.headers.get("user-agent") || "";
    const parsedUa = parseUserAgent(userAgent);

    let body: any = {};
    try {
      body = await request.json();
    } catch {
      // Empty body
    }

    const wrongName = body.name || "Неизвестно";
    const attemptCount =
      typeof body.attempt_count === "number" ? body.attempt_count : 1;
    const sessionId = body.session_id;

    // Send Telegram notification immediately
    try {
      await notifyFailedNameAttempt(
        {
          name: wrongName,
          attemptCount: attemptCount,
          ip: rawIp,
          device: body.device || parsedUa.device,
          browser: body.browser || parsedUa.browser,
          os: body.os || parsedUa.os,
        },
        runtimeEnv
      );
    } catch (tgErr) {
      console.error("Failed to send Telegram failed name alert:", tgErr);
    }

    // Optionally update visitor log in Supabase if session exists
    if (sessionId) {
      try {
        const supabase = getSupabaseAdmin();
        await supabase
          .from("visitor_logs")
          .update({
            name: `[Сгрешено: ${wrongName} (#${attemptCount})]`,
          })
          .eq("session_id", sessionId);
      } catch (dbErr) {
        // Ignore DB update error
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Error in log-failed-name:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
