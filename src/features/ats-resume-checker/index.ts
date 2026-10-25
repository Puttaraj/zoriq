export { AtsWorkspace } from "./components/ats-workspace";

export const seoContent = `
## Free Online AI ATS Resume Scanner & Optimizer
Applicant Tracking Systems (ATS) like Workday, Greenhouse, Taleo, and Lever screen out over 70% of candidate resumes before a human recruiter ever sees them. ZORIQ ATS Resume Checker uses advanced language models to diagnostic-test your resume against algorithmic filtering traps.

## How the ATS Recruitment Algorithm Works
1. **Parsing & Formatting Check:** The parser converts your document into plaintext. Complex multi-column layouts, graphics, or tables cause text streams to scramble, resulting in an immediate rejection.
2. **Keyword & Skills Matching:** The algorithm measures keyword density and semantic match against the employer's Job Description (JD).
3. **STAR Method Bullet Evaluation:** Recruiter search filters prioritize action verbs (e.g. *Architected, Spearheaded, Accelerated*) paired with quantifiable metrics (%, $, time saved).

## Complete Data Privacy
Unlike other platforms that sell candidate data or train public models on your confidential contact information, ZORIQ parses and evaluates resumes in transient memory with zero persistent storage.
`;

export const faqs = [
  {
    question: "What is a good ATS score?",
    answer:
      "An ATS score of 80% or above means your resume has strong keyword alignment, recognized section headers, and high interview conversion likelihood for that specific role.",
  },
  {
    question: "Do I need to paste a Job Description?",
    answer:
      "While optional, pasting the target job description is highly recommended. It allows the AI to calculate exact keyword matches and highlight the specific missing skills recruiters are filtering for.",
  },
  {
    question: "Can this tool fix my resume bullet points?",
    answer:
      "Yes! The STAR-method rewriter identifies weak, duty-focused bullets and rewrites them into high-impact accomplishment statements with metrics.",
  },
];
