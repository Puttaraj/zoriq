# ZORIQ — Project Constitution

> **Every AI coding assistant, every developer, every contributor MUST read this file before generating or modifying any code.**

---

## 1. Vision

Build one of the world's best online utility platforms that provides hundreds of fast, secure, AI-powered tools for everyone.

## 2. Mission

Deliver production-grade, browser-based utility tools that are:

- Faster than any competitor
- More beautiful than any competitor
- Easier to use than any competitor
- Ranking on Google's first page for every target keyword

## 3. Comparable Platforms

Every feature must be comparable in quality to:

- **TinyWow** — tool variety and speed
- **SmallPDF / ILovePDF** — file tool UX
- **Remove.bg** — single-purpose tool excellence
- **Canva** — UI quality and delight
- **Vercel** — UI simplicity and clarity
- **Stripe** — design precision and polish

---

## 4. Architecture

### 4.1 Tech Stack

| Layer      | Technology               |
| ---------- | ------------------------ |
| Framework  | Next.js 15 (App Router)  |
| UI Library | React 19                 |
| Language   | TypeScript (strict mode) |
| Styling    | Tailwind CSS v4          |
| Components | shadcn/ui                |
| Animations | Framer Motion            |
| Validation | Zod                      |
| Analytics  | GA4 + Microsoft Clarity  |
| Hosting    | Vercel                   |
| CDN        | Cloudflare               |
| Domain     | zoriq.co.in              |

### 4.2 Folder Structure

```
src/
├── app/              # THIN routing layer ONLY (layouts, pages, API routes)
├── components/
│   ├── ui/           # shadcn/ui primitives (never put business logic here)
│   ├── layout/       # Header, Footer, MobileNav, Breadcrumbs
│   ├── shared/       # Cross-feature components (ToolCard, FileDropzone, etc.)
│   ├── sections/     # Homepage sections
│   └── ads/          # AdSense components
├── features/         # Feature-based modules (one per tool)
│   └── <tool-slug>/
│       ├── components/
│       ├── hooks/
│       ├── lib/
│       ├── types/
│       └── index.ts  # Public API barrel export
├── lib/              # Shared utilities (utils.ts, seo.ts, schema.ts, etc.)
├── config/           # Site config, tool registry, categories, feature flags
├── hooks/            # Global hooks
├── types/            # Global TypeScript types
└── styles/           # Additional CSS files
```

### 4.3 Rules

- `app/` contains ONLY routing files (page.tsx, layout.tsx, route.ts, loading.tsx, error.tsx)
- Business logic lives in `features/` or `lib/`
- UI components live in `components/`
- Every feature folder has a barrel `index.ts`
- No cross-feature imports — features communicate through shared types and config

---

## 5. Engineering Principles

### 5.1 The Five Questions

Every feature must answer YES to ALL:

1. **Will users search this?** — Is there search demand?
2. **Can Google rank it?** — Is the SEO strategy clear?
3. **Will users use it repeatedly?** — Does it solve a real problem?
4. **Can it generate revenue?** — Via ads, premium, or engagement?
5. **Is it better than competitors?** — Faster, prettier, simpler?

If any answer is NO → **do not build it.**

### 5.2 SOLID Principles

- **S**ingle Responsibility: One component = one job
- **O**pen/Closed: Extend via composition, not modification
- **L**iskov Substitution: Components are interchangeable via props
- **I**nterface Segregation: Small, focused TypeScript interfaces
- **D**ependency Inversion: Depend on abstractions, not implementations

### 5.3 No Duplication

NEVER duplicate:

- Components
- Business logic
- API calls
- Utility functions
- Type definitions

Always reuse existing code. If it doesn't exist, create it in the right shared location.

---

## 6. Coding Standards

### 6.1 TypeScript

- Strict mode enabled (no `any`, no unused vars/params)
- All function parameters typed
- All return types explicit on exported functions
- Prefer `interface` over `type` for object shapes
- Use `const` assertions where appropriate
- Zod schemas for runtime validation

### 6.2 React

- Server Components by default
- `"use client"` only when interactivity is required
- No prop drilling — use composition
- Custom hooks for reusable logic
- Lazy loading via `next/dynamic` for tool workspaces
- Error boundaries on every tool page

### 6.3 Styling

- Tailwind CSS utility classes
- `cn()` helper for conditional classes
- CSS variables for theme tokens
- No inline styles
- No CSS modules (use Tailwind)
- Mobile-first responsive design

### 6.4 File Naming

- Components: `PascalCase.tsx` (e.g., `HeroSection.tsx`)
- Hooks: `use-kebab-case.ts` (e.g., `use-clipboard.ts`)
- Utilities: `kebab-case.ts` (e.g., `rate-limit.ts`)
- Types: `kebab-case.ts` (e.g., `tool.ts`)
- Config: `kebab-case.ts` (e.g., `feature-flags.ts`)

---

## 7. Design Philosophy

### 7.1 Aesthetic Principles

- **Minimal** — No visual clutter
- **Premium** — Every pixel is intentional
- **Modern** — Current design trends, not 2020
- **Glassmorphism** — Where it enhances depth
- **Rounded corners** — Soft, approachable feel
- **Gradients** — Subtle, brand-aligned
- **Typography** — Inter (body) + Plus Jakarta Sans (headings)
- **Iconography** — Lucide icons, consistent sizing

### 7.2 Color System

| Token       | Light          | Dark           |
| ----------- | -------------- | -------------- |
| Primary     | Violet #6C3AED | Violet #8B5CF6 |
| Accent      | Mint #06D6A0   | Mint #34D399   |
| Background  | #FAFBFC        | #0A0A0F        |
| Card        | #FFFFFF        | #12121A        |
| Border      | #E2E8F0        | #27273A        |
| Destructive | #EF4444        | #F87171        |

### 7.3 Animations

- Framer Motion for page transitions and component animations
- Subtle entrance animations (fade + slide)
- Micro-interactions on buttons, cards, toggles
- Never block user interaction
- `prefers-reduced-motion` must be respected

---

## 8. SEO Standards

Every tool page MUST include:

- [ ] SEO title (unique, keyword-optimized, <60 chars)
- [ ] Meta description (compelling, <155 chars)
- [ ] Canonical URL
- [ ] Open Graph tags (title, description, image)
- [ ] Twitter Card tags
- [ ] BreadcrumbList schema (JSON-LD)
- [ ] FAQPage schema (JSON-LD)
- [ ] SoftwareApplication schema (JSON-LD)
- [ ] H1 tag (single, containing primary keyword)
- [ ] FAQ section (minimum 5 questions)
- [ ] SEO content section (minimum 300 words)
- [ ] Related tools section (internal linking)
- [ ] Breadcrumbs UI component

---

## 9. Security Standards

### 9.1 Headers (applied via next.config.ts)

- Content-Security-Policy
- Strict-Transport-Security (HSTS)
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- X-XSS-Protection
- Referrer-Policy
- Permissions-Policy

### 9.2 API Routes

Every API route MUST include:

- Zod input validation
- Rate limiting (token bucket per IP)
- Input sanitization
- File type validation (MIME + magic bytes)
- File size validation
- CSRF protection (origin checking)

### 9.3 Client-Side

- React's built-in XSS prevention
- DOMPurify for any user-generated HTML
- No `dangerouslySetInnerHTML` without sanitization
- No `eval()` or `Function()` constructor

---

## 10. Performance Budget

| Metric                    | Target   |
| ------------------------- | -------- |
| Initial JS Bundle         | < 150 KB |
| Largest Contentful Paint  | < 1.5s   |
| Interaction to Next Paint | < 100ms  |
| Cumulative Layout Shift   | < 0.05   |
| First Contentful Paint    | < 0.8s   |
| Lighthouse Score          | 95+      |

### Mandatory Optimizations

- Dynamic imports for every tool workspace (`next/dynamic`)
- Web Workers for heavy processing (image, PDF)
- `next/font` with subsetting
- `next/image` with AVIF/WebP
- ISR for tool pages (revalidate: 86400)
- Edge caching on Vercel + Cloudflare

---

## 11. Accessibility (WCAG 2.1 AA)

- Semantic HTML elements
- ARIA labels on interactive elements
- Keyboard navigation for all tools
- Focus management and visible focus indicators
- Color contrast ratios ≥ 4.5:1 (normal text), ≥ 3:1 (large text)
- Screen reader testing
- `prefers-reduced-motion` support
- `prefers-color-scheme` support

---

## 12. Feature Flags

Every future feature must support states:

```typescript
type FeatureState = "enabled" | "disabled" | "beta" | "internal";
```

Feature flags are defined in `src/config/feature-flags.ts` and checked via `isFeatureEnabled()`.

---

## 13. AI-Ready Architecture

Every feature module exposes extension points for future AI integration:

```
Current Tool → AI Enhancement
──────────────────────────────
Resume Builder → AI Resume Builder
PDF Tool → AI PDF Summarizer
Image Tool → AI Image Enhancer
Developer Tool → AI Code Assistant
```

Architecture rules:

- Processing logic is abstracted behind interfaces
- Tool config supports `aiEnhanced: boolean` flag
- Feature hooks accept optional AI processing callbacks
- No redesign required to add AI capabilities

---

## 14. Business Architecture

Optimized user flow:

```
Google Search → Landing Page → Tool → Related Tool → Another Tool → Blog → AdSense → Premium (Future)
```

Every page must:

- Link to related tools (cross-selling)
- Include internal links (SEO juice)
- Show engagement hooks (popular tools, latest tools)
- Support ad placements without blocking usability

---

## 15. Deployment Pipeline

```
Development → GitHub → Pull Request → GitHub Actions (lint + type-check + build) → Vercel Preview → Manual Review → Production → Cloudflare CDN → zoriq.co.in
```

---

## 16. Definition of Done

A feature is COMPLETE only when:

- ✅ UI complete and pixel-perfect
- ✅ Responsive (320px → 1440px)
- ✅ Accessibility passed (WCAG 2.1 AA)
- ✅ Lighthouse score > 95
- ✅ SEO metadata added
- ✅ Schema.org structured data added
- ✅ Error handling implemented
- ✅ Loading states implemented
- ✅ Empty states implemented
- ✅ Dark mode + Light mode working
- ✅ Production build passes
- ✅ No TypeScript errors
- ✅ No ESLint errors

---

## 17. Phase Roadmap

| Phase | Scope                                                       | Status |
| ----- | ----------------------------------------------------------- | ------ |
| 0     | Developer Experience (DX tooling)                           | ✅     |
| 1     | Foundation (design system, layout, homepage, SEO, security) | 🔄     |
| 2     | Tools (9 browser-based utilities)                           | ⏳     |
| 3     | Polish & Launch (directory, marketing, deployment)          | ⏳     |
| 4     | Blog Infrastructure (MDX)                                   | ⏳     |
| 5     | Admin Module (/admin)                                       | ⏳     |
| 6     | AI Integration (Zoriq AI)                                   | ⏳     |
| 7     | Premium Features                                            | ⏳     |

---

## 18. Future Microservices

The frontend abstracts service calls behind interfaces. When the system scales:

```
Potential Services:
- AI Service
- PDF Service
- Image Service
- Analytics Service
- Notification Service
- Search Service
```

Frontend should NOT require changes during migration.

---

**This document is the single source of truth for ZORIQ.**
**No code should violate this document.**
**Last updated: 2026-07-11**
