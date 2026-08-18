/**
 * POST /api/auth/register
 * Creates a Supabase auth user and a registration record.
 * Body: { email, password, firstName, lastName, organization?, attendanceType }
 */

import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import { TICKET_PRICES } from "@/lib/payment/prices";

function ipFrom(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  const ip = ipFrom(req);
  const ua = req.headers.get("user-agent") ?? "";

  let body: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    organization?: string;
    attendanceType: "in-person" | "livestream";
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { email, password, firstName, lastName, organization, attendanceType } = body;

  // ── Validate ──────────────────────────────────────────────────
  if (!email || !password || !firstName || !lastName || !attendanceType) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (!["in-person", "livestream"].includes(attendanceType)) {
    return NextResponse.json({ error: "Invalid attendanceType" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const amount = TICKET_PRICES[attendanceType];

  // ── Create auth user ──────────────────────────────────────────
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // pre-confirm so users can log in immediately; we send our own email via Resend
    user_metadata: { first_name: firstName, last_name: lastName },
  });

  if (authError) {
    await logger.warn("AUTH_REGISTER", `Failed to create auth user for ${email}`, {
      metadata: { error: authError.message },
      ipAddress: ip,
      userAgent: ua,
    });

    // Return a user-friendly message (don't leak internal details)
    const isEmailTaken = authError.message.toLowerCase().includes("already");
    return NextResponse.json(
      { error: isEmailTaken ? "An account with this email already exists." : "Registration failed. Please try again." },
      { status: isEmailTaken ? 409 : 500 }
    );
  }

  const userId = authData.user.id;

  // ── Insert registration record ────────────────────────────────
  const { data: regData, error: regError } = await supabase
    .from("registrations")
    .insert({
      user_id: userId,
      attendance_type: attendanceType,
      first_name: firstName,
      last_name: lastName,
      email,
      organization: organization ?? null,
      status: "pending",
      amount_lkr: amount,
    })
    .select("id")
    .single();

  if (regError) {
    // Roll back: delete the auth user to avoid orphaned accounts
    await supabase.auth.admin.deleteUser(userId);

    await logger.error("AUTH_REGISTER", `Failed to insert registration for user ${userId}`, {
      metadata: { error: regError.message },
      ipAddress: ip,
      userAgent: ua,
    });

    return NextResponse.json(
      { error: "Could not save registration. Please try again." },
      { status: 500 }
    );
  }

  await logger.info("AUTH_REGISTER", `New registration created`, {
    registrationId: regData.id,
    metadata: { email, attendanceType, amountLkr: amount },
    ipAddress: ip,
    userAgent: ua,
  });

  return NextResponse.json({
    registrationId: regData.id,
    amountLkr: amount,
    message: "Registration created. Proceed to payment.",
  });
}
