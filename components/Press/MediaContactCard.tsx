import { Mail, Phone, Clock } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { SiteSettingsData } from "@/sanity/lib/queries";

interface MediaContactCardProps {
  settings?: SiteSettingsData | null;
}

export default function MediaContactCard({ settings }: MediaContactCardProps) {
  if (
    !settings?.mediaContactName &&
    !settings?.mediaContactEmail &&
    !settings?.mediaContactPhone
  ) {
    return null;
  }

  return (
    <section className="w-full bg-paper py-12 md:py-16 px-6">
      <GlassCard className="max-w-2xl mx-auto p-8 md:p-12 text-center">
        <p className="eyebrow text-teal mb-4">Media contact</p>

        {settings.mediaContactName && (
          <h3 className="font-display font-semibold text-2xl text-deep mb-8">
            {settings.mediaContactName}
          </h3>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-deep/70">
          {settings.mediaContactEmail && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-teal" />
              <a
                href={`mailto:${settings.mediaContactEmail}`}
                className="text-sm hover:underline hover:text-teal transition-colors"
              >
                {settings.mediaContactEmail}
              </a>
            </div>
          )}

          {settings.mediaContactPhone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-teal" />
              <a
                href={`tel:${settings.mediaContactPhone}`}
                className="text-sm hover:underline hover:text-teal transition-colors"
              >
                {settings.mediaContactPhone}
              </a>
            </div>
          )}

          {settings.mediaContactResponseTime && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-teal" />
              <span className="text-sm">{settings.mediaContactResponseTime}</span>
            </div>
          )}
        </div>
      </GlassCard>
    </section>
  );
}
