"use client";

import { useState } from "react";
import { Instagram, Facebook, Linkedin, Twitter, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TextInput } from "@/components/ui/FormField";

export default function ContactSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() === "") return;
    setSubscribed(true);
  };

  return (
    <section id="contact" className="relative w-full bg-paper pt-28 md:pt-40 px-6">
      <SectionHeading
        eyebrow="Contact"
        title="Let's stay in touch"
        subtitle="Questions about the Congress, the programme, or the valley itself. we're glad to help."
        align="center"
        className="mx-auto mb-20"
      />

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 mb-24">
        {/* Contact card */}
        <GlassCard className="p-8 md:p-10">
          <p className="eyebrow text-teal mb-6">Get in touch</p>
          <dl className="space-y-5">
            <div>
              <dt className="text-sm text-deep/55 mb-1">Email</dt>
              <dd className="text-deep font-medium">hello@bluemindcongress.org</dd>
            </div>
            <div>
              <dt className="text-sm text-deep/55 mb-1">Phone</dt>
              <dd className="text-deep font-medium">+94 11 234 5678</dd>
            </div>
            <div>
              <dt className="text-sm text-deep/55 mb-1">Address</dt>
              <dd className="text-deep font-medium">
                Deraniyagala Water &amp; Mountain Tourism Foundation
                <br />
                Kelani River Valley, Sri Lanka
              </dd>
            </div>
          </dl>

          <div className="flex items-center gap-3 mt-8">
            {[Instagram, Facebook, Twitter, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-deep/15 text-deep/70 hover:text-teal hover:border-teal/40 transition-colors"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </GlassCard>

        {/* Newsletter + map */}
        <div className="flex flex-col gap-6">
          <GlassCard className="p-8 md:p-10">
            <p className="eyebrow text-teal mb-4">Newsletter</p>
            <p className="text-deep/65 mb-6">
              One email a month. Programme updates, speaker announcements, no
              noise.
            </p>

            {subscribed ? (
              <p className="text-deep font-medium">
                You&apos;re on the list! Thank you.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-3">
                <TextInput
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="flex-1 min-w-0 rounded-full"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-deep text-paper hover:bg-deep/90 transition-colors"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </GlassCard>

          <div className="flex-1 rounded-[2rem] overflow-hidden min-h-[180px] border border-deep/10">
            <iframe
              title="Congress location map"
              className="w-full h-full grayscale-[20%] opacity-90"
              style={{ minHeight: 180 }}
              loading="lazy"
              src="https://maps.google.com/maps?q=Kelani%20River%20Valley%2C%20Sri%20Lanka&t=&z=9&ie=UTF8&iwloc=&output=embed"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-deep/10 py-10 px-2">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-deep/50">
          <p>
            © 2027 Deraniyagala Water &amp; Mountain Tourism Foundation. All
            rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="/press" className="hover:text-deep transition-colors">
              Press
            </a>
            <a href="/sponsorship" className="hover:text-deep transition-colors">
              Sponsorship
            </a>
            <a href="/register" className="hover:text-deep transition-colors">
              Register
            </a>
          </div>
        </div>
      </footer>
    </section>
  );
}
