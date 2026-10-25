import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

interface AtsAnalysisResponse {
  atsScore: number;
  summary: string;
  matchedKeywords: string[];
  missingKeywords: string[];
  formattingScore: number;
  formattingFeedback: string[];
  bulletImprovements: {
    original: string;
    improved: string;
    reason: string;
  }[];
  actionableTips: string[];
}

function generateSmartFallback(
  resumeText: string,
  jobDescription?: string,
): AtsAnalysisResponse {
  const commonTech = [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Python",
    "SQL",
    "Git",
    "REST APIs",
    "Docker",
    "AWS",
    "CI/CD Pipelines",
    "Performance Optimization",
    "Unit Testing",
    "System Architecture",
  ];

  const lowerResume = resumeText.toLowerCase();
  const matched = commonTech.filter((tech) =>
    lowerResume.includes(tech.toLowerCase()),
  );
  const missing = commonTech
    .filter((tech) => !lowerResume.includes(tech.toLowerCase()))
    .slice(0, 6);

  const hasNumbers = /\d+%|\$\d+|₹\d+|\d+x/i.test(resumeText);
  const wordCount = resumeText.trim().split(/\s+/).length;

  let baseScore = 70;
  if (matched.length >= 4) baseScore += 10;
  if (hasNumbers) baseScore += 8;
  if (wordCount >= 200 && wordCount <= 700) baseScore += 6;
  const atsScore = Math.min(Math.max(baseScore, 55), 94);

  return {
    atsScore,
    summary: jobDescription
      ? `Your resume matches several foundational competencies for this role, but incorporating missing job requirements and quantifiable metrics will significantly improve your ATS ranking.`
      : `Your profile has a solid technical footprint with ${matched.length} detected skills. Strengthening your STAR-format accomplishment metrics will maximize recruiter shortlisting.`,
    matchedKeywords:
      matched.length > 0 ? matched : ["Problem Solving", "Git", "JavaScript"],
    missingKeywords:
      missing.length > 0
        ? missing
        : ["CI/CD Pipelines", "AWS / Cloud Infrastructure", "Unit Testing"],
    formattingScore: 88,
    formattingFeedback: [
      "Clean single-column structure ensures compatibility with Workday and Greenhouse parsers.",
      "Standard section headings (Experience, Education, Skills) are clearly recognized.",
      hasNumbers
        ? "Good use of numeric metrics in bullet points."
        : "Add measurable numbers, percentages, or scale metrics to experience points.",
    ],
    bulletImprovements: [
      {
        original: "Responsible for building web applications and fixing bugs.",
        improved:
          "Engineered scalable web applications in React & TypeScript, resolving 30+ critical production issues and improving team velocity by 20%.",
        reason:
          "Replaced passive responsibility phrasing with active verb 'Engineered' and added quantifiable impact.",
      },
      {
        original: "Worked on performance improvements across the platform.",
        improved:
          "Spearheaded frontend optimization initiatives, reducing Largest Contentful Paint (LCP) by 35% across 150k monthly active users.",
        reason:
          "Used strong action verb 'Spearheaded' and anchored work to standard Core Web Vitals metrics.",
      },
    ],
    actionableTips: [
      "Adopt the STAR method (Situation, Task, Action, Result) for all bullet points.",
      "Incorporate at least 3-4 of the missing keywords directly into your skills and project descriptions.",
      "Keep resume length to 1-2 pages strictly in single-column format for optimal ATS parsing.",
    ],
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resumeText, jobDescription } = body;

    if (
      !resumeText ||
      typeof resumeText !== "string" ||
      resumeText.trim().length < 50
    ) {
      return NextResponse.json(
        {
          error: "Please provide a valid resume text (at least 50 characters).",
        },
        { status: 400 },
      );
    }

    const apiKey = process.env.TOKENRA_API_KEY;
    const baseUrl = process.env.TOKENRA_BASE_URL || "https://tokenra.io/v1";
    const model = process.env.TOKENRA_MODEL || "deepseek-v4-flash";

    // If no API key is configured
    if (!apiKey) {
      return NextResponse.json({
        data: generateSmartFallback(resumeText, jobDescription),
        source:
          "diagnostic-preview (Add TOKENRA_API_KEY to .env for live DeepSeek inference)",
      });
    }

    // Live Tokenra DeepSeek inference
    const prompt = `You are an elite Applicant Tracking System (ATS) recruitment algorithm and professional executive resume coach.
Analyze the following resume${jobDescription ? " against the target Job Description" : ""}.

=== RESUME TEXT ===
${resumeText.slice(0, 6000)}

${
  jobDescription
    ? `=== TARGET JOB DESCRIPTION ===\n${jobDescription.slice(0, 3000)}\n`
    : ""
}
=== INSTRUCTIONS ===
1. Calculate a realistic ATS pass likelihood score (0 to 100).
2. Write an executive summary of the candidate's resume strength.
3. List 5 to 8 strongly matched technical and industry keywords found in the resume.
4. List 4 to 8 critical missing keywords or skills (especially from the Job Description).
5. Give a formatting & parseability score (0 to 100) with specific feedback.
6. Provide 2 to 3 bullet point rewrites using the STAR method (Situation, Task, Action, Result) with strong verbs and metrics.
7. Provide 3 actionable tips for maximum interview conversion.

Return ONLY a valid JSON object strictly matching this schema:
{
  "atsScore": <number 0-100>,
  "summary": "<string>",
  "matchedKeywords": ["<kw1>", "<kw2>"],
  "missingKeywords": ["<kw1>", "<kw2>"],
  "formattingScore": <number 0-100>,
  "formattingFeedback": ["<note 1>", "<note 2>"],
  "bulletImprovements": [
    {
      "original": "<original weak line>",
      "improved": "<quantified STAR version>",
      "reason": "<explanation>"
    }
  ],
  "actionableTips": ["<quick win tip 1>", "<quick win tip 2>", "<quick win tip 3>"]
}

STRICT INSTRUCTION: Respond with valid JSON ONLY. No markdown formatting, no code blocks, no backticks, no introductory text.`;

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content:
              "You are an ATS resume optimization engine. Output valid JSON only. Never output markdown codeblocks.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      const isQuotaError =
        errText.includes("insufficient_user_quota") ||
        errText.includes("额度不足") ||
        response.status === 403;

      if (isQuotaError) {
        console.warn(
          "Tokenra AI quota is empty ($0.00). Serving tailored diagnostic fallback.",
        );
        return NextResponse.json({
          data: generateSmartFallback(resumeText, jobDescription),
          source:
            "diagnostic-fallback (Tokenra account balance is $0.00; recharge Tokenra credits for live DeepSeek inference)",
          quotaExhausted: true,
        });
      }

      return NextResponse.json(
        { error: `AI Service Error (${response.status}): ${errText}` },
        { status: response.status },
      );
    }

    const aiData = await response.json();
    const rawContent = aiData.choices?.[0]?.message?.content ?? "";

    // Extract pure JSON object
    const jsonStart = rawContent.indexOf("{");
    const jsonEnd = rawContent.lastIndexOf("}");
    const cleanedJson =
      jsonStart !== -1 && jsonEnd !== -1
        ? rawContent.slice(jsonStart, jsonEnd + 1)
        : rawContent.trim();

    const parsed: AtsAnalysisResponse = JSON.parse(cleanedJson);
    return NextResponse.json({ data: parsed, source: "live-deepseek-v4" });
  } catch (error: unknown) {
    console.error("ATS Resume API error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
