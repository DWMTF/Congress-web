import { CheckCircle } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export const metadata = { title: "Payment Confirmed — Blue Mind Congress 2027" };

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-screen bg-paper">
      <Navbar />
      <div className="flex items-center justify-center min-h-[80vh] px-6">
        <div className="text-center max-w-md">
          <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-teal/10 mb-8">
            <CheckCircle className="h-10 w-10 text-teal" strokeWidth={1.5} />
          </span>
          <h1 className="font-display font-semibold text-2xl text-deep mb-3">
            You&apos;re confirmed!
          </h1>
          <p className="text-deep/60 mb-8 leading-relaxed">
            Your registration is confirmed and a receipt has been sent to your email.
            We look forward to seeing you at the Congress.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 rounded-full bg-teal text-white text-sm font-medium hover:bg-teal/90 transition-colors"
          >
            Return to homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
