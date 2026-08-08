"use client";

import { motion } from "framer-motion";
import { FileText, ClipboardList, Shapes, Camera, Video, Download } from "lucide-react";
import { IconBadge } from "@/components/ui/IconBadge";

const ASSETS = [
  {
    icon: FileText,
    title: "Press Release",
    description: "The official Congress 2027 announcement, ready to publish.",
    size: "PDF · 240 KB",
    href: "/press-kit/press-release.pdf",
  },
  {
    icon: ClipboardList,
    title: "Fact Sheet",
    description: "Key dates, figures and background on the Foundation.",
    size: "PDF · 180 KB",
    href: "/press-kit/fact-sheet.pdf",
  },
  {
    icon: Shapes,
    title: "Logos",
    description: "Congress and Foundation marks in SVG and PNG, light and dark.",
    size: "ZIP · 4.1 MB",
    href: "/press-kit/logos.zip",
  },
  {
    icon: Camera,
    title: "Photos",
    description: "High-resolution imagery from past events and the valley.",
    size: "ZIP · 86 MB",
    href: "/press-kit/photos.zip",
  },
  {
    icon: Video,
    title: "Videos",
    description: "B-roll and the official Congress trailer, broadcast quality.",
    size: "ZIP · 320 MB",
    href: "/press-kit/videos.zip",
  },
];

export default function DownloadCards() {
  return (
    <section className="w-full bg-paper py-16 md:py-24 px-6">
      <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ASSETS.map((asset, i) => (
          <motion.a
            key={asset.title}
            href={asset.href}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            whileHover={{ y: -4 }}
            className="group flex flex-col rounded-3xl border border-deep/10 bg-white p-7 hover:border-teal/30 hover:shadow-lg hover:shadow-deep/5 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <IconBadge icon={asset.icon} />
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-deep/10 text-deep/50 group-hover:text-teal group-hover:border-teal/40 transition-colors">
                <Download className="h-4 w-4" />
              </span>
            </div>

            <h3 className="font-display font-semibold text-lg text-deep mb-2">
              {asset.title}
            </h3>
            <p className="text-sm text-deep/60 leading-relaxed mb-6 flex-1">
              {asset.description}
            </p>
            <span className="text-xs text-deep/40">{asset.size}</span>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
