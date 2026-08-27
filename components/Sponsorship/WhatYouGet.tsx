"use client";

import { motion } from "framer-motion";
import { Check, Star, Award, Zap, Heart, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

const TIERS = [
  {
    name: "Patron / Community Partner",
    badge: "Community & Impact",
    price: "$5,000 USD",
    description: "Ideal for organizations committed to grassroots education, environmental stewardship, and academic research.",
    highlight: false,
    icon: Heart,
    features: [
      "Direct attribution for 5 Youth/Scholar bursaries",
      "2 All-Access Congress Delegate Passes",
      "Logo placement on official website & print program",
      "Inclusion in Digital Media Kit distributed to delegates",
      "Audited Carbon & Sustainability Certificate",
    ],
  },
  {
    name: "Eco & Innovation Partner",
    badge: "Eco Leadership",
    price: "$15,000 USD",
    description: "Tailored for sustainable brands, green technology providers, and eco-hospitality innovators.",
    highlight: false,
    icon: Zap,
    features: [
      "4 All-Access Congress Delegate Passes",
      "Dedicated brand showcase in the Eco-Tourism Pavilion",
      "Logo on global livestream broadcasts (10k+ viewers)",
      "Co-branding on official Congress Workshop Tracks",
      "Inclusion in post-summit published whitepapers",
      "VIP Invitation to the Gala Dinner & River Banquet",
    ],
  },
  {
    name: "Principal / Gold Partner",
    badge: "Most Popular",
    price: "$30,000 USD",
    description: "High-visibility leadership position for established tourism boards, financial institutions, and global corporations.",
    highlight: true,
    icon: Award,
    features: [
      "6 VIP Full-Access & Speaker Retreat Passes",
      "Prominent stage branding in Main Plenary Auditorium",
      "Curated Panel Speaking or Workshop Host position",
      "Dedicated Private Meeting Lounge in the Valley",
      "Priority inclusion in international press briefings",
      "Full-page feature in the 2027 Congress Fact Sheet",
      "Direct access to minister-level roundtable sessions",
    ],
  },
  {
    name: "Title / Sovereign Partner",
    badge: "Exclusive · 1 Available",
    price: "Custom / Inquire",
    description: "The premier summit co-creator. Complete top-billing integration across all global media, stages, and venues.",
    highlight: false,
    icon: Star,
    features: [
      "'Presented in Partnership with [Your Brand]' branding",
      "10 VIP Passes + Private Luxury Villa Accommodation",
      "Keynote Address during the Opening Plenary Ceremony",
      "Exclusive Naming Rights for the Primary Congress Pavilion",
      "Co-ownership of the 2027 Global Blue Policy Blueprint",
      "Exclusive Bespoke River Experience Activation Zone",
      "Dedicated PR and media interview broadcast package",
    ],
  },
];

export default function WhatYouGet() {
  return (
    <section id="tiers" className="w-full bg-paper py-16 md:py-24 px-6 border-t border-deep/10">
      <div className="max-w-7xl mx-auto space-y-16">
        <SectionHeading
          eyebrow="Deliverables & Tiers"
          title="What You Can Get"
          subtitle="Meaningful ROI through global brand prestige, executive networking, and verified sustainability impact."
          align="center"
          className="mx-auto"
        />

        {/* 4 Tier Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TIERS.map((tier, i) => {
            const Icon = tier.icon;
            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex"
              >
                <GlassCard
                  className={`p-7 flex flex-col justify-between w-full relative transition-all duration-300 ${
                    tier.highlight
                      ? "border-2 border-teal shadow-xl shadow-teal/10 bg-white ring-4 ring-teal/5"
                      : "border border-deep/10 bg-white hover:border-deep/30"
                  }`}
                >
                  {tier.highlight && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-teal text-deep text-[11px] font-bold uppercase tracking-wider shadow-sm">
                      {tier.badge}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-deep/[0.06] text-deep">
                        <Icon className="h-5 w-5 text-teal" />
                      </div>
                      {!tier.highlight && (
                        <span className="text-[11px] font-semibold text-deep/50 uppercase tracking-wider">
                          {tier.badge}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-display font-semibold text-lg text-deep">
                        {tier.name}
                      </h3>
                      <div className="text-xl font-display font-bold text-deep mt-1">
                        {tier.price}
                      </div>
                    </div>

                    <p className="text-xs text-deep/65 leading-relaxed">
                      {tier.description}
                    </p>

                    <div className="border-t border-deep/10 pt-4 space-y-2.5">
                      <p className="text-[11px] font-bold text-deep uppercase tracking-wider">
                        Key Benefits Included:
                      </p>
                      {tier.features.map((feat) => (
                        <div key={feat} className="flex items-start gap-2.5 text-xs text-deep/80 leading-snug">
                          <Check className="h-4 w-4 text-teal shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6">
                    <a
                      href="#inquiry"
                      className={`w-full py-2.5 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                        tier.highlight
                          ? "bg-deep text-paper hover:bg-deep/90"
                          : "bg-deep/[0.06] text-deep hover:bg-deep/10"
                      }`}
                    >
                      Select Tier
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        {/* Bespoke Partnerships Note */}
        <div className="p-8 rounded-3xl bg-deep/[0.03] border border-deep/10 text-center max-w-3xl mx-auto space-y-3">
          <h4 className="font-display font-semibold text-lg text-deep">
            Custom or In-Kind Sponsorships
          </h4>
          <p className="text-sm text-deep/70">
            We actively collaborate with technical providers, scientific institutions, eco-transport operators, and media outlets for custom in-kind partnerships.
          </p>
        </div>
      </div>
    </section>
  );
}
