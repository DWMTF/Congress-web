import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  tone = "deep",
  className,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  tone?: "deep" | "paper";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <p className={cn("eyebrow mb-4", tone === "deep" ? "text-teal" : "text-teal")}>
        {eyebrow}
      </p>
      <h2
        className={cn(
          "font-display font-semibold text-display-lg text-balance",
          tone === "deep" ? "text-deep" : "text-paper"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-5 text-lg text-balance",
            tone === "deep" ? "text-deep/65" : "text-paper/70"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
