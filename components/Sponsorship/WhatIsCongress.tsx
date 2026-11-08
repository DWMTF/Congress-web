"use client";

import { motion } from "framer-motion";
import { Waves, Mountain, Brain, Compass, Users2, Leaf, type LucideIcon } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IconBadge } from "@/components/ui/IconBadge";
import type { SponsorshipPageData, SponsorshipPillarData } from "@/sanity/lib/queries";

const PILLAR_ICON_MAP: Record<string, LucideIcon> = {
  brain: Brain,
  mountain: Mountain,
  users: Users2,
  waves: Waves,
  compass: Compass,
  leaf: Leaf,
};

interface WhatIsCongressProps {
  pageData?: SponsorshipPageData | null;
  pillars?: SponsorshipPillarData[] | null;
}

export default function WhatIsCongress({ pageData, pillars }: WhatIsCongressProps = {}) {
  const validPillars = pillars?.filter((p) => p.title) || [];

  return (
    <section className="relative w-full bg-paper py-16 md:py-20 px-6 border-t border-deep/10">
      <div className="max-w-6xl mx-auto space-y-12 md:space-y-16">
        <SectionHeading
          eyebrow={pageData?.whatIsCongressEyebrow || "The Congress Explained"}
          title={pageData?.whatIsCongressTitle || "What is Blue Mind Congress 2027?"}
          subtitle={
            pageData?.whatIsCongressSubtitle ||
            "A landmark international summit exploring how water, nature, and neuroscience can reshape global tourism, mental health, and ecological conservation."
          }
          align="center"
          className="mx-auto"
        />

        {/* Narrative Box */}
        {(pageData?.manifestoQuote || !pageData) && (
          <GlassCard className="p-7 md:p-10 max-w-4xl mx-auto bg-gradient-to-b from-teal/[0.04] to-deep/[0.02]">
            <div className="space-y-4 text-center">
              <p className="text-xl md:text-2xl font-display font-medium text-deep leading-snug">
                &ldquo;
                {pageData?.manifestoQuote ||
                  "We are beginning to understand what humans have intuitively felt for millennia: being near, in, on, or under water makes us healthier, happier, and more connected."}
                &rdquo;
              </p>
              {(pageData?.manifestoAttribution || !pageData) && (
                <p className="text-sm text-deep/60">
                  —{" "}
                  {pageData?.manifestoAttribution ||
                    "Blue Mind Congress 2027 Manifesto · Kelani River Valley, Sri Lanka"}
                </p>
              )}
            </div>
          </GlassCard>
        )}

        {/* Pillar Cards */}
        {validPillars.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6">
            {validPillars.map((pillar, i) => {
              const Icon = (pillar.iconType && PILLAR_ICON_MAP[pillar.iconType]) || Brain;

              return (
                <motion.div
                  key={pillar._id || pillar.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <GlassCard className="h-full p-8 flex flex-col justify-between border-deep/10 hover:border-teal/30 hover:shadow-xl hover:shadow-teal/5 transition-all">
                    <div className="space-y-4">
                      <IconBadge icon={Icon} />
                      <div>
                        {pillar.subtitle && (
                          <span className="text-xs font-semibold text-teal uppercase tracking-wider block mb-1">
                            {pillar.subtitle}
                          </span>
                        )}
                        <h3 className="font-display font-semibold text-xl text-deep">
                          {pillar.title}
                        </h3>
                      </div>
                      <p className="text-sm text-deep/70 leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
