"use client";

import { useEffect, useState } from "react";

interface CountdownProps {
  target: Date;
  className?: string;
  unitClassName?: string;
  labelClassName?: string;
}

function useCountdown(target: Date) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, target.getTime() - Date.now());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTime({ days, hours, minutes, seconds });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return time;
}

/** Reusable countdown display — pass any target date, style with className props. */
export default function Countdown({
  target,
  className = "",
  unitClassName = "font-sans font-light text-paper text-4xl md:text-5xl tabular-nums tracking-wider",
  labelClassName = "mt-2 eyebrow text-paper/70 !text-[0.65rem]",
}: CountdownProps) {
  const countdown = useCountdown(target);

  const units = [
    { value: countdown.days, label: "Days" },
    { value: countdown.hours, label: "Hours" },
    { value: countdown.minutes, label: "Minutes" },
    { value: countdown.seconds, label: "Seconds" },
  ];

  return (
    <div className={`flex items-start gap-8 md:gap-12 ${className}`}>
      {units.map((unit) => (
        <div key={unit.label} className="flex flex-col items-center">
          <span className={unitClassName}>{String(unit.value).padStart(2, "0")}</span>
          <span className={labelClassName}>{unit.label}</span>
        </div>
      ))}
    </div>
  );
}
