import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { safeSanityFetch } from "@/sanity/lib/client";
import { SITE_SETTINGS_QUERY, type SiteSettingsData } from "@/sanity/lib/queries";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await safeSanityFetch<SiteSettingsData>(
    SITE_SETTINGS_QUERY,
    {},
    ["siteSettings"]
  );

  const title = settings?.title || "Blue Mind Congress 2027";
  const favicon = settings?.faviconUrl || "/images/wmtf.ico";
  const logo = settings?.logoUrl || "/images/wmtf.png";

  return {
    title: {
      default: title,
      template: `%s — ${title}`,
    },
    description: "Discover how water transforms the human mind. Blue Mind Congress 2027.",
    icons: {
      icon: [
        { url: favicon },
        { url: "/images/wmtf.ico", sizes: "any" },
      ],
      apple: [
        { url: logo },
        { url: "/images/wmtf.png" },
      ],
      shortcut: [favicon],
    },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
