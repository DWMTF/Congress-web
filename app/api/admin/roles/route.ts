import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, setUserRole, UserRole } from "@/lib/auth/roles";
import { createServiceClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const service = createServiceClient();

  // 1. Fetch user_roles table records
  const { data: roleRecords, error: roleError } = await service
    .from("user_roles")
    .select("*")
    .order("created_at", { ascending: false });

  if (roleError) {
    return NextResponse.json({ error: roleError.message }, { status: 500 });
  }

  // 2. Fetch auth users list
  const {
    data: { users },
    error: authUsersError,
  } = await service.auth.admin.listUsers({ perPage: 100 });

  if (authUsersError) {
    return NextResponse.json({ error: authUsersError.message }, { status: 500 });
  }

  // Map role records by user_id
  const roleMap = new Map<string, { role: UserRole; updated_at: string }>();
  roleRecords?.forEach((r) => {
    roleMap.set(r.user_id, { role: r.role, updated_at: r.updated_at });
  });

  const combinedUsers = users.map((u) => {
    const roleInfo = roleMap.get(u.id);
    const metaRole = (u.app_metadata?.role as UserRole) || (u.user_metadata?.role as UserRole) || "user";
    const effectiveRole = roleInfo?.role || metaRole || "user";

    return {
      id: u.id,
      email: u.email,
      firstName: u.user_metadata?.first_name || "",
      lastName: u.user_metadata?.last_name || "",
      role: effectiveRole,
      createdAt: u.created_at,
      lastSignInAt: u.last_sign_in_at,
    };
  });

  return NextResponse.json({ users: combinedUsers });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json();
    const { userId, role } = body as { userId: string; role: UserRole };

    if (!userId || !role) {
      return NextResponse.json({ error: "userId and role are required" }, { status: 400 });
    }

    if (!["user", "admin", "super_admin"].includes(role)) {
      return NextResponse.json({ error: "Invalid role specified" }, { status: 400 });
    }

    // Prevent non-super_admin from changing a super_admin role
    if (auth.userWithRole?.role !== "super_admin" && role === "super_admin") {
      return NextResponse.json(
        { error: "Only super administrators can assign the super_admin role." },
        { status: 403 }
      );
    }

    const result = await setUserRole(userId, role);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    await logger.info("ADMIN_ROLE_CHANGE", `User role updated for ${userId} to ${role}`, {
      metadata: {
        adminId: auth.userWithRole?.user.id,
        targetUserId: userId,
        newRole: role,
      },
    });

    return NextResponse.json({ message: "User role updated successfully", role });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update role";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
