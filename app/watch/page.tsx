"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Radio,
  Lock,
  Clock,
  AlertCircle,
  RefreshCw,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

// Dynamically import MuxPlayer to avoid SSR window issues
const MuxPlayer = dynamic(() => import("@mux/mux-player-react"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-video bg-deep/90 flex flex-col items-center justify-center text-paper rounded-3xl animate-pulse">
      <Radio className="h-10 w-10 text-teal animate-spin mb-3" />
      <p className="text-sm font-medium">Initializing secure video player...</p>
    </div>
  ),
});

interface StreamState {
  authenticated: boolean;
  authorized: boolean;
  streamAvailable?: boolean;
  title?: string;
  playbackId?: string;
  token?: string;
  status?: string;
  isLive?: boolean;
  reason?: "no_registration" | "unconfirmed";
  error?: string;
  message?: string;
}

export default function WatchPage() {
  const [streamData, setStreamData] = useState<StreamState | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function checkStreamAccess() {
    try {
      setRefreshing(true);
      const res = await fetch("/api/stream/token");
      const data = await res.json();
      setStreamData(data);
    } catch {
      setStreamData({
        authenticated: false,
        authorized: false,
        error: "Network error connecting to stream server. Please retry.",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    checkStreamAccess();

    // Periodic check every 30 seconds to catch stream starting
    const interval = setInterval(checkStreamAccess, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-paper pb-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Stream Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-deep/10">
          <div>
            <div className="flex items-center gap-3">
              {streamData?.isLive ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/15 text-red-600 animate-pulse">
                  <span className="h-2 w-2 rounded-full bg-red-600 animate-ping" />
                  LIVE NOW
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-700">
                  <Clock className="h-3.5 w-3.5" />
                  BROADCAST STANDBY
                </span>
              )}
              <span className="text-xs font-medium text-deep/60">
                Kelani River Valley, Sri Lanka
              </span>
            </div>

            <h1 className="font-display font-bold text-2xl sm:text-3xl text-deep mt-2">
              {streamData?.title || "Blue Mind Congress 2027 — Plenary Livestream"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={checkStreamAccess}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 text-xs"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
              Refresh Stream
            </Button>
          </div>
        </div>

        {/* Main Video Viewport & Q&A */}
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="space-y-6">
            {loading ? (
              <div className="w-full aspect-video bg-deep/90 flex flex-col items-center justify-center text-paper rounded-3xl">
                <Radio className="h-10 w-10 text-teal animate-spin mb-3" />
                <p className="text-sm font-medium">Verifying ticket credentials...</p>
              </div>
            ) : !streamData?.authenticated ? (
              /* Case 1: Unauthenticated */
              <GlassCard className="aspect-video flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-deep/10 flex items-center justify-center text-deep">
                  <Lock className="h-8 w-8 text-teal" />
                </div>
                <h3 className="font-display font-semibold text-2xl text-deep">
                  Sign In Required
                </h3>
                <p className="text-sm text-deep/70 max-w-md">
                  This live stream is restricted to verified Congress delegates. Please sign in to authenticate your ticket.
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <Link
                    href="/login?next=/watch"
                    className="px-6 py-3 rounded-full bg-deep text-paper text-sm font-medium hover:bg-deep/90 transition-colors"
                  >
                    Sign In to Watch
                  </Link>
                  <Link
                    href="/register"
                    className="px-6 py-3 rounded-full border border-deep/15 text-deep text-sm font-medium hover:bg-deep/5 transition-colors"
                  >
                    Register for Congress
                  </Link>
                </div>
              </GlassCard>
            ) : !streamData.authorized ? (
              /* Case 2: Authenticated but Unconfirmed / No Registration */
              <GlassCard className="aspect-video flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                  <AlertCircle className="h-8 w-8" />
                </div>
                <h3 className="font-display font-semibold text-2xl text-deep">
                  Ticket Confirmation Required
                </h3>
                <p className="text-sm text-deep/70 max-w-md">
                  {streamData.error ||
                    "Your account does not have an active confirmed registration pass for the livestream."}
                </p>
                <div className="pt-2">
                  <Link
                    href="/payment"
                    className="px-6 py-3 rounded-full bg-teal text-deep font-semibold text-sm hover:bg-teal/90 transition-colors shadow-sm inline-flex items-center gap-2"
                  >
                    Complete Ticket Payment
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </GlassCard>
            ) : !streamData.streamAvailable ? (
              /* Case 3: Authorized, but stream not yet created */
              <GlassCard className="aspect-video flex flex-col items-center justify-center p-8 text-center space-y-4 bg-gradient-to-b from-teal/[0.04] to-deep/[0.02]">
                <div className="h-16 w-16 rounded-full bg-teal/15 flex items-center justify-center text-teal">
                  <Clock className="h-8 w-8" />
                </div>
                <h3 className="font-display font-semibold text-2xl text-deep">
                  Live Stream Offline
                </h3>
                <p className="text-sm text-deep/70 max-w-md leading-relaxed">
                  The Congress broadcast has not started yet. The stream will automatically connect as soon as the session begins.
                </p>
                <div className="flex items-center gap-2 text-xs font-semibold text-teal bg-teal/10 px-3 py-1.5 rounded-full">
                  <ShieldCheck className="h-4 w-4" />
                  Ticket Verified · Access Granted
                </div>
              </GlassCard>
            ) : (
              /* Case 4: Authorized & Stream Available -> MUX Player with signed token */
              <div className="space-y-3">
                <div className="rounded-3xl overflow-hidden shadow-2xl border border-deep/15 aspect-video bg-black relative">
                  <MuxPlayer
                    playbackId={streamData.playbackId}
                    tokens={{ playback: streamData.token }}
                    metadata={{
                      video_title: streamData.title || "Blue Mind Congress 2027",
                    }}
                    streamType="live"
                    autoPlay
                    accentColor="#3aafa9"
                    primaryColor="#ffffff"
                    secondaryColor="#0a4d68"
                    className="w-full h-full"
                  />
                </div>

                {!streamData.isLive && (
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs text-amber-800">
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-600" />
                      Broadcast is currently in standby. Player will begin transmitting when the live feed is active.
                    </span>
                    <button
                      onClick={checkStreamAccess}
                      className="underline font-semibold hover:text-amber-900"
                    >
                      Check now
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Delegate Q&A Notice */}
          <GlassCard className="p-6 md:p-8 space-y-3 bg-gradient-to-b from-teal/[0.04] to-deep/[0.02]">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-teal" />
              <h3 className="font-display font-semibold text-base text-deep">
                Delegate Q&amp;A
              </h3>
            </div>
            <p className="text-xs text-deep/70 leading-relaxed max-w-3xl">
              Have a question for the keynote speakers? Questions submitted by livestream delegates are relayed live to the stage moderators during the closing 15 minutes of each track.
            </p>
            <a
              href="mailto:questions@bluemindcongress.org"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal hover:underline pt-1"
            >
              Submit a Question via Email ➔
            </a>
          </GlassCard>
        </div>
      </div>
    </main>
  );
}
