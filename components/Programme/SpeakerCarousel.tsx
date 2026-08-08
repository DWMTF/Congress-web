"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const SPEAKERS = [
  {
    name: "Dr. Amara Wickramasinghe",
    title: "Marine Cognitive Scientist",
    bio: "Studies how proximity to moving water shifts attention and stress markers in urban populations.",
    image:
      "/images/speakers/person2.jpg",
  },
  {
    name: "Ravindu Fernando",
    title: "River Conservation Lead",
    bio: "Leads community-based river restoration across the Kelani basin, bridging policy and grassroots action.",
    image:
      "/images/speakers/person1.jpg",
  },
  {
    name: "Dr. Priya Nadarajah",
    title: "Public Health Researcher",
    bio: "Publishes on blue-space access as a determinant of mental health outcomes in South Asian cities.",
    image:
      "/images/speakers/person2.jpg",
  },
  {
    name: "Kasun Jayasuriya",
    title: "Adventure Tourism Director",
    bio: "Designs immersive rafting and mountain programmes that translate research into lived experience.",
    image:
      "/images/speakers/person1.jpg",
  },
  {
    name: "Dr. Malini Perera",
    title: "Environmental Psychologist",
    bio: "Focuses on the neuroscience of calm — measuring how natural water sounds regulate the nervous system.",
    image:
      "/images/speakers/person2.jpg",
  },
];

export default function SpeakerCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    slidesToScroll: 1,
  });

  const [selected, setSelected] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    // Register listeners first, then schedule an initial sync on the next frame
    // to avoid calling setState synchronously within the effect body.
    emblaApi.on("select", onSelect).on("reInit", onSelect);
    const raf = requestAnimationFrame(() => onSelect());

    return () => {
      cancelAnimationFrame(raf);
      // detach listeners
      try {
        emblaApi.off("select", onSelect).off("reInit", onSelect);
      } catch (e) {
        /* ignore if off is not available */
      }
    };
  }, [emblaApi, onSelect]);

  return (
    <div>
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="eyebrow text-teal mb-3">Speaking at the Congress</p>
          <h3 className="font-display font-semibold text-display-md text-deep">
            Voices of the valley
          </h3>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <button
            aria-label="Previous speaker"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canPrev}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-deep/15 text-deep disabled:opacity-30 hover:bg-deep/5 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            aria-label="Next speaker"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canNext}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-deep/15 text-deep disabled:opacity-30 hover:bg-deep/5 transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6 -ml-6 pl-6">
          {SPEAKERS.map((speaker) => (
            <div
              key={speaker.name}
              className="flex-shrink-0 w-[78%] sm:w-[46%] lg:w-[30%]"
            >
              <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden mb-5">
                <Image
                  src={speaker.image}
                  alt={speaker.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 78vw, 30vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep/60 via-transparent to-transparent" />
              </div>
              <h5 className="font-display font-semibold text-lg text-deep">
                {speaker.name}
              </h5>
              <p className="text-teal text-sm font-medium mb-2">{speaker.title}</p>
              <p className="text-deep/65 text-sm leading-relaxed">{speaker.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Minimal progress dots */}
      <div className="mt-8 flex items-center gap-2">
        {SPEAKERS.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to speaker ${i + 1}`}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === selected ? "w-8 bg-teal" : "w-1.5 bg-deep/15"
              }`}
          />
        ))}
      </div>
    </div>
  );
}
