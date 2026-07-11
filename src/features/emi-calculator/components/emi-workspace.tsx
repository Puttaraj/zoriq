"use client";

import { useState, useMemo } from "react";
import {
  IndianRupee,
  Percent,
  Calendar,
  PieChart,
  TableProperties,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function EmiWorkspace() {
  const [loanAmount, setLoanAmount] = useState(1000000); // 10 Lakhs default
  const [interestRate, setInterestRate] = useState(8.5); // 8.5% default
  const [tenure, setTenure] = useState(15); // 15 years default
  const [tenureType, setTenureType] = useState<"years" | "months">("years");

  const calculation = useMemo(() => {
    const P = loanAmount;
    const annualRate = interestRate;
    const totalMonths = tenureType === "years" ? tenure * 12 : tenure;

    if (P <= 0 || annualRate <= 0 || totalMonths <= 0) {
      return {
        emi: 0,
        totalInterest: 0,
        totalPayment: 0,
        principalPct: 100,
        interestPct: 0,
        schedule: [],
      };
    }

    const r = annualRate / 12 / 100; // Monthly interest rate

    // EMI formula: [P x r x (1+r)^N] / [(1+r)^N - 1]
    const emi =
      (P * r * Math.pow(1 + r, totalMonths)) /
      (Math.pow(1 + r, totalMonths) - 1);
    const totalPayment = emi * totalMonths;
    const totalInterest = totalPayment - P;

    const interestPct = Math.round((totalInterest / totalPayment) * 100);
    const principalPct = 100 - interestPct;

    // Generate monthly amortization schedule (slice to first 120 months for render safety)
    const schedule = [];
    let balance = P;
    for (let month = 1; month <= totalMonths; month++) {
      const interestPayable = balance * r;
      const principalPayable = emi - interestPayable;
      const closingBalance = balance - principalPayable;

      schedule.push({
        month,
        openingBalance: balance,
        emi,
        interest: interestPayable,
        principal: principalPayable,
        closingBalance: Math.max(0, closingBalance),
      });

      balance = closingBalance;
    }

    return {
      emi,
      totalInterest,
      totalPayment,
      principalPct,
      interestPct,
      schedule,
    };
  }, [loanAmount, interestRate, tenure, tenureType]);

  return (
    <div className="border-border/60 bg-card shadow-soft mx-auto max-w-5xl rounded-2xl border p-6 sm:p-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Side: Inputs */}
        <div className="flex flex-col gap-6 lg:col-span-6">
          {/* Loan Amount */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span className="text-foreground flex items-center gap-1.5">
                <IndianRupee className="text-primary h-4 w-4" />
                Loan Amount
              </span>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="border-border focus:border-primary w-32 rounded-md border px-2 py-1 text-right font-mono text-sm outline-none"
              />
            </div>
            <input
              type="range"
              min="100000"
              max="10000000"
              step="50000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="bg-muted accent-primary h-2 w-full cursor-pointer appearance-none rounded-full focus:outline-none"
              aria-label="Loan amount slider"
            />
            <div className="text-muted-foreground flex justify-between text-[10px] font-semibold">
              <span>₹1 Lakh</span>
              <span>₹50 Lakhs</span>
              <span>₹1 Crore</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span className="text-foreground flex items-center gap-1.5">
                <Percent className="text-primary h-4 w-4" />
                Interest Rate (p.a.)
              </span>
              <input
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="border-border focus:border-primary w-20 rounded-md border px-2 py-1 text-right font-mono text-sm outline-none"
              />
            </div>
            <input
              type="range"
              min="5"
              max="20"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="bg-muted accent-primary h-2 w-full cursor-pointer appearance-none rounded-full focus:outline-none"
              aria-label="Interest rate slider"
            />
            <div className="text-muted-foreground flex justify-between text-[10px] font-semibold">
              <span>5%</span>
              <span>12.5%</span>
              <span>20%</span>
            </div>
          </div>

          {/* Tenure */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span className="text-foreground flex items-center gap-1.5">
                <Calendar className="text-primary h-4 w-4" />
                Tenure
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="border-border focus:border-primary w-20 rounded-md border px-2 py-1 text-right font-mono text-sm outline-none"
                />
                <select
                  value={tenureType}
                  onChange={(e) => {
                    const type = e.target.value as "years" | "months";
                    setTenureType(type);
                    setTenure(type === "years" ? 15 : 180);
                  }}
                  className="border-border bg-background focus:border-primary h-7 rounded-md border px-2 py-1 text-xs outline-none"
                >
                  <option value="years">Years</option>
                  <option value="months">Months</option>
                </select>
              </div>
            </div>
            <input
              type="range"
              min={tenureType === "years" ? 1 : 12}
              max={tenureType === "years" ? 30 : 360}
              step="1"
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              className="bg-muted accent-primary h-2 w-full cursor-pointer appearance-none rounded-full focus:outline-none"
              aria-label="Tenure slider"
            />
            <div className="text-muted-foreground flex justify-between text-[10px] font-semibold">
              <span>{tenureType === "years" ? "1 Year" : "12 Months"}</span>
              <span>{tenureType === "years" ? "15 Years" : "180 Months"}</span>
              <span>{tenureType === "years" ? "30 Years" : "360 Months"}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Calculation & Summary Cards */}
        <div className="lg:border-border/60 flex flex-col gap-6 lg:col-span-6 lg:border-l lg:pl-8">
          <div className="bg-primary/5 border-primary/10 rounded-2xl border p-6 text-center">
            <span className="text-primary text-xs font-semibold tracking-wider uppercase">
              Loan EMI (Monthly)
            </span>
            <h3 className="text-foreground mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              {formatCurrency(calculation.emi)}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="border-border/60 bg-muted/10 rounded-xl border p-4">
              <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                Principal Amount
              </span>
              <p className="text-foreground mt-1 text-lg font-bold">
                {formatCurrency(loanAmount)}
              </p>
            </div>
            <div className="border-border/60 bg-muted/10 rounded-xl border p-4">
              <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                Interest Payable
              </span>
              <p className="text-foreground mt-1 text-lg font-bold">
                {formatCurrency(calculation.totalInterest)}
              </p>
            </div>
          </div>

          <div className="border-border/60 bg-muted/10 flex items-center justify-between rounded-xl border p-4">
            <span className="text-muted-foreground text-xs font-semibold">
              Total Payment (Principal + Interest)
            </span>
            <span className="text-foreground text-base font-bold">
              {formatCurrency(calculation.totalPayment)}
            </span>
          </div>

          {/* Visual principal vs interest split percentage bar */}
          <div className="flex flex-col gap-2">
            <span className="text-foreground flex items-center gap-1 text-xs font-semibold">
              <PieChart className="text-primary h-4 w-4" />
              Breakup of Total Payment
            </span>
            <div className="bg-muted flex h-3 w-full overflow-hidden rounded-full">
              <div
                className="bg-primary h-full"
                style={{ width: `${calculation.principalPct}%` }}
                title={`Principal ${calculation.principalPct}%`}
              />
              <div
                className="h-full bg-orange-500"
                style={{ width: `${calculation.interestPct}%` }}
                title={`Interest ${calculation.interestPct}%`}
              />
            </div>
            <div className="flex justify-between text-[10px] font-semibold">
              <span className="text-primary">
                Principal: {calculation.principalPct}%
              </span>
              <span className="text-orange-500">
                Interest: {calculation.interestPct}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Amortization Schedule Table */}
      {calculation.schedule.length > 0 && (
        <div className="border-border/60 mt-8 border-t pt-6">
          <span className="text-foreground mb-4 flex items-center gap-2 text-sm font-semibold">
            <TableProperties className="text-primary h-4 w-4" />
            Amortization Schedule (First 12 Months)
          </span>
          <div className="border-border overflow-x-auto rounded-lg border">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted text-muted-foreground font-semibold uppercase">
                <tr>
                  <th className="px-4 py-3">Month</th>
                  <th className="px-4 py-3">Opening Balance</th>
                  <th className="px-4 py-3">EMI</th>
                  <th className="px-4 py-3">Interest</th>
                  <th className="px-4 py-3">Principal</th>
                  <th className="px-4 py-3">Closing Balance</th>
                </tr>
              </thead>
              <tbody className="divide-border divide-y font-mono">
                {calculation.schedule.slice(0, 12).map((item) => (
                  <tr key={item.month} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-semibold">{item.month}</td>
                    <td className="px-4 py-3">
                      {formatCurrency(item.openingBalance)}
                    </td>
                    <td className="px-4 py-3">{formatCurrency(item.emi)}</td>
                    <td className="px-4 py-3 text-orange-500">
                      {formatCurrency(item.interest)}
                    </td>
                    <td className="text-primary px-4 py-3">
                      {formatCurrency(item.principal)}
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      {formatCurrency(item.closingBalance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
