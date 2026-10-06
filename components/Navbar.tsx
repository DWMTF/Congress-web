"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronDown, LogOut, CreditCard, LayoutDashboard, Radio } from "lucide-react";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

const NAV_LINKS = [
  { label: "About", href: "/#about", hideOn: ["/register", "/press", "/admin", "/sponsorship"] },
  { label: "Sponsorship", href: "/sponsorship" },
  { label: "Downloads", href: "/press" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // ── Fetch current role & user info ────────────────────────────
  const fetchUserRole = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUserEmail(data.user.email ?? null);
          setIsAdmin(Boolean(data.isAdmin));
          setLoadingAuth(false);
          return;
        }
      }
    } catch {
      // Fallback to client auth
    }

    try {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserEmail(data.user.email ?? null);
        const metaRole =
          (data.user.app_metadata?.role as string) || (data.user.user_metadata?.role as string);
        setIsAdmin(metaRole === "admin" || metaRole === "super_admin");
      } else {
        setUserEmail(null);
        setIsAdmin(false);
      }
    } catch {
      setUserEmail(null);
      setIsAdmin(false);
    } finally {
      setLoadingAuth(false);
    }
  }, [supabase]);

  // ── Watch auth state ──────────────────────────────────────────
  useEffect(() => {
    fetchUserRole();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
        await fetchUserRole();
      } else if (event === "SIGNED_OUT") {
        setUserEmail(null);
        setIsAdmin(false);
        setLoadingAuth(false);
      } else if (session?.user) {
        setUserEmail(session.user.email ?? null);
        const metaRole =
          (session.user.app_metadata?.role as string) ||
          (session.user.user_metadata?.role as string);
        setIsAdmin(metaRole === "admin" || metaRole === "super_admin");
        setLoadingAuth(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUserRole, supabase]);

  // ── Close dropdown on outside click ──────────────────────────
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    setMenuOpen(false);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    setUserEmail(null);
    setIsAdmin(false);
    router.push("/");
    router.refresh();
  }

  const isLoggedIn = userEmail !== null;

  return (
    <nav className="relative z-50 flex items-center justify-between px-6 md:px-10 py-5 bg-paper">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3">
        <span className="h-8 w-8 rounded-full bg-deep" aria-hidden />
        <span className="font-semibold text-deep text-lg tracking-tight">
          Blue Mind Congress
        </span>
      </Link>

      {/* Navigation */}
      <div className="hidden md:flex items-center gap-10">
        {NAV_LINKS.filter((link) => !link.hideOn?.includes(pathname)).map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-sm text-deep/80 hover:text-deep transition-colors"
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Auth button */}
      {loadingAuth ? (
        <div className="h-9 w-28 animate-pulse rounded-full bg-deep/[0.04]" aria-hidden />
      ) : !isLoggedIn ? (
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-deep/80 hover:text-deep transition-colors px-3 py-2"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-deep text-paper text-sm font-medium px-5 py-2.5 hover:bg-deep/90 transition-colors shadow-sm"
          >
            Register
          </Link>
        </div>
      ) : (
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-full bg-deep/[0.06] border border-deep/10 text-sm font-medium text-deep px-4 py-2 hover:bg-deep/10 transition-colors"
          >
            <span className="h-6 w-6 rounded-full bg-teal/20 flex items-center justify-center text-teal text-xs font-bold">
              {userEmail ? userEmail[0].toUpperCase() : "U"}
            </span>
            <span className="hidden sm:block max-w-[140px] truncate">{userEmail}</span>
            {isAdmin && (
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-teal/20 text-teal uppercase tracking-wide">
                Admin
              </span>
            )}
            <ChevronDown className={`h-3.5 w-3.5 text-deep/50 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-deep/10 bg-white shadow-xl shadow-deep/5 overflow-hidden z-50">
              {isAdmin && (
                <>
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-teal hover:bg-teal/[0.08] transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4 text-teal shrink-0" />
                    Admin Dashboard
                  </Link>
                  <div className="border-t border-deep/10" />
                </>
              )}

              <Link
                href="/watch"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-deep/80 hover:bg-teal/[0.06] hover:text-deep transition-colors"
              >
                <Radio className="h-4 w-4 text-teal shrink-0" />
                Live Stream
              </Link>
              <Link
                href="/payment"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-deep/80 hover:bg-teal/[0.06] hover:text-deep transition-colors"
              >
                <CreditCard className="h-4 w-4 text-teal shrink-0" />
                My Registration
              </Link>
              <div className="border-t border-deep/10" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-deep/80 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                Sign out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
