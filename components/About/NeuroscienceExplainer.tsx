"use client";

import { motion } from "framer-motion";
import { Waves, HeartPulse, Eye, Wind, LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IconBadge } from "@/components/ui/IconBadge";
import type { NeuroscienceFactData } from "@/sanity/lib/queries";

const ICON_MAP: Record<string, LucideIcon> = {
  waves: Waves,
  heartPulse: HeartPulse,
  eye: Eye,
  wind: Wind,
};

interface NeuroscienceExplainerProps {
  facts?: NeuroscienceFactData[] | null;
  heading?: {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
  };
}

export default function NeuroscienceExplainer({ facts, heading }: NeuroscienceExplainerProps) {
  if (!facts || facts.length === 0) {
    return null;
  }

  const validFacts = facts.filter((f) => f.title && f.text);

  if (validFacts.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full bg-paper py-16 md:py-20 px-6">
      <SectionHeading
        eyebrow={heading?.eyebrow || "The neuroscience"}
        title={heading?.title || "Why water changes the mind."}
        subtitle={heading?.subtitle || "Not a metaphor, a measurable shift in brain and body chemistry."}
        align="center"
        className="mx-auto mb-10 md:mb-12"
      />

      <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {validFacts.map((fact, i) => {
          const Icon =
            (fact.iconType && ICON_MAP[fact.iconType]) || Waves;

          return (
            <motion.div
              key={fact._id || fact.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              className="rounded-3xl border border-deep/10 bg-white p-7"
            >
              <IconBadge icon={Icon} className="mb-6" />
              <h4 className="font-display font-semibold text-lg text-deep mb-2">
                {fact.title}
              </h4>
              <p className="text-sm text-deep/65 leading-relaxed">{fact.text}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
