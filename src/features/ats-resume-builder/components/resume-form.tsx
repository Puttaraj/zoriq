"use client";

import { Dispatch, SetStateAction } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  ResumeData,
  ExperienceItem,
  EducationItem,
  ProjectItem,
} from "../types/resume";

interface ResumeFormProps {
  data: ResumeData;
  setData: Dispatch<SetStateAction<ResumeData>>;
}

export function ResumeForm({ data, setData }: ResumeFormProps) {
  // Update Contact
  const updateContact = (key: keyof ResumeData["contact"], val: string) => {
    setData((prev) => ({
      ...prev,
      contact: { ...prev.contact, [key]: val },
    }));
  };

  // Add Experience
  const addExperience = () => {
    const newExp: ExperienceItem = {
      id: `exp-${Date.now()}`,
      company: "",
      role: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      bullets: [""],
    };
    setData((prev) => ({ ...prev, experience: [...prev.experience, newExp] }));
  };

  // Update Experience Field
  const updateExp = (id: string, field: keyof ExperienceItem, val: unknown) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.map((e) =>
        e.id === id ? { ...e, [field]: val } : e,
      ),
    }));
  };

  // Remove Experience
  const removeExp = (id: string) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.filter((e) => e.id !== id),
    }));
  };

  // Update Experience Bullet
  const updateExpBullet = (expId: string, bIndex: number, text: string) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.map((e) => {
        if (e.id !== expId) return e;
        const newBullets = [...e.bullets];
        newBullets[bIndex] = text;
        return { ...e, bullets: newBullets };
      }),
    }));
  };

  // Add Experience Bullet
  const addExpBullet = (expId: string) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.map((e) =>
        e.id === expId ? { ...e, bullets: [...e.bullets, ""] } : e,
      ),
    }));
  };

  // Remove Experience Bullet
  const removeExpBullet = (expId: string, bIndex: number) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.map((e) =>
        e.id === expId
          ? { ...e, bullets: e.bullets.filter((_, i) => i !== bIndex) }
          : e,
      ),
    }));
  };

  // Add Education
  const addEducation = () => {
    const newEdu: EducationItem = {
      id: `edu-${Date.now()}`,
      institution: "",
      degree: "",
      location: "",
      startDate: "",
      endDate: "",
      gpa: "",
    };
    setData((prev) => ({ ...prev, education: [...prev.education, newEdu] }));
  };

  const updateEdu = (id: string, field: keyof EducationItem, val: string) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.map((ed) =>
        ed.id === id ? { ...ed, [field]: val } : ed,
      ),
    }));
  };

  const removeEdu = (id: string) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.filter((ed) => ed.id !== id),
    }));
  };

  // Add Project
  const addProject = () => {
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: "",
      techStack: "",
      link: "",
      bullets: [""],
    };
    setData((prev) => ({ ...prev, projects: [...prev.projects, newProj] }));
  };

  const updateProj = (id: string, field: keyof ProjectItem, val: unknown) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === id ? { ...p, [field]: val } : p,
      ),
    }));
  };

  const removeProj = (id: string) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  };

  const updateProjBullet = (pId: string, bIndex: number, text: string) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => {
        if (p.id !== pId) return p;
        const newBullets = [...p.bullets];
        newBullets[bIndex] = text;
        return { ...p, bullets: newBullets };
      }),
    }));
  };

  const addProjBullet = (pId: string) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === pId ? { ...p, bullets: [...p.bullets, ""] } : p,
      ),
    }));
  };

  const removeProjBullet = (pId: string, bIndex: number) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === pId
          ? { ...p, bullets: p.bullets.filter((_, i) => i !== bIndex) }
          : p,
      ),
    }));
  };

  return (
    <div className="space-y-6 text-xs">
      {/* SECTION 1: CONTACT */}
      <div className="border-border/60 bg-muted/5 rounded-xl border p-4">
        <h3 className="font-heading text-foreground mb-3 text-xs font-bold tracking-wider uppercase">
          1. Header &amp; Contact Details
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="text-muted-foreground text-[10px] font-bold uppercase">
              Full Name *
            </label>
            <input
              type="text"
              value={data.contact.fullName}
              onChange={(e) => updateContact("fullName", e.target.value)}
              placeholder="e.g. John Doe"
              className="border-border/80 bg-background focus:border-primary w-full rounded-lg border p-2 text-xs outline-none"
            />
          </div>
          <div>
            <label className="text-muted-foreground text-[10px] font-bold uppercase">
              Target Role Title *
            </label>
            <input
              type="text"
              value={data.contact.jobTitle}
              onChange={(e) => updateContact("jobTitle", e.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
              className="border-border/80 bg-background focus:border-primary w-full rounded-lg border p-2 text-xs outline-none"
            />
          </div>
          <div>
            <label className="text-muted-foreground text-[10px] font-bold uppercase">
              Email *
            </label>
            <input
              type="email"
              value={data.contact.email}
              onChange={(e) => updateContact("email", e.target.value)}
              placeholder="you@email.com"
              className="border-border/80 bg-background focus:border-primary w-full rounded-lg border p-2 text-xs outline-none"
            />
          </div>
          <div>
            <label className="text-muted-foreground text-[10px] font-bold uppercase">
              Phone Number *
            </label>
            <input
              type="text"
              value={data.contact.phone}
              onChange={(e) => updateContact("phone", e.target.value)}
              placeholder="+91 98765 43210"
              className="border-border/80 bg-background focus:border-primary w-full rounded-lg border p-2 text-xs outline-none"
            />
          </div>
          <div>
            <label className="text-muted-foreground text-[10px] font-bold uppercase">
              Location (City, Country)
            </label>
            <input
              type="text"
              value={data.contact.location}
              onChange={(e) => updateContact("location", e.target.value)}
              placeholder="Bengaluru, India"
              className="border-border/80 bg-background focus:border-primary w-full rounded-lg border p-2 text-xs outline-none"
            />
          </div>
          <div>
            <label className="text-muted-foreground text-[10px] font-bold uppercase">
              LinkedIn URL
            </label>
            <input
              type="text"
              value={data.contact.linkedin}
              onChange={(e) => updateContact("linkedin", e.target.value)}
              placeholder="linkedin.com/in/username"
              className="border-border/80 bg-background focus:border-primary w-full rounded-lg border p-2 text-xs outline-none"
            />
          </div>
          <div>
            <label className="text-muted-foreground text-[10px] font-bold uppercase">
              GitHub URL
            </label>
            <input
              type="text"
              value={data.contact.github}
              onChange={(e) => updateContact("github", e.target.value)}
              placeholder="github.com/username"
              className="border-border/80 bg-background focus:border-primary w-full rounded-lg border p-2 text-xs outline-none"
            />
          </div>
          <div>
            <label className="text-muted-foreground text-[10px] font-bold uppercase">
              Portfolio Website
            </label>
            <input
              type="text"
              value={data.contact.portfolio}
              onChange={(e) => updateContact("portfolio", e.target.value)}
              placeholder="yourportfolio.dev"
              className="border-border/80 bg-background focus:border-primary w-full rounded-lg border p-2 text-xs outline-none"
            />
          </div>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="border-border/60 bg-muted/5 rounded-xl border p-4">
        <h3 className="font-heading text-foreground mb-2 text-xs font-bold tracking-wider uppercase">
          Professional Summary
        </h3>
        <textarea
          value={data.summary}
          onChange={(e) =>
            setData((prev) => ({ ...prev, summary: e.target.value }))
          }
          rows={3}
          placeholder="Brief 2-3 sentence overview highlighting your core competencies and top achievements..."
          className="border-border/80 bg-background w-full rounded-lg border p-2 text-xs outline-none"
        />
      </div>

      {/* SECTION 2: WORK EXPERIENCE */}
      <div className="border-border/60 bg-muted/5 rounded-xl border p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-heading text-foreground text-xs font-bold tracking-wider uppercase">
            2. Work Experience
          </h3>
          <button
            type="button"
            onClick={addExperience}
            className="border-border hover:bg-muted text-primary inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-all"
          >
            <Plus className="h-3 w-3" />
            Add Experience
          </button>
        </div>

        <div className="space-y-4">
          {data.experience.map((exp, idx) => (
            <div
              key={exp.id}
              className="border-border/60 bg-background space-y-2.5 rounded-lg border p-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-foreground text-[11px] font-bold">
                  Role #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeExp(exp.id)}
                  className="text-muted-foreground hover:text-destructive text-[11px]"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => updateExp(exp.id, "company", e.target.value)}
                  placeholder="Company Name"
                  className="border-border/80 bg-muted/10 rounded-md border p-1.5 text-xs outline-none"
                />
                <input
                  type="text"
                  value={exp.role}
                  onChange={(e) => updateExp(exp.id, "role", e.target.value)}
                  placeholder="Job Title"
                  className="border-border/80 bg-muted/10 rounded-md border p-1.5 text-xs outline-none"
                />
                <input
                  type="text"
                  value={exp.startDate}
                  onChange={(e) =>
                    updateExp(exp.id, "startDate", e.target.value)
                  }
                  placeholder="Start Date (e.g. Jan 2022)"
                  className="border-border/80 bg-muted/10 rounded-md border p-1.5 text-xs outline-none"
                />
                <input
                  type="text"
                  value={exp.endDate}
                  onChange={(e) => updateExp(exp.id, "endDate", e.target.value)}
                  placeholder="End Date (e.g. Present)"
                  className="border-border/80 bg-muted/10 rounded-md border p-1.5 text-xs outline-none"
                />
              </div>

              {/* Bullets */}
              <div className="space-y-1.5 pt-1">
                <span className="text-muted-foreground text-[10px] font-bold uppercase">
                  Accomplishment Bullets (Use STAR method with metrics)
                </span>
                {exp.bullets.map((bullet, bIdx) => (
                  <div key={bIdx} className="flex items-center gap-1.5">
                    <span className="text-muted-foreground">•</span>
                    <input
                      type="text"
                      value={bullet}
                      onChange={(e) =>
                        updateExpBullet(exp.id, bIdx, e.target.value)
                      }
                      placeholder="e.g. Architected micro-frontend in React 19, reducing page load by 35% across 100k users."
                      className="border-border/80 bg-muted/10 flex-1 rounded-md border p-1.5 text-xs outline-none"
                    />
                    {exp.bullets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExpBullet(exp.id, bIdx)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addExpBullet(exp.id)}
                  className="text-primary mt-1 text-[11px] font-semibold hover:underline"
                >
                  + Add Bullet Point
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: KEY PROJECTS */}
      <div className="border-border/60 bg-muted/5 rounded-xl border p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-heading text-foreground text-xs font-bold tracking-wider uppercase">
            3. Key Projects
          </h3>
          <button
            type="button"
            onClick={addProject}
            className="border-border hover:bg-muted text-primary inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-all"
          >
            <Plus className="h-3 w-3" />
            Add Project
          </button>
        </div>

        <div className="space-y-4">
          {data.projects.map((proj, idx) => (
            <div
              key={proj.id}
              className="border-border/60 bg-background space-y-2.5 rounded-lg border p-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-foreground text-[11px] font-bold">
                  Project #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeProj(proj.id)}
                  className="text-muted-foreground hover:text-destructive text-[11px]"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <input
                  type="text"
                  value={proj.name}
                  onChange={(e) => updateProj(proj.id, "name", e.target.value)}
                  placeholder="Project Name"
                  className="border-border/80 bg-muted/10 rounded-md border p-1.5 text-xs outline-none"
                />
                <input
                  type="text"
                  value={proj.techStack}
                  onChange={(e) =>
                    updateProj(proj.id, "techStack", e.target.value)
                  }
                  placeholder="Tech Stack (e.g. Next.js, Redis)"
                  className="border-border/80 bg-muted/10 rounded-md border p-1.5 text-xs outline-none"
                />
                <input
                  type="text"
                  value={proj.link}
                  onChange={(e) => updateProj(proj.id, "link", e.target.value)}
                  placeholder="Live URL / Repo"
                  className="border-border/80 bg-muted/10 rounded-md border p-1.5 text-xs outline-none"
                />
              </div>

              <div className="space-y-1.5 pt-1">
                {proj.bullets.map((bullet, bIdx) => (
                  <div key={bIdx} className="flex items-center gap-1.5">
                    <span className="text-muted-foreground">•</span>
                    <input
                      type="text"
                      value={bullet}
                      onChange={(e) =>
                        updateProjBullet(proj.id, bIdx, e.target.value)
                      }
                      placeholder="Bullet point describing technical architecture or user impact..."
                      className="border-border/80 bg-muted/10 flex-1 rounded-md border p-1.5 text-xs outline-none"
                    />
                    {proj.bullets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeProjBullet(proj.id, bIdx)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addProjBullet(proj.id)}
                  className="text-primary mt-1 text-[11px] font-semibold hover:underline"
                >
                  + Add Project Bullet
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: EDUCATION */}
      <div className="border-border/60 bg-muted/5 rounded-xl border p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-heading text-foreground text-xs font-bold tracking-wider uppercase">
            4. Education
          </h3>
          <button
            type="button"
            onClick={addEducation}
            className="border-border hover:bg-muted text-primary inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-all"
          >
            <Plus className="h-3 w-3" />
            Add Education
          </button>
        </div>

        <div className="space-y-3">
          {data.education.map((edu, idx) => (
            <div
              key={edu.id}
              className="border-border/60 bg-background space-y-2 rounded-lg border p-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-foreground text-[11px] font-bold">
                  Degree #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeEdu(edu.id)}
                  className="text-muted-foreground hover:text-destructive text-[11px]"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) =>
                    updateEdu(edu.id, "institution", e.target.value)
                  }
                  placeholder="University / College Name"
                  className="border-border/80 bg-muted/10 rounded-md border p-1.5 text-xs outline-none"
                />
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => updateEdu(edu.id, "degree", e.target.value)}
                  placeholder="Degree & Major (e.g. B.Tech Computer Science)"
                  className="border-border/80 bg-muted/10 rounded-md border p-1.5 text-xs outline-none"
                />
                <input
                  type="text"
                  value={edu.endDate}
                  onChange={(e) => updateEdu(edu.id, "endDate", e.target.value)}
                  placeholder="Graduation Year (e.g. 2022)"
                  className="border-border/80 bg-muted/10 rounded-md border p-1.5 text-xs outline-none"
                />
                <input
                  type="text"
                  value={edu.gpa}
                  onChange={(e) => updateEdu(edu.id, "gpa", e.target.value)}
                  placeholder="GPA / Percentage (e.g. 8.8 / 10)"
                  className="border-border/80 bg-muted/10 rounded-md border p-1.5 text-xs outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 5: TECHNICAL SKILLS */}
      <div className="border-border/60 bg-muted/5 rounded-xl border p-4">
        <h3 className="font-heading text-foreground mb-3 text-xs font-bold tracking-wider uppercase">
          5. Technical Skills
        </h3>
        <div className="space-y-2">
          {data.skills.map((sk) => (
            <div
              key={sk.id}
              className="grid grid-cols-1 items-center gap-2 sm:grid-cols-12"
            >
              <input
                type="text"
                value={sk.category}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    skills: prev.skills.map((s) =>
                      s.id === sk.id ? { ...s, category: e.target.value } : s,
                    ),
                  }))
                }
                className="border-border/80 bg-background rounded-md border p-1.5 text-xs font-bold sm:col-span-4"
              />
              <input
                type="text"
                value={sk.items}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    skills: prev.skills.map((s) =>
                      s.id === sk.id ? { ...s, items: e.target.value } : s,
                    ),
                  }))
                }
                placeholder="Comma separated skills (e.g. TypeScript, React, Next.js)"
                className="border-border/80 bg-background rounded-md border p-1.5 text-xs sm:col-span-8"
              />
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 6: DECLARATION TOGGLE */}
      <div className="border-border/60 bg-muted/5 rounded-xl border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading text-foreground text-xs font-bold tracking-wider uppercase">
              6. Formal Declaration
            </h3>
            <p className="text-muted-foreground mt-0.5 text-[11px]">
              Enable for Indian Government exams, PSUs, banking, and university
              placements.
            </p>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={data.declaration.enabled}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  declaration: {
                    ...prev.declaration,
                    enabled: e.target.checked,
                  },
                }))
              }
              className="peer sr-only"
            />
            <div className="peer bg-muted peer-checked:bg-primary h-5 w-9 rounded-full transition-all after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full" />
          </label>
        </div>

        {data.declaration.enabled && (
          <div className="border-border/40 mt-3 space-y-2 border-t pt-3">
            <textarea
              value={data.declaration.statement}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  declaration: {
                    ...prev.declaration,
                    statement: e.target.value,
                  },
                }))
              }
              rows={2}
              className="border-border/80 bg-background w-full rounded-md border p-2 text-xs outline-none"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={data.declaration.place}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    declaration: { ...prev.declaration, place: e.target.value },
                  }))
                }
                placeholder="Place (e.g. Bengaluru)"
                className="border-border/80 bg-background rounded-md border p-1.5 text-xs outline-none"
              />
              <input
                type="text"
                value={data.declaration.date}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    declaration: { ...prev.declaration, date: e.target.value },
                  }))
                }
                placeholder="Date"
                className="border-border/80 bg-background rounded-md border p-1.5 text-xs outline-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
