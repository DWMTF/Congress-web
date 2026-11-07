"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { PressPageData } from "@/sanity/lib/queries";

interface PressHeroProps {
  data?: PressPageData | null;
  videoSrc?: string | null;
}

export default function PressHero({ data, videoSrc }: PressHeroProps = {}) {
  const [videoFailed, setVideoFailed] = useState(false);
  const resolvedVideo = data?.videoFileUrl || data?.videoUrl || videoSrc;

  return (
    <header className="relative min-h-[55vh] md:min-h-[65vh] w-full overflow-hidden bg-deep flex items-center justify-center">
      {/* Background media */}
      <div className="absolute inset-0">
        {resolvedVideo && !videoFailed && (
          <video
            key={resolvedVideo}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            onError={() => setVideoFailed(true)}
          >
            <source src={resolvedVideo} />
          </video>
        )}

        {/* Overlay matching root and sponsorship hero */}
        <div className="absolute inset-0 bg-gradient-to-t from-deep/95 via-deep/65 to-deep/40" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-20 max-w-3xl mx-auto px-6 py-20 md:py-28 text-center space-y-4"
      >
        <p className="eyebrow text-teal mb-3">
          {data?.heroEyebrow || "Press & media"}
        </p>

        <h1 className="font-display font-semibold text-display-lg text-paper text-balance">
          {data?.heroTitle || "Everything you need to cover the Congress."}
        </h1>

        <p className="text-paper/85 text-lg md:text-xl max-w-xl mx-auto text-balance leading-relaxed">
          {data?.heroSubtitle ||
            "Approved assets, facts and figures ready to use, no permissions needed."}
        </p>
      </motion.div>
    </header>
  );
}
