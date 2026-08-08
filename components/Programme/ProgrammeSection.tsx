"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { SectionHeading } from "@/components/ui/SectionHeading";
import TrackCards from "./TrackCards";
import SpeakerCarousel from "./SpeakerCarousel";

gsap.registerPlugin(ScrollTrigger);

export default function ProgrammeSection() {
  const headingRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
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
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="programme"
      className="relative w-full bg-paper py-28 md:py-36 px-6 md:px-16"
    >
      <div className="max-w-6xl mx-auto">
        {/* <div ref={headingRef} className="mb-16">
          <SectionHeading
            eyebrow="Programme"
            title="Three tracks, one current."
            subtitle="Every track feeds the same idea from a different angle — the evidence, the experience, and the community that holds it together."
          />
        </div> */}

        {/* <TrackCards /> */}

        <div className="mt-28 md:mt-36">
          <SpeakerCarousel />
        </div>
      </div>
    </section>
  );
}
