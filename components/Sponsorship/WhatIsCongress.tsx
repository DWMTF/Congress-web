"use client";

import { motion } from "framer-motion";
import { Waves, Mountain, Brain, Compass, Users2, Leaf } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IconBadge } from "@/components/ui/IconBadge";

const PILLARS = [
  {
    icon: Brain,
    title: "Neuroscience of Water",
    subtitle: "The Science of Healing",
    description:
      "Investigating the scientifically backed 'Blue Mind' state how proximity to moving waters lowers cortisol, stimulates neuroplasticity, and sparks creative clarity.",
  },
  {
    icon: Mountain,
    title: "Sustainable Mountain & River Tourism",
    subtitle: "Regenerative Economics",
    description:
      "Transforming high-impact adventure travel into regenerative eco-tourism models that protect delicate river headwaters and mountain biomes.",
  },
  {
    icon: Users2,
    title: "Global Leadership Convergence",
    subtitle: "40+ Nations Connected",
    description:
      "Uniting over 1,200 in-person leaders and 10,000+ global livestream delegates including scientists, government ministers, hotel leaders, and youth activists.",
  },
];

export default function WhatIsCongress() {
  return (
    <section className="w-full bg-paper py-16 md:py-24 px-6 border-t border-deep/10">
      <div className="max-w-6xl mx-auto space-y-16">
        <SectionHeading
          eyebrow="The Congress Explained"
          title="What is Blue Mind Congress 2027?"
          subtitle="A landmark international summit exploring how water, nature, and neuroscience can reshape global tourism, mental health, and ecological conservation."
          align="center"
          className="mx-auto"
        />

        {/* Narrative Box */}
        <GlassCard className="p-8 md:p-12 max-w-4xl mx-auto bg-gradient-to-b from-teal/[0.04] to-deep/[0.02]">
          <div className="space-y-4 text-center">
            <p className="text-xl md:text-2xl font-display font-medium text-deep leading-snug">
              &ldquo;We are beginning to understand what humans have intuitively felt for millennia: being near, in, on, or under water makes us healthier, happier, and more connected.&rdquo;
            </p>
            <p className="text-sm text-deep/60">
              — Blue Mind Congress 2027 Manifesto · Kelani River Valley, Sri Lanka
            </p>
          </div>
        </GlassCard>

        {/* 3 Pillar Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <GlassCard className="h-full p-8 flex flex-col justify-between border-deep/10 hover:border-teal/30 hover:shadow-xl hover:shadow-teal/5 transition-all">
                <div className="space-y-4">
                  <IconBadge icon={pillar.icon} />
                  <div>
                    <span className="text-xs font-semibold text-teal uppercase tracking-wider block mb-1">
                      {pillar.subtitle}
                    </span>
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
          ))}
        </div>
      </div>
    </section>
  );
}
