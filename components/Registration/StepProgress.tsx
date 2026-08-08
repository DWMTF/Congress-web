"use client";

import { motion } from "framer-motion";

const STEPS = ["Attendance", "Details", "Confirm", "Payment"];

export default function StepProgress({ current }: { current: number }) {
  return (
    <div className="flex items-center w-full max-w-md mx-auto mb-14">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-2">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors duration-500 ${
                i <= current
                  ? "bg-deep text-paper"
                  : "bg-deep/[0.06] text-deep/40"
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`text-xs transition-colors duration-500 ${
                i <= current ? "text-deep" : "text-deep/35"
              }`}
            >
              {label}
            </span>
          </div>

          {i < STEPS.length - 1 && (
            <div className="flex-1 h-px bg-deep/10 mx-2 mb-5 relative overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-teal"
                initial={{ width: 0 }}
                animate={{ width: i < current ? "100%" : "0%" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
