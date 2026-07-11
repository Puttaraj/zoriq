"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, UserCheck, CalendarDays, Award } from "lucide-react";
import { getToolBySlug } from "@/config/tools";
import { ToolCard } from "@/components/shared/tool-card";
import { cn } from "@/lib/utils";

const featuresData = [
  {
    key: "trending",
    label: "Trending",
    icon: TrendingUp,
    slug: "json-formatter",
    badge: "Hot Choice",
  },
  {
    key: "most-used",
    label: "Most Used",
    icon: UserCheck,
    slug: "image-compressor",
    badge: "Popular",
  },
  {
    key: "recent",
    label: "Recently Added",
    icon: CalendarDays,
    slug: "qr-generator",
    badge: "New Release",
  },
  {
    key: "editors",
    label: "Editor's Choice",
    icon: Award,
    slug: "password-generator",
    badge: "Staff Pick",
  },
] as const;

export function FeaturedTools() {
  const [activeTab, setActiveTab] = useState<string>("trending");

  const activeItem = featuresData.find((f) => f.key === activeTab);
  const tool = activeItem ? getToolBySlug(activeItem.slug) : undefined;

  return (
    <section className="py-20 lg:py-28" id="featured">
      <div className="container-tight">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="font-heading text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
            Featured Tools
          </h2>
          <p className="text-muted-foreground mx-auto mt-3 max-w-md text-sm leading-relaxed">
            Direct access to our top highlighted utilities selected by our
            engineering editors.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl grid-cols-1 items-center gap-8 md:grid-cols-12">
          {/* Left Column: Tab Selectors */}
          <div className="bg-muted/20 border-border/40 flex flex-col gap-2 rounded-xl border p-2 md:col-span-5">
            {featuresData.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "focus-ring relative flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-semibold transition-all",
                    isActive
                      ? "text-primary bg-card border-border/30 border shadow-sm"
                      : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <TabIcon className="h-4.5 w-4.5" />
                    <span>{tab.label}</span>
                  </div>
                  {isActive && (
                    <span className="bg-primary/10 text-primary rounded px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Column: Display Card with Animation */}
          <div className="flex flex-col justify-center md:col-span-7">
            <AnimatePresence mode="wait">
              {tool && (
                <motion.div
                  key={tool.slug}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="w-full"
                >
                  <ToolCard tool={tool} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
