"use client";

import { useState } from "react";
import { Instagram, Facebook, Linkedin, Twitter, ArrowRight, Check, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TextInput } from "@/components/ui/FormField";
import type { SiteSettingsData } from "@/sanity/lib/queries";

interface ContactSectionProps {
  settings?: SiteSettingsData | null;
  heading?: {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
  };
}

export default function ContactSection({ settings, heading }: ContactSectionProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const trimmed = email.trim();
    if (!trimmed) {
      setErrorMessage("Please enter an email address.");
      return;
    }

    // Basic quick client check before dispatching
    if (!trimmed.includes("@") || !trimmed.includes(".")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Unable to subscribe. Please try again.");
        return;
      }

      setSubscribed(true);
      setEmail("");
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const socialLinks = [
    { icon: Instagram, url: settings?.instagramUrl, label: "Instagram" },
    { icon: Facebook, url: settings?.facebookUrl, label: "Facebook" },
    { icon: Twitter, url: settings?.twitterUrl, label: "X (Twitter)" },
    { icon: Linkedin, url: settings?.linkedinUrl, label: "LinkedIn" },
  ].filter((s) => Boolean(s.url));

  return (
    <section id="contact" className="relative w-full bg-paper pt-16 md:pt-20 px-6">
      <SectionHeading
        eyebrow={heading?.eyebrow || "Contact"}
        title={heading?.title || "Let's stay in touch"}
        subtitle={
          heading?.subtitle ||
          "Questions about the Congress, the programme, or the valley itself. we're glad to help."
        }
        align="center"
        className="mx-auto mb-10 md:mb-12"
      />

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 mb-14 md:mb-16">
        {/* Contact card */}
        <GlassCard className="p-8 md:p-10">
          <p className="eyebrow text-teal mb-6">Get in touch</p>
          <dl className="space-y-5">
            {settings?.contactEmail && (
              <div>
                <dt className="text-sm text-deep/55 mb-1">Email</dt>
                <dd className="text-deep font-medium">
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="hover:underline hover:text-teal transition-colors"
                  >
                    {settings.contactEmail}
                  </a>
                </dd>
              </div>
            )}
            {settings?.contactPhone && (
              <div>
                <dt className="text-sm text-deep/55 mb-1">Phone</dt>
                <dd className="text-deep font-medium">
                  <a
                    href={`tel:${settings.contactPhone}`}
                    className="hover:underline hover:text-teal transition-colors"
                  >
                    {settings.contactPhone}
                  </a>
                </dd>
              </div>
            )}
            {settings?.contactAddress && (
              <div>
                <dt className="text-sm text-deep/55 mb-1">Address</dt>
                <dd className="text-deep font-medium whitespace-pre-line">
                  {settings.contactAddress}
                </dd>
              </div>
            )}
          </dl>

          {socialLinks.length > 0 && (
            <div className="flex items-center gap-3 mt-8">
              {socialLinks.map(({ icon: Icon, url, label }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-deep/15 text-deep/70 hover:text-teal hover:border-teal/40 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
        </GlassCard>

        {/* Newsletter + map */}
        <div className="flex flex-col gap-6">
          <GlassCard className="p-8 md:p-10">
            <p className="eyebrow text-teal mb-4">
              {settings?.newsletterEyebrow || "Newsletter"}
            </p>
            <p className="text-deep/65 mb-6">
              {settings?.newsletterDescription ||
                "One email a month. Programme updates, speaker announcements, no noise."}
            </p>

            {subscribed ? (
              <div className="flex items-center gap-3 p-4 bg-teal/10 border border-teal/20 rounded-2xl text-deep animate-in fade-in zoom-in duration-200">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal text-paper shrink-0">
                  <Check className="h-4 w-4" />
                </span>
                <p className="text-sm font-medium">
                  {settings?.newsletterSuccessMessage || "You're on the list! Thank you."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <form onSubmit={handleSubmit} className="flex gap-3">
                  <TextInput
                    type="email"
                    required
                    disabled={loading}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMessage) setErrorMessage("");
                    }}
                    placeholder="you@email.com"
                    className="flex-1 min-w-0 rounded-full"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    aria-label="Subscribe"
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-deep text-paper hover:bg-deep/90 disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowRight className="h-4 w-4" />
                    )}
                  </button>
                </form>
                {errorMessage && (
                  <p className="text-xs text-red-600 font-medium pl-3 animate-in fade-in duration-150">
                    {errorMessage}
                  </p>
                )}
              </div>
            )}
          </GlassCard>

          <div className="flex-1 rounded-[2rem] overflow-hidden min-h-[180px] border border-deep/10">
            <iframe
              title="Congress location map"
              className="w-full h-full grayscale-[20%] opacity-90"
              style={{ minHeight: 180 }}
              loading="lazy"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                settings?.mapLocationQuery || "Kelani River Valley, Sri Lanka"
              )}&t=&z=9&ie=UTF8&iwloc=&output=embed`}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-deep/10 py-8 px-2">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-deep/50">
          <p>
            {settings?.footerCopyright ||
              "© 2027 Water & Mountain Tourism Foundation. All rights reserved."}
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
