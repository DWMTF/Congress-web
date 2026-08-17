export const metadata = { title: "Sign In — Blue Mind Congress 2027" };

import LoginForm from "@/components/Auth/LoginForm";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-paper">
      <Navbar />
      <div className="flex items-center justify-center min-h-[80vh] px-6">
        <LoginForm />
      </div>
    </main>
  );
}
