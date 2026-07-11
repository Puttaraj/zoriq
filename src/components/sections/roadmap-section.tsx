"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Sparkles,
  Image,
  Terminal,
  Chrome,
  Monitor,
  ArrowUpRight,
} from "lucide-react";

const roadmapItems = [
  {
    phase: "Q3 2026",
    title: "PDF Utilities",
    description:
      "Compress, merge, split, and format PDF documents client-side in the browser.",
    icon: FileText,
    status: "in-development",
  },
  {
    phase: "Q3 2026",
    title: "AI Enhancements",
    description:
      "Introduce smart features like regex pattern creators and layout code generation helpers.",
    icon: Sparkles,
    status: "in-development",
  },
  {
    phase: "Q4 2026",
    title: "Advanced Image Tools",
    description:
      "Remove image background objects, intelligent upscale, and smart smart overlays.",
    icon: Image,
    status: "planned",
  },
  {
    phase: "Q4 2026",
    title: "Developer APIs",
    description:
      "Programmatic micro-endpoints for direct JSON formatting, password creation, and validation.",
    icon: Terminal,
    status: "planned",
  },
  {
    phase: "Q1 2027",
    title: "Chrome Extension",
    description:
      "Run ZORIQ tools directly from any active browser tab with keyboard command support.",
    icon: Chrome,
    status: "planned",
  },
  {
    phase: "Q1 2027",
    title: "Desktop & Mobile Apps",
    description:
      "Offline native application builds optimized for Windows, macOS, Android, and iOS.",
    icon: Monitor,
    status: "planned",
  },
];

export function RoadmapSection() {
  return (
    <section
      className="border-border/30 bg-muted/5 border-t py-20 lg:py-28"
      id="roadmap"
    >
      <div className="container-tight">
        {/* Section Header */}
        <div className="mb-14 text-center">
          <h2 className="font-heading text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
            Product Roadmap
          </h2>
          <p className="text-muted-foreground mx-auto mt-3 max-w-md text-sm leading-relaxed">
            A sneak peek into upcoming capabilities we are building to make
            ZORIQ the ultimate utility belt.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {roadmapItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              className="group border-border/40 bg-card hover:border-primary/20 shadow-soft relative flex flex-col justify-between rounded-xl border p-6 transition-all duration-300"
            >
              <div>
                {/* Phase Badge & Icon */}
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-primary bg-primary/5 border-primary/10 rounded-md border px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase">
                    {item.phase}
                  </span>
                  <div className="text-muted-foreground group-hover:text-primary transition-colors">
                    <item.icon className="h-5 w-5" />
                  </div>
                </div>

                <h3 className="font-heading text-foreground text-sm font-bold">
                  {item.title}
                </h3>
                <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Status footer bar */}
              <div className="mt-6 flex items-center justify-between text-[10px] font-bold tracking-wider uppercase">
                <span
                  className={
                    item.status === "in-development"
                      ? "text-accent-surface"
                      : "text-muted-foreground"
                  }
                >
                  {item.status === "in-development"
                    ? "• In Development"
                    : "• Planned"}
                </span>
                <ArrowUpRight className="text-foreground h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-60" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
