"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STAGES = [
  {
    label: "Stage 1",
    title: "Pre-Congress",
    year: "2027",
    description:
      "Community river walks and orientation sessions ease delegates into the valley before the main programme begins.",
    image:
      "/images/congress/post-congress.jpg",
    icon: (
      <path d="M4 32c4-6 8-6 12 0s8 6 12 0 8-6 12 0" strokeLinecap="round" />
    ),
  },
  {
    label: "Stage 2",
    title: "Congress",
    year: "2027",
    description:
      "Four days of keynotes, panels and workshops across science, policy and lived experience of water and wellbeing.",
    image:
      "/images/congress/congress.jpg",
    icon: <circle cx="20" cy="20" r="13" />,
  },
  {
    label: "Stage 3",
    title: "Post-Congress Tourism",
    year: "2027",
    description:
      "Guided rafting, mountain trails and quiet-water retreats let delegates put Blue Mind theory into practice.",
    image:
      "/images/congress/pre-congress.jpg",
    icon: <path d="M6 34 18 10l8 14 4-6 8 16" strokeLinecap="round" strokeLinejoin="round" />,
  },
];

export default function CongressStages() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useLayoutEffect(() => {
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
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative h-screen w-full overflow-hidden bg-paper"
    >
      <div className="absolute top-14 left-6 md:left-16 z-10">
        <p className="eyebrow text-teal mb-3">The Congress, in three stages</p>
        <h3 className="font-display font-medium text-display-md text-deep max-w-md text-balance">
          A journey, not just an agenda.
        </h3>
      </div>

      {/* Signature river-line connecting the stages, rather than a generic straight timeline */}
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
        {STAGES.map((stage, i) => (
          <article
            key={stage.title}
            className="relative flex-shrink-0 w-screen h-full flex items-center justify-center px-6 md:px-20"
          >
            <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center max-w-5xl w-full">
              <div className={i % 2 === 1 ? "md:order-2" : ""}>
                <div className="relative aspect-[4/5] w-full max-w-md rounded-3xl overflow-hidden mx-auto">
                  <Image
                    src={stage.image}
                    alt={stage.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 90vw, 480px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep/50 to-transparent" />
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
                      {stage.icon}
                    </svg>
                  </span>
                  <span className="eyebrow text-deep/50">{stage.label}</span>
                </div>

                <p className="eyebrow text-teal mb-2">{stage.year}</p>
                <h4 className="font-display font-semibold text-display-md text-deep mb-4 text-balance">
                  {stage.title}
                </h4>
                <p className="text-deep/70 text-lg max-w-sm text-balance">
                  {stage.description}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
