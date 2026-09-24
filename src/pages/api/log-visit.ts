import type { APIRoute } from "astro";
import { getSupabaseAdmin } from "../../lib/supabase";
import { notifyVisitorEnter } from "../../lib/telegram";

export const prerender = false;

// Helper to parse user agent
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
      // Beacon or empty body fallback
    }

    const action = body.action || "enter"; // 'enter' | 'heartbeat' | 'leave'
    const sessionId = body.session_id;

    if (!sessionId) {
      return new Response(JSON.stringify({ error: "Missing session_id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabase = getSupabaseAdmin();
    const now = new Date();
    const nowIso = now.toISOString();

    if (action === "enter") {
      const isFirstVisit = body.is_first_visit === true;

      // Send Telegram notification ONLY on the first site opening, not on every page transition
      if (isFirstVisit) {
        try {
          await notifyVisitorEnter(
            {
              ip: rawIp,
              device: body.device || parsedUa.device,
              browser: body.browser || parsedUa.browser,
              os: body.os || parsedUa.os,
              currentPage: body.current_page || "/",
              referrer: body.referrer || null,
            },
            runtimeEnv
          );
        } catch (tgErr) {
          console.error("Telegram visitor notification error:", tgErr);
        }
      }

      // Insert new visitor entry into Supabase
      const { error } = await supabase.from("visitor_logs").upsert(
        [
          {
            session_id: sessionId,
            name: body.name || null,
            ip: rawIp,
            device: body.device || parsedUa.device,
            browser: body.browser || parsedUa.browser,
            os: body.os || parsedUa.os,
            user_agent: userAgent,
            current_page: body.current_page || "/",
            referrer: body.referrer || null,
            entered_at: nowIso,
            left_at: nowIso,
            duration_seconds: 0,
            is_online: true,
            created_at: nowIso,
          },
        ],
        { onConflict: "session_id" }
      );

      if (error) {
        console.error("Error inserting visitor_log enter:", error);
      }
    } else if (action === "heartbeat" || action === "leave") {
      // Find the entry time to calculate duration
      const { data: existing } = await supabase
        .from("visitor_logs")
        .select("entered_at")
        .eq("session_id", sessionId)
        .single();

      let durationSeconds = 0;
      if (existing?.entered_at) {
        const enteredDate = new Date(existing.entered_at);
        durationSeconds = Math.max(
          0,
          Math.floor((now.getTime() - enteredDate.getTime()) / 1000)
        );
      }

      const updateData: any = {
        left_at: nowIso,
        duration_seconds: durationSeconds,
        is_online: action === "heartbeat",
      };

      if (body.current_page) {
        updateData.current_page = body.current_page;
      }
      if (body.name) {
        updateData.name = body.name;
      }

      const { error } = await supabase
        .from("visitor_logs")
        .update(updateData)
        .eq("session_id", sessionId);

      if (error) {
        console.error(`Error updating visitor_log ${action}:`, error);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Visitor logging endpoint error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
