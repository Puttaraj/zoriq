export const seoContent = `
## World Timezone & Unix Epoch Timestamp Converter
Convert Unix epoch timestamps to human-readable dates and compare world timezones across international business hubs in real time.

## Key Features
* **Unix Timestamp Converter:** Bidirectional conversion between raw epoch seconds/milliseconds and human date strings in UTC and local time.
* **Simultaneous World Clocks:** Compare current times across New York (EST), London (GMT), Bengaluru (IST), Tokyo (JST), and San Francisco (PST).
* **Interactive Time Slider:** Drag hours to coordinate global meetings and asynchronous engineering standups effortlessly.
* **100% In-Browser:** Calculations use the standard JavaScript \`Intl.DateTimeFormat\` engine with zero latency.
`;

export const faqs = [
  {
    question: "What is a Unix epoch timestamp?",
    answer:
      "A Unix timestamp is the number of seconds that have elapsed since January 1, 1970 00:00:00 UTC (the Unix Epoch). It is the universal standard for storing timestamps in databases and APIs.",
  },
  {
    question: "Does this tool automatically handle Daylight Saving Time (DST)?",
    answer:
      "Yes. Using your browser's native IANA timezone database, daylight saving transitions (EDT, BST, PDT) are automatically computed with 100% precision.",
  },
  {
    question: "Can I convert milliseconds from JavaScript Date.now()?",
    answer:
      "Yes. You can toggle between 10-digit seconds and 13-digit millisecond timestamps.",
  },
];

export { TimezoneWorkspace } from "./components/timezone-workspace";
