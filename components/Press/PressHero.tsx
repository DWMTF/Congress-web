import type { PressPageData } from "@/sanity/lib/queries";

interface PressHeroProps {
  data?: PressPageData | null;
}

export default function PressHero({ data }: PressHeroProps = {}) {
  return (
    <section className="w-full bg-paper pt-24 pb-16 px-6 text-center">
      <p className="eyebrow text-teal mb-4">
        {data?.heroEyebrow || "Press & media"}
      </p>
      <h1 className="font-display font-semibold text-display-lg text-deep text-balance max-w-3xl mx-auto">
        {data?.heroTitle || "Everything you need to cover the Congress."}
      </h1>
      <p className="mt-5 text-deep/65 text-lg max-w-xl mx-auto text-balance">
        {data?.heroSubtitle ||
          "Approved assets, facts and figures ready to use, no permissions needed."}
      </p>
    </section>
  );
}
