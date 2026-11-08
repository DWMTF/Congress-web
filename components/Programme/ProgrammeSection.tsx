"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { SectionHeading } from "@/components/ui/SectionHeading";
import TrackCards from "./TrackCards";
import SpeakerCarousel from "./SpeakerCarousel";
import type { ProgrammeTrackData, SpeakerData } from "@/sanity/lib/queries";

gsap.registerPlugin(ScrollTrigger);

interface ProgrammeSectionProps {
  speakers?: SpeakerData[] | null;
  tracks?: ProgrammeTrackData[] | null;
  heading?: {
    eyebrow?: string;
    title?: string;
  };
}

export default function ProgrammeSection({
  speakers,
  tracks,
  heading,
}: ProgrammeSectionProps) {
  const headingRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 80%",
            },
          }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  const hasSpeakers = Boolean(speakers && speakers.length > 0);
  const hasTracks = Boolean(tracks && tracks.length > 0);

  if (!hasSpeakers && !hasTracks) {
    return null;
  }

  return (
    <section
      id="programme"
      className="relative w-full bg-paper py-16 md:py-20 px-6 md:px-16"
    >
      <div className="max-w-6xl mx-auto">
        {hasTracks && <TrackCards tracks={tracks} />}

        {hasSpeakers && (
          <div className={hasTracks ? "mt-14 md:mt-18" : ""}>
            <SpeakerCarousel speakers={speakers} heading={heading} />
          </div>
        )}
      </div>
    </section>
  );
}
