// Single source of truth for all portfolio content.

export const BOOKING_URL =
  "/";

export const AVATAR_URL =
  "/profile.jfif";

export interface Profile {
  name: string;
  location: string;
  email: string;
  roles: string[];
  featured: { label: string; href: string };
  bioParagraphs: string[];
}

export const profile: Profile = {
  name: "Arandelle Paguinto",
  location: "City of San Pedro, Laguna, Philippines",
  email: "hello@arandelle.com",
  roles: ["Software Engineer", "Web Developer", "Fullstack Developer"],
  featured: {
    label: "Developed Ordering System for the restaurant · 2026",
    href: "https://food.harrisoninasalbbq.com.ph",
  },
  bioParagraphs: [
    "I'm a full-stack developer passionate about building modern web applications that are fast, responsive, and easy to use. I enjoy turning ideas into real products with technologies like React, Next.js, TypeScript, Node.js, and MongoDB, while continuously improving my engineering skills.",
    "I believe there's always a better way to write software. I enjoy learning new technologies, refactoring code, solving complex problems, and building projects that challenge me to think like a senior engineer. Every project is an opportunity to improve both my technical skills and the experience I create for users.",
    "Outside of coding, you'll usually find me exploring software architecture, contributing to personal projects, keeping up with new technologies, or planning the next feature to build. My goal is simple: become the kind of software engineer who creates products people genuinely enjoy using.",
  ],
};

export interface TimelineItem {
  title: string;
  org: string;
  period: string;
  kind: "work" | "education";
}

export const timeline: TimelineItem[] = [
  {
    title: "Fullstack Web Developer",
    org: "JPSC Group Holdings Inc. (JPTech Solutions Inc.)",
    period: "2026 — Present",
    kind: "work",
  },
  {
    title: "Bachelor of Science in Information Technologies",
    org: "Cavite State University - Tanza Campus",
    period: "2020 — 2025",
    kind: "education",
  },
];

export interface TechGroup {
  category: string;
  items: string[];
}

export const techStack: TechGroup[] = [
  {
    category: "Frontend",
    items: ["TypeScript", "React", "Next.js", "Tailwind CSS"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Python", "MongoDB", "MySQL", "FastAPI", "JavaScript"],
  },
  {
    category: "DevOps & Cloud",
    items: ["Alibaba Cloud", "Docker", "GitHub Actions", "Vercel"],
  },
];

export interface Project {
  name: string;
  description: string;
  url: string;
}

export const projects: Project[] = [
  {
    name: "Harrison House of Inasal & BBQ",
    description:
      "A modern restaurant ordering platform for online orders, reservations, and menu management.",
    url: "https://food.harrisoninasalbbq.com.ph",
  },
  {
    name: "AI Powered Field Vision QA",
    description:
      "An AI vision assistant that analyzes field images, answers visual questions, and annotates objects for safety and compliance.",
    url: "https://field-vision-qa.vercel.app/",
  },
  {
    name: "CoinWise",
    description:
      "An AI-powered expense tracker that provides spending insights, budget monitoring, and personalized financial summaries.",
    url: "https://coinwise-opal.vercel.com",
  },
  {
    name: "Eris: Emergency Response and Information System",
    description:
      "An emergency response and information system that helps barangay responders coordinate incidents, manage emergency requests, and keep residents informed.",
    url: "https://github.com/Arandelle/ERIS-Web_Admin",
  },
];

export interface Certification {
  name: string;
  issuer: string;
  url: string;
}

export const certifications: Certification[] = [
  {
    name: "Mobile Application Development",
    issuer: "Bayan Academy (BPI TechVoc Program)",
    url: "#",
  },
];

export interface Testimonial {
  quote: string;
  name: string;
  title: string;
}

export const testimonials: Testimonial[] = [
];

export interface SocialLink {
  label: string;
  href: string;
  icon: "linkedin" | "github";
}

export const socials: SocialLink[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/arandelle-paguinto-588237285", icon: "linkedin" },
  { label: "GitHub", href: "https://github.com/Arandelle", icon: "github" },
];

export interface Article {
  slug: string;
  title: string;
  date: string; // ISO date
  readingTime: string;
  excerpt: string;
  content: string; // markdown
}

export const articles: Article[] = [
  {
    slug: "quiet-engineering",
    title: "The Case for Quiet Engineering",
    date: "2025-09-14",
    readingTime: "6 min read",
    excerpt:
      "The best systems are the ones nobody notices. A look at why restraint, not cleverness, is the mark of senior work.",
    content: `## The best code is invisible

There's a particular kind of pride that comes from a clever solution — the one-liner, the abstraction that handles every case. But after a decade of shipping software, I've come to believe that **cleverness is usually a liability**.

Quiet engineering is about building things that get out of the way:

- Code your teammates can read without you in the room.
- Systems that fail loudly and recover gracefully.
- Abstractions that earn their keep, and no more.

> Simplicity is a feature you ship to your future self.

### Three habits

1. **Delete before you add.** The cheapest code to maintain is the code that doesn't exist.
2. **Name things honestly.** A precise name is worth a paragraph of comments.
3. **Optimize for change.** You will be wrong about the requirements. Make being wrong cheap.

The engineers I admire most aren't the ones with the flashiest commits. They're the ones whose work you only notice when it's gone.`,
  },
  {
    slug: "designing-with-constraints",
    title: "Designing With Constraints",
    date: "2025-07-02",
    readingTime: "5 min read",
    excerpt:
      "Constraints are not the enemy of good design — they are the substrate it grows from. Notes from building Atlas UI.",
    content: `## Constraints are a gift

When we started **Atlas UI**, the temptation was to support everything. Every theme, every variant, every edge case. We resisted, and the library is better for it.

### What we said no to

- Runtime theming via CSS-in-JS.
- A configuration object for every component.
- "Just one more" prop.

Each \`no\` made the surface area smaller and the product sharper. A tight set of primitives composes further than a sprawling set of features.

\`\`\`tsx
// One primitive, composed — not a hundred props.
<Button asChild>
  <a href="/docs">Read the docs</a>
</Button>
\`\`\`

Constraints force decisions, and decisions are what give a product a point of view.`,
  },
  {
    slug: "reading-the-stack",
    title: "Reading the Whole Stack",
    date: "2025-04-21",
    readingTime: "8 min read",
    excerpt:
      "Why the most valuable skill for a senior engineer is the willingness to follow a request all the way down.",
    content: `## Follow the request down

The fastest way to grow as an engineer is uncomfortable: **follow a single request from the browser all the way to the database and back**, refusing to wave your hands at any layer.

When you do this honestly, you discover:

- The cache you assumed was working isn't.
- The "framework magic" is just a function you could have read.
- The slow query has been slow for months.

### A small exercise

Pick one endpoint in your app. Trace it:

1. The component that triggers it.
2. The network call and its headers.
3. The route handler and its middleware.
4. The query, and the indexes it does (or doesn't) use.

Most performance problems and most bugs live in the seams *between* these layers — exactly the places we're tempted to skip.`,
  },
  {
    slug: "mentoring-that-scales",
    title: "Mentoring That Actually Scales",
    date: "2025-01-30",
    readingTime: "4 min read",
    excerpt:
      "Lessons from running a mentorship cohort: how to give feedback that compounds instead of feedback that fades.",
    content: `## Feedback that compounds

Running a mentorship cohort taught me that **most feedback evaporates** the moment it's given. The trick is to give feedback that teaches a *rule*, not just a fix.

### Fix vs. rule

- Fix: "Rename this variable to \`userCount\`."
- Rule: "Names should let a reader predict the type and the meaning — \`count\` could be anything."

The fix solves today's problem. The rule solves the next hundred.

> Teach the pattern, and you're no longer the bottleneck.

The goal of mentoring isn't to make people depend on you. It's to make yourself unnecessary, as quickly as you kindly can.`,
  },
];
