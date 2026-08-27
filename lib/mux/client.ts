import Mux from "@mux/mux-node";
import jwt from "jsonwebtoken";

export const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID || "",
  tokenSecret: process.env.MUX_TOKEN_SECRET || "",
});

export const RTMP_INGEST_URL = "rtmp://global-live.mux.com:5222/app";

/**
 * Normalizes the RSA private key whether it is stored as:
 * 1. A Base64-encoded string
 * 2. Raw PEM text
 * 3. PEM with literal \n escapes
 */
function getNormalizedPrivateKey(): string {
  const raw = process.env.MUX_PRIVATE_KEY || "";
  if (!raw) {
    throw new Error("MUX_PRIVATE_KEY is missing in environment variables.");
  }

  // If already standard PEM header
  if (raw.includes("-----BEGIN")) {
    return raw.replace(/\\n/g, "\n");
  }

  // Try base64 decoding
  try {
    const decoded = Buffer.from(raw, "base64").toString("ascii");
    if (decoded.includes("-----BEGIN")) {
      return decoded;
    }
  } catch {
    // fall through
  }

  return raw;
}

/**
 * Creates a new Mux live stream with a 'signed' playback policy
 */
export async function createMuxLiveStream() {
  const liveStream = await mux.video.liveStreams.create({
    playback_policy: ["signed"],
    new_asset_settings: {
      playback_policy: ["signed"],
    },
    reconnect_window: 60,
  });

  const playbackId = liveStream.playback_ids?.[0]?.id;
  if (!playbackId) {
    throw new Error("Failed to generate playback ID for Mux live stream.");
  }

  return {
    muxLiveStreamId: liveStream.id,
    streamKey: liveStream.stream_key || "",
    playbackId,
    status: liveStream.status,
  };
}

/**
 * Retrieves the live status of a stream directly from Mux API
 */
export async function getMuxLiveStream(muxLiveStreamId: string) {
  try {
    const stream = await mux.video.liveStreams.retrieve(muxLiveStreamId);
    return {
      id: stream.id,
      status: stream.status,
      streamKey: stream.stream_key,
      playbackId: stream.playback_ids?.[0]?.id,
      activeAssetId: stream.active_asset_id,
      recentAssetIds: stream.recent_asset_ids,
    };
  } catch (err) {
    console.error(`[Mux] Error fetching live stream ${muxLiveStreamId}:`, err);
    return null;
  }
}

/**
 * Deletes a live stream from Mux
 */
export async function deleteMuxLiveStream(muxLiveStreamId: string) {
  try {
    await mux.video.liveStreams.delete(muxLiveStreamId);
    return true;
  } catch (err) {
    console.error(`[Mux] Error deleting live stream ${muxLiveStreamId}:`, err);
    return false;
  }
}

/**
 * Generates a signed Mux JWT token for an authorized user to watch the stream
 */
export function generateMuxPlaybackToken(playbackId: string, durationMinutes = 30): string {
  const signingKeyId = process.env.MUX_SIGNING_KEY_ID;
  if (!signingKeyId) {
    throw new Error("MUX_SIGNING_KEY_ID is missing in environment variables.");
  }

  const privateKey = getNormalizedPrivateKey();

  const token = jwt.sign(
    {
      sub: playbackId,
      aud: "v", // 'v' = video playback
      exp: Math.floor(Date.now() / 1000) + durationMinutes * 60,
    },
    privateKey,
    {
      algorithm: "RS256",
      keyid: signingKeyId,
    }
  );

  return token;
}
