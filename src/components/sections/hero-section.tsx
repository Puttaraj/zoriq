"use client";

import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Globe } from "lucide-react";
import Link from "next/link";
import { SearchBar } from "@/components/shared/search-bar";

const stats = [
  { icon: Zap, label: "Instant Processing", value: "100%" },
  { icon: Shield, label: "Secure & Private", value: "No Upload" },
  { icon: Globe, label: "Free Forever", value: "9+ Tools" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28 lg:py-36">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* Gradient Orbs */}
        <div className="bg-primary/8 absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full blur-[120px]" />
        <div className="bg-accent-surface/6 absolute top-20 -right-40 h-[400px] w-[400px] rounded-full blur-[120px]" />
        <div className="bg-primary/5 absolute -bottom-20 left-1/3 h-[300px] w-[300px] rounded-full blur-[100px]" />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container-tight relative">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="border-primary/20 bg-primary/5 text-primary inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-medium">
              <Zap className="h-3 w-3" />
              100% Free · No Sign-up Required
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-heading mt-8 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
          >
            Online Tools That <span className="gradient-text">Just Work</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground mt-6 text-lg leading-relaxed sm:text-xl"
          >
            Fast, secure, and beautifully designed tools for developers,
            students, and everyone. No sign-up. No uploads to servers.
            Everything runs in your browser.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10"
          >
            <SearchBar
              variant="hero"
              placeholder="Search for tools — try 'password', 'image', 'json'..."
            />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/tools"
              className="gradient-brand focus-ring inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:brightness-110"
            >
              Explore All Tools
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#popular"
              className="border-border bg-card hover:bg-muted focus-ring inline-flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-semibold transition-all"
            >
              Popular Tools
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 sm:gap-12"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="text-muted-foreground flex items-center gap-3 text-sm"
              >
                <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                  <stat.icon className="text-primary h-5 w-5" />
                </div>
                <div>
                  <p className="text-foreground font-semibold">{stat.value}</p>
                  <p className="text-xs">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
