"use client";

import { useState, useMemo } from "react";
import {
  TrendingUp,
  Percent,
  Calendar,
  IndianRupee,
  TableProperties,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { calculateSip } from "../lib/sip-math";

export function SipWorkspace() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000); // ₹10,000 / month
  const [expectedReturn, setExpectedReturn] = useState(12); // 12% default mutual fund return
  const [tenure, setTenure] = useState(10); // 10 years default

  const calculation = useMemo(() => {
    return calculateSip(monthlyInvestment, expectedReturn, tenure);
  }, [monthlyInvestment, expectedReturn, tenure]);

  return (
    <div className="border-border/60 bg-card shadow-soft mx-auto max-w-5xl rounded-2xl border p-6 sm:p-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left: Input Controls */}
        <div className="flex flex-col gap-6 lg:col-span-6">
          {/* Monthly Investment */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span className="text-foreground flex items-center gap-1.5">
                <IndianRupee className="text-primary h-4 w-4" />
                Monthly Investment
              </span>
              <div className="relative">
                <input
                  type="number"
                  value={monthlyInvestment}
                  onChange={(e) =>
                    setMonthlyInvestment(Math.max(500, Number(e.target.value)))
                  }
                  className="border-border focus:border-primary w-32 rounded-md border px-2 py-1 text-right font-mono text-sm outline-none"
                />
              </div>
            </div>
            <input
              type="range"
              min="500"
              max="200000"
              step="500"
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
              className="bg-muted accent-primary h-2 w-full cursor-pointer appearance-none rounded-full"
            />
            <div className="text-muted-foreground flex justify-between text-[11px]">
              <span>₹500</span>
              <span>₹1,00,000</span>
              <span>₹2,00,000</span>
            </div>
          </div>

          {/* Expected Return Rate */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span className="text-foreground flex items-center gap-1.5">
                <Percent className="text-primary h-4 w-4" />
                Expected Annual Return Rate (p.a)
              </span>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={expectedReturn}
                  onChange={(e) =>
                    setExpectedReturn(
                      Math.max(1, Math.min(30, Number(e.target.value))),
                    )
                  }
                  className="border-border focus:border-primary w-24 rounded-md border px-2 py-1 text-right font-mono text-sm outline-none"
                />
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="0.5"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(Number(e.target.value))}
              className="bg-muted accent-primary h-2 w-full cursor-pointer appearance-none rounded-full"
            />
            <div className="text-muted-foreground flex justify-between text-[11px]">
              <span>1%</span>
              <span>12% (Equity avg)</span>
              <span>30%</span>
            </div>
          </div>

          {/* Time Period */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span className="text-foreground flex items-center gap-1.5">
                <Calendar className="text-primary h-4 w-4" />
                Time Period (Years)
              </span>
              <div className="relative">
                <input
                  type="number"
                  value={tenure}
                  onChange={(e) =>
                    setTenure(Math.max(1, Math.min(40, Number(e.target.value))))
                  }
                  className="border-border focus:border-primary w-24 rounded-md border px-2 py-1 text-right font-mono text-sm outline-none"
                />
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="40"
              step="1"
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              className="bg-muted accent-primary h-2 w-full cursor-pointer appearance-none rounded-full"
            />
            <div className="text-muted-foreground flex justify-between text-[11px]">
              <span>1 Yr</span>
              <span>15 Yrs</span>
              <span>40 Yrs</span>
            </div>
          </div>

          {/* Key Summary Cards */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="border-border/60 bg-muted/10 rounded-xl border p-3.5">
              <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                Invested Amount
              </span>
              <p className="text-foreground mt-1 text-lg font-extrabold tracking-tight">
                {formatCurrency(calculation.investedAmount)}
              </p>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5">
              <span className="text-[10px] font-bold tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
                Estimated Returns
              </span>
              <p className="mt-1 text-lg font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
                +{formatCurrency(calculation.estimatedReturns)}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Future Value & Donut Chart */}
        <div className="border-border/60 bg-muted/5 flex flex-col items-center justify-between rounded-xl border p-6 text-center lg:col-span-6">
          <div className="w-full">
            <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Total Maturity Value
            </span>
            <h3 className="gradient-text font-heading mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
              {formatCurrency(calculation.totalValue)}
            </h3>
          </div>

          {/* SVG Donut Visual */}
          <div className="relative my-6 flex h-48 w-48 items-center justify-center">
            <svg
              className="h-full w-full -rotate-90 transform"
              viewBox="0 0 36 36"
            >
              {/* Background ring */}
              <path
                className="text-muted/40"
                strokeWidth="4"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Invested Portion */}
              <path
                className="text-primary"
                strokeDasharray={`${calculation.investedPct}, 100`}
                strokeWidth="4"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Returns Portion */}
              <path
                className="text-emerald-500"
                strokeDasharray={`${calculation.returnsPct}, 100`}
                strokeDashoffset={`-${calculation.investedPct}`}
                strokeWidth="4"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <TrendingUp className="text-primary h-6 w-6" />
              <span className="text-foreground mt-1 text-xs font-bold">
                {calculation.returnsPct}% Returns
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex w-full justify-center gap-6 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="bg-primary h-3 w-3 rounded-full" />
              <span className="text-muted-foreground">
                Invested ({calculation.investedPct}%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="text-muted-foreground">
                Returns ({calculation.returnsPct}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Yearly Projection Schedule */}
      {calculation.yearlyBreakdown.length > 0 && (
        <div className="border-border/60 mt-8 border-t pt-6">
          <div className="mb-4 flex items-center gap-2">
            <TableProperties className="text-primary h-4 w-4" />
            <h4 className="font-heading text-foreground text-sm font-semibold">
              Year-on-Year Growth Projection
            </h4>
          </div>
          <div className="border-border/60 overflow-hidden rounded-xl border">
            <div className="max-h-72 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 text-muted-foreground sticky top-0 font-semibold uppercase">
                  <tr>
                    <th className="px-4 py-3">Year</th>
                    <th className="px-4 py-3 text-right">Invested Amount</th>
                    <th className="px-4 py-3 text-right">Estimated Growth</th>
                    <th className="px-4 py-3 text-right">Year-End Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-border/40 divide-y">
                  {calculation.yearlyBreakdown.map((item) => (
                    <tr
                      key={item.year}
                      className="hover:bg-muted/10 transition-colors"
                    >
                      <td className="text-foreground px-4 py-2.5 font-medium">
                        Year {item.year}
                      </td>
                      <td className="text-muted-foreground px-4 py-2.5 text-right font-mono">
                        {formatCurrency(item.invested)}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono font-medium text-emerald-600 dark:text-emerald-400">
                        +{formatCurrency(item.returns)}
                      </td>
                      <td className="text-foreground px-4 py-2.5 text-right font-mono font-bold">
                        {formatCurrency(item.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
