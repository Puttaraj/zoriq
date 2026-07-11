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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: "easeOut",
      }}
    >
      <Link
        href={`/tools/${tool.slug}`}
        className={cn(
          "group border-border/60 bg-card relative flex flex-col gap-4 rounded-xl border p-6",
          "shadow-soft transition-all duration-300",
          "hover:border-primary/30 hover:-translate-y-1 hover:shadow-lg",
          "focus-ring",
        )}
        id={`tool-card-${tool.slug}`}
      >
        {/* Icon */}
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl",
            "bg-primary/10 text-primary transition-colors",
            "group-hover:bg-primary group-hover:text-primary-foreground",
          )}
        >
          <IconComponent className="h-6 w-6" />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-1.5">
          <h3 className="font-heading text-card-foreground text-base font-semibold">
            {tool.name}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {tool.shortDescription}
          </p>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2">
          {tool.isNew && (
            <span className="bg-accent-surface/10 text-accent-surface rounded-full px-2.5 py-0.5 text-xs font-medium">
              New
            </span>
          )}
          {tool.processingLocation === "client" && (
            <span className="bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 text-xs">
              Browser-based
            </span>
          )}
        </div>

        {/* Hover Arrow */}
        <div
          className={cn(
            "absolute top-4 right-4 opacity-0 transition-all duration-300",
            "group-hover:opacity-100",
          )}
        >
          <LucideIcons.ArrowUpRight className="text-primary h-4 w-4" />
        </div>
      </Link>
    </motion.div>
  );
}
