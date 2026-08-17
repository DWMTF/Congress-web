/**
 * OnePay.lk v3 Payment Gateway integration
 * Docs: https://developer.onepay.lk/payment-api.html
 *
 * Hash formula (SHA-256):
 *   SHA256( app_id + currency + amount.toFixed(2) + hash_salt )
 */

import crypto from "crypto";
// NOTE: This file is server-only (uses Node.js crypto). Do not import into client components.

const ONEPAY_API_BASE = "https://api.onepay.lk/v3";

// Re-export with env overrides for server-side use
export const TICKET_PRICES: Record<string, number> = {
  "in-person": Number(process.env.PRICE_IN_PERSON_LKR),
  livestream: Number(process.env.PRICE_LIVESTREAM_LKR),
};

// ── Types ──────────────────────────────────────────────────────
export interface OnePayCheckoutParams {
  reference: string;
  amount: number;
  currency?: string;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhone: string;
  redirectUrl: string;
  additionalData?: string;
}

export interface OnePayCheckoutResult {
  ipgTransactionId: string;
  redirectUrl: string;
  grossAmount: number;
  netAmount: number;
  currency: string;
}

export interface OnePayTransactionStatus {
  ipgTransactionId: string;
  currency: string;
  amount: number;
  status: boolean;        // true = paid
  paidOn: string | null;
  requestedAt: string;
}

// ── Hash ───────────────────────────────────────────────────────
function buildHash(appId: string, currency: string, amount: number, hashSalt: string): string {
  const input = `${appId}${currency}${amount.toFixed(2)}${hashSalt}`;
  return crypto.createHash("sha256").update(input).digest("hex");
}

// ── Create checkout link ───────────────────────────────────────
export async function createCheckoutLink(
  params: OnePayCheckoutParams
): Promise<OnePayCheckoutResult> {
  const appId = process.env.ONEPAY_APP_ID!;
  const appToken = process.env.ONEPAY_APP_TOKEN!;
  const hashSalt = process.env.ONEPAY_HASH_SALT!;
  const currency = params.currency ?? "LKR";

  if (!appId || !appToken || !hashSalt) {
    throw new Error("OnePay credentials are not configured (check ONEPAY_APP_ID, ONEPAY_APP_TOKEN, ONEPAY_HASH_SALT)");
  }

  const hash = buildHash(appId, currency, params.amount, hashSalt);

  const body = {
    currency,
    app_id: appId,
    hash,
    amount: params.amount,
    reference: params.reference,
    customer_first_name: params.customerFirstName,
    customer_last_name: params.customerLastName,
    customer_phone_number: params.customerPhone,
    customer_email: params.customerEmail,
    transaction_redirect_url: params.redirectUrl,
    additionalData: params.additionalData ?? "",
  };

  const res = await fetch(`${ONEPAY_API_BASE}/checkout/link/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${appToken}`,
    },
    body: JSON.stringify(body),
  });

  const json = await res.json();

  if (!res.ok || json.status !== 200) {
    throw new Error(
      `OnePay checkout failed [HTTP ${res.status}]: ${json.message ?? JSON.stringify(json)}`
    );
  }

  return {
    ipgTransactionId: json.data.ipg_transaction_id,
    redirectUrl: json.data.gateway.redirect_url,
    grossAmount: json.data.amount.gross_amount,
    netAmount: json.data.amount.net_amount,
    currency: json.data.amount.currency,
  };
}

// ── Get transaction status ─────────────────────────────────────
export async function getTransactionStatus(
  onepayTransactionId: string
): Promise<OnePayTransactionStatus> {
  const appId = process.env.ONEPAY_APP_ID!;
  const appToken = process.env.ONEPAY_APP_TOKEN!;

  const res = await fetch(`${ONEPAY_API_BASE}/transaction/status/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${appToken}`,
    },
    body: JSON.stringify({ app_id: appId, onepay_transaction_id: onepayTransactionId }),
  });

  const json = await res.json();

  if (!res.ok || json.status !== 200) {
    throw new Error(
      `OnePay status check failed [HTTP ${res.status}]: ${json.message ?? JSON.stringify(json)}`
    );
  }

  return {
    ipgTransactionId: json.data.ipg_transaction_id,
    currency: json.data.currency,
    amount: json.data.amount,
    status: json.data.status,
    paidOn: json.data.paid_on,
    requestedAt: json.data.transaction_request_datetime,
  };
}

// ── Generate a unique payment reference ───────────────────────
export function generateReference(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `DWMTF-${ts}-${rand}`;
}
