"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const EVENTS = [
  {
    year: "2026",
    title: "Journey begins",
    description:
      "Registrations open and the valley starts preparing to host delegates from across the region.",
    image: "/images/congress/congress.jpg",
  },
  {
    year: "Feb",
    title: "Pre-Congress",
    description:
      "Orientation walks and welcome sessions ease arriving delegates into the rhythm of the river.",
    image: "/images/congress/pre-congress.jpg",
  },
  {
    year: "Mar",
    title: "Community Events",
    description:
      "Open sessions with local schools, fishing communities and river custodians along the Kelani basin.",
    image: "/images/congress/congress.jpg",
  },
  {
    year: "Mar",
    title: "Swimming Gala",
    description:
      "An open-water gala celebrating the valley's swimmers, from first-timers to national athletes.",
    image: "/images/congress/congress.jpg",
  },
  {
    year: "Apr",
    title: "Congress",
    description:
      "Four days of keynotes, panels and workshops at the heart of the programme.",
    image: "/images/congress/congress.jpg",
  },
  {
    year: "May",
    title: "Post-Congress Tourism",
    description:
      "Guided rafting, mountain trails and quiet-water retreats close the Congress on reflection.",
    image: "/images/congress/congress.jpg",
  },
];

export default function TimelineSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      /*
       * --------------------------------------------------
       * CENTRAL TIMELINE LINE
       * --------------------------------------------------
       */
      gsap.fromTo(
        lineRef.current,
        {
          scaleY: 0,
        },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 20%",
            end: "bottom 70%",
            scrub: 0.6,
          },
        }
      );

      /*
       * --------------------------------------------------
       * EVENT REVEALS
       * --------------------------------------------------
       */
      gsap.utils
        .toArray<HTMLElement>(".timeline-event")
        .forEach((event) => {
          const image = event.querySelector(".timeline-image");
          const imageWrapper = event.querySelector(".timeline-image-wrapper");
          const content = event.querySelector(".timeline-content");
          const year = event.querySelector(".timeline-year");
          const title = event.querySelector(".timeline-title");
          const description = event.querySelector(
            ".timeline-description"
          );

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: event,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          });

          /*
           * Image appears first
           */
          tl.fromTo(
            imageWrapper,
            {
              opacity: 0,
              y: 50,
              scale: 0.96,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              ease: "power3.out",
            }
          )

            /*
             * Image itself reveals with a slight zoom
             */
            .fromTo(
              image,
              {
                scale: 1.12,
              },
              {
                scale: 1,
                duration: 1.2,
                ease: "power3.out",
              },
              "<"
            )

            /*
             * Year
             */
            .fromTo(
              year,
              {
                opacity: 0,
                y: 20,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: "power2.out",
              },
              "-=0.35"
            )

            /*
             * Title
             */
            .fromTo(
              title,
              {
                opacity: 0,
                y: 25,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power3.out",
              },
              "-=0.2"
            )

            /*
             * Description
             */
            .fromTo(
              description,
              {
                opacity: 0,
                y: 20,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power3.out",
              },
              "-=0.25"
            );

          /*
           * ------------------------------------------------
           * IMAGE PARALLAX
           * ------------------------------------------------
           */
          gsap.to(image, {
            yPercent: -12,
            ease: "none",
            scrollTrigger: {
              trigger: imageWrapper,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-24">
      {/* Section heading */}

      <div className="max-w-4xl mx-auto mb-24">
        <p className="eyebrow text-teal mb-4">
          The road to the river
        </p>

        <h3 className="font-display text-4xl md:text-5xl font-semibold text-deep">
          A journey, mapped
        </h3>
      </div>

      {/* Timeline */}

      <div className="relative max-w-4xl mx-auto">

        {/* Central growing line */}

        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-deep/10 md:-translate-x-1/2">
          <div
            ref={lineRef}
            className="absolute inset-0 bg-teal origin-top"
          />
        </div>

        <div className="space-y-32 md:space-y-40">

          {EVENTS.map((event, i) => (
            <div
              key={`${event.title}-${i}`}
              className={`timeline-event relative flex flex-col md:flex-row items-start md:items-center gap-8 pl-16 md:pl-0 ${
                i % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >

              {/* Timeline node */}

              <span className="absolute left-6 md:left-1/2 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full bg-teal ring-4 ring-paper" />

              {/* Content */}

              <div className="timeline-content md:w-1/2 md:px-10">

                <p className="timeline-year eyebrow text-teal mb-3">
                  {event.year}
                </p>

                <h4 className="timeline-title font-display font-semibold text-2xl text-deep mb-3">
                  {event.title}
                </h4>

                <p className="timeline-description text-deep/65 leading-relaxed max-w-sm">
                  {event.description}
                </p>

              </div>

              {/* Image */}

              <div className="md:w-1/2 md:px-10 w-full">

                <div className="timeline-image-wrapper relative aspect-[16/10] w-full rounded-3xl overflow-hidden">

                  <div className="timeline-image absolute inset-0 h-[124%] -top-[12%]">

                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 90vw, 45vw"
                    />

                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-deep/40 to-transparent" />

                </div>

              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}