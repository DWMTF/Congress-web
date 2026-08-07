"use client"
import { useState } from "react";
import { LinkButton } from "@/components/ui/Button";
import Countdown from "@/components/ui/Countdown";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Downloads", href: "/press" },
  { label: "Contact", href: "#contact" },
];

export default function Hero() {
    const [videoFailed, setVideoFailed] = useState(false);

    return (
        <header className="relative h-screen w-full overflow-hidden">
      {/* Nav */}
      <nav className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 md:px-10 py-5 bg-paper">
        <div className="flex items-center gap-3">
          <span className="h-8 w-8 rounded-full bg-deep" aria-hidden />
          <span className="font-semibold text-deep text-lg tracking-tight">
            Blue Mind Congress
          </span>
        </div>

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

        <a
          href="/register"
          className="rounded-full bg-deep text-paper text-sm font-medium px-5 py-2.5 hover:bg-deep/90 transition-colors"
        >
          Register
        </a>
      </nav>

      {/* Background media: looping video, falls back to the static photo */}
      <div className="absolute inset-0">
        {!videoFailed && (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            poster="https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2400&auto=format&fit=crop"
            onError={() => setVideoFailed(true)}
          >
            <source src="/videos/hero-loop.webm" type="video/webm" />
            <source src="/videos/hero-loop.mp4" type="video/mp4" />
          </video>
        )}

        {/* {videoFailed && (
          <Image
            src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2400&auto=format&fit=crop"
            alt="Rafters paddling a calm forest river"
            fill
            priority
            className="object-cover"
          />
        )} */}

        <div className="absolute inset-0 bg-gradient-to-t from-deep/70 via-deep/10 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-20 flex h-full flex-col items-center justify-center text-center px-6">
        <p className="eyebrow text-teal mb-5">
          Deraniyagala Water &amp; Mountain Tourism Foundation
        </p>

        <h1 className="font-sans font-semibold text-paper text-7xl md:text-5xl text-balance">
          Blue Mind Congress 2027
        </h1>

        <p className="mt-5 text-paper/90 text-lg md:text-xl max-w-xl text-balance">
          Discover how water transforms the human mind.
        </p>

        <Countdown target={new Date("2027-05-01T09:00:00")} className="mt-10" />

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
            {/* <button>Register</button>
            <button>Become a Sponsor</button> */}
          <LinkButton href="/register" variant="secondary" className="min-w-[180px]">
            Register
          </LinkButton>
          <LinkButton href="/sponsorship" variant="glass" className="min-w-[180px]">
            Become a Sponsor
          </LinkButton> 
        </div>
      </div>
    </header>
    );
}