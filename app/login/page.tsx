import { Suspense } from "react";
import LoginForm from "@/components/Auth/LoginForm";
import Navbar from "@/components/Navbar";

export const metadata = { title: "Sign In" };

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-paper">
      <Navbar />
      <div className="flex items-center justify-center min-h-[80vh] px-6">
        <Suspense fallback={<div className="text-deep/50 text-sm">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}

