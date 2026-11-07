"use client";

import { useState } from "react";
import { LinkButton } from "@/components/ui/Button";
import Countdown from "@/components/ui/Countdown";
import type { HeroData } from "@/sanity/lib/queries";

interface HeroProps {
  data?: HeroData | null;
}

export default function Hero({ data }: HeroProps) {
  const [videoFailed, setVideoFailed] = useState(false);

  if (!data || !data.title) {
    return null;
  }

  const videoSrc = data.videoFileUrl || data.videoUrl;
  const countdownDate = data.countdownDate ? new Date(data.countdownDate) : null;

  return (
    <header className="relative h-screen w-full overflow-hidden bg-deep">
      {/* Background media */}
      <div className="absolute inset-0">
        {videoSrc && !videoFailed && (
          <video
            key={videoSrc}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            onError={() => setVideoFailed(true)}
          >
            <source src={videoSrc} />
          </video>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-deep/90 via-deep/40 to-deep/20" />
      </div>

      {/* Hero content */}
      <div className="relative z-20 flex h-full flex-col items-center justify-center text-center px-6">
        {data.eyebrow && (
          <p className="eyebrow text-teal mb-5">
            {data.eyebrow}
          </p>
        )}

        <h1 className="font-sans font-semibold text-paper text-display-md text-balance">
          {data.title}
        </h1>

        {data.subtitle && (
          <p className="mt-5 text-paper/90 text-lg md:text-xl max-w-xl text-balance">
            {data.subtitle}
          </p>
        )}

        {countdownDate && (
          <Countdown
            target={countdownDate}
            className="mt-10"
          />
        )}

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          {data.registerButtonText && (
            <LinkButton
              href="/register"
              variant="secondary"
              className="min-w-[180px]"
            >
              {data.registerButtonText}
            </LinkButton>
          )}

          {data.sponsorButtonText && (
            <LinkButton
              href="/sponsorship"
              variant="glass"
              className="min-w-[180px]"
            >
              {data.sponsorButtonText}
            </LinkButton>
          )}
        </div>
      </div>
    </header>
  );
}
