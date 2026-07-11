"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Zap,
  Shield,
  EyeOff,
  Globe,
  Paintbrush,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "All calculations and processing execute locally in milliseconds. Zero server network queues.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "We design utilities that respect your security. Your inputs are kept local to your device.",
  },
  {
    icon: EyeOff,
    title: "No Uploads",
    description:
      "Your documents, images, and keys never hit our backend servers. Complete peace of mind.",
  },
  {
    icon: Globe,
    title: "Free Forever",
    description:
      "No premium wall limits, holds, or trials. Essential utilities available to everyone.",
  },
  {
    icon: Paintbrush,
    title: "Modern UI",
    description:
      "Handcrafted with Plus Jakarta Sans typography, sleek dark modes, and glassmorphism layouts.",
  },
  {
    icon: Cpu,
    title: "Browser Processing",
    description:
      "Powered by modern Web Workers and Canvas APIs that load safely in client-side memory.",
  },
];

export function CTASection() {
  return (
    <section className="bg-muted/5 py-20 lg:py-28">
      <div className="container-tight">
        {/* Section Title */}
        <div className="mb-14 text-center">
          <h2 className="font-heading text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
            Why Choose ZORIQ?
          </h2>
          <p className="text-muted-foreground mx-auto mt-3 max-w-md text-sm leading-relaxed">
            The next-generation online utility platform built for speed, offline
            privacy, and premium usability.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mb-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              className="border-border/40 bg-card/60 shadow-soft hover:border-primary/20 flex flex-col gap-4 rounded-xl border p-6 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
                <feature.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-heading text-foreground text-sm font-bold">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="border-primary/20 from-primary to-secondary relative overflow-hidden rounded-2xl border bg-gradient-to-br p-10 text-center text-white shadow-lg sm:p-16"
        >
          {/* Background decoration dots */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            aria-hidden="true"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative z-10 mx-auto max-w-xl">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Start Using ZORIQ Today
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/80">
              No registration queues, credentials requests, or license payments.
              Bookmark the page and start converting files instantly in your
              browser.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/tools"
                className={cn(
                  "text-primary inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold shadow-md transition-all",
                  "focus-ring hover:bg-white/90 hover:shadow-lg",
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
