export { WordWorkspace } from "./components/word-workspace";
export const seoContent = `
## What is a Word Counter?
A word counter is a simple, browser-based tool that calculates the count of characters, words, sentences, and paragraphs in a block of text in real-time. Whether you are writing a blog post, essay, social media caption, or technical documentation, tracking metrics like word count is essential for meeting strict content guidelines.

## Understanding the Statistics
* **Word Count:** Total number of words in your text block. A space represents the break between words.
* **Character Count:** The total number of letters, numbers, punctuation marks, and spaces. We show character counts with and without spaces to help you meet Twitter (X) limits or academic instructions.
* **Reading & Speaking Time:** Based on standard speed metrics (Average Reading Speed: 225 WPM, Average Speaking Speed: 150 WPM), this estimates how long it will take a user to read your document or deliver it as a speech.
* **Keyword Density:** Highlights the most repeated words in your document (longer than 2 characters). This is useful for SEO optimization to ensure you are targeting search keywords without keyword stuffing.

## Client-Side Security
All calculations are done immediately within your browser. Unlike other online word counter tools, we never upload your text to our servers. Your documents, private communications, or unpublished drafts remain 100% confidential.
`;

export const faqs = [
  {
    question: "Does the word counter store my text?",
    answer:
      "No. Everything runs inside your local browser using client-side JavaScript. Your text is never transmitted over the internet or stored on our servers.",
  },
  {
    question: "How is reading time calculated?",
    answer:
      "Reading time is calculated using the industry standard speed of 225 words per minute. For example, a 450-word article will estimate a reading time of 2 minutes.",
  },
  {
    question: "What is keyword density?",
    answer:
      "Keyword density represents the percentage of times a specific word appears in your text relative to the total word count. Our tool parses words longer than 2 characters to help you audit SEO optimization.",
  },
  {
    question: "Are spaces included in the character count?",
    answer:
      "We show both metrics: 'Characters (with spaces)' which counts every keystroke including whitespace, and 'Characters (no spaces)' which excludes spaces, tabs, and carriage returns.",
  },
  {
    question: "Is there a limit on how much text I can paste?",
    answer:
      "There are no artificial limits. You can paste entire chapters of books or long essays. Since processing is local, speed is determined by your browser's speed.",
  },
];
