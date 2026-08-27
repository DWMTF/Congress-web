import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/roles";
import { createServiceClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.toLowerCase().trim() || "";
  const attendanceType = searchParams.get("attendanceType") || "all";
  const status = searchParams.get("status") || "all";

  const service = createServiceClient();

  let query = service
    .from("registrations")
    .select(`
      *,
      payments (*)
    `)
    .order("created_at", { ascending: false });

  if (attendanceType !== "all") {
    query = query.eq("attendance_type", attendanceType);
  }

  if (status !== "all") {
    query = query.eq("status", status);
  }

  const { data: registrations, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let filtered = registrations || [];

  if (search) {
    filtered = filtered.filter(
      (r) =>
        r.first_name?.toLowerCase().includes(search) ||
        r.last_name?.toLowerCase().includes(search) ||
        r.email?.toLowerCase().includes(search) ||
        r.organization?.toLowerCase().includes(search) ||
        r.id?.toLowerCase().includes(search)
    );
  }

  return NextResponse.json({ registrations: filtered });
}

function ipFrom(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const ip = ipFrom(req);
  const ua = req.headers.get("user-agent") ?? "";

  try {
    const body = await req.json();
    const { registrationId, status, attendanceType } = body;

    if (!registrationId) {
      return NextResponse.json({ error: "registrationId is required" }, { status: 400 });
    }

    const service = createServiceClient();

    // 1. Fetch current registration record for audit history
    const { data: existingReg, error: fetchError } = await service
      .from("registrations")
      .select("*")
      .eq("id", registrationId)
      .single();

    if (fetchError || !existingReg) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    const isStatusChanged = status && status !== existingReg.status && ["pending", "confirmed", "cancelled"].includes(status);
    if (isStatusChanged) {
      updates.status = status;
    }

    const isTypeChanged = attendanceType && attendanceType !== existingReg.attendance_type && ["in-person", "livestream"].includes(attendanceType);
    if (isTypeChanged) {
      updates.attendance_type = attendanceType;
    }

    // 2. Perform the update
    const { data, error } = await service
      .from("registrations")
      .update(updates)
      .eq("id", registrationId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const adminEmail = auth.userWithRole?.user.email || auth.userWithRole?.user.id;
    const attendeeName = `${existingReg.first_name} ${existingReg.last_name}`;

    // 3. Maintain an immutable audit log
    const logEvent = isStatusChanged ? "ADMIN_STATUS_OVERRIDE" : "ADMIN_REGISTRATION_UPDATE";
    const logMessage = isStatusChanged
      ? `Admin (${adminEmail}) manually changed registration status from '${existingReg.status}' to '${status}' for ${attendeeName} (${existingReg.email})`
      : `Admin (${adminEmail}) updated registration details for ${attendeeName} (${existingReg.email})`;

    await logger.info(logEvent, logMessage, {
      registrationId,
      ipAddress: ip,
      userAgent: ua,
      metadata: {
        adminId: auth.userWithRole?.user.id,
        adminEmail,
        previousStatus: existingReg.status,
        newStatus: status || existingReg.status,
        previousType: existingReg.attendance_type,
        newType: attendanceType || existingReg.attendance_type,
        attendeeName,
        attendeeEmail: existingReg.email,
        registrationId,
        timestamp: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      registration: data,
      message: `Registration status updated to ${data.status} by administrator.`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update registration";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
