"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, ArrowRight, CheckCircle2, FileDown, AlertCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TextInput, TextArea, Select } from "@/components/ui/FormField";
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
    <section id="inquiry" className="relative w-full bg-paper py-16 md:py-20 px-6 border-t border-deep/10">
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          eyebrow={pageData?.inquiryEyebrow || "Direct Contacts"}
          title={pageData?.inquiryTitle || "Let’s Create an Impactful Partnership"}
          subtitle={
            pageData?.inquirySubtitle ||
            "Speak directly with our partnership director or send a brief inquiry to receive the comprehensive 2027 Sponsorship Prospectus."
          }
          align="center"
          className="mx-auto mb-12 md:mb-14"
        />

        <div className="grid md:grid-cols-12 gap-8 items-start">
          {/* Direct Contacts Card (5 cols) */}
          <GlassCard className="md:col-span-5 p-8 md:p-10 flex flex-col justify-between h-full">
            <div>
              <p className="eyebrow text-teal mb-3">
                {settings?.partnershipsOfficeTitle || "Partnerships Office"}
              </p>
              <h3 className="font-display font-semibold text-2xl text-deep mb-3">
                {settings?.partnershipsOfficeSubtitle || "Get in Touch"}
              </h3>
              <p className="text-sm text-deep/65 leading-relaxed mb-8">
                Our team is available for tailored proposals, co-curation calls, and private briefing decks.
              </p>

              <dl className="space-y-6">
                {settings?.partnershipsEmail && (
                  <div>
                    <dt className="text-sm text-deep/55 mb-1">Partnerships Email</dt>
                    <dd className="text-deep font-medium">
                      <a
                        href={`mailto:${settings.partnershipsEmail}`}
                        className="hover:underline hover:text-teal transition-colors"
                      >
                        {settings.partnershipsEmail}
                      </a>
                    </dd>
                  </div>
                )}

                {settings?.partnershipsPhone && (
                  <div>
                    <dt className="text-sm text-deep/55 mb-1">Direct Telephone / WhatsApp</dt>
                    <dd className="text-deep font-medium">
                      <a
                        href={`tel:${settings.partnershipsPhone}`}
                        className="hover:underline hover:text-teal transition-colors"
                      >
                        {settings.partnershipsPhone}
                      </a>
                    </dd>
                    {settings?.partnershipsHours && (
                      <p className="text-xs text-deep/50 mt-1">{settings.partnershipsHours}</p>
                    )}
                  </div>
                )}

                {settings?.contactAddress && (
                  <div>
                    <dt className="text-sm text-deep/55 mb-1">Headquarters</dt>
                    <dd className="text-deep font-medium whitespace-pre-line leading-relaxed">
                      {settings.contactAddress}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {prospectusUrl && (
              <div className="pt-8 mt-8 border-t border-deep/10">
                <a
                  href={prospectusUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-deep/15 text-deep text-sm font-medium hover:bg-deep/5 transition-colors"
                >
                  <FileDown className="h-4 w-4 text-teal" />
                  <span>{settings?.prospectusButtonLabel || "Download Congress Prospectus (PDF)"}</span>
                </a>
              </div>
            )}
          </GlassCard>

          {/* Interactive Inquiry Form (7 cols) */}
          <GlassCard className="md:col-span-7 p-8 md:p-10">
            {submitted ? (
              <div className="py-16 text-center space-y-5">
                <span className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-teal/10 text-teal">
                  <CheckCircle2 className="h-8 w-8 stroke-[1.75]" />
                </span>
                <h3 className="font-display font-semibold text-2xl text-deep">
                  {pageData?.inquirySuccessTitle || "Inquiry Received"}
                </h3>
                <p className="text-sm text-deep/65 max-w-md mx-auto leading-relaxed">
                  {pageData?.inquirySuccessMessage ||
                    "Thank you for reaching out. Our Partnership Director will connect with you within 24 business hours with the full deck and scheduling details."}
                </p>
                <div className="pt-4">
                  <Button
                    variant="ghost"
                    onClick={() => setSubmitted(false)}
                    className="text-xs"
                  >
                    Send another inquiry
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div>
                  <p className="eyebrow text-teal mb-2">Inquiry Form</p>
                  <h3 className="font-display font-semibold text-2xl text-deep mb-1">
                    {pageData?.inquiryFormTitle || "Partnership Inquiry"}
                  </h3>
                  <p className="text-sm text-deep/65">
                    {pageData?.inquiryFormSubtitle ||
                      "Tell us about your brand and the scope of partnership you are exploring."}
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-700 flex items-start gap-3">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-deep/60 mb-2">
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
                    <label className="block text-xs font-medium text-deep/60 mb-2">
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
                    <label className="block text-xs font-medium text-deep/60 mb-2">
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
                    <label className="block text-xs font-medium text-deep/60 mb-2">
                      Interested Tier
                    </label>
                    <Select
                      value={formData.tier}
                      onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
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
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-deep/60 mb-2">
                    Partnership Objectives &amp; Notes
                  </label>
                  <TextArea
                    rows={4}
                    required
                    placeholder="Describe your organization's goals, CSR priorities, or specific activations you would like to explore..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 text-sm font-medium gap-2"
                >
                  <span>{loading ? "Transmitting Inquiry…" : "Submit Sponsorship Inquiry"}</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            )}
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
