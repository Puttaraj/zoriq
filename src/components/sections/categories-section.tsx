"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { getActiveCategories } from "@/config/categories";
import { cn } from "@/lib/utils";

export function CategoriesSection() {
  const categories = getActiveCategories();

  return (
    <section className="bg-muted/30 py-16 lg:py-24" id="categories">
      <div className="container-tight">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Browse by Category
          </h2>
          <p className="text-muted-foreground mt-2">
            Find the right tool for your task
          </p>
        </div>

        {/* Category Grid */}
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => {
            const IconComponent =
              (LucideIcons[
                category.icon as keyof typeof LucideIcons
              ] as LucideIcons.LucideIcon) ?? LucideIcons.Folder;

            return (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  href={`/tools?category=${category.slug}`}
                  className={cn(
                    "group border-border/60 bg-card shadow-soft flex flex-col items-center gap-3 rounded-xl border p-6 text-center transition-all duration-300",
                    "hover:border-primary/30 hover:-translate-y-1 hover:shadow-lg",
                    "focus-ring",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br text-white transition-transform group-hover:scale-110",
                      category.color,
                    )}
                  >
                    <IconComponent className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="font-heading text-sm font-semibold">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {category.toolCount}{" "}
                      {category.toolCount === 1 ? "tool" : "tools"}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
