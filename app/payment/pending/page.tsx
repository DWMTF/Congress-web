import { Clock } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export const metadata = { title: "Payment Pending" };

export default function PaymentPendingPage() {
  return (
    <main className="min-h-screen bg-paper">
      <Navbar />
      <div className="flex items-center justify-center min-h-[80vh] px-6">
        <div className="text-center max-w-md">
          <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 mb-8">
            <Clock className="h-10 w-10 text-amber-400" strokeWidth={1.5} />
          </span>
          <h1 className="font-display font-semibold text-2xl text-deep mb-3">
            Payment pending
          </h1>
          <p className="text-deep/60 mb-8 leading-relaxed">
            Your payment is still being processed. If successful, you&apos;ll receive a
            confirmation email shortly. If you don&apos;t hear back within 30 minutes,
            please contact us.
          </p>
          <Link
            href="/#contact"
            className="inline-block px-6 py-3 rounded-full border border-deep/20 text-deep/70 text-sm font-medium hover:border-deep/40 transition-colors"
          >
            Contact us
          </Link>
        </div>
      </div>
    </main>
  );
}
