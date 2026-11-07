import { Suspense } from "react";
import LoginForm from "@/components/Auth/LoginForm";
import Navbar from "@/components/Navbar";
import { safeSanityFetch } from "@/sanity/lib/client";
import { SITE_SETTINGS_QUERY, type SiteSettingsData } from "@/sanity/lib/queries";

export const metadata = { title: "Sign In — Blue Mind Congress" };

export const revalidate = 60;

export default async function LoginPage() {
  const settings = await safeSanityFetch<SiteSettingsData>(
    SITE_SETTINGS_QUERY,
    {},
    ["siteSettings"]
  );

  return (
    <main className="min-h-screen bg-paper">
      <Navbar title={settings?.title} logoUrl={settings?.logoUrl} />
      <div className="flex items-center justify-center min-h-[80vh] px-6">
        <Suspense fallback={<div className="text-deep/50 text-sm">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}

