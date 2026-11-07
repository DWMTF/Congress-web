"use client";

import { motion } from "framer-motion";
import { Check, Star, Award, Zap, Heart, ArrowRight, LucideIcon } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { SponsorshipTierData } from "@/sanity/lib/queries";

const ICON_MAP: Record<string, LucideIcon> = {
  heart: Heart,
  zap: Zap,
  award: Award,
  star: Star,
};

interface WhatYouGetProps {
  tiers?: SponsorshipTierData[] | null;
  heading?: {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
  };
}

export default function WhatYouGet({ tiers, heading }: WhatYouGetProps) {
  if (!tiers || tiers.length === 0) {
    return null;
  }

  const validTiers = tiers.filter((t) => t.name && t.price);

  if (validTiers.length === 0) {
    return null;
  }

  return (
    <section id="tiers" className="w-full bg-paper py-16 md:py-24 px-6 border-t border-deep/10">
      <div className="max-w-7xl mx-auto space-y-16">
        <SectionHeading
          eyebrow={heading?.eyebrow || "Deliverables & Tiers"}
          title={heading?.title || "What You Can Get"}
          subtitle={
            heading?.subtitle ||
            "Meaningful ROI through global brand prestige, executive networking, and verified sustainability impact."
          }
          align="center"
          className="mx-auto"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {validTiers.map((tier, i) => {
            const Icon = (tier.iconType && ICON_MAP[tier.iconType]) || Star;
            const features = tier.features || [];

            return (
              <motion.div
                key={tier._id || tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex"
              >
                <GlassCard
                  className={`p-7 flex flex-col justify-between w-full relative transition-all duration-300 ${
                    tier.highlight
                      ? "border-2 border-teal shadow-xl shadow-teal/10 bg-white ring-4 ring-teal/5"
                      : "border border-deep/10 bg-white hover:border-deep/30"
                  }`}
                >
                  <div>
                    {/* Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal/10 text-teal">
                        <Icon className="h-5 w-5" />
                      </span>
                      {tier.badge && (
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            tier.highlight
                              ? "bg-teal text-white font-semibold"
                              : "bg-deep/5 text-deep/70"
                          }`}
                        >
                          {tier.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="font-display font-semibold text-xl text-deep mb-1">
                      {tier.name}
                    </h3>

                    <div className="text-2xl font-bold font-sans text-deep mb-3">
                      {tier.price}
                    </div>

                    {tier.description && (
                      <p className="text-xs text-deep/60 leading-relaxed mb-6">
                        {tier.description}
                      </p>
                    )}

                    {/* Features list */}
                    {features.length > 0 && (
                      <ul className="space-y-2.5 mb-8 border-t border-deep/10 pt-4">
                        {features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-deep/75 leading-tight">
                            <Check className="h-3.5 w-3.5 text-teal shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <a
                    href="#inquire"
                    className={`w-full py-2.5 px-4 rounded-xl text-center text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      tier.highlight
                        ? "bg-teal text-paper hover:bg-teal/90 shadow-md shadow-teal/20"
                        : "bg-deep/5 hover:bg-deep/10 text-deep"
                    }`}
                  >
                    Select Tier
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
