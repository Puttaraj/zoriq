"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import type { ToolConfig } from "@/types/tool";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  tool: ToolConfig;
  index?: number;
}

export function ToolCard({ tool, index = 0 }: ToolCardProps) {
  const IconComponent =
    (LucideIcons[
      tool.icon as keyof typeof LucideIcons
    ] as LucideIcons.LucideIcon) ?? LucideIcons.Wrench;

  // Map category to a short readable tag
  const categoryName = tool.category.replace(" Tools", "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{
        duration: 0.35,
        delay: index * 0.04,
        ease: "easeOut",
      }}
      className="h-full"
    >
      <Link
        href={`/tools/${tool.slug}`}
        className={cn(
          "group border-border/40 bg-card relative flex h-full flex-col justify-between overflow-hidden rounded-xl border p-6",
          "shadow-soft transition-all duration-300 ease-out",
          "hover:border-primary/45 hover:-translate-y-1.5 hover:shadow-lg",
          "hover:shadow-[0_8px_30px_rgb(108,58,237,0.06)] dark:hover:shadow-[0_8px_30px_rgb(139,92,246,0.04)]",
          "focus-ring",
        )}
        id={`tool-card-${tool.slug}`}
      >
        {/* Glow effect on hover */}
        <div
          className="from-primary/5 absolute inset-0 -z-10 bg-gradient-to-br via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          aria-hidden="true"
        />

        <div className="flex flex-col gap-4">
          {/* Header row: Icon & Category Tag */}
          <div className="flex items-center justify-between">
            <div
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-lg transition-all duration-300",
                "bg-muted/80 text-muted-foreground",
                "group-hover:bg-primary/10 group-hover:text-primary",
              )}
            >
              <IconComponent className="h-5 w-5" />
            </div>
            <span className="bg-muted/60 text-muted-foreground rounded px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase">
              {categoryName}
            </span>
          </div>

          {/* Title & Description */}
          <div className="flex flex-col gap-1.5">
            <h3 className="font-heading text-foreground group-hover:text-primary text-sm font-semibold tracking-tight transition-colors">
              {tool.name}
            </h3>
            <p className="text-muted-foreground/95 line-clamp-2 text-xs leading-relaxed">
              {tool.shortDescription}
            </p>
          </div>
        </div>

        {/* Badges and launch metrics footer */}
        <div className="border-border/20 mt-5 flex flex-col gap-3.5 border-t pt-4">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Speed estimate metric */}
            <span className="bg-accent-surface/5 text-accent-surface inline-flex items-center gap-1 rounded px-2 py-0.5 text-[9px] font-semibold">
              <span className="bg-accent-surface h-1 w-1 rounded-full" />
              Instant
            </span>
            {/* Privacy Badge */}
            <span className="bg-primary/5 text-primary rounded px-2 py-0.5 text-[9px] font-semibold">
              No Uploads
            </span>
            {/* Location Badge */}
            <span className="bg-muted text-muted-foreground rounded px-2 py-0.5 text-[9px] font-medium">
              Browser Executed
            </span>
          </div>

          {/* Launch Button / Call-to-action bar */}
          <div className="text-primary flex items-center justify-between text-xs font-semibold">
            <span className="-translate-x-2 text-[11px] font-bold opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
              Open Tool
            </span>
            <div className="text-muted-foreground group-hover:bg-primary rounded-lg p-1.5 transition-all duration-300 group-hover:text-white">
              <LucideIcons.ArrowUpRight className="h-4.5 w-4.5" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
