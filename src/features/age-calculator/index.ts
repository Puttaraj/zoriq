export { AgeWorkspace } from "./components/age-workspace";
export const seoContent = `
## Why Use Our Age Calculator?
Our age calculator determines the exact time difference between a birth date and a target date. Rather than guessing, this utility does precise calendar adjustments — managing leap years, variable month lengths (28, 30, or 31 days), and timezone logic to output your exact age down to the second.

## Detailed Breakdown & Insights
* **Exact Age:** Get a clear, human-readable age structured in years, months, and days.
* **Granular Metrics:** See how your life measures up in total months, weeks, days, hours, minutes, and even seconds.
* **Next Birthday Countdown:** Find out exactly how many days are left until your next cake-cutting event, along with the day of the week it falls on.
* **Astrology & Zodiac:** The tool automatically determines your Western Zodiac sign (Aries, Taurus, etc.) and your Chinese Zodiac birth year animal (Dragon, Tiger, etc.).
* **Born Day:** Find out what day of the week you were born on (e.g. Sunday, Monday).

## Complete Client-Side Calculation
No personal data is sent to our servers. Your date of birth is processed entirely inside your local browser tab. Enjoy private, safe, and instant calculations.
`;

export const faqs = [
  {
    question: "How does the age calculator handle leap years?",
    answer:
      "The algorithm calculates calendar differences taking leap years into account. When traversing years (like 2024), it correctly factors in the 29 days of February to guarantee accurate outputs.",
  },
  {
    question: "Can I calculate my age on a past or future date?",
    answer:
      "Yes. By customizing the 'Age at the Date of' field, you can calculate how old you were on a historical milestone (like graduation day) or how old you will be on a future date.",
  },
  {
    question: "How is the next birthday countdown calculated?",
    answer:
      "It checks your birth month and day against the target date. If the anniversary has already occurred in the target year, it calculates the remaining time to that date in the following calendar year.",
  },
  {
    question: "How is the Chinese Zodiac determined?",
    answer:
      "It uses a cycle based on the lunar calendar years (Rat, Ox, Tiger, etc.) beginning from a base index year. While the traditional Chinese New Year starts between late January and mid February, this tool uses the calendar year index for simplicity.",
  },
  {
    question: "Is ZORIQ storing my birth date details?",
    answer:
      "Never. Your birth date details never leave your browser. All calculation scripts run locally in client memory.",
  },
];
