"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { TextInput } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Login failed. Please try again.");
        return;
      }

      router.push("/register");
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <GlassCard className="w-full max-w-md p-8 md:p-12">
      <h1 className="font-display font-semibold text-2xl text-deep mb-2">Welcome back</h1>
      <p className="text-deep/60 text-sm mb-8">Sign in to manage your Congress registration.</p>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <TextInput
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          type="email"
          autoComplete="email"
          required
        />
        <TextInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          autoComplete="current-password"
          required
        />

        {error && (
          <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{error}</p>
        )}

        <Button type="submit" disabled={loading} className="w-full py-3">
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-deep/50 text-center">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-teal hover:underline font-medium">
          Register for the Congress
        </Link>
      </p>
    </GlassCard>
  );
}
