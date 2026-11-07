"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, FileDown, AlertCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TextInput } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import type { SiteSettingsData, SponsorshipPageData, SponsorshipTierData } from "@/sanity/lib/queries";

interface SponsorshipInquiryProps {
  settings?: SiteSettingsData | null;
  pageData?: SponsorshipPageData | null;
  tiers?: SponsorshipTierData[] | null;
}

export default function SponsorshipInquiry({
  settings,
  pageData,
  tiers,
}: SponsorshipInquiryProps = {}) {
  const initialTier = tiers?.[0]?.name || "Principal / Gold Partner";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    tier: initialTier,
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const prospectusUrl = settings?.prospectusFileUrl || settings?.prospectusExternalUrl;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/sponsorship/inquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit inquiry. Please try again.");
      }

      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        organization: "",
        tier: initialTier,
        message: "",
      });
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="inquiry" className="w-full bg-paper py-16 md:py-24 px-6 border-t border-deep/10">
      <div className="max-w-6xl mx-auto space-y-16">
        <SectionHeading
          eyebrow={pageData?.inquiryEyebrow || "Direct Contacts"}
          title={pageData?.inquiryTitle || "Let’s Create an Impactful Partnership"}
          subtitle={
            pageData?.inquirySubtitle ||
            "Speak directly with our partnership director or send a brief inquiry to receive the comprehensive 2027 Sponsorship Prospectus."
          }
          align="center"
          className="mx-auto"
        />

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Direct Contacts Card (2 cols) */}
          <GlassCard className="lg:col-span-2 p-8 md:p-10 space-y-8 bg-gradient-to-b from-white to-deep/[0.02]">
            <div>
              <p className="eyebrow text-teal mb-2">
                {settings?.partnershipsOfficeTitle || "Partnerships Office"}
              </p>
              <h3 className="font-display font-semibold text-2xl text-deep">
                {settings?.partnershipsOfficeSubtitle || "Get in Touch"}
              </h3>
              <p className="text-sm text-deep/60 mt-2">
                Our team is available for tailored proposals, co-curation calls, and private briefing decks.
              </p>
            </div>

            <div className="space-y-6 text-sm">
              {settings?.partnershipsEmail && (
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-teal/15 text-teal shrink-0 mt-0.5">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs text-deep/50 uppercase tracking-wider font-semibold block mb-0.5">
                      Partnerships Email
                    </span>
                    <a
                      href={`mailto:${settings.partnershipsEmail}`}
                      className="text-deep font-medium hover:text-teal transition-colors"
                    >
                      {settings.partnershipsEmail}
                    </a>
                  </div>
                </div>
              )}

              {settings?.partnershipsPhone && (
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-teal/15 text-teal shrink-0 mt-0.5">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs text-deep/50 uppercase tracking-wider font-semibold block mb-0.5">
                      Direct Telephone / WhatsApp
                    </span>
                    <a
                      href={`tel:${settings.partnershipsPhone}`}
                      className="text-deep font-medium hover:text-teal transition-colors"
                    >
                      {settings.partnershipsPhone}
                    </a>
                    {settings.partnershipsHours && (
                      <p className="text-xs text-deep/50 mt-0.5">{settings.partnershipsHours}</p>
                    )}
                  </div>
                </div>
              )}

              {settings?.contactAddress && (
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-teal/15 text-teal shrink-0 mt-0.5">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs text-deep/50 uppercase tracking-wider font-semibold block mb-0.5">
                      Foundation Headquarters
                    </span>
                    <p className="text-deep font-medium leading-snug whitespace-pre-line">
                      {settings.contactAddress}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {prospectusUrl && (
              <div className="pt-4 border-t border-deep/10">
                <a
                  href={prospectusUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-deep/15 text-deep text-xs font-semibold hover:bg-deep/5 transition-colors"
                >
                  <FileDown className="h-4 w-4 text-teal" />
                  {settings?.prospectusButtonLabel || "Download Congress Prospectus (PDF)"}
                </a>
              </div>
            )}
          </GlassCard>

          {/* Interactive Inquiry Form (3 cols) */}
          <GlassCard className="lg:col-span-3 p-8 md:p-10">
            {submitted ? (
              <div className="py-16 text-center space-y-4">
                <div className="h-16 w-16 bg-teal/20 text-teal rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="font-display font-semibold text-2xl text-deep">
                  {pageData?.inquirySuccessTitle || "Inquiry Received"}
                </h3>
                <p className="text-sm text-deep/70 max-w-md mx-auto">
                  {pageData?.inquirySuccessMessage ||
                    "Thank you for reaching out. Our Partnership Director will connect with you within 24 business hours with the full deck and scheduling details."}
                </p>
                <Button
                  variant="ghost"
                  onClick={() => setSubmitted(false)}
                  className="text-xs mt-4"
                >
                  Send another inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h3 className="font-display font-semibold text-xl text-deep mb-1">
                    {pageData?.inquiryFormTitle || "Partnership Inquiry Form"}
                  </h3>
                  <p className="text-xs text-deep/60">
                    {pageData?.inquiryFormSubtitle ||
                      "Tell us about your brand and the scope of partnership you are exploring."}
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-deep/70 uppercase tracking-wider mb-2">
                      Your Name
                    </label>
                    <TextInput
                      required
                      placeholder="e.g. Dr. Maya Silva"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-deep/70 uppercase tracking-wider mb-2">
                      Business Email
                    </label>
                    <TextInput
                      type="email"
                      required
                      placeholder="maya@company.org"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-deep/70 uppercase tracking-wider mb-2">
                      Organization / Company
                    </label>
                    <TextInput
                      required
                      placeholder="e.g. Blue Horizons Institute"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-deep/70 uppercase tracking-wider mb-2">
                      Interested Tier
                    </label>
                    <select
                      value={formData.tier}
                      onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-deep/15 rounded-xl text-sm text-deep focus:outline-none focus:border-deep"
                    >
                      {tiers && tiers.length > 0 ? (
                        <>
                          {tiers.map((t) => (
                            <option key={t._id || t.name} value={t.name}>
                              {t.name}
                            </option>
                          ))}
                          <option value="Custom / In-Kind Collaboration">
                            Custom / In-Kind Collaboration
                          </option>
                        </>
                      ) : (
                        <>
                          <option value="Title / Sovereign Partner">Title / Sovereign Partner (Exclusive)</option>
                          <option value="Principal / Gold Partner">Principal / Gold Partner</option>
                          <option value="Eco & Innovation Partner">Eco &amp; Innovation Partner</option>
                          <option value="Patron / Community Partner">Patron / Community Partner</option>
                          <option value="Custom / In-Kind Collaboration">Custom / In-Kind Collaboration</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-deep/70 uppercase tracking-wider mb-2">
                    Partnership Objectives &amp; Notes
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your organization's goals, CSR priorities, or specific activations you would like to explore..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-deep/15 rounded-xl text-sm text-deep focus:outline-none focus:border-deep resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-deep text-paper hover:bg-deep/90 flex items-center justify-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  {loading ? "Transmitting Inquiry..." : "Submit Sponsorship Inquiry"}
                </Button>
              </form>
            )}
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
