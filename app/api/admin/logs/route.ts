import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/roles";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(req.url);
  const source = searchParams.get("source") || "all"; // "all" | "payment" | "system"
  const level = searchParams.get("level") || "all";
  const event = searchParams.get("event") || "all";
  const search = searchParams.get("search")?.toLowerCase().trim() || "";
  const limit = parseInt(searchParams.get("limit") || "100", 10);
  const maxLimit = Math.min(limit, 200);

  const service = createServiceClient();

  async function fetchTableLogs(table: "payment_logs" | "system_logs", logSource: "payment" | "system") {
    try {
      let query = service
        .from(table)
        .select("*")
        .order("created_at", { ascending: false })
        .limit(maxLimit);

      if (level !== "all") {
        query = query.eq("level", level);
      }

      if (event !== "all") {
        query = query.eq("event", event);
      }

      const { data, error } = await query;
      if (error) {
        console.error(`[admin/logs] Error querying ${table}:`, error.message);
        return [];
      }

      return (data || []).map((row) => ({
        ...row,
        log_source: logSource,
      }));
    } catch (err) {
      console.error(`[admin/logs] Exception querying ${table}:`, err);
      return [];
    }
  }

  let combinedLogs: Array<Record<string, unknown> & { log_source: "payment" | "system"; created_at: string }> = [];

  if (source === "payment") {
    combinedLogs = await fetchTableLogs("payment_logs", "payment");
  } else if (source === "system") {
    combinedLogs = await fetchTableLogs("system_logs", "system");
  } else {
    // "all": fetch from both tables and merge sorted by created_at DESC
    const [paymentLogs, systemLogs] = await Promise.all([
      fetchTableLogs("payment_logs", "payment"),
      fetchTableLogs("system_logs", "system"),
    ]);

    combinedLogs = [...paymentLogs, ...systemLogs]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, maxLimit);
  }

  let filtered = combinedLogs;

  if (search) {
    filtered = filtered.filter(
      (l) =>
        (typeof l.event === "string" && l.event.toLowerCase().includes(search)) ||
        (typeof l.message === "string" && l.message.toLowerCase().includes(search)) ||
        (typeof l.ip_address === "string" && l.ip_address.toLowerCase().includes(search)) ||
        (typeof l.registration_id === "string" && l.registration_id.toLowerCase().includes(search)) ||
        (typeof l.payment_id === "string" && l.payment_id.toLowerCase().includes(search)) ||
        JSON.stringify(l.metadata || {}).toLowerCase().includes(search)
    );
  }

  return NextResponse.json({ logs: filtered });
}
