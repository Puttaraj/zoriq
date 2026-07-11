"use client";

import { useState, useEffect, useCallback } from "react";
import { Calendar, Cake, Clock, Stars, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function AgeWorkspace() {
  const [birthDate, setBirthDate] = useState("1998-01-01");
  const [targetDate, setTargetDate] = useState("");

  const [results, setResults] = useState<{
    years: number;
    months: number;
    days: number;
    totalMonths: number;
    totalWeeks: number;
    totalDays: number;
    totalHours: number;
    totalMinutes: number;
    totalSeconds: number;
    nextBirthdayDays: number;
    nextBirthdayDayName: string;
    birthDayName: string;
    westernZodiac: string;
    chineseZodiac: string;
  } | null>(null);

  // Set target date to today's date on mount
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    if (today) {
      setTargetDate(today);
    }
  }, []);

  const calculateAge = useCallback((birthStr: string, targetStr: string) => {
    if (!birthStr || !targetStr) return null;

    const birth = new Date(birthStr);
    const target = new Date(targetStr);

    if (isNaN(birth.getTime()) || isNaN(target.getTime())) return null;
    if (birth > target) return null;

    // Exact Age Calculation (Years, Months, Days)
    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      // Get previous month's total days
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
      months--;
    }

    if (months < 0) {
      months += 12;
      years--;
    }

    // Totals Calculation
    const diffMs = target.getTime() - birth.getTime();
    const totalSeconds = Math.floor(diffMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;

    // Next Birthday Calculation
    const nextBday = new Date(
      target.getFullYear(),
      birth.getMonth(),
      birth.getDate(),
    );
    if (nextBday < target) {
      nextBday.setFullYear(target.getFullYear() + 1);
    }
    const diffNextMs = nextBday.getTime() - target.getTime();
    const nextBirthdayDays = Math.ceil(diffNextMs / (1000 * 60 * 60 * 24));

    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const nextBirthdayDayName = dayNames[nextBday.getDay()] || "";
    const birthDayName = dayNames[birth.getDay()] || "";

    // Western Zodiac
    const westernZodiac = getWesternZodiac(
      birth.getMonth() + 1,
      birth.getDate(),
    );

    // Chinese Zodiac
    const chineseZodiac = getChineseZodiac(birth.getFullYear());

    return {
      years,
      months,
      days,
      totalMonths,
      totalWeeks,
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds,
      nextBirthdayDays,
      nextBirthdayDayName,
      birthDayName,
      westernZodiac,
      chineseZodiac,
    };
  }, []);

  useEffect(() => {
    const res = calculateAge(birthDate, targetDate);
    setResults(res);
  }, [birthDate, targetDate, calculateAge]);

  return (
    <div className="border-border/60 bg-card shadow-soft mx-auto max-w-4xl rounded-2xl border p-6 sm:p-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        {/* Left Side: Inputs */}
        <div className="flex flex-col gap-6 md:col-span-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-foreground flex items-center gap-2 text-sm font-semibold">
              <Calendar className="text-primary h-4 w-4" />
              Date of Birth
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="border-border bg-background focus:border-primary w-full rounded-lg border px-3 py-2 text-sm outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-foreground flex items-center gap-2 text-sm font-semibold">
              <Calendar className="text-primary h-4 w-4" />
              Age at the Date of
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="border-border bg-background focus:border-primary w-full rounded-lg border px-3 py-2 text-sm outline-none"
            />
          </div>
        </div>

        {/* Right Side: Output */}
        <div className="md:border-border/60 flex flex-col gap-6 md:col-span-8 md:border-l md:pl-8">
          {results ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col gap-6"
            >
              {/* Primary age card */}
              <div className="bg-primary/5 border-primary/10 rounded-2xl border p-6 text-center">
                <span className="text-primary text-xs font-semibold tracking-wider uppercase">
                  Your Exact Age
                </span>
                <h3 className="text-foreground mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                  {results.years}{" "}
                  <span className="text-muted-foreground text-sm font-medium">
                    Years
                  </span>{" "}
                  {results.months}{" "}
                  <span className="text-muted-foreground text-sm font-medium">
                    Months
                  </span>{" "}
                  {results.days}{" "}
                  <span className="text-muted-foreground text-sm font-medium">
                    Days
                  </span>
                </h3>
              </div>

              {/* Grid outputs */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Next Birthday */}
                <div className="border-border/60 bg-muted/10 flex items-start gap-3 rounded-xl border p-4">
                  <Cake className="text-primary mt-0.5 h-5 w-5" />
                  <div>
                    <h4 className="text-muted-foreground text-xs font-semibold">
                      Next Birthday
                    </h4>
                    <p className="text-foreground mt-1 text-sm font-bold">
                      In {results.nextBirthdayDays}{" "}
                      {results.nextBirthdayDays === 1 ? "day" : "days"}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      On a {results.nextBirthdayDayName}
                    </p>
                  </div>
                </div>

                {/* Day of birth & Zodiacs */}
                <div className="border-border/60 bg-muted/10 flex items-start gap-3 rounded-xl border p-4">
                  <Stars className="text-primary mt-0.5 h-5 w-5" />
                  <div>
                    <h4 className="text-muted-foreground text-xs font-semibold">
                      Horoscope & Zodiac
                    </h4>
                    <p className="text-foreground mt-1 text-sm font-bold">
                      {results.westernZodiac} ({results.chineseZodiac})
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Born on a {results.birthDayName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Extra detailed list breakdown */}
              <div className="border-border/60 flex flex-col gap-3 border-t pt-4">
                <span className="text-foreground flex items-center gap-2 text-sm font-semibold">
                  <Clock className="text-primary h-4 w-4" />
                  Detailed Age Breakdown
                </span>
                <div className="grid grid-cols-2 gap-3 font-mono text-xs sm:grid-cols-3">
                  <div className="border-border/40 bg-muted/5 rounded-lg border p-2.5">
                    <span className="text-muted-foreground">Total Months</span>
                    <p className="text-foreground mt-0.5 font-bold">
                      {results.totalMonths.toLocaleString()}
                    </p>
                  </div>
                  <div className="border-border/40 bg-muted/5 rounded-lg border p-2.5">
                    <span className="text-muted-foreground">Total Weeks</span>
                    <p className="text-foreground mt-0.5 font-bold">
                      {results.totalWeeks.toLocaleString()}
                    </p>
                  </div>
                  <div className="border-border/40 bg-muted/5 rounded-lg border p-2.5">
                    <span className="text-muted-foreground">Total Days</span>
                    <p className="text-foreground mt-0.5 font-bold">
                      {results.totalDays.toLocaleString()}
                    </p>
                  </div>
                  <div className="border-border/40 bg-muted/5 rounded-lg border p-2.5">
                    <span className="text-muted-foreground">Total Hours</span>
                    <p className="text-foreground mt-0.5 font-bold">
                      {results.totalHours.toLocaleString()}
                    </p>
                  </div>
                  <div className="border-border/40 bg-muted/5 rounded-lg border p-2.5">
                    <span className="text-muted-foreground">Total Minutes</span>
                    <p className="text-foreground mt-0.5 font-bold">
                      {results.totalMinutes.toLocaleString()}
                    </p>
                  </div>
                  <div className="border-border/40 bg-muted/5 rounded-lg border p-2.5">
                    <span className="text-muted-foreground">Total Seconds</span>
                    <p className="text-foreground mt-0.5 font-bold">
                      {results.totalSeconds.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-muted/10 border-border flex h-full flex-col items-center justify-center rounded-2xl border border-dashed p-6 text-center">
              <Sparkles className="text-muted-foreground/30 mb-3 h-10 w-10" />
              <p className="text-foreground text-sm font-semibold">
                Select a valid Date of Birth
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                Birthdate must be prior to target date
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const getWesternZodiac = (month: number, day: number) => {
  const signs = [
    { name: "Capricorn", start: [12, 22], end: [1, 19] },
    { name: "Aquarius", start: [1, 20], end: [2, 18] },
    { name: "Pisces", start: [2, 19], end: [3, 20] },
    { name: "Aries", start: [3, 21], end: [4, 19] },
    { name: "Taurus", start: [4, 20], end: [5, 20] },
    { name: "Gemini", start: [5, 21], end: [6, 20] },
    { name: "Cancer", start: [6, 21], end: [7, 22] },
    { name: "Leo", start: [7, 23], end: [8, 22] },
    { name: "Virgo", start: [8, 23], end: [9, 22] },
    { name: "Libra", start: [9, 23], end: [10, 22] },
    { name: "Scorpio", start: [10, 23], end: [11, 21] },
    { name: "Sagittarius", start: [11, 22], end: [12, 21] },
  ];

  const sign = signs.find((s) => {
    const [sm, sd] = s.start;
    const [em, ed] = s.end;
    if (
      sm === undefined ||
      sd === undefined ||
      em === undefined ||
      ed === undefined
    )
      return false;
    return (month === sm && day >= sd) || (month === em && day <= ed);
  });

  return sign ? sign.name : "Capricorn";
};

const getChineseZodiac = (year: number) => {
  const animals = [
    "Rat",
    "Ox",
    "Tiger",
    "Rabbit",
    "Dragon",
    "Snake",
    "Horse",
    "Goat",
    "Monkey",
    "Rooster",
    "Dog",
    "Pig",
  ];
  // Offset based on base year 1900 which was year of the Rat
  const index = (year - 1900) % 12;
  return index >= 0 ? animals[index] || "Rat" : animals[index + 12] || "Rat";
};
