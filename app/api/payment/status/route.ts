/**
 * POST /api/payment/status
 * Polls OnePay for the latest transaction status and syncs the DB.
 * Body: { reference }
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import { getTransactionStatus } from "@/lib/payment/onepay";
import { sendConfirmationEmail } from "@/lib/email";

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

  // ── Auth guard ────────────────────────────────────────────────
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { reference: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { reference } = body;
  if (!reference) {
    return NextResponse.json({ error: "reference is required" }, { status: 400 });
  }

  const service = createServiceClient();

  // ── Load payment ──────────────────────────────────────────────
  const { data: payment, error: paymentError } = await service
    .from("payments")
    .select("*, registrations(*)")
    .eq("reference", reference)
    .single();

  if (paymentError || !payment) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  // Verify ownership
  const reg = payment.registrations as { user_id: string; email: string; first_name: string; last_name: string; attendance_type: string; amount_lkr: number } | null;
  if (!reg || reg.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Already confirmed — no need to poll
  if (payment.status === "completed") {
    return NextResponse.json({ status: "completed", paid: true });
  }

  if (!payment.onepay_transaction_id) {
    return NextResponse.json({ status: payment.status, paid: false });
  }

  // ── Poll OnePay ───────────────────────────────────────────────
  let txStatus;
  try {
    txStatus = await getTransactionStatus(payment.onepay_transaction_id);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await logger.error("PAYMENT_STATUS", "OnePay status poll failed", {
      paymentId: payment.id,
      registrationId: payment.registration_id,
      metadata: { error: message, reference },
      ipAddress: ip,
      userAgent: ua,
    });
    return NextResponse.json({ error: "Could not retrieve payment status" }, { status: 502 });
  }

  await logger.info("PAYMENT_STATUS", "OnePay status polled", {
    paymentId: payment.id,
    registrationId: payment.registration_id,
    metadata: { paid: txStatus.status, paidOn: txStatus.paidOn, reference },
    ipAddress: ip,
    userAgent: ua,
  });

  // ── Handle paid ───────────────────────────────────────────────
  if (txStatus.status) {
    // Update payment
    await service
      .from("payments")
      .update({
        status: "completed",
        paid_at: txStatus.paidOn ?? new Date().toISOString(),
        raw_response: txStatus as unknown as Record<string, unknown>,
      })
      .eq("id", payment.id);

    // Confirm registration
    await service
      .from("registrations")
      .update({ status: "confirmed" })
      .eq("id", payment.registration_id);

    await logger.info("PAYMENT_STATUS", "Payment confirmed, registration updated", {
      paymentId: payment.id,
      registrationId: payment.registration_id,
      metadata: { paidOn: txStatus.paidOn, amountLkr: txStatus.amount },
      ipAddress: ip,
      userAgent: ua,
    });

    // Send confirmation email (non-blocking)
    if (reg) {
      sendConfirmationEmail({
        to: reg.email,
        firstName: reg.first_name,
        lastName: reg.last_name,
        attendanceType: reg.attendance_type as "in-person" | "livestream",
        reference,
        amountLkr: Number(reg.amount_lkr),
      }).catch((err) => {
        logger.error("EMAIL_SEND", "Confirmation email failed", {
          paymentId: payment.id,
          metadata: { error: err instanceof Error ? err.message : String(err) },
        });
      });
    }

    return NextResponse.json({ status: "completed", paid: true });
  }

  return NextResponse.json({ status: payment.status, paid: false });
}
