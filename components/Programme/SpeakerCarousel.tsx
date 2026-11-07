"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, User } from "lucide-react";
import type { SpeakerData } from "@/sanity/lib/queries";
import { urlForImage } from "@/sanity/lib/image";

interface SpeakerCarouselProps {
  speakers?: SpeakerData[] | null;
  heading?: {
    eyebrow?: string;
    title?: string;
  };
}

export default function SpeakerCarousel({ speakers, heading }: SpeakerCarouselProps) {
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
    emblaApi.on("select", onSelect).on("reInit", onSelect);
    const raf = requestAnimationFrame(() => onSelect());

    return () => {
      cancelAnimationFrame(raf);
      try {
        emblaApi.off("select", onSelect).off("reInit", onSelect);
      } catch {
        // detach listener safe
      }
    };
  }, [emblaApi, onSelect]);

  if (!speakers || speakers.length === 0) {
    return null;
  }

  const validSpeakers = speakers.filter((s) => s.name);

  if (validSpeakers.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="eyebrow text-teal mb-3">
            {heading?.eyebrow || "Speaking at the Congress"}
          </p>
          <h3 className="font-display font-semibold text-display-md text-deep">
            {heading?.title || "Voices of the valley"}
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
          {validSpeakers.map((speaker) => {
            const imageUrl = speaker.image ? urlForImage(speaker.image)?.url() : null;

            return (
              <div
                key={speaker._id || speaker.name}
                className="flex-shrink-0 w-[78%] sm:w-[46%] lg:w-[30%]"
              >
                <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden mb-5 bg-deep/5 flex items-center justify-center">
                  {imageUrl ? (
                    <>
                      <Image
                        src={imageUrl}
                        alt={speaker.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 78vw, 30vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-deep/60 via-transparent to-transparent" />
                    </>
                  ) : (
                    <User className="h-16 w-16 text-deep/20" />
                  )}
                </div>
                <h5 className="font-display font-semibold text-lg text-deep">
                  {speaker.name}
                </h5>
                {speaker.title && (
                  <p className="text-teal text-sm font-medium mb-2">
                    {speaker.title}
                  </p>
                )}
                {speaker.bio && (
                  <p className="text-deep/65 text-sm leading-relaxed">
                    {speaker.bio}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Minimal progress dots */}
      <div className="mt-8 flex items-center gap-2">
        {validSpeakers.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to speaker ${i + 1}`}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === selected ? "w-8 bg-teal" : "w-1.5 bg-deep/15"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
