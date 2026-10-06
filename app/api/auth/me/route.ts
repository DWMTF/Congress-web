import { NextResponse } from "next/server";
import { getCurrentUserWithRole } from "@/lib/auth/roles";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const current = await getCurrentUserWithRole();

  const headers = {
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  };

  if (!current) {
    return NextResponse.json(
      { authenticated: false, user: null, role: null, isAdmin: false },
      { status: 200, headers }
    );
  }

  return NextResponse.json(
    {
      authenticated: true,
      user: {
        id: current.user.id,
        email: current.user.email,
        user_metadata: current.user.user_metadata,
      },
      role: current.role,
      isAdmin: current.isAdmin,
    },
    { status: 200, headers }
  );
}
