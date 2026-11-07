"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import type { StageData } from "@/sanity/lib/queries";
import { urlForImage } from "@/sanity/lib/image";

gsap.registerPlugin(ScrollTrigger);

interface CongressStagesProps {
  stages?: StageData[] | null;
  heading?: {
    eyebrow?: string;
    title?: string;
  };
}

export default function CongressStages({ stages, heading }: CongressStagesProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  const validStages =
    stages && stages.length > 0
      ? stages.filter((s) => s.title && s.label)
      : [];

  useLayoutEffect(() => {
    if (validStages.length === 0 || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const path = pathRef.current;
      if (!track || !path) return;

      const length = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });

      const getScrollDistance = () => track.scrollWidth - window.innerWidth;

      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${getScrollDistance()}`,
        scrub: 1,
        pin: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          gsap.set(track, { x: -getScrollDistance() * self.progress });
          gsap.set(path, { strokeDashoffset: length * (1 - self.progress) });
        },
      });

      return () => st.kill();
    }, sectionRef);

    return () => ctx.revert();
  }, [validStages.length]);

  if (validStages.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative h-screen w-full overflow-hidden bg-paper"
    >
      <div className="absolute top-14 left-6 md:left-16 z-10">
        <p className="eyebrow text-teal mb-3">
          {heading?.eyebrow || "The Congress, in three stages"}
        </p>
        <h3 className="font-display font-medium text-display-md text-deep max-w-md text-balance">
          {heading?.title || "A journey, not just an agenda."}
        </h3>
      </div>

      <svg
        className="absolute inset-0 h-full w-full pointer-events-none"
        viewBox="0 0 3600 800"
        preserveAspectRatio="none"
      >
        <path
          ref={pathRef}
          d="M 0 400 C 300 250, 600 550, 900 400 S 1500 250, 1800 400 S 2400 550, 2700 400 S 3300 250, 3600 400"
          fill="none"
          stroke="#3AAFA9"
          strokeWidth="3"
          strokeOpacity="0.4"
        />
      </svg>

      <div ref={trackRef} className="flex h-full items-center will-change-transform">
        {validStages.map((stage, i) => {
          const imageUrl = stage.image
            ? urlForImage(stage.image)?.url()
            : null;

          return (
            <article
              key={stage._id || stage.title}
              className="relative flex-shrink-0 w-screen h-full flex items-center justify-center px-6 md:px-20"
            >
              <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center max-w-5xl w-full">
                <div className={i % 2 === 1 ? "md:order-2" : ""}>
                  <div className="relative aspect-[4/5] w-full max-w-md rounded-3xl overflow-hidden mx-auto bg-deep/5">
                    {imageUrl && (
                      <>
                        <Image
                          src={imageUrl}
                          alt={stage.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 90vw, 480px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-deep/50 to-transparent" />
                      </>
                    )}
                  </div>
                </div>

                <div className={i % 2 === 1 ? "md:order-1" : ""}>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full glass-on-white">
                      <svg
                        viewBox="0 0 40 40"
                        className="h-6 w-6 stroke-teal fill-none"
                        strokeWidth="2.5"
                      >
                        <path
                          d="M4 32c4-6 8-6 12 0s8 6 12 0 8-6 12 0"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                    <span className="eyebrow text-deep/50">{stage.label}</span>
                  </div>

                  {stage.year && (
                    <p className="eyebrow text-teal mb-2">{stage.year}</p>
                  )}
                  <h4 className="font-display font-semibold text-display-md text-deep mb-4 text-balance">
                    {stage.title}
                  </h4>
                  {stage.description && (
                    <p className="text-deep/70 text-lg max-w-sm text-balance">
                      {stage.description}
                    </p>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
