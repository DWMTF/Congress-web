/**
 * POST /api/auth/login
 * Signs the user in with email + password via Supabase Auth.
 * Body: { email, password }
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

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

  let body: { email: string; password: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    await logger.warn("AUTH_LOGIN", `Failed login attempt for ${email}`, {
      metadata: { reason: error.message },
      ipAddress: ip,
      userAgent: ua,
    });

    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  await logger.info("AUTH_LOGIN", `User logged in`, {
    metadata: { userId: data.user.id, email },
    ipAddress: ip,
    userAgent: ua,
  });

  return NextResponse.json({ message: "Logged in successfully" });
}
