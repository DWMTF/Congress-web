import { Mail, Phone, Clock } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export default function MediaContactCard() {
  return (
    <section className="w-full bg-paper py-16 md:py-24 px-6">
      <GlassCard className="max-w-2xl mx-auto p-8 md:p-12 text-center">
        <p className="eyebrow text-teal mb-4">Media contact</p>
        <h3 className="font-display font-semibold text-2xl text-deep mb-8">
          Nadeeka Rathnayake, Communications Lead
        </h3>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-deep/70">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-teal" />
            <span className="text-sm">press@bluemindcongress.org</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-teal" />
            <span className="text-sm">+94 77 123 4567</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-teal" />
            <span className="text-sm">Replies within 1 business day</span>
          </div>
        </div>
      </GlassCard>
    </section>
  );
}
