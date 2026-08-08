"use client";

import { motion } from "framer-motion";
import { FlaskConical, Compass, Users } from "lucide-react";
import { IconBadge } from "@/components/ui/IconBadge";

const TRACKS = [
  {
    icon: FlaskConical,
    number: "01",
    title: "Science & Policy",
    description:
      "Peer-reviewed research on water, cognition and wellbeing — and what it means for how cities plan around blue space.",
  },
  {
    icon: Compass,
    number: "02",
    title: "Lifestyle & Adventure",
    description:
      "Rafting, open-water swimming and mountain trail sessions that turn Blue Mind theory into something felt, not just read.",
  },
  {
    icon: Users,
    number: "03",
    title: "Public & Community",
    description:
      "Local voices, river custodianship and public health outreach — grounding the Congress in the valley that hosts it.",
  },
];

export default function TrackCards() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {TRACKS.map((track, i) => (
        <motion.div
          key={track.title}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.02, y: -4 }}
          className="glass-highlight group relative rounded-3xl border border-deep/10 bg-white p-8 min-h-[280px] flex flex-col justify-between cursor-default"
          style={{ transition: "border-color 0.4s ease, box-shadow 0.4s ease" }}
        >
          <div
            className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              padding: 1,
              background: "linear-gradient(135deg, #3AAFA9, #0A4D68)",
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />

          <div>
            <div className="flex items-center justify-between mb-8">
              <IconBadge icon={track.icon} />
              <span className="font-display text-deep/20 text-3xl font-medium">
                {track.number}
              </span>
            </div>

            <h4 className="font-display font-semibold text-2xl text-deep mb-3">
              {track.title}
            </h4>
            <p className="text-deep/65 leading-relaxed">{track.description}</p>
          </div>

          <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-teal">
            View sessions
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </span>
        </motion.div>
      ))}
    </div>
  );
}
