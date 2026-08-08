import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function IconBadge({
  icon: Icon,
  className,
  iconClassName = "h-5 w-5 text-teal",
}: {
  icon: LucideIcon;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <span
      className={cn(
        "flex h-12 w-12 items-center justify-center rounded-full glass-on-white",
        className
      )}
    >
      <Icon className={iconClassName} strokeWidth={1.75} />
    </span>
  );
}
