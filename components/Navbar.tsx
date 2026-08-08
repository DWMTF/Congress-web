"use client";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Downloads", href: "/press" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  return (
    <nav className="relative z-50 flex items-center justify-between px-6 md:px-10 py-5 bg-paper">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <span
          className="h-8 w-8 rounded-full bg-deep"
          aria-hidden
        />

        <span className="font-semibold text-deep text-lg tracking-tight">
          Blue Mind Congress
        </span>
      </div>

      {/* Navigation */}
      <div className="hidden md:flex items-center gap-10">
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-sm text-deep/80 hover:text-deep transition-colors"
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Register */}
      <a
        href="/register"
        className="rounded-full bg-deep text-paper text-sm font-medium px-5 py-2.5 hover:bg-deep/90 transition-colors"
      >
        Register
      </a>
    </nav>
  );
}