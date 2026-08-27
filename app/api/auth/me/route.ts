import { NextResponse } from "next/server";
import { getCurrentUserWithRole } from "@/lib/auth/roles";

export async function GET() {
  const current = await getCurrentUserWithRole();

  if (!current) {
    return NextResponse.json({ authenticated: false, user: null, role: null, isAdmin: false }, { status: 200 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: current.user.id,
      email: current.user.email,
      user_metadata: current.user.user_metadata,
    },
    role: current.role,
    isAdmin: current.isAdmin,
  });
}
