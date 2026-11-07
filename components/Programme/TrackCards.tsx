"use client";

import { motion } from "framer-motion";
import { FlaskConical, Compass, Users, LucideIcon } from "lucide-react";
import { IconBadge } from "@/components/ui/IconBadge";
import type { ProgrammeTrackData } from "@/sanity/lib/queries";

const ICON_MAP: Record<string, LucideIcon> = {
  science: FlaskConical,
  adventure: Compass,
  community: Users,
};

interface TrackCardsProps {
  tracks?: ProgrammeTrackData[] | null;
}

export default function TrackCards({ tracks }: TrackCardsProps) {
  if (!tracks || tracks.length === 0) {
    return null;
  }

  const validTracks = tracks.filter((t) => t.title);

  if (validTracks.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {validTracks.map((track, i) => {
        const Icon =
          (track.iconType && ICON_MAP[track.iconType]) || FlaskConical;

        return (
          <motion.div
            key={track._id || track.title}
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
                <IconBadge icon={Icon} />
                {track.number && (
                  <span className="font-display text-deep/20 text-3xl font-medium">
                    {track.number}
                  </span>
                )}
              </div>

              <h4 className="font-display font-semibold text-2xl text-deep mb-3">
                {track.title}
              </h4>
              {track.description && (
                <p className="text-deep/65 leading-relaxed">{track.description}</p>
              )}
            </div>

            <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-teal">
              View sessions
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
