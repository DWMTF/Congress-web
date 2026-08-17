/**
 * POST /api/payment/initiate
 * Creates an OnePay checkout link for an existing registration.
 * Body: { registrationId }
 * Returns: { redirectUrl }
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import {
  createCheckoutLink,
  generateReference,
} from "@/lib/payment/onepay";

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

  let body: { registrationId: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { registrationId } = body;
  if (!registrationId) {
    return NextResponse.json({ error: "registrationId is required" }, { status: 400 });
  }

  const service = createServiceClient();

  // ── Load registration ─────────────────────────────────────────
  const { data: reg, error: regError } = await service
    .from("registrations")
    .select("*")
    .eq("id", registrationId)
    .eq("user_id", user.id)           // ownership check
    .single();

  if (regError || !reg) {
    await logger.warn("PAYMENT_INITIATE", "Registration not found or not owned by user", {
      registrationId,
      metadata: { userId: user.id },
      ipAddress: ip,
      userAgent: ua,
    });
    return NextResponse.json({ error: "Registration not found" }, { status: 404 });
  }

  if (reg.status === "confirmed") {
    return NextResponse.json({ error: "This registration is already paid" }, { status: 409 });
  }

  // ── Build redirect URL ────────────────────────────────────────
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const reference = generateReference();
  const redirectUrl = `${baseUrl}/payment/callback?ref=${reference}`;

  // ── Create payment record ─────────────────────────────────────
  const { data: payment, error: paymentError } = await service
    .from("payments")
    .insert({
      registration_id: registrationId,
      reference,
      amount_lkr: reg.amount_lkr,
      currency: "LKR",
      status: "initiated",
    })
    .select("id")
    .single();

  if (paymentError || !payment) {
    await logger.error("PAYMENT_INITIATE", "Failed to create payment record", {
      registrationId,
      metadata: { error: paymentError?.message },
      ipAddress: ip,
      userAgent: ua,
    });
    return NextResponse.json({ error: "Could not initiate payment" }, { status: 500 });
  }

  await logger.info("PAYMENT_INITIATE", "Payment record created, calling OnePay", {
    paymentId: payment.id,
    registrationId,
    metadata: { reference, amountLkr: reg.amount_lkr },
    ipAddress: ip,
    userAgent: ua,
  });

  // ── Call OnePay ───────────────────────────────────────────────
  let checkoutResult;
  try {
    // Split full name for OnePay (first / last)
    checkoutResult = await createCheckoutLink({
      reference,
      amount: Number(reg.amount_lkr),
      customerFirstName: reg.first_name,
      customerLastName: reg.last_name,
      customerEmail: reg.email,
      customerPhone: "+94000000000",  // Replace with actual phone field if you add it
      redirectUrl,
      additionalData: `registrationId:${registrationId}`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    await logger.error("PAYMENT_INITIATE", "OnePay checkout link creation failed", {
      paymentId: payment.id,
      registrationId,
      metadata: { error: message, reference },
      ipAddress: ip,
      userAgent: ua,
    });

    // Mark payment as failed
    await service
      .from("payments")
      .update({ status: "failed" })
      .eq("id", payment.id);

    return NextResponse.json({ error: "Payment gateway error. Please try again." }, { status: 502 });
  }

  // ── Update payment record with gateway data ───────────────────
  await service
    .from("payments")
    .update({
      status: "pending",
      onepay_transaction_id: checkoutResult.ipgTransactionId,
      gateway_redirect_url: checkoutResult.redirectUrl,
      raw_response: checkoutResult as unknown as Record<string, unknown>,
    })
    .eq("id", payment.id);

  await logger.info("PAYMENT_INITIATE", "OnePay checkout link created successfully", {
    paymentId: payment.id,
    registrationId,
    metadata: {
      ipgTransactionId: checkoutResult.ipgTransactionId,
      reference,
      grossAmount: checkoutResult.grossAmount,
    },
    ipAddress: ip,
    userAgent: ua,
  });

  return NextResponse.json({
    redirectUrl: checkoutResult.redirectUrl,
    reference,
    paymentId: payment.id,
  });
}
