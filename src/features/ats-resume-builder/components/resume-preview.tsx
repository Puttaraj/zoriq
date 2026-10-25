"use client";

import { ResumeData } from "../types/resume";

interface ResumePreviewProps {
  data: ResumeData;
}

export function ResumePreview({ data }: ResumePreviewProps) {
  const {
    contact,
    summary,
    experience,
    education,
    projects,
    skills,
    declaration,
  } = data;

  return (
    <div className="bg-muted/10 flex justify-center overflow-x-auto p-4 sm:p-6">
      {/* A4 Print Document */}
      <div
        id="ats-resume-document"
        className="mx-auto min-h-[297mm] w-full max-w-[210mm] bg-white p-[14mm] font-serif leading-normal text-slate-900 shadow-xl sm:p-[18mm] print:shadow-none"
        style={{
          fontFamily: "Georgia, Cambria, 'Times New Roman', Times, serif",
          color: "#0f172a",
        }}
      >
        {/* HEADER */}
        <header className="mb-4 border-b border-slate-300 pb-3 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase sm:text-3xl">
            {contact.fullName || "Your Full Name"}
          </h1>
          {contact.jobTitle && (
            <p className="mt-0.5 font-sans text-xs font-semibold tracking-wider text-slate-700 uppercase">
              {contact.jobTitle}
            </p>
          )}

          {/* Contact Details Single Row */}
          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 font-sans text-[11px] text-slate-700">
            {contact.location && <span>{contact.location}</span>}
            {contact.phone && (
              <>
                <span>•</span>
                <span>{contact.phone}</span>
              </>
            )}
            {contact.email && (
              <>
                <span>•</span>
                <a href={`mailto:${contact.email}`} className="hover:underline">
                  {contact.email}
                </a>
              </>
            )}
            {contact.linkedin && (
              <>
                <span>•</span>
                <span>{contact.linkedin}</span>
              </>
            )}
            {contact.github && (
              <>
                <span>•</span>
                <span>{contact.github}</span>
              </>
            )}
            {contact.portfolio && (
              <>
                <span>•</span>
                <span>{contact.portfolio}</span>
              </>
            )}
          </div>
        </header>

        {/* SUMMARY (Optional) */}
        {summary && (
          <section className="mb-4">
            <h2 className="mb-1.5 border-b border-slate-400 pb-0.5 font-sans text-xs font-bold tracking-wider text-slate-900 uppercase">
              Professional Summary
            </h2>
            <p className="text-justify text-[11.5px] leading-relaxed text-slate-800">
              {summary}
            </p>
          </section>
        )}

        {/* EXPERIENCE */}
        {experience.length > 0 && (
          <section className="mb-4">
            <h2 className="mb-2 border-b border-slate-400 pb-0.5 font-sans text-xs font-bold tracking-wider text-slate-900 uppercase">
              Work Experience
            </h2>
            <div className="space-y-3">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="font-bold text-slate-900">
                      {exp.company}
                    </span>
                    <span className="font-sans text-[11px] text-slate-600">
                      {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  <div className="mb-1 flex items-baseline justify-between text-[11.5px] text-slate-700 italic">
                    <span>{exp.role}</span>
                    {exp.location && (
                      <span className="font-sans text-[11px] text-slate-600 not-italic">
                        {exp.location}
                      </span>
                    )}
                  </div>
                  {exp.bullets.length > 0 && (
                    <ul className="list-disc space-y-0.5 pl-4 text-[11px] leading-snug text-slate-800">
                      {exp.bullets.filter(Boolean).map((bullet, i) => (
                        <li key={i}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS */}
        {projects.length > 0 && (
          <section className="mb-4">
            <h2 className="mb-2 border-b border-slate-400 pb-0.5 font-sans text-xs font-bold tracking-wider text-slate-900 uppercase">
              Key Projects
            </h2>
            <div className="space-y-2.5">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="font-bold text-slate-900">
                      {proj.name}
                      {proj.techStack && (
                        <span className="ml-1.5 font-sans text-[10.5px] font-normal text-slate-600">
                          | {proj.techStack}
                        </span>
                      )}
                    </span>
                    {proj.link && (
                      <span className="font-sans text-[10.5px] text-slate-600">
                        {proj.link}
                      </span>
                    )}
                  </div>
                  {proj.bullets.length > 0 && (
                    <ul className="mt-0.5 list-disc space-y-0.5 pl-4 text-[11px] leading-snug text-slate-800">
                      {proj.bullets.filter(Boolean).map((bullet, i) => (
                        <li key={i}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EDUCATION */}
        {education.length > 0 && (
          <section className="mb-4">
            <h2 className="mb-2 border-b border-slate-400 pb-0.5 font-sans text-xs font-bold tracking-wider text-slate-900 uppercase">
              Education
            </h2>
            <div className="space-y-2">
              {education.map((edu) => (
                <div
                  key={edu.id}
                  className="flex items-baseline justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900">
                      {edu.institution}
                    </span>
                    <div className="text-[11.5px] text-slate-700">
                      {edu.degree}
                      {edu.gpa && (
                        <span className="ml-2 font-sans text-[11px] text-slate-600">
                          (GPA: {edu.gpa})
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="font-sans text-[11px] text-slate-600">
                    {edu.startDate} – {edu.endDate}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TECHNICAL SKILLS */}
        {skills.length > 0 && (
          <section className="mb-4">
            <h2 className="mb-1.5 border-b border-slate-400 pb-0.5 font-sans text-xs font-bold tracking-wider text-slate-900 uppercase">
              Technical Skills
            </h2>
            <div className="space-y-1 text-[11px] leading-relaxed">
              {skills.map((sk) => (
                <div key={sk.id} className="flex">
                  <span className="min-w-[120px] font-sans text-[11px] font-bold text-slate-900">
                    {sk.category}:
                  </span>
                  <span className="text-slate-800">{sk.items}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* OPTIONAL FORMAL DECLARATION */}
        {declaration.enabled && (
          <section className="mt-6 border-t border-slate-300 pt-3 text-[10.5px]">
            <h2 className="mb-1 font-sans text-[10px] font-bold tracking-wider text-slate-900 uppercase">
              Declaration
            </h2>
            <p className="leading-relaxed text-slate-700 italic">
              {declaration.statement}
            </p>
            <div className="mt-3 flex justify-between font-sans text-[10.5px] text-slate-700">
              <div>
                <span>Date: {declaration.date}</span>
                <br />
                <span>Place: {declaration.place}</span>
              </div>
              <div className="text-right">
                <span className="font-bold">{contact.fullName}</span>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
