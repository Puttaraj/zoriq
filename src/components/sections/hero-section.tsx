"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Globe, Clock } from "lucide-react";
import Link from "next/link";
import { SearchBar } from "@/components/shared/search-bar";

interface CounterProps {
  value: string;
  duration?: number;
}

function AnimatedCounter({ value, duration = 1000 }: CounterProps) {
  const [count, setCount] = useState(0);
  const numeric = parseInt(value.replace(/[^0-9]/g, ""), 10);
  const suffix = value.replace(/[0-9]/g, "");

  useEffect(() => {
    if (isNaN(numeric)) return;

    let start = 0;
    const end = numeric;
    const incrementTime = Math.max(Math.floor(duration / (end || 1)), 15);
    const step = Math.max(Math.ceil(end / 50), 1);

    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [numeric, duration]);

  if (isNaN(numeric)) return <span>{value}</span>;
  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

const stats = [
  { icon: Zap, label: "Free Tools", value: "10+" },
  { icon: Shield, label: "Browser Processing", value: "100%" },
  { icon: Globe, label: "Sign Up Required", value: "0" },
  { icon: Clock, label: "Available", value: "24/7" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32 lg:py-40">
      {/* Background ambient accents */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      >
        <div className="bg-primary/8 absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full blur-[130px]" />
        <div className="bg-accent-surface/6 absolute top-20 -right-40 h-[500px] w-[500px] rounded-full blur-[120px]" />
      </div>

      <div className="container-tight relative">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className="border-primary/20 bg-primary/5 text-primary inline-flex items-center gap-1.5 rounded-full border px-4.5 py-1.5 text-xs font-semibold tracking-wider uppercase">
              <Zap className="h-3.5 w-3.5" />
              100% Client-Side · Private & Free
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="font-heading text-foreground mt-8 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
          >
            Fast. Private. Free.
            <span className="gradient-text mt-2 block">Online Tools.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-muted-foreground mt-6 text-base leading-relaxed sm:text-lg lg:text-xl"
          >
            Powerful Online Utilities. Zero Installation. Zero Sign Up.
            Everything processes locally in your browser memory for absolute
            data privacy.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mx-auto mt-10 max-w-2xl"
          >
            <SearchBar
              variant="hero"
              placeholder="Search tools — try 'compressor', 'uuid', 'json'..."
            />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/tools"
              className="gradient-brand focus-ring inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:brightness-110"
            >
              Explore Tools
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#categories"
              className="border-border bg-card hover:bg-muted focus-ring inline-flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-semibold transition-all"
            >
              Browse Categories
            </Link>
          </motion.div>

          {/* Stats Counters */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="mt-20 grid grid-cols-2 gap-6 sm:grid-cols-4"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="border-border/50 bg-card/40 shadow-soft flex flex-col items-center justify-center rounded-xl border p-5"
              >
                <div className="bg-primary/10 text-primary mb-3 flex h-9 w-9 items-center justify-center rounded-lg">
                  <stat.icon className="h-5 w-5" />
                </div>
                <p className="font-heading text-foreground text-2xl font-black">
                  <AnimatedCounter value={stat.value} />
                </p>
                <p className="text-muted-foreground mt-1 text-center text-xs font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
