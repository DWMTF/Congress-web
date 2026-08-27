"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, CreditCard, LayoutDashboard, Shield } from "lucide-react";
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
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // ── Fetch current role & user info ────────────────────────────
  async function fetchUserRole() {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUserEmail(data.user.email ?? null);
          setUserRole(data.role);
          setIsAdmin(data.isAdmin);
          return;
        }
      }
    } catch {
      // Fallback to client auth
    }

    const { data } = await supabase.auth.getUser();
    setUserEmail(data.user?.email ?? null);
    const metaRole = (data.user?.app_metadata?.role as string) || (data.user?.user_metadata?.role as string);
    setUserRole(metaRole ?? null);
    setIsAdmin(metaRole === "admin" || metaRole === "super_admin");
  }

  // ── Watch auth state ──────────────────────────────────────────
  useEffect(() => {
    fetchUserRole();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserRole();
      } else {
        setUserEmail(null);
        setUserRole(null);
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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
    await fetch("/api/auth/logout", { method: "POST" });
    setUserEmail(null);
    setUserRole(null);
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
      {!isLoggedIn ? (
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
              {userEmail[0].toUpperCase()}
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
