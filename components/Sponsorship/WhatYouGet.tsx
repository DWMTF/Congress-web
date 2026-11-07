"use client";

import { motion } from "framer-motion";
import { Check, Star, Award, Zap, Heart, ArrowRight, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IconBadge } from "@/components/ui/IconBadge";
import { cn } from "@/lib/utils";
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
    <section id="tiers" className="relative w-full bg-paper py-28 md:py-36 px-6 border-t border-deep/10">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          eyebrow={heading?.eyebrow || "Deliverables & Tiers"}
          title={heading?.title || "What You Can Get"}
          subtitle={
            heading?.subtitle ||
            "Meaningful ROI through global brand prestige, executive networking, and verified sustainability impact."
          }
          align="center"
          className="mx-auto mb-20"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {validTiers.map((tier, i) => {
            const Icon = (tier.iconType && ICON_MAP[tier.iconType]) || Star;
            const features = tier.features || [];

            return (
              <motion.div
                key={tier._id || tier.name}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4 }}
                className={cn(
                  "group relative rounded-[2rem] p-8 flex flex-col justify-between transition-all duration-300",
                  tier.highlight
                    ? "bg-white border-2 border-teal/40 shadow-xl shadow-teal/5 ring-1 ring-teal/20"
                    : "bg-white border border-deep/10 hover:border-deep/25 shadow-xs"
                )}
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <IconBadge icon={Icon} />
                    {tier.badge && (
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-medium tracking-wide",
                          tier.highlight
                            ? "bg-teal text-paper shadow-xs"
                            : "bg-teal/10 text-teal border border-teal/20"
                        )}
                      >
                        {tier.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display font-semibold text-2xl text-deep mb-2">
                    {tier.name}
                  </h3>

                  <div className="font-display text-3xl font-semibold text-deep tracking-tight mb-4">
                    {tier.price}
                  </div>

                  {tier.description && (
                    <p className="text-sm text-deep/65 leading-relaxed mb-6">
                      {tier.description}
                    </p>
                  )}

                  {/* Features list */}
                  {features.length > 0 && (
                    <ul className="space-y-3 pt-6 mb-8 border-t border-deep/10">
                      {features.map((feat, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-sm text-deep/75 leading-snug"
                        >
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal/10 text-teal mt-0.5">
                            <Check className="h-3 w-3 stroke-[2.5]" />
                          </span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <a
                  href="#inquiry"
                  className={cn(
                    "inline-flex w-full items-center justify-center rounded-full font-medium px-6 py-3.5 transition-colors gap-2 text-sm",
                    tier.highlight
                      ? "bg-deep text-paper hover:bg-deep/90 shadow-sm"
                      : "border border-deep/15 text-deep hover:bg-deep/5"
                  )}
                >
                  <span>Select Tier</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
