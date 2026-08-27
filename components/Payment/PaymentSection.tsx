"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Waves, Radio, AlertCircle, Lock, ArrowUpRight, RefreshCw } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

interface Registration {
  id: string;
  attendance_type: "in-person" | "livestream";
  first_name: string;
  last_name: string;
  email: string;
  organization: string | null;
  amount_lkr: number;
  status: string;
}

function formatLKR(amount: number) {
  return `LKR ${Number(amount).toLocaleString("en-LK")}`;
}

export default function PaymentSection() {
  const router = useRouter();
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [changing, setChanging] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/register"); return; }

      const { data, error: regError } = await supabase
        .from("registrations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (regError || !data) { router.replace("/register"); return; }
      if (data.status === "confirmed") { router.replace("/payment/success"); return; }

      setRegistration(data);
      setLoading(false);
    }
    load();
  }, [router]);

  async function handleChangeAttendance(to: "in-person" | "livestream") {
    if (!registration || changing) return;
    setError("");
    setChanging(true);
    try {
      const res = await fetch("/api/registration/update-attendance", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId: registration.id, attendanceType: to }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Could not update. Please try again."); return; }
      setRegistration((r) => r ? { ...r, attendance_type: data.attendanceType, amount_lkr: data.amountLkr } : r);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setChanging(false);
    }
  }

  async function handlePay() {
    if (!registration) return;
    setError("");
    setPaying(true);
    try {
      const res = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId: registration.id }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Payment initiation failed. Please try again."); return; }
      window.location.href = data.redirectUrl;
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setPaying(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-teal/10 animate-pulse">
          <Waves className="h-5 w-5 text-teal" strokeWidth={1.5} />
        </span>
      </div>
    );
  }

  if (!registration) return null;

  const isLivestream = registration.attendance_type === "livestream";
  const AttendanceIcon = isLivestream ? Radio : Waves;
  const attendanceLabel = isLivestream ? "Livestream" : "In Person";

  return (
    <section className="relative w-full bg-paper py-20 md:py-28 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-teal/[0.04] to-transparent pointer-events-none" />

      <div className="relative max-w-xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-medium tracking-widest uppercase text-teal/80 mb-3">Payment</p>
          <h1 className="font-display font-semibold text-3xl text-deep mb-3">
            Complete your registration
          </h1>
          <p className="text-deep/55">Review your details below and proceed to secure payment.</p>
        </div>

        {/* ── Upgrade prompt for livestream (big & prominent) ─── */}
        {isLivestream && (
          <div className="mb-6 rounded-2xl border border-teal/30 bg-gradient-to-br from-teal/[0.08] to-teal/[0.03] p-6 md:p-8">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal/15">
                <Waves className="h-5 w-5 text-teal" strokeWidth={1.75} />
              </span>
              <div className="flex-1">
                <h2 className="font-display font-semibold text-lg text-deep leading-snug mb-2">
                  Why watch from home when you can be part of the experience?
                </h2>
                <p className="text-sm text-deep/60 mb-5">
                  Join us in person on the riverbank immerse yourself in the full Congress atmosphere, connect with speakers, and be there for every moment live.
                </p>
                <button
                  onClick={() => handleChangeAttendance("in-person")}
                  disabled={changing}
                  className="inline-flex items-center gap-2 rounded-full bg-teal text-white text-sm font-medium px-5 py-2.5 hover:bg-teal/90 transition-colors disabled:opacity-60"
                >
                  {changing ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4" />
                  )}
                  {changing ? "Updating…" : "Upgrade to In Person"}
                </button>
              </div>
            </div>
          </div>
        )}

        <GlassCard className="p-8 md:p-12">
          {/* Attendee summary */}
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-deep/10">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-teal/10 shrink-0">
              <AttendanceIcon className="h-5 w-5 text-teal" strokeWidth={1.5} />
            </span>
            <div>
              <p className="font-semibold text-deep">
                {registration.first_name} {registration.last_name}
              </p>
              <p className="text-sm text-deep/55">{registration.email}</p>
            </div>
          </div>

          {/* Details */}
          <dl className="space-y-4 mb-8">
            {[
              { label: "Attendance", value: attendanceLabel },
              { label: "Organization", value: registration.organization || "—" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between border-b border-deep/10 pb-4">
                <dt className="text-sm text-deep/55">{row.label}</dt>
                <dd className="font-medium text-deep">{row.value}</dd>
              </div>
            ))}

            <div className="flex items-center justify-between pt-2">
              <dt className="text-sm font-semibold text-deep">Total amount</dt>
              <dd className="text-xl font-bold text-teal">{formatLKR(registration.amount_lkr)}</dd>
            </div>
          </dl>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-6">
              <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button onClick={handlePay} disabled={paying || changing} className="w-full py-3.5">
            {paying ? "Redirecting to payment…" : "Proceed to secure payment →"}
          </Button>

          <div className="flex items-center justify-center gap-2 mt-4">
            <Lock className="h-3 w-3 text-deep/30" />
            <p className="text-xs text-deep/40">
              Secured by OnePay · Visa · Mastercard · AMEX · Lanka QR
            </p>
          </div>
        </GlassCard>

        {/* ── Downgrade option for in-person (small & subtle) ─── */}
        {!isLivestream && (
          <p className="text-center mt-5 text-xs text-deep/40">
            Changed your plans?{" "}
            <button
              onClick={() => handleChangeAttendance("livestream")}
              disabled={changing}
              className="text-deep/60 hover:text-deep underline underline-offset-2 transition-colors disabled:opacity-50"
            >
              {changing ? "Updating…" : "Switch to Livestream instead"}
            </button>
          </p>
        )}
      </div>
    </section>
  );
}
