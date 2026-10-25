import { ResumeData } from "../types/resume";

export const SAMPLE_SOFTWARE_ENGINEER: ResumeData = {
  contact: {
    fullName: "Puttaraj K",
    jobTitle: "Full Stack Software Engineer",
    email: "puttaraj@example.com",
    phone: "+91 98765 43210",
    location: "Bengaluru, India",
    linkedin: "linkedin.com/in/puttaraj",
    github: "github.com/puttaraj",
    portfolio: "puttaraj.dev",
  },
  summary:
    "Full-stack software engineer with 4+ years of expertise in TypeScript, React, Next.js, and Node.js. Proven track record of architecting high-performance, client-side web utilities with zero server footprint and sub-second load times.",
  experience: [
    {
      id: "exp-1",
      company: "Zoriq Technologies",
      role: "Lead Frontend Engineer",
      location: "Bengaluru, India",
      startDate: "Jan 2023",
      endDate: "Present",
      current: true,
      bullets: [
        "Architected and deployed 25+ client-side utility tools in Next.js 15 and React 19, reducing server overhead to $0.",
        "Engineered in-browser WebGPU AI background removal, achieving sub-2-second inference latency with zero cloud API costs.",
        "Optimized Core Web Vitals across the platform, improving Largest Contentful Paint (LCP) by 45% and driving 100k+ organic monthly visits.",
      ],
    },
    {
      id: "exp-2",
      company: "CloudScale Solutions",
      role: "Software Developer",
      location: "Bengaluru, India",
      startDate: "Jul 2020",
      endDate: "Dec 2022",
      current: false,
      bullets: [
        "Developed scalable micro-frontends and RESTful API endpoints serving 250,000+ daily active users.",
        "Implemented automated CI/CD deployment pipelines using GitHub Actions, decreasing release cycle times by 35%.",
        "Refactored legacy state management into modern React hooks, resolving 60+ critical client-side memory leak defects.",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      institution: "Visvesvaraya Technological University",
      degree: "Bachelor of Engineering in Computer Science",
      location: "Karnataka, India",
      startDate: "2016",
      endDate: "2020",
      gpa: "8.6 / 10.0",
    },
  ],
  projects: [
    {
      id: "proj-1",
      name: "ZORIQ — Browser Utility Engine",
      techStack: "Next.js 15, TypeScript, Tailwind CSS, WebGPU",
      link: "zoriq.co.in",
      bullets: [
        "Built a 100% private, client-side utility platform featuring PDF compilation, image compressors, and AI resume analytics.",
        "Designed single-column semantic ATS templates, scoring 98% pass rates across Taleo, Workday, and Greenhouse parsers.",
      ],
    },
  ],
  skills: [
    {
      id: "sk-1",
      category: "Languages",
      items: "TypeScript, JavaScript, HTML5, CSS3, SQL, Python",
    },
    {
      id: "sk-2",
      category: "Frameworks & Libraries",
      items:
        "React 19, Next.js 15, Node.js, Tailwind CSS v4, Express, Framer Motion",
    },
    {
      id: "sk-3",
      category: "Tools & Infrastructure",
      items: "Git, GitHub, Docker, Postman, Vercel, Cloudflare, WebGPU",
    },
  ],
  declaration: {
    enabled: false,
    statement:
      "I hereby declare that the information provided above is true and correct to the best of my knowledge and belief.",
    date: new Date().toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    place: "Bengaluru",
  },
};
