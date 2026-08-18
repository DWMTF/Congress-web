/**
 * PATCH /api/registration/update-attendance
 * Allows an authenticated user to change their attendance type
 * before payment is completed.
 * Body: { registrationId, attendanceType }
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import { TICKET_PRICES } from "@/lib/payment/prices";

export async function PATCH(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  // ── Auth guard ────────────────────────────────────────────────
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { registrationId: string; attendanceType: "in-person" | "livestream" };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { registrationId, attendanceType } = body;

  if (!registrationId || !["in-person", "livestream"].includes(attendanceType)) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  const service = createServiceClient();

  // ── Load registration (ownership check) ──────────────────────
  const { data: reg, error: regError } = await service
    .from("registrations")
    .select("id, user_id, status, attendance_type")
    .eq("id", registrationId)
    .eq("user_id", user.id)
    .single();

  if (regError || !reg) {
    return NextResponse.json({ error: "Registration not found" }, { status: 404 });
  }

  if (reg.status === "confirmed") {
    return NextResponse.json(
      { error: "Cannot change attendance type after payment is completed." },
      { status: 409 }
    );
  }

  if (reg.attendance_type === attendanceType) {
    return NextResponse.json({ error: "Already set to this attendance type" }, { status: 400 });
  }

  const newAmount = TICKET_PRICES[attendanceType];

  const { error: updateError } = await service
    .from("registrations")
    .update({ attendance_type: attendanceType, amount_lkr: newAmount })
    .eq("id", registrationId);

  if (updateError) {
    await logger.error("REGISTRATION_UPDATE", "Failed to update attendance type", {
      registrationId,
      metadata: { error: updateError.message, userId: user.id },
      ipAddress: ip,
    });
    return NextResponse.json({ error: "Update failed. Please try again." }, { status: 500 });
  }

  await logger.info("REGISTRATION_UPDATE", "Attendance type updated", {
    registrationId,
    metadata: {
      userId: user.id,
      from: reg.attendance_type,
      to: attendanceType,
      newAmountLkr: newAmount,
    },
    ipAddress: ip,
  });

  return NextResponse.json({ attendanceType, amountLkr: newAmount });
}
