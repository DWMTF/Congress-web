import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

/**
 * Sanitizes input email:
 * 1. Converts to string, trims whitespace.
 * 2. Lowercases for consistent RFC 5321 storage.
 * 3. Strips control characters, newlines, carriage returns, and null bytes.
 * 4. Normalizes unicode characters (NFKC).
 */
function sanitizeEmail(raw: unknown): string {
  if (typeof raw !== "string") return "";

  return raw
    .trim()
    .toLowerCase()
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
    .normalize("NFKC");
}

interface ValidationResult {
  valid: boolean;
  error?: string;
  sanitizedEmail: string;
}

/**
 * Validates email against standard constraints:
 * - Presence & character length bounds (5 to 254 characters)
 * - Local part length (max 64) and domain part length (max 253)
 * - No consecutive dots (..)
 * - No leading/trailing dots or hyphens on domain
 * - Strict RFC-compliant regex
 */
function validateEmail(rawEmail: unknown): ValidationResult {
  const sanitized = sanitizeEmail(rawEmail);

  if (!sanitized) {
    return { valid: false, error: "Please enter an email address.", sanitizedEmail: "" };
  }

  if (sanitized.length > 254) {
    return {
      valid: false,
      error: "Email address cannot exceed 254 characters.",
      sanitizedEmail: "",
    };
  }

  if (sanitized.length < 5) {
    return { valid: false, error: "Please enter a valid email address.", sanitizedEmail: "" };
  }

  const parts = sanitized.split("@");
  if (parts.length !== 2) {
    return { valid: false, error: "Please enter a valid email address.", sanitizedEmail: "" };
  }

  const [localPart, domainPart] = parts;

  if (localPart.length === 0 || localPart.length > 64) {
    return {
      valid: false,
      error: "The local part of the email address is invalid.",
      sanitizedEmail: "",
    };
  }

  if (domainPart.length === 0 || domainPart.length > 253) {
    return {
      valid: false,
      error: "The domain part of the email address is invalid.",
      sanitizedEmail: "",
    };
  }

  if (localPart.includes("..") || domainPart.includes("..")) {
    return {
      valid: false,
      error: "Email address cannot contain consecutive dots.",
      sanitizedEmail: "",
    };
  }

  if (localPart.startsWith(".") || localPart.endsWith(".")) {
    return {
      valid: false,
      error: "Email address cannot begin or end with a period.",
      sanitizedEmail: "",
    };
  }

  if (!domainPart.includes(".")) {
    return {
      valid: false,
      error: "Please enter an email with a valid domain (e.g. name@domain.com).",
      sanitizedEmail: "",
    };
  }

  if (
    domainPart.startsWith(".") ||
    domainPart.endsWith(".") ||
    domainPart.startsWith("-") ||
    domainPart.endsWith("-")
  ) {
    return { valid: false, error: "The domain format is invalid.", sanitizedEmail: "" };
  }

  // Strict email regex (RFC 5322 compatible)
  const strictRegex =
    /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i;

  if (!strictRegex.test(sanitized)) {
    return { valid: false, error: "Please enter a valid email address.", sanitizedEmail: "" };
  }

  return { valid: true, sanitizedEmail: sanitized };
}

function getClientMeta(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const userAgent = (req.headers.get("user-agent") || "").slice(0, 500);
  return { ip, userAgent };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
    }

    const { valid, error, sanitizedEmail } = validateEmail(body.email);

    if (!valid || !sanitizedEmail) {
      return NextResponse.json({ error: error || "Invalid email address." }, { status: 400 });
    }

    const { ip, userAgent } = getClientMeta(req);
    const service = createServiceClient();

    // Upsert into newsletter_subscribers table
    const { data, error: dbError } = await service
      .from("newsletter_subscribers")
      .upsert(
        {
          email: sanitizedEmail,
          status: "subscribed",
          ip_address: ip,
          user_agent: userAgent,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "email" }
      )
      .select()
      .single();

    if (dbError) {
      console.error("[newsletter/subscribe] Database error:", dbError);
      return NextResponse.json(
        { error: "Database error saving newsletter subscription. Please try again." },
        { status: 500 }
      );
    }

    // Log the event in system audit trail
    await logger.info(
      "NEWSLETTER_SUBSCRIBED",
      `New newsletter subscription received for ${sanitizedEmail}`,
      {
        ipAddress: ip,
        userAgent,
        metadata: {
          subscriberId: data?.id,
          email: sanitizedEmail,
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: "You're on the list! Thank you for subscribing.",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("[newsletter/subscribe] Unexpected error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
