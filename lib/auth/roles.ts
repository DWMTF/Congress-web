import { createClient, createServiceClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

export type UserRole = "user" | "admin" | "super_admin";

export interface UserWithRole {
  user: User;
  role: UserRole;
  isAdmin: boolean;
}

/**
 * Retrieves the role for a given user ID.
 * Queries public.user_roles table first, then falls back to auth metadata.
 */
export async function getUserRole(userId: string): Promise<UserRole> {
  try {
    const service = createServiceClient();
    const { data, error } = await service
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();

    if (!error && data?.role) {
      return data.role as UserRole;
    }

    // Fallback: check auth user metadata via admin client
    const { data: userData } = await service.auth.admin.getUserById(userId);
    const metaRole =
      (userData?.user?.app_metadata?.role as UserRole) ||
      (userData?.user?.user_metadata?.role as UserRole);

    if (metaRole && ["user", "admin", "super_admin"].includes(metaRole)) {
      // Sync into user_roles table
      await service
        .from("user_roles")
        .upsert({ user_id: userId, role: metaRole }, { onConflict: "user_id" });
      return metaRole;
    }

    return "user";
  } catch (err) {
    console.error("[getUserRole] Error fetching user role:", err);
    return "user";
  }
}

/**
 * Retrieves the currently authenticated user along with their role.
 * Safe to use in Server Components and Route Handlers.
 */
export async function getCurrentUserWithRole(): Promise<UserWithRole | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    const role = await getUserRole(user.id);
    const isAdmin = role === "admin" || role === "super_admin";

    return {
      user,
      role,
      isAdmin,
    };
  } catch (err: any) {
    if (err?.digest === "DYNAMIC_SERVER_USAGE" || err?.message?.includes("Dynamic server usage")) {
      throw err;
    }
    console.error("[getCurrentUserWithRole] Error fetching current user:", err);
    return null;
  }
}

/**
 * Strict server-side admin check for API Route Handlers.
 * Returns { authorized: true, userWithRole } or { authorized: false, response: NextResponse }
 */
export async function requireAdmin() {
  const current = await getCurrentUserWithRole();

  if (!current) {
    return {
      authorized: false as const,
      userWithRole: null,
      error: "Unauthorized",
      status: 401,
    };
  }

  if (!current.isAdmin) {
    return {
      authorized: false as const,
      userWithRole: current,
      error: "Forbidden: Administrator privileges required.",
      status: 403,
    };
  }

  return {
    authorized: true as const,
    userWithRole: current,
  };
}

/**
 * Assigns or updates a user's role.
 */
export async function setUserRole(userId: string, role: UserRole): Promise<{ success: boolean; error?: string }> {
  try {
    const service = createServiceClient();

    // 1. Update user_roles table
    const { error: dbError } = await service
      .from("user_roles")
      .upsert({ user_id: userId, role, updated_at: new Date().toISOString() }, { onConflict: "user_id" });

    if (dbError) {
      return { success: false, error: dbError.message };
    }

    // 2. Sync to auth app_metadata for fast JWT reads
    await service.auth.admin.updateUserById(userId, {
      app_metadata: { role },
      user_metadata: { role },
    });

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update role";
    return { success: false, error: message };
  }
}
