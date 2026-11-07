"use client";

import { motion } from "framer-motion";
import {
  FileText,
  ClipboardList,
  Shapes,
  Camera,
  Video,
  Download,
  LucideIcon,
} from "lucide-react";
import { IconBadge } from "@/components/ui/IconBadge";
import type { PressAssetData } from "@/sanity/lib/queries";

const ICON_MAP: Record<string, LucideIcon> = {
  fileText: FileText,
  clipboard: ClipboardList,
  shapes: Shapes,
  camera: Camera,
  video: Video,
};

interface DownloadCardsProps {
  assets?: PressAssetData[] | null;
}

export default function DownloadCards({ assets }: DownloadCardsProps) {
  if (!assets || assets.length === 0) {
    return null;
  }

  const validAssets = assets.filter(
    (a) => a.title && (a.fileUrl || a.externalUrl)
  );

  if (validAssets.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-paper py-12 md:py-16 px-6">
      <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {validAssets.map((asset, i) => {
          const Icon =
            (asset.iconType && ICON_MAP[asset.iconType]) || FileText;
          const href = asset.fileUrl || asset.externalUrl || "#";
          const sizeLabel =
            asset.customSize || (asset.fileUrl?.endsWith(".pdf") ? "PDF" : "Download");

          return (
            <motion.a
              key={asset._id || asset.title}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              className="group flex flex-col rounded-3xl border border-deep/10 bg-white p-7 hover:border-teal/30 hover:shadow-lg hover:shadow-deep/5 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-6">
                <IconBadge icon={Icon} />
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-deep/10 text-deep/50 group-hover:text-teal group-hover:border-teal/40 transition-colors">
                  <Download className="h-4 w-4" />
                </span>
              </div>

              <h3 className="font-display font-semibold text-lg text-deep mb-2">
                {asset.title}
              </h3>
              {asset.description && (
                <p className="text-sm text-deep/60 leading-relaxed mb-6 flex-1">
                  {asset.description}
                </p>
              )}
              {sizeLabel && (
                <span className="text-xs text-deep/40">{sizeLabel}</span>
              )}
            </motion.a>
          );
        })}
      </div>
    </section>
  );
}
