import type { APIRoute } from "astro";
import { getSupabaseAdmin } from "../../lib/supabase";
import { notifyInviteSubmission } from "../../lib/telegram";

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const data = await request.json();
    const runtimeEnv = (locals as any)?.runtime?.env;
    const supabase = getSupabaseAdmin();

    const rawIp =
      request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      request.headers.get("x-client-ip") ||
      "127.0.0.1";

    // 1. Send Telegram notification immediately so no date invite is ever lost!
    try {
      await notifyInviteSubmission(
        {
          name: data.name,
          phone: data.phone,
          place: data.place,
          date: data.date,
          time: data.time,
          special_wish: data.special_wish,
          ip: rawIp,
        },
        runtimeEnv
      );
    } catch (telegramErr) {
      console.error("Telegram notification error:", telegramErr);
    }

    // 2. Insert into Supabase
    let dbError: string | null = null;
    try {
      const { error } = await supabase.from("invites").insert([
        {
          name: data.name || null,
          phone: data.phone,
          place: data.place,
          date: data.date,
          time: data.time,
          special_wish: data.special_wish || null,
          created_at: new Date().toISOString(),
        },
      ]);
      if (error) {
        console.error("Supabase insert error:", error);
        dbError = error.message;
      }
    } catch (err: any) {
      console.error("Supabase exception:", err);
      dbError = err.message;
    }

    return new Response(
      JSON.stringify({
        success: true,
        db_synced: !dbError,
        ...(dbError ? { db_error: dbError } : {}),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    console.error("Server error:", err);
    return new Response(JSON.stringify({ error: err.message || "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
