"use client";

import { useState } from "react";
import { LinkButton } from "@/components/ui/Button";
import Countdown from "@/components/ui/Countdown";

export default function Hero() {
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <header className="relative h-screen w-full overflow-hidden">
      {/* Background media */}
      <div className="absolute inset-0">
        {!videoFailed && (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            onError={() => setVideoFailed(true)}
          >
            <source src="/videos/hero-loop.webm" type="video/webm" />
            <source src="/videos/hero-loop.mp4" type="video/mp4" />
          </video>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-deep/70 via-deep/10 to-transparent" />
      </div>

      {/* Hero content */}
      <div className="relative z-20 flex h-full flex-col items-center justify-center text-center px-6">
        <p className="eyebrow text-teal mb-5">
          Water &amp; Mountain Tourism Foundation
        </p>

        <h1 className="font-sans font-semibold text-paper text-display-md text-balance">
          Blue Mind Congress 2027
        </h1>

        <p className="mt-5 text-paper/90 text-lg md:text-xl max-w-xl text-balance">
          Discover how water transforms the human mind.
        </p>

        <Countdown
          target={new Date("2027-05-01T09:00:00")}
          className="mt-10"
        />

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <LinkButton
            href="/register"
            variant="secondary"
            className="min-w-[180px]"
          >
            Register
          </LinkButton>

          <LinkButton
            href="/sponsorship"
            variant="glass"
            className="min-w-[180px]"
          >
            Become a Sponsor
          </LinkButton>
        </div>
      </div>
    </header>
  );
}