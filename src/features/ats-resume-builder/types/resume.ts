export interface ContactInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  techStack: string;
  link: string;
  bullets: string[];
}

export interface SkillCategory {
  id: string;
  category: string;
  items: string;
}

export interface DeclarationConfig {
  enabled: boolean;
  statement: string;
  date: string;
  place: string;
}

export interface ResumeData {
  contact: ContactInfo;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  skills: SkillCategory[];
  declaration: DeclarationConfig;
}

export interface AtsAuditCheck {
  id: string;
  title: string;
  passed: boolean;
  points: number;
  tip: string;
}

export interface AtsAuditResult {
  score: number;
  checks: AtsAuditCheck[];
  missingCrucials: string[];
}
