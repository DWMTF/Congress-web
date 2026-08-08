"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Waves, Radio } from "lucide-react";
import StepProgress from "./StepProgress";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { TextInput } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";

type Attendance = "in-person" | "livestream" | null;

interface FormState {
  attendance: Attendance;
  name: string;
  email: string;
  organization: string;
}

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -60 : 60, opacity: 0 }),
};

export default function RegistrationSection() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [form, setForm] = useState<FormState>({
    attendance: null,
    name: "",
    email: "",
    organization: "",
  });

  const goNext = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, 3));
  };
  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const canProceed =
    (step === 0 && form.attendance !== null) ||
    (step === 1 && form.name.trim() !== "" && form.email.trim() !== "") ||
    step === 2 ||
    step === 3;

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

      <StepProgress current={step} />

      <div className="relative max-w-xl mx-auto">
        <GlassCard className="p-8 md:p-12 min-h-[380px] flex flex-col overflow-hidden">
          <div className="flex-1">
            <AnimatePresence mode="wait" custom={direction}>
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
                      },
                      {
                        id: "livestream" as const,
                        icon: Radio,
                        title: "Livestream",
                        desc: "Attend every keynote and panel from wherever you are.",
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
                        <p className="text-sm text-deep/60">{option.desc}</p>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

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
                    Tell us about you
                  </h3>
                  <div className="space-y-4">
                    <TextInput
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="Full name"
                    />
                    <TextInput
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="Email address"
                      type="email"
                    />
                    <TextInput
                      value={form.organization}
                      onChange={(e) => setForm((f) => ({ ...f, organization: e.target.value }))}
                      placeholder="Organization (optional)"
                    />
                  </div>
                </motion.div>
              )}

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
                        value:
                          form.attendance === "in-person" ? "In Person" : "Livestream",
                      },
                      { label: "Name", value: form.name || "—" },
                      { label: "Email", value: form.email || "—" },
                      { label: "Organization", value: form.organization || "—" },
                    ].map((row) => (
                      <div
                        key={row.label}
                        className="flex items-center justify-between border-b border-deep/10 pb-4"
                      >
                        <dt className="text-sm text-deep/55">{row.label}</dt>
                        <dd className="text-deep font-medium">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                </motion.div>
              )}

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
                    You&apos;re ready for payment
                  </h3>
                  <p className="text-deep/60 max-w-sm mb-8">
                    We&apos;ve held your place. Complete registration securely to
                    confirm your seat at the Congress.
                  </p>
                  <Button>Proceed to secure payment</Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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
    </section>
  );
}
