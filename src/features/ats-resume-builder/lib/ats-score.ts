import { ResumeData, AtsAuditResult, AtsAuditCheck } from "../types/resume";

const ACTION_VERBS = [
  "architected",
  "spearheaded",
  "accelerated",
  "engineered",
  "developed",
  "designed",
  "deployed",
  "optimized",
  "implemented",
  "scaled",
  "automated",
  "orchestrated",
  "reduced",
  "increased",
  "boosted",
  "delivered",
  "mentored",
];

const METRIC_REGEX =
  /\b(\d+%|\$\d+|₹\d+|\d+\+?\s*(users|ms|s|x|k|m|hours|days))\b/i;

export function calculateLiveAtsScore(resume: ResumeData): AtsAuditResult {
  const checks: AtsAuditCheck[] = [];

  // Check 1: Full Name & Title
  const hasName = Boolean(resume.contact.fullName.trim());
  const hasTitle = Boolean(resume.contact.jobTitle.trim());
  checks.push({
    id: "name_title",
    title: "Full Name & Professional Role Header",
    passed: hasName && hasTitle,
    points: 10,
    tip: "Add your full name and target role title (e.g. Senior Frontend Engineer).",
  });

  // Check 2: Contact Details (Email + Phone)
  const hasEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(
    resume.contact.email.trim(),
  );
  const hasPhone = resume.contact.phone.trim().length >= 8;
  checks.push({
    id: "contact",
    title: "Verified Email & Phone Number",
    passed: hasEmail && hasPhone,
    points: 10,
    tip: "Include a professional email and contact phone number.",
  });

  // Check 3: LinkedIn / Professional Link
  const hasLinks = Boolean(
    resume.contact.linkedin.trim() || resume.contact.github.trim(),
  );
  checks.push({
    id: "links",
    title: "LinkedIn or GitHub Profile URL",
    passed: hasLinks,
    points: 10,
    tip: "Add your LinkedIn or GitHub profile link for recruiter credibility.",
  });

  // Check 4: Experience Count & Depth
  const expCount = resume.experience.length;
  const hasDetailedExp =
    expCount > 0 && resume.experience.some((e) => e.bullets.length >= 2);
  checks.push({
    id: "experience",
    title: "Work Experience with Detailed Bullet Points",
    passed: hasDetailedExp,
    points: 20,
    tip: "Add at least one work experience with 2 or more descriptive bullet points.",
  });

  // Check 5: Action Verbs Usage
  const allBullets = [
    ...resume.experience.flatMap((e) => e.bullets),
    ...resume.projects.flatMap((p) => p.bullets),
  ].map((b) => b.toLowerCase());

  const usesActionVerbs = allBullets.some((bullet) =>
    ACTION_VERBS.some((verb) => bullet.includes(verb)),
  );
  checks.push({
    id: "action_verbs",
    title: "Strong Action Verbs (Engineered, Spearheaded, Optimized)",
    passed: usesActionVerbs,
    points: 15,
    tip: "Start bullet points with strong power verbs instead of passive phrases like 'responsible for'.",
  });

  // Check 6: Measurable Metrics & Numbers (STAR Method)
  const hasMetrics = allBullets.some((bullet) => METRIC_REGEX.test(bullet));
  checks.push({
    id: "metrics",
    title: "Measurable Impact & Metrics (%, numbers, scale)",
    passed: hasMetrics,
    points: 15,
    tip: "Quantify your achievements (e.g., 'reduced load time by 35%', 'scaled to 50k users').",
  });

  // Check 7: Technical Skills Categorization
  const hasSkills = resume.skills.some((s) => s.items.trim().length >= 5);
  checks.push({
    id: "skills",
    title: "Technical Skills & Competencies",
    passed: hasSkills,
    points: 10,
    tip: "List your key programming languages, frameworks, and developer tools.",
  });

  // Check 8: Education Background
  const hasEducation =
    resume.education.length > 0 &&
    Boolean(resume.education[0].institution.trim());
  checks.push({
    id: "education",
    title: "Educational Credentials",
    passed: hasEducation,
    points: 10,
    tip: "Add your college degree, university name, and graduation year.",
  });

  // Calculate Total Score
  const score = checks.reduce(
    (acc, curr) => acc + (curr.passed ? curr.points : 0),
    0,
  );

  const missingCrucials = checks.filter((c) => !c.passed).map((c) => c.tip);

  return {
    score: Math.min(100, Math.max(0, score)),
    checks,
    missingCrucials,
  };
}
