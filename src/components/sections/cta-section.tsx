"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap, Shield, Globe, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "All tools process instantly in your browser. No waiting, no server round-trips.",
  },
  {
    icon: Shield,
    title: "100% Private",
    description:
      "Your files never leave your device. Everything runs client-side with zero data collection.",
  },
  {
    icon: Globe,
    title: "Free Forever",
    description:
      "No sign-up, no credit card, no limits. Professional-grade tools available to everyone.",
  },
  {
    icon: Sparkles,
    title: "AI-Ready",
    description:
      "Built for the future. AI-powered enhancements coming soon to supercharge every tool.",
  },
];

export function CTASection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container-tight">
        {/* Features Grid */}
        <div className="mb-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="border-border/60 bg-card shadow-soft flex flex-col gap-3 rounded-xl border p-6"
            >
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                <feature.icon className="text-primary h-5 w-5" />
              </div>
              <h3 className="font-heading text-base font-semibold">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="gradient-brand relative overflow-hidden rounded-2xl p-10 text-center text-white sm:p-16"
        >
          {/* Background decoration */}
          <div
            className="pointer-events-none absolute inset-0 opacity-10"
            aria-hidden="true"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "30px 30px",
            }}
          />

          <div className="relative">
            <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              Start Using ZORIQ Today
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-white/80">
              Join thousands of users who trust ZORIQ for their daily utility
              needs. No sign-up required — just pick a tool and go.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/tools"
                className={cn(
                  "text-primary inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold shadow-lg transition-all",
                  "focus-ring hover:bg-white/90 hover:shadow-xl",
                )}
              >
                Explore All Tools
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
