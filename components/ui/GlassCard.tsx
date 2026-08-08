import { cn } from "@/lib/utils";

export function GlassCard({
  className,
  children,
  onLight = true,
}: {
  className?: string;
  children: React.ReactNode;
  /** true = subtle deep-tint glass for use on white; false = frosted glass for use on imagery/dark. */
  onLight?: boolean;
}) {
  return (
    <div className={cn(onLight ? "glass-on-white" : "glass", "rounded-[2rem]", className)}>
      {children}
    </div>
  );
}
