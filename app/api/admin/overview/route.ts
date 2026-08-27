import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/roles";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const service = createServiceClient();

  // 1. Fetch all registrations
  const { data: registrations, error: regError } = await service
    .from("registrations")
    .select("*")
    .order("created_at", { ascending: false });

  if (regError) {
    return NextResponse.json({ error: regError.message }, { status: 500 });
  }

  // 2. Fetch payments
  const { data: payments, error: payError } = await service
    .from("payments")
    .select("*")
    .order("created_at", { ascending: false });

  if (payError) {
    return NextResponse.json({ error: payError.message }, { status: 500 });
  }

  // 3. Fetch user roles count
  const { count: totalUsers } = await service
    .from("user_roles")
    .select("*", { count: "exact", head: true });

  const { count: adminCount } = await service
    .from("user_roles")
    .select("*", { count: "exact", head: true })
    .in("role", ["admin", "super_admin"]);

  // Calculate metrics
  const totalRegistrations = registrations?.length || 0;
  const inPersonRegistrations = registrations?.filter((r) => r.attendance_type === "in-person").length || 0;
  const livestreamRegistrations = registrations?.filter((r) => r.attendance_type === "livestream").length || 0;
  const confirmedRegistrations = registrations?.filter((r) => r.status === "confirmed").length || 0;
  const pendingRegistrations = registrations?.filter((r) => r.status === "pending").length || 0;
  const cancelledRegistrations = registrations?.filter((r) => r.status === "cancelled").length || 0;

  const totalRevenueLkr = payments
    ?.filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + Number(p.amount_lkr || 0), 0) || 0;

  const completedPaymentsCount = payments?.filter((p) => p.status === "completed").length || 0;
  const failedPaymentsCount = payments?.filter((p) => p.status === "failed").length || 0;

  return NextResponse.json({
    metrics: {
      totalRegistrations,
      inPersonRegistrations,
      livestreamRegistrations,
      confirmedRegistrations,
      pendingRegistrations,
      cancelledRegistrations,
      totalRevenueLkr,
      completedPaymentsCount,
      failedPaymentsCount,
      totalUsers: totalUsers || 0,
      adminCount: adminCount || 0,
    },
    recentRegistrations: registrations?.slice(0, 8) || [],
    recentPayments: payments?.slice(0, 8) || [],
  });
}
