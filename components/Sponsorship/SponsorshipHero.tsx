"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { SponsorshipPageData } from "@/sanity/lib/queries";

interface SponsorshipHeroProps {
  data?: SponsorshipPageData | null;
  videoSrc?: string | null;
}

export default function SponsorshipHero({ data, videoSrc }: SponsorshipHeroProps = {}) {
  const [videoFailed, setVideoFailed] = useState(false);
  const resolvedVideo = data?.videoFileUrl || data?.videoUrl || videoSrc;

  return (
    <header className="relative min-h-[65vh] md:min-h-[75vh] w-full overflow-hidden bg-deep flex items-center justify-center">
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

        {/* Overlay matching root hero */}
        <div className="absolute inset-0 bg-gradient-to-t from-deep/95 via-deep/65 to-deep/40" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-20 max-w-4xl mx-auto px-6 py-20 md:py-24 text-center space-y-6"
      >
        <p className="eyebrow text-teal mb-4">
          {data?.heroEyebrow || "Partnerships & Sponsorship 2027"}
        </p>

        <h1 className="font-display font-semibold text-display-lg text-paper text-balance">
          {data?.heroTitle || "Champion the Future of Water, Mind & Mountain Tourism."}
        </h1>

        <p className="text-paper/85 text-lg md:text-xl max-w-2xl mx-auto text-balance leading-relaxed">
          {data?.heroSubtitle ||
            "Position your brand at the forefront of global neuroscience, sustainable travel, and environmental stewardship in the Kelani River Valley."}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <a
            href="#inquiry"
            className="inline-flex items-center justify-center rounded-full font-medium px-8 py-3.5 bg-paper text-deep hover:bg-paper/90 transition-colors shadow-sm gap-2"
          >
            <span>{data?.partnerButtonText || "Become a Partner"}</span>
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="#tiers"
            className="inline-flex items-center justify-center rounded-full font-medium px-8 py-3.5 glass text-paper hover:bg-white/20 transition-colors gap-2"
          >
            <span>{data?.tiersButtonText || "Explore Sponsorship Tiers"}</span>
          </a>
        </div>
      </motion.div>
    </header>
  );
}
