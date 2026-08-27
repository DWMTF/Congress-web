import { XCircle } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export const metadata = { title: "Payment Failed" };

export default function PaymentFailedPage() {
  return (
    <main className="min-h-screen bg-paper">
      <Navbar />
      <div className="flex items-center justify-center min-h-[80vh] px-6">
        <div className="text-center max-w-md">
          <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-50 mb-8">
            <XCircle className="h-10 w-10 text-red-400" strokeWidth={1.5} />
          </span>
          <h1 className="font-display font-semibold text-2xl text-deep mb-3">
            Payment unsuccessful
          </h1>
          <p className="text-deep/60 mb-8 leading-relaxed">
            Something went wrong during payment. Your card has not been charged.
            Please try again or contact us if the issue persists.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/register"
              className="inline-block px-6 py-3 rounded-full bg-teal text-white text-sm font-medium hover:bg-teal/90 transition-colors"
            >
              Try again
            </Link>
            <Link
              href="/#contact"
              className="inline-block px-6 py-3 rounded-full border border-deep/20 text-deep/70 text-sm font-medium hover:border-deep/40 transition-colors"
            >
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
