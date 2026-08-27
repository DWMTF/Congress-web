export const metadata = { title: "Complete Payment" };

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
