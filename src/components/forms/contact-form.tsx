"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successInfo, setSuccessInfo] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(
          data.error || "Failed to send message. Please try again.",
        );
      }

      setStatus("success");
      setSuccessInfo(
        data.message || "Thank you! Your message has been sent successfully.",
      );
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again later.",
      );
    }
  };

  return (
    <div className="border-border/60 bg-card shadow-soft rounded-2xl border p-6 sm:p-8">
      {status === "success" ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className="font-heading text-foreground text-xl font-bold">
            Message Sent Successfully!
          </h3>
          <p className="text-muted-foreground mt-2 max-w-md text-sm leading-relaxed">
            {successInfo} We review every submission and typically respond
            within 24–48 hours.
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="border-border hover:bg-muted/30 text-foreground mt-6 inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold transition-all"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {status === "error" && (
            <div className="flex items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5 text-xs text-rose-600 dark:text-rose-400">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold">Unable to send message</p>
                <p className="mt-0.5 opacity-90">{errorMessage}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-muted-foreground text-xs font-semibold">
                Your Name <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="John Doe"
                suppressHydrationWarning={true}
                className="border-border bg-background focus:border-primary w-full rounded-lg border px-3 py-2 text-sm transition-colors outline-none"
                disabled={status === "submitting"}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-muted-foreground text-xs font-semibold">
                Email Address <span className="text-primary">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="john@example.com"
                suppressHydrationWarning={true}
                className="border-border bg-background focus:border-primary w-full rounded-lg border px-3 py-2 text-sm transition-colors outline-none"
                disabled={status === "submitting"}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-muted-foreground text-xs font-semibold">
              Subject
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              placeholder="Feature request / Bug report / General feedback"
              className="border-border bg-background focus:border-primary w-full rounded-lg border px-3 py-2 text-sm transition-colors outline-none"
              disabled={status === "submitting"}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-muted-foreground text-xs font-semibold">
              Message <span className="text-primary">*</span>
            </label>
            <textarea
              required
              rows={5}
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              placeholder="What is on your mind? If reporting an issue, please describe what happened."
              className="border-border bg-background focus:border-primary w-full resize-none rounded-lg border px-3 py-2 text-sm transition-colors outline-none"
              disabled={status === "submitting"}
            />
          </div>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="bg-primary text-primary-foreground hover:bg-primary/90 focus-ring mt-2 inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold shadow-sm transition-all disabled:opacity-60"
          >
            {status === "submitting" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending Message...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send Message
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
