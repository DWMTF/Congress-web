import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/roles";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(req.url);
  const level = searchParams.get("level") || "all";
  const event = searchParams.get("event") || "all";
  const search = searchParams.get("search")?.toLowerCase().trim() || "";
  const limit = parseInt(searchParams.get("limit") || "100", 10);

  const service = createServiceClient();

  let query = service
    .from("payment_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(Math.min(limit, 200));

  if (level !== "all") {
    query = query.eq("level", level);
  }

  if (event !== "all") {
    query = query.eq("event", event);
  }

  const { data: logs, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let filtered = logs || [];

  if (search) {
    filtered = filtered.filter(
      (l) =>
        l.event?.toLowerCase().includes(search) ||
        l.message?.toLowerCase().includes(search) ||
        l.ip_address?.toLowerCase().includes(search) ||
        l.registration_id?.toLowerCase().includes(search) ||
        l.payment_id?.toLowerCase().includes(search) ||
        JSON.stringify(l.metadata || {}).toLowerCase().includes(search)
    );
  }

  return NextResponse.json({ logs: filtered });
}
