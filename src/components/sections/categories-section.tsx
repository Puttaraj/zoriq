"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { categories as allCategories } from "@/config/categories";
import { cn } from "@/lib/utils";

export function CategoriesSection() {
  return (
    <section className="bg-muted/10 py-20 lg:py-28" id="categories">
      <div className="container-tight">
        {/* Header */}
        <div className="mb-14 text-center">
          <h2 className="font-heading text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
            Browse by Category
          </h2>
          <p className="text-muted-foreground mx-auto mt-3 max-w-md text-sm leading-relaxed">
            Find the right tools optimized for developers, students, content
            creators, and finance.
          </p>
        </div>

        {/* Category Grid */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {allCategories.map((category, index) => {
            const IconComponent =
              (LucideIcons[
                category.icon as keyof typeof LucideIcons
              ] as LucideIcons.LucideIcon) ?? LucideIcons.Folder;

            const isUpcoming = category.toolCount === 0;

            const cardContent = (
              <div
                className={cn(
                  "group border-border/40 bg-card shadow-soft relative flex flex-col items-center gap-4 rounded-xl border p-6 text-center transition-all duration-300",
                  isUpcoming
                    ? "opacity-80"
                    : "hover:border-primary/30 focus-ring cursor-pointer hover:-translate-y-1 hover:shadow-lg",
                )}
              >
                {/* Visual gradient backdrop */}
                <div
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-md transition-all duration-300",
                    category.color,
                    !isUpcoming &&
                      "group-hover:scale-110 group-hover:shadow-lg",
                  )}
                >
                  <IconComponent className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-heading text-foreground text-sm font-bold">
                    {category.name}
                  </h3>
                  <p className="text-muted-foreground mt-1.5 text-xs font-semibold tracking-wider uppercase">
                    {isUpcoming ? (
                      <span className="text-primary/80 bg-primary/5 rounded px-2 py-0.5 text-[10px]">
                        Coming Soon
                      </span>
                    ) : (
                      `${category.toolCount} ${category.toolCount === 1 ? "tool" : "tools"}`
                    )}
                  </p>
                </div>
              </div>
            );

            return (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
              >
                {isUpcoming ? (
                  cardContent
                ) : (
                  <Link href={`/tools?category=${category.slug}`}>
                    {cardContent}
                  </Link>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
