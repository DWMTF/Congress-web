"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Waves, Radio, AlertCircle, LogIn, UserPlus } from "lucide-react";
import StepProgress from "./StepProgress";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { TextInput } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { TICKET_PRICES } from "@/lib/payment/prices";

type Attendance = "in-person" | "livestream" | null;
type AuthMode = "choose" | "login" | "register";

interface FormState {
  attendance: Attendance;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  organization: string;
}

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -60 : 60, opacity: 0 }),
};

function formatLKR(amount: number) {
  return `LKR ${amount.toLocaleString("en-LK")}`;
}

export default function RegistrationSection() {
  const [authMode, setAuthMode] = useState<AuthMode>("choose");
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [form, setForm] = useState<FormState>({
    attendance: null,
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    organization: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ── Login state (for inline login form) ──────────────────────
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error ?? "Invalid email or password.");
        return;
      }
      // Redirect to homepage or a "my registration" page after login
      window.location.href = "/";
    } catch {
      setLoginError("Network error. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  }

  const goNext = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, 3));
  };
  const goBack = () => {
    setError("");
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const canProceed =
    (step === 0 && form.attendance !== null) ||
    (step === 1 &&
      form.firstName.trim() !== "" &&
      form.lastName.trim() !== "" &&
      form.email.trim() !== "" &&
      form.password.length >= 8) ||
    step === 2 ||
    step === 3;

  const price = form.attendance ? TICKET_PRICES[form.attendance] : 0;

  /** Step 3: Register + initiate payment */
  async function handlePayment() {
    setError("");
    setLoading(true);

    try {
      // 1 — Register user
      const regRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          firstName: form.firstName,
          lastName: form.lastName,
          organization: form.organization || undefined,
          attendanceType: form.attendance,
        }),
      });

      const regData = await regRes.json();

      if (!regRes.ok) {
        setError(regData.error ?? "Registration failed. Please try again.");
        return;
      }

      // 2 — Log in so the session cookie is set
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      if (!loginRes.ok) {
        setError("Account created but auto-login failed. Please log in manually and return.");
        return;
      }

      // 3 — Initiate payment
      const payRes = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId: regData.registrationId }),
      });

      const payData = await payRes.json();

      if (!payRes.ok) {
        setError(payData.error ?? "Payment initiation failed. Please try again.");
        return;
      }

      // 4 — Redirect to OnePay
      window.location.href = payData.redirectUrl;
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="register"
      className="relative w-full bg-paper py-20 md:py-28 px-6 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-teal/[0.04] to-transparent pointer-events-none" />

      <SectionHeading
        eyebrow="Registration"
        title="Reserve your place"
        subtitle="Four short steps. No long forms, no clutter."
        align="center"
        className="relative mx-auto mb-14"
      />

      {/* ── Gate + login are shown INSTEAD of the form ─────── */}
      <AnimatePresence mode="wait">
        {authMode !== "register" && (
          <motion.div
            key={authMode}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-w-xl mx-auto mb-4"
          >
            <GlassCard className="p-8 md:p-12">
              {authMode === "choose" && (
                <>
                  <h3 className="font-display font-semibold text-xl text-deep mb-2">
                    Do you have an account?
                  </h3>
                  <p className="text-sm text-deep/55 mb-8">
                    Sign in to manage an existing registration, or create a new account to register.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => setAuthMode("login")}
                      className="text-left rounded-2xl border border-deep/10 hover:border-teal/50 bg-white hover:bg-teal/[0.03] p-6 transition-all duration-300 group"
                    >
                      <LogIn className="h-6 w-6 mb-4 text-deep/40 group-hover:text-teal transition-colors" strokeWidth={1.75} />
                      <p className="font-medium text-deep mb-1">Sign in</p>
                      <p className="text-sm text-deep/55">I already have an account</p>
                    </button>
                    <button
                      onClick={() => setAuthMode("register")}
                      className="text-left rounded-2xl border border-teal bg-teal/[0.06] shadow-[0_0_0_1px_rgba(58,175,169,0.3)] p-6 transition-all duration-300"
                    >
                      <UserPlus className="h-6 w-6 mb-4 text-teal" strokeWidth={1.75} />
                      <p className="font-medium text-deep mb-1">Create account</p>
                      <p className="text-sm text-deep/55">Register for the Congress</p>
                    </button>
                  </div>
                </>
              )}

              {authMode === "login" && (
                <>
                  <button
                    onClick={() => { setLoginError(""); setAuthMode("choose"); }}
                    className="text-sm text-deep/50 hover:text-deep transition-colors mb-6 inline-flex items-center gap-1"
                  >
                    ← Back
                  </button>
                  <h3 className="font-display font-semibold text-xl text-deep mb-2">
                    Welcome back
                  </h3>
                  <p className="text-sm text-deep/55 mb-6">
                    Sign in to manage your registration.
                  </p>
                  <form onSubmit={handleLogin} className="space-y-4" noValidate>
                    <TextInput
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="Email address"
                      type="email"
                      autoComplete="email"
                      required
                    />
                    <TextInput
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Password"
                      type="password"
                      autoComplete="current-password"
                      required
                    />
                    {loginError && (
                      <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                        <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                        <p className="text-sm text-red-600">{loginError}</p>
                      </div>
                    )}
                    <Button type="submit" disabled={loginLoading} className="w-full py-3">
                      {loginLoading ? "Signing in…" : "Sign in"}
                    </Button>
                  </form>
                  <p className="mt-5 text-xs text-deep/40 text-center">
                    Don&apos;t have an account yet?{" "}
                    <button
                      onClick={() => setAuthMode("register")}
                      className="text-teal hover:underline font-medium"
                    >
                      Register here
                    </button>
                  </p>
                </>
              )}
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Multi-step registration form ──────────────────────── */}
      <AnimatePresence>
        {authMode === "register" && (
          <motion.div
            key="register-flow"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-center mb-8">
              <button
                onClick={() => { setError(""); setAuthMode("choose"); }}
                className="text-sm text-deep/50 hover:text-deep transition-colors inline-flex items-center gap-1"
              >
                ← Already have an account? Sign in
              </button>
            </div>

      <StepProgress current={step} />

      <div className="relative max-w-xl mx-auto">
        <GlassCard className="p-8 md:p-12 min-h-[380px] flex flex-col overflow-hidden">
          <div className="flex-1">
            <AnimatePresence mode="wait" custom={direction}>

              {/* ── Step 0: Attendance type ───────────────────── */}
              {step === 0 && (
                <motion.div
                  key="step-0"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h3 className="font-display font-semibold text-xl text-deep mb-6">
                    How will you join us?
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      {
                        id: "in-person" as const,
                        icon: Waves,
                        title: "In Person",
                        desc: "Join us on the riverbank for the full Congress experience.",
                        price: TICKET_PRICES["in-person"],
                      },
                      {
                        id: "livestream" as const,
                        icon: Radio,
                        title: "Livestream",
                        desc: "Attend every keynote and panel from wherever you are.",
                        price: TICKET_PRICES["livestream"],
                      },
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setForm((f) => ({ ...f, attendance: option.id }))}
                        className={`text-left rounded-2xl border p-6 transition-all duration-300 ${
                          form.attendance === option.id
                            ? "border-teal bg-teal/[0.06] shadow-[0_0_0_1px_rgba(58,175,169,0.3)]"
                            : "border-deep/10 hover:border-deep/25 bg-white"
                        }`}
                      >
                        <option.icon
                          className={`h-6 w-6 mb-4 ${
                            form.attendance === option.id ? "text-teal" : "text-deep/50"
                          }`}
                          strokeWidth={1.75}
                        />
                        <p className="font-medium text-deep mb-1">{option.title}</p>
                        <p className="text-sm text-deep/60 mb-3">{option.desc}</p>
                        <p className={`text-sm font-semibold ${form.attendance === option.id ? "text-teal" : "text-deep/50"}`}>
                          {formatLKR(option.price)}
                        </p>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── Step 1: Personal details + account ───────── */}
              {step === 1 && (
                <motion.div
                  key="step-1"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h3 className="font-display font-semibold text-xl text-deep mb-6">
                    Create your account
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <TextInput
                        value={form.firstName}
                        onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                        placeholder="First name"
                        autoComplete="given-name"
                      />
                      <TextInput
                        value={form.lastName}
                        onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                        placeholder="Last name"
                        autoComplete="family-name"
                      />
                    </div>
                    <TextInput
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="Email address"
                      type="email"
                      autoComplete="email"
                    />
                    <TextInput
                      value={form.password}
                      onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                      placeholder="Password (min. 8 characters)"
                      type="password"
                      autoComplete="new-password"
                    />
                    <TextInput
                      value={form.organization}
                      onChange={(e) => setForm((f) => ({ ...f, organization: e.target.value }))}
                      placeholder="Organization (optional)"
                      autoComplete="organization"
                    />
                  </div>
                </motion.div>
              )}

              {/* ── Step 2: Review ────────────────────────────── */}
              {step === 2 && (
                <motion.div
                  key="step-2"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h3 className="font-display font-semibold text-xl text-deep mb-6">
                    Confirm your details
                  </h3>
                  <dl className="space-y-4">
                    {[
                      {
                        label: "Attendance",
                        value: form.attendance === "in-person" ? "In Person" : "Livestream",
                      },
                      { label: "Name", value: `${form.firstName} ${form.lastName}`.trim() || "—" },
                      { label: "Email", value: form.email || "—" },
                      { label: "Organization", value: form.organization || "—" },
                      { label: "Registration fee", value: formatLKR(price) },
                    ].map((row) => (
                      <div
                        key={row.label}
                        className="flex items-center justify-between border-b border-deep/10 pb-4"
                      >
                        <dt className="text-sm text-deep/55">{row.label}</dt>
                        <dd className={`font-medium ${row.label === "Registration fee" ? "text-teal" : "text-deep"}`}>
                          {row.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </motion.div>
              )}

              {/* ── Step 3: Pay ───────────────────────────────── */}
              {step === 3 && (
                <motion.div
                  key="step-3"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="text-center flex flex-col items-center justify-center h-full py-6"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-teal/10 mb-6">
                    <Check className="h-6 w-6 text-teal" />
                  </span>
                  <h3 className="font-display font-semibold text-xl text-deep mb-2">
                    Ready to secure your seat
                  </h3>
                  <p className="text-deep/60 max-w-sm mb-3">
                    You&apos;ll be redirected to OnePay to complete your{" "}
                    <strong>{formatLKR(price)}</strong> payment securely.
                  </p>
                  <p className="text-xs text-deep/40 mb-8">
                    Visa · Mastercard · AMEX · Lanka QR
                  </p>

                  {error && (
                    <div className="flex items-start gap-2 w-full text-left bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4">
                      <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  <Button onClick={handlePayment} disabled={loading} className="px-8">
                    {loading ? "Redirecting…" : "Proceed to secure payment →"}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Error (steps 0–2) */}
          {error && step < 3 && (
            <div className="flex items-start gap-2 mt-4 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {step < 3 && (
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-deep/10">
              <button
                onClick={goBack}
                disabled={step === 0}
                className="text-sm font-medium text-deep/60 disabled:opacity-0 hover:text-deep transition-colors"
              >
                ← Back
              </button>
              <Button
                onClick={goNext}
                disabled={!canProceed}
                className="px-6 py-3 text-sm"
              >
                Continue
              </Button>
            </div>
          )}
        </GlassCard>
      </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
