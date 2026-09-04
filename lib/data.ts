// Single source of truth for all portfolio content.

export const BOOKING_URL =
  "/";

export const AVATAR_URL =
  "/profile.jfif";

// ── Profile ────────────────────────────────────────────────────────────────

export interface Profile {
  name: string;
  location: string;
  email: string;
  role: string;
  bioParagraphs: string[];
}

export const profile: Profile = {
  name: "Arandelle Paguinto",
  location: "San Pedro, Laguna, Philippines",
  email: "hello@arandelle.com",
  role: "Fullstack Web Developer",
  bioParagraphs: [
    "I'm a full-stack developer passionate about building modern web applications that are fast, responsive, and easy to use. I enjoy turning ideas into real products with technologies like React, Next.js, TypeScript, Node.js, and MongoDB, while continuously improving my engineering skills.",
    "I believe there's always a better way to write software. I enjoy learning new technologies, refactoring code, solving complex problems, and building projects that challenge me to think like a senior engineer.",
    "Outside of coding, you'll usually find me exploring software architecture, contributing to personal projects, keeping up with new technologies, or planning the next feature to build.",
  ],
};

// ── Navigation tabs ────────────────────────────────────────────────────────

export type TabId =
  | "home"
  | "certifications"
  | "projects"
  | "blogs"
  | "contact"
  | "smarttalk";

export const navItems: { id: TabId; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "certifications", label: "Certifications" },
  { id: "projects", label: "Projects" },
  { id: "blogs", label: "Blogs" },
  { id: "contact", label: "Contact" },
  { id: "smarttalk", label: "Smart Talk" },
];

// ── Experience ─────────────────────────────────────────────────────────────

export interface ExperienceEntry {
  title: string;
  company: string;
  companyUrl: string;
  location: string;
  startDate: string; // e.g. "July 2025"
  endDate?: string; // e.g. "Present", omitted → current
  isCurrent: boolean;
  description: string;
  technologies: string[];
  awards?: { title: string; description: string }[];
}

export const experiences: ExperienceEntry[] = [
  {
    title: "Fullstack Web Developer",
    company: "JPSC Group Holdings Inc.",
    companyUrl: "#",
    location: "Philippines",
    startDate: "July 2025",
    isCurrent: true,
    description:
      "Developed and maintained full-stack web applications using React, Next.js, Node.js, and MongoDB. Collaborated with cross-functional teams to design and implement new features, optimize performance, and ensure a seamless user experience across all platforms.",
    technologies: [
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "MongoDB",
      "Tailwind CSS",
      "REST APIs",
    ],
  },
];

// Career progression timeline (all roles, including education)
export interface TimelineItem {
  title: string;
  org: string;
  startDate: string;
  endDate: string;
}

export const timeline: TimelineItem[] = [
  {
    title: "Fullstack Web Developer",
    org: "JPSC Group Holdings Inc.",
    startDate: "2025",
    endDate: "Present",
  },
  {
    title: "BS Information Technology",
    org: "Cavite State University – Tanza Campus",
    startDate: "2020",
    endDate: "2025",
  },
];

// ── Technical Expertise ────────────────────────────────────────────────────

export interface ExpertiseGroup {
  heading: string;
  skills: string[];
}

export const expertise: ExpertiseGroup[] = [
  {
    heading: "Programming",
    skills: [
      "Laravel",
      "JavaScript / TypeScript",
      "React.js & Tailwind CSS",
      "Next.js",
      "Node.js & Express.js",
    ],
  },
  {
    heading: "Design & Development",
    skills: [
      "Figma Design & Prototyping",
      "Wireframing & User Flow Design",
      "UI/UX",
      "WordPress Development & Customization",
    ],
  },
  {
    heading: "Systems",
    skills: [
      "GoHighLevel",
      "RoboFlow",
      "Git & GitHub Version Control",
      "Computer System Servicing",
      "API Testing with Postman",
    ],
  },
];

// ── Certifications ─────────────────────────────────────────────────────────

export interface Certification {
  name: string;
  issuer: string;
  url: string;
  date?: string;
}

export const certifications: Certification[] = [
  {
    name: "Mobile Application Development",
    issuer: "Bayan Academy (BPI TechVoc Program)",
    url: "#",
  },
];

// ── Projects ───────────────────────────────────────────────────────────────

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

// ── Blog Articles ──────────────────────────────────────────────────────────

export interface Article {
  slug: string;
  title: string;
  date: string;
  readingTime: string;
  excerpt: string;
  content: string;
}

export const articles: Article[] = [
  {
    slug: "quiet-engineering",
    title: "The Case for Quiet Engineering",
    date: "2025-09-14",
    readingTime: "6 min read",
    excerpt:
      "The best systems are the ones nobody notices. A look at why restraint, not cleverness, is the mark of senior work.",
    content: `## The best code is invisible\n\nThere's a particular kind of pride that comes from a clever solution — the one-liner, the abstraction that handles every case. But after a decade of shipping software, I've come to believe that **cleverness is usually a liability**.\n\nQuiet engineering is about building things that get out of the way:\n\n- Code your teammates can read without you in the room.\n- Systems that fail loudly and recover gracefully.\n- Abstractions that earn their keep, and no more.\n\n> Simplicity is a feature you ship to your future self.\n\n### Three habits\n\n1. **Delete before you add.** The cheapest code to maintain is the code that doesn't exist.\n2. **Name things honestly.** A precise name is worth a paragraph of comments.\n3. **Optimize for change.** You will be wrong about the requirements. Make being wrong cheap.\n\nThe engineers I admire most aren't the ones with the flashiest commits. They're the ones whose work you only notice when it's gone.`,
  },
  {
    slug: "designing-with-constraints",
    title: "Designing With Constraints",
    date: "2025-07-02",
    readingTime: "5 min read",
    excerpt:
      "Constraints are not the enemy of good design — they are the substrate it grows from. Notes from building Atlas UI.",
    content: `## Constraints are a gift\n\nWhen we started **Atlas UI**, the temptation was to support everything. Every theme, every variant, every edge case. We resisted, and the library is better for it.\n\n### What we said no to\n\n- Runtime theming via CSS-in-JS.\n- A configuration object for every component.\n- "Just one more" prop.\n\nEach \`no\` made the surface area smaller and the product sharper. A tight set of primitives composes further than a sprawling set of features.\n\n\`\`\`tsx\n// One primitive, composed — not a hundred props.\n<Button asChild>\n  <a href="/docs">Read the docs</a>\n</Button>\n\`\`\`\n\nConstraints force decisions, and decisions are what give a product a point of view.`,
  },
  {
    slug: "reading-the-stack",
    title: "Reading the Whole Stack",
    date: "2025-04-21",
    readingTime: "8 min read",
    excerpt:
      "Why the most valuable skill for a senior engineer is the willingness to follow a request all the way down.",
    content: `## Follow the request down\n\nThe fastest way to grow as an engineer is uncomfortable: **follow a single request from the browser all the way to the database and back**, refusing to wave your hands at any layer.\n\nWhen you do this honestly, you discover:\n\n- The cache you assumed was working isn't.\n- The "framework magic" is just a function you could have read.\n- The slow query has been slow for months.\n\n### A small exercise\n\nPick one endpoint in your app. Trace it:\n\n1. The component that triggers it.\n2. The network call and its headers.\n3. The route handler and its middleware.\n4. The query, and the indexes it does (or doesn't) use.\n\nMost performance problems and most bugs live in the seams *between* these layers — exactly the places we're tempted to skip.`,
  },
  {
    slug: "mentoring-that-scales",
    title: "Mentoring That Actually Scales",
    date: "2025-01-30",
    readingTime: "4 min read",
    excerpt:
      "Lessons from running a mentorship cohort: how to give feedback that compounds instead of feedback that fades.",
    content: `## Feedback that compounds\n\nRunning a mentorship cohort taught me that **most feedback evaporates** the moment it's given. The trick is to give feedback that teaches a *rule*, not just a fix.\n\n### Fix vs. rule\n\n- Fix: "Rename this variable to \`userCount\`."\n- Rule: "Names should let a reader predict the type and the meaning — \`count\` could be anything."\n\nThe fix solves today's problem. The rule solves the next hundred.\n\n> Teach the pattern, and you're no longer the bottleneck.\n\nThe goal of mentoring isn't to make people depend on you. It's to make yourself unnecessary, as quickly as you kindly can.`,
  },
];

// ── Social Links ───────────────────────────────────────────────────────────

export interface SocialLink {
  label: string;
  href: string;
  icon: "linkedin" | "github";
}

export const socials: SocialLink[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/arandelle-paguinto-588237285",
    icon: "linkedin",
  },
  {
    label: "GitHub",
    href: "https://github.com/Arandelle",
    icon: "github",
  },
];
