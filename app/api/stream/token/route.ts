import { NextResponse } from "next/server";
import { getCurrentUserWithRole } from "@/lib/auth/roles";
import { createServiceClient } from "@/lib/supabase/server";
import { generateMuxPlaybackToken, getMuxLiveStream } from "@/lib/mux/client";

export async function GET() {
  const current = await getCurrentUserWithRole();

  if (!current) {
    return NextResponse.json(
      {
        authenticated: false,
        authorized: false,
        error: "You must be signed in to access the livestream.",
      },
      { status: 401 }
    );
  }

  const service = createServiceClient();

  // 1. Authorize: Admin or Confirmed Attendee
  if (!current.isAdmin) {
    const { data: registration } = await service
      .from("registrations")
      .select("id, status, attendance_type")
      .eq("user_id", current.user.id)
      .maybeSingle();

    if (!registration) {
      return NextResponse.json(
        {
          authenticated: true,
          authorized: false,
          reason: "no_registration",
          error: "No registration found for this account. Please register for a ticket.",
        },
        { status: 403 }
      );
    }

    if (registration.status !== "confirmed") {
      return NextResponse.json(
        {
          authenticated: true,
          authorized: false,
          reason: "unconfirmed",
          status: registration.status,
          error: "Your registration is pending payment confirmation. Please complete payment to unlock livestream access.",
        },
        { status: 403 }
      );
    }
  }

  // 2. Fetch the active live stream
  const { data: stream, error: streamError } = await service
    .from("live_streams")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (streamError || !stream) {
    return NextResponse.json({
      authenticated: true,
      authorized: true,
      streamAvailable: false,
      message: "The Congress livestream has not been initialized yet. Check back closer to the session start.",
    });
  }

  // 3. Query Mux real-time stream status
  const muxData = await getMuxLiveStream(stream.mux_live_stream_id);
  const liveStatus = muxData?.status || stream.status;
  const isLive = liveStatus === "active";

  // 4. Generate signed Mux playback token
  try {
    const token = generateMuxPlaybackToken(stream.playback_id, 45); // valid for 45 minutes

    return NextResponse.json({
      authenticated: true,
      authorized: true,
      streamAvailable: true,
      title: stream.title,
      playbackId: stream.playback_id,
      token,
      status: liveStatus,
      isLive,
      user: {
        email: current.user.email,
        role: current.role,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to sign playback token";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
