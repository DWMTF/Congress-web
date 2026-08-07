import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "glass" | "ghost";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-deep text-paper hover:bg-deep/90",
  secondary: "bg-paper text-deep hover:bg-paper/90",
  glass: "glass text-paper hover:bg-white/20",
  ghost: "border border-deep/15 text-deep hover:bg-deep/5",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  href?: undefined;
}

interface LinkButtonProps {
  variant?: Variant;
  href: string;
  className?: string;
  children: React.ReactNode;
}

const base =
  "inline-flex items-center justify-center rounded-full font-medium px-8 py-3.5 transition-colors disabled:opacity-30 disabled:pointer-events-none";

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button className={cn(base, VARIANT_CLASSES[variant], className)} {...props} />
  );
}

export function LinkButton({ variant = "primary", href, className, children }: LinkButtonProps) {
  const isExternalAnchor = href.startsWith("#");
  const classes = cn(base, VARIANT_CLASSES[variant], className);

  if (isExternalAnchor) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
