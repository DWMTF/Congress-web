"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { SponsorshipPageData } from "@/sanity/lib/queries";

interface SponsorshipHeroProps {
  data?: SponsorshipPageData | null;
}

export default function SponsorshipHero({ data }: SponsorshipHeroProps = {}) {
  return (
    <section className="relative w-full bg-paper pt-24 pb-16 md:pt-32 md:pb-24 px-6 text-center overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-teal/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        <p className="eyebrow text-teal mb-4">
          {data?.heroEyebrow || "Partnerships & Sponsorship 2027"}
        </p>

        <h1 className="font-display font-semibold text-display-lg text-deep text-balance">
          {data?.heroTitle || "Champion the Future of Water, Mind & Mountain Tourism."}
        </h1>

        <p className="text-deep/70 text-lg md:text-xl max-w-2xl mx-auto text-balance leading-relaxed">
          {data?.heroSubtitle ||
            "Position your brand at the forefront of global neuroscience, sustainable travel, and environmental stewardship in the Kelani River Valley."}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <a
            href="#inquiry"
            className="inline-flex items-center justify-center rounded-full font-medium px-8 py-3.5 bg-deep text-paper hover:bg-deep/90 transition-colors shadow-sm gap-2"
          >
            {data?.partnerButtonText || "Become a Partner"}
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="#tiers"
            className="inline-flex items-center justify-center rounded-full font-medium px-8 py-3.5 border border-deep/15 text-deep hover:bg-deep/5 transition-colors gap-2"
          >
            {data?.tiersButtonText || "Explore Sponsorship Tiers"}
          </a>
        </div>
      </motion.div>
    </section>
  );
}
