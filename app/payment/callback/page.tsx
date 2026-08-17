/**
 * /payment/callback
 * OnePay redirects here after the user completes (or abandons) payment.
 * We poll /api/payment/status and redirect to success or failed.
 */
"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Waves } from "lucide-react";

const MAX_POLLS = 12;
const POLL_INTERVAL_MS = 3000;

function CallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get("ref");

  const [message, setMessage] = useState("Verifying your payment…");
  const polls = useRef(0);

  useEffect(() => {
    if (!reference) {
      router.replace("/payment/failed?reason=missing_ref");
      return;
    }

    const interval = setInterval(async () => {
      polls.current += 1;

      try {
        const res = await fetch("/api/payment/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference }),
        });

        const data = await res.json();

        if (data.paid) {
          clearInterval(interval);
          router.replace(`/payment/success?ref=${reference}`);
          return;
        }

        if (data.status === "failed") {
          clearInterval(interval);
          router.replace("/payment/failed?reason=gateway");
          return;
        }
      } catch {
        // Network hiccup — keep polling
      }

      if (polls.current >= MAX_POLLS) {
        clearInterval(interval);
        // Payment is still pending after timeout — redirect to pending state
        setMessage("Taking longer than expected. Check your email for confirmation.");
        setTimeout(() => router.replace(`/payment/pending?ref=${reference}`), 3000);
      } else {
        setMessage(`Verifying your payment${".".repeat((polls.current % 3) + 1)}`);
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [reference, router]);

  return (
    <div className="text-center">
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-teal/10 mb-6 animate-pulse">
        <Waves className="h-7 w-7 text-teal" strokeWidth={1.5} />
      </span>
      <h1 className="font-display font-semibold text-xl text-deep mb-2">
        Processing Payment
      </h1>
      <p className="text-deep/60 text-sm">{message}</p>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <main className="min-h-screen bg-paper flex items-center justify-center px-6">
      <Suspense
        fallback={
          <div className="text-center">
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-teal/10 mb-6 animate-pulse">
              <Waves className="h-7 w-7 text-teal" strokeWidth={1.5} />
            </span>
            <h1 className="font-display font-semibold text-xl text-deep mb-2">
              Processing Payment
            </h1>
            <p className="text-deep/60 text-sm">Verifying your payment…</p>
          </div>
        }
      >
        <CallbackInner />
      </Suspense>
    </main>
  );
}
