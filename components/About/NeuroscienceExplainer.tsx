"use client";

import { motion } from "framer-motion";
import { Waves, HeartPulse, Eye, Wind } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IconBadge } from "@/components/ui/IconBadge";

const FACTS = [
  {
    icon: Waves,
    title: "Alpha waves rise",
    text: "Near moving water, the brain shifts toward alpha activity the relaxed-alert state seen in light meditation.",
  },
  {
    icon: HeartPulse,
    title: "Cortisol falls",
    text: "Stress hormone levels measurably drop within minutes of exposure to blue space, before the mind even registers calm.",
  },
  {
    icon: Eye,
    title: "Attention restores",
    text: "The gentle, repetitive motion of water offers 'soft fascination' enough to hold focus without demanding effort.",
  },
  {
    icon: Wind,
    title: "Breathing slows",
    text: "The rhythm of waves and the colour blue itself are linked to slower heart rate and deeper, longer breaths.",
  },
];

export default function NeuroscienceExplainer() {
  return (
    <section className="relative w-full bg-paper py-28 md:py-36 px-6">
      <SectionHeading
        eyebrow="The neuroscience"
        title="Why water changes the mind."
        subtitle="Not a metaphor, a measurable shift in brain and body chemistry."
        align="center"
        className="mx-auto mb-16"
      />

      <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {FACTS.map((fact, i) => (
          <motion.div
            key={fact.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: i * 0.08 }}
            className="rounded-3xl border border-deep/10 bg-white p-7"
          >
            <IconBadge icon={fact.icon} className="mb-6" />
            <h4 className="font-display font-semibold text-lg text-deep mb-2">
              {fact.title}
            </h4>
            <p className="text-sm text-deep/65 leading-relaxed">{fact.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
