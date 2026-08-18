export const metadata = { title: "Complete Payment — Blue Mind Congress 2027" };

import Navbar from "@/components/Navbar";
import PaymentSection from "@/components/Payment/PaymentSection";

export default function PaymentPage() {
  return (
    <main className="min-h-screen bg-paper">
      <Navbar />
      <PaymentSection />
    </main>
  );
}
