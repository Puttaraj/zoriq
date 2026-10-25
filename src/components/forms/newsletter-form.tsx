"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Subscription failed");
      }

      setStatus("success");
      setMessage(data.message || "Subscribed!");
      setEmail("");
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 5000);
    } catch (err: unknown) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Error joining");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <form
        onSubmit={handleSubmit}
        className="border-border/40 bg-card focus-within:border-primary/50 relative flex items-center rounded-lg border p-1 transition-all duration-300"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@email.com"
          suppressHydrationWarning={true}
          disabled={status === "loading" || status === "success"}
          className="placeholder:text-muted-foreground/60 w-full flex-1 bg-transparent px-2.5 py-1.5 text-xs outline-none"
          aria-label="Newsletter email"
        />
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="bg-primary text-primary-foreground hover:bg-primary/90 focus-ring inline-flex cursor-pointer items-center gap-1 rounded px-3 py-1.5 text-[10px] font-semibold transition-all disabled:opacity-75"
        >
          {status === "loading" ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : status === "success" ? (
            <>
              <Check className="h-3 w-3" />
              Joined!
            </>
          ) : (
            "Join"
          )}
        </button>
      </form>
      {message && (
        <span
          className={`text-[11px] font-medium transition-all ${
            status === "success"
              ? "text-emerald-500"
              : status === "error"
                ? "text-rose-500"
                : "text-muted-foreground"
          }`}
        >
          {message}
        </span>
      )}
    </div>
  );
}
