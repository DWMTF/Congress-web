import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/roles";
import { createServiceClient } from "@/lib/supabase/server";
import {
  createMuxLiveStream,
  getMuxLiveStream,
  deleteMuxLiveStream,
  generateMuxPlaybackToken,
  RTMP_INGEST_URL,
} from "@/lib/mux/client";
import { logger } from "@/lib/logger";

function ipFrom(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const service = createServiceClient();
  const { data: dbStreams, error } = await service
    .from("live_streams")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Check real-time Mux status for the streams
  const enrichedStreams = await Promise.all(
    (dbStreams || []).map(async (st) => {
      const muxData = await getMuxLiveStream(st.mux_live_stream_id);
      let testToken = "";
      try {
        testToken = generateMuxPlaybackToken(st.playback_id, 10);
      } catch {
        // ignore if signing key misconfigured
      }

      return {
        ...st,
        muxStatus: muxData?.status || st.status,
        rtmpIngestUrl: RTMP_INGEST_URL,
        testToken,
      };
    })
  );

  return NextResponse.json({
    streams: enrichedStreams,
    rtmpIngestUrl: RTMP_INGEST_URL,
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const ip = ipFrom(req);
  const ua = req.headers.get("user-agent") ?? "";

  try {
    let body: { title?: string } = {};
    try {
      body = await req.json();
    } catch {
      // optional
    }

    const streamTitle = body.title || "Blue Mind Congress 2027 Main Stage";

    // 1. Create live stream in Mux
    const muxResult = await createMuxLiveStream();

    // 2. Persist in database
    const service = createServiceClient();
    const { data: savedStream, error: dbError } = await service
      .from("live_streams")
      .insert({
        title: streamTitle,
        mux_live_stream_id: muxResult.muxLiveStreamId,
        playback_id: muxResult.playbackId,
        stream_key: muxResult.streamKey,
        status: muxResult.status || "idle",
      })
      .select()
      .single();

    if (dbError) {
      // Clean up Mux stream if DB save failed
      await deleteMuxLiveStream(muxResult.muxLiveStreamId);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    const adminEmail = auth.userWithRole?.user.email || auth.userWithRole?.user.id;

    await logger.info("ADMIN_STREAM_CREATE", `Admin created new live stream '${streamTitle}'`, {
      ipAddress: ip,
      userAgent: ua,
      metadata: {
        adminId: auth.userWithRole?.user.id,
        adminEmail,
        streamId: savedStream.id,
        muxLiveStreamId: muxResult.muxLiveStreamId,
        playbackId: muxResult.playbackId,
      },
    });

    return NextResponse.json({
      stream: {
        ...savedStream,
        rtmpIngestUrl: RTMP_INGEST_URL,
      },
      message: "Live stream provisioned successfully.",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create Mux stream";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(req.url);
  const streamId = searchParams.get("streamId");

  if (!streamId) {
    return NextResponse.json({ error: "streamId is required" }, { status: 400 });
  }

  const service = createServiceClient();
  const { data: existingStream } = await service
    .from("live_streams")
    .select("*")
    .eq("id", streamId)
    .single();

  if (!existingStream) {
    return NextResponse.json({ error: "Stream not found" }, { status: 404 });
  }

  // 1. Delete on Mux
  await deleteMuxLiveStream(existingStream.mux_live_stream_id);

  // 2. Delete in DB
  const { error: deleteError } = await service
    .from("live_streams")
    .delete()
    .eq("id", streamId);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  const adminEmail = auth.userWithRole?.user.email || auth.userWithRole?.user.id;

  await logger.info("ADMIN_STREAM_DELETE", `Admin deleted live stream '${existingStream.title}'`, {
    metadata: {
      adminId: auth.userWithRole?.user.id,
      adminEmail,
      streamId,
      muxLiveStreamId: existingStream.mux_live_stream_id,
    },
  });

  return NextResponse.json({ message: "Live stream deleted successfully." });
}
