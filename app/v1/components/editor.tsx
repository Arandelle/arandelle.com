"use client";

import { useMemo } from "react";
import { ExternalLink, MapPin, Calendar } from "lucide-react";
import { usePortfolio } from "../context";
import { Welcome } from "./welcome";
import {
  projects as staticProjects,
  articles as staticArticles,
  profile as staticProfile,
  experiences as staticExperiences,
  expertise as staticExpertise,
  certifications as staticCertifications,
  socials as staticSocials,
} from "@/lib/data";

export function Editor() {
  const { activeTabId, data } = usePortfolio();

  if (!activeTabId) return <Welcome />;

  return (
    <div className="flex-1 overflow-y-auto flex">
      <LineNumbers />
      <div className="flex-1 min-w-0 px-4 sm:px-6 md:px-8 py-6">
        <FileContent fileId={activeTabId} data={data} />
      </div>
    </div>
  );
}

function LineNumbers() {
  const lines = useMemo(() => Array.from({ length: 80 }, (_, i) => i + 1), []);
  return (
    <div className="hidden md:flex flex-col shrink-0 w-12 pt-6 pr-4 text-right border-r border-[var(--vscode-border)] sticky top-0 h-fit self-start">
      {lines.map((n) => (
        <div
          key={n}
          className="text-[11px] leading-[22px] text-[var(--vscode-text-muted)] select-none font-mono"
        >
          {n}
        </div>
      ))}
    </div>
  );
}

function FileContent({
  fileId,
  data,
}: {
  fileId: string;
  data: ReturnType<typeof usePortfolio>["data"];
}) {
  if (fileId === "about") return <AboutRenderer data={data} />;
  if (fileId === "experience") return <ExperienceRenderer data={data} />;
  if (fileId.startsWith("project-"))
    return <ProjectRenderer fileId={fileId} data={data} />;
  if (fileId.startsWith("article-"))
    return <ArticleRenderer fileId={fileId} data={data} />;

  return (
    <div className="text-[var(--vscode-text-muted)]">
      <span className="text-[var(--vscode-accent)]">{"// "}</span>
      File not found
    </div>
  );
}

/* ── Shared components ──────────────────────────────────────────────────── */

function FileHeader({ name }: { name: string }) {
  return (
    <div className="mb-6">
      <span className="text-[var(--vscode-text-muted)] text-[11px] font-mono uppercase tracking-wider">
        {name}
      </span>
    </div>
  );
}

function CodeLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[var(--vscode-accent)] font-mono text-[12px]">
      {children}
    </span>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-2 py-0.5 text-[11px] font-mono bg-[var(--vscode-line-highlight)] border border-[var(--vscode-border)] rounded-sm text-[var(--vscode-text)]">
      {children}
    </span>
  );
}

/* ── About ──────────────────────────────────────────────────────────────── */

function AboutRenderer({
  data,
}: {
  data: ReturnType<typeof usePortfolio>["data"];
}) {
  const profile = data.profile ?? staticProfile;
  const expertiseData = data.expertise ?? staticExpertise;
  const certs = data.certifications ?? staticCertifications;
  const socials = data.socials ?? staticSocials;

  return (
    <div className="max-w-[700px]">
      <FileHeader name="about.tsx" />

      <div className="mb-8">
        <CodeLabel>{"// "}</CodeLabel>
        <CodeLabel>{profile.name}</CodeLabel>
        <h1 className="text-[28px] font-semibold text-[var(--vscode-text-bright)] mt-2 mb-1">
          {profile.name}
        </h1>
        <div className="flex items-center gap-4 text-[var(--vscode-text-muted)] text-[13px]">
          <span className="flex items-center gap-1.5">
            <MapPin size={13} /> {profile.location}
          </span>
          <a
            href={`mailto:${profile.email}`}
            className="hover:text-[var(--vscode-accent-hover)]"
          >
            {profile.email}
          </a>
        </div>
        <div className="mt-1">
          <span className="text-[var(--vscode-text-bright)] text-[14px]">
            {profile.role}
          </span>
        </div>
      </div>

      <div className="mb-8 space-y-3">
        <CodeLabel>{"export const bio = "}</CodeLabel>
        {profile.bioParagraphs.map((p, i) => (
          <p key={i} className="text-[14px] leading-[1.7] text-[var(--vscode-text)]">
            {p}
          </p>
        ))}
      </div>

      <div className="mb-8">
        <CodeLabel>{"export const expertise = {"}</CodeLabel>
        <div className="mt-3 space-y-4">
          {expertiseData.map((group, i) => (
            <div key={i} className="pl-4">
              <div className="text-[14px] font-medium text-[var(--vscode-text-bright)] mb-2">
                {group.heading ?? (group as Record<string, unknown>).name as string}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(group.skills ?? []).map((skill) => (
                  <Pill key={skill}>{skill}</Pill>
                ))}
              </div>
            </div>
          ))}
        </div>
        <CodeLabel>{"}"}</CodeLabel>
      </div>

      {certs.length > 0 && (
        <div className="mb-8">
          <CodeLabel>{"export const certifications = ["}</CodeLabel>
          <div className="mt-3 space-y-2 pl-4">
            {certs.map((cert, i) => (
              <div key={i} className="flex items-center gap-2 text-[13px]">
                <span className="text-[var(--vscode-text-muted)]">
                  {cert.issuer}
                </span>
                <span className="text-[var(--vscode-text)]">{cert.name}</span>
                {cert.date && (
                  <span className="text-[var(--vscode-text-muted)] text-[11px]">
                    ({typeof cert.date === "string" ? cert.date : new Date(cert.date).getFullYear()})
                  </span>
                )}
              </div>
            ))}
          </div>
          <CodeLabel>{"]"}</CodeLabel>
        </div>
      )}

      <div>
        <CodeLabel>{"export const socials = ["}</CodeLabel>
        <div className="mt-3 flex gap-4 pl-4">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[13px] hover:text-[var(--vscode-accent-hover)]"
            >
              {social.label}
              <ExternalLink size={12} />
            </a>
          ))}
        </div>
        <CodeLabel>{"]"}</CodeLabel>
      </div>
    </div>
  );
}

/* ── Experience ─────────────────────────────────────────────────────────── */

function ExperienceRenderer({
  data,
}: {
  data: ReturnType<typeof usePortfolio>["data"];
}) {
  const experiences = data.experiences ?? staticExperiences;

  return (
    <div className="max-w-[700px]">
      <FileHeader name="experience.tsx" />

      <CodeLabel>{"export const experiences = ["}</CodeLabel>

      <div className="mt-4 space-y-6">
        {experiences.map((exp, i) => {
          const raw = exp as Record<string, unknown>;
          const title = (exp.title ?? raw.role ?? "Developer") as string;
          const isCurrent = (raw.current ?? exp.isCurrent ?? false) as boolean;
          const startDate = exp.startDate
            ? typeof exp.startDate === "string"
              ? exp.startDate
              : new Date(exp.startDate).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })
            : "";
          const endDate = exp.endDate
            ? typeof exp.endDate === "string"
              ? exp.endDate
              : new Date(exp.endDate).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })
            : "Present";

          return (
            <div
              key={i}
              className="pl-4 border-l-2 border-[var(--vscode-border)] hover:border-[var(--vscode-accent)] transition-colors"
            >
              <h3 className="text-[16px] font-semibold text-[var(--vscode-text-bright)]">
                {title}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-[13px]">
                <a
                  href={(raw.companyUrl as string) ?? "#"}
                  className="text-[var(--vscode-accent)] hover:text-[var(--vscode-accent-hover)]"
                >
                  {exp.company}
                </a>
                {(raw.location as string | undefined) && (
                  <>
                    <span className="text-[var(--vscode-text-muted)]">·</span>
                    <span className="text-[var(--vscode-text-muted)] flex items-center gap-1">
                      <MapPin size={11} /> {raw.location as string}
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-[12px] text-[var(--vscode-text-muted)] mt-1">
                <Calendar size={11} />
                <span>
                  {startDate} — {isCurrent ? "Present" : endDate}
                </span>
                {isCurrent && (
                  <span className="px-1.5 py-0.5 text-[10px] bg-[var(--vscode-accent)] text-white rounded-sm font-mono uppercase">
                    current
                  </span>
                )}
              </div>
              <p className="text-[13px] text-[var(--vscode-text)] mt-3 leading-[1.65]">
                {exp.description}
              </p>
              {(raw.technologies as string[] | undefined)?.length ? (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {(raw.technologies as string[]).map((tech) => (
                    <Pill key={tech}>{tech}</Pill>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-6">
        <CodeLabel>{"];"}</CodeLabel>
      </div>
    </div>
  );
}

/* ── Project ────────────────────────────────────────────────────────────── */

function ProjectRenderer({
  fileId,
  data,
}: {
  fileId: string;
  data: ReturnType<typeof usePortfolio>["data"];
}) {
  const projects = data.projects ?? staticProjects;
  const slug = fileId.replace("project-", "");
  const project = projects.find(
    (p) => p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug,
  );

  if (!project) {
    return (
      <div className="text-[var(--vscode-text-muted)]">
        <span className="text-[var(--vscode-accent)]">{"// "}</span>
        Project not found
      </div>
    );
  }

  const tags = ((project as unknown as Record<string, unknown>).tags as string[] | undefined) ?? [];
  const image = (project as unknown as Record<string, unknown>).image as string | null | undefined;

  return (
    <div className="max-w-[700px]">
      <FileHeader name={`${slug}.tsx`} />

      <h1 className="text-[24px] font-semibold text-[var(--vscode-text-bright)] mb-4">
        {project.name}
      </h1>

      <CodeLabel>{"const description = "}</CodeLabel>
      <p className="text-[14px] text-[var(--vscode-text)] leading-[1.7] mt-2 mb-6">
        {project.description}
      </p>

      {tags.length > 0 && (
        <div className="mb-6">
          <CodeLabel>{"const techStack = ["}</CodeLabel>
          <div className="flex flex-wrap gap-1.5 mt-2 pl-4">
            {tags.map((tag) => (
              <Pill key={tag}>{tag}</Pill>
            ))}
          </div>
          <CodeLabel>{"];"}</CodeLabel>
        </div>
      )}

      {image && (
        <div className="mb-6">
          <CodeLabel>{"// preview"}</CodeLabel>
          <div className="mt-2 rounded border border-[var(--vscode-border)] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={project.name}
              className="w-full h-auto"
            />
          </div>
        </div>
      )}

      {project.url && project.url !== "#" && (
        <div>
          <CodeLabel>{"export const liveUrl = "}</CodeLabel>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-2 px-4 py-2 bg-[var(--vscode-accent)] hover:bg-[var(--vscode-accent-hover)] text-white rounded text-[13px] transition-colors"
          >
            Visit Project <ExternalLink size={13} />
          </a>
        </div>
      )}
    </div>
  );
}

/* ── Article ────────────────────────────────────────────────────────────── */

function ArticleRenderer({
  fileId,
  data,
}: {
  fileId: string;
  data: ReturnType<typeof usePortfolio>["data"];
}) {
  const articles = data.articles ?? staticArticles;
  const slug = fileId.replace("article-", "");
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="text-[var(--vscode-text-muted)]">
        <span className="text-[var(--vscode-accent)]">{"// "}</span>
        Article not found
      </div>
    );
  }

  const date = article.date
    ? typeof article.date === "string"
      ? article.date
      : new Date(article.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
    : "";

  return (
    <div className="max-w-[700px]">
      <FileHeader name={`${slug}.mdx`} />

      <div className="flex items-center gap-3 text-[12px] text-[var(--vscode-text-muted)] mb-4">
        <span>{date}</span>
        {((article as unknown as Record<string, unknown>).readingTime as string | undefined) ? (
          <>
            <span>·</span>
            <span>{(article as unknown as Record<string, unknown>).readingTime as string}</span>
          </>
        ) : null}
      </div>

      <h1 className="text-[24px] font-semibold text-[var(--vscode-text-bright)] mb-4">
        {article.title}
      </h1>

      <CodeLabel>{"/*"}</CodeLabel>
      <p className="text-[13px] text-[var(--vscode-text-muted)] italic my-1">
        {article.excerpt}
      </p>
      <CodeLabel>{"*/"}</CodeLabel>

      <div className="mt-6 prose-content">
        <MarkdownContent content={article.content} />
      </div>
    </div>
  );
}

function MarkdownContent({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="space-y-3 text-[14px] text-[var(--vscode-text)] leading-[1.7]">
      {lines.map((line, i) => {
        const trimmed = line.trim();

        if (!trimmed) return <div key={i} className="h-2" />;

        if (trimmed.startsWith("### ")) {
          return (
            <h3
              key={i}
              className="text-[16px] font-semibold text-[var(--vscode-text-bright)] mt-6"
            >
              {trimmed.slice(4)}
            </h3>
          );
        }

        if (trimmed.startsWith("## ")) {
          return (
            <h2
              key={i}
              className="text-[20px] font-semibold text-[var(--vscode-text-bright)] mt-4"
            >
              {trimmed.slice(3)}
            </h2>
          );
        }

        if (trimmed.startsWith("# ")) {
          return (
            <h1
              key={i}
              className="text-[24px] font-semibold text-[var(--vscode-text-bright)] mt-4"
            >
              {trimmed.slice(2)}
            </h1>
          );
        }

        if (trimmed.startsWith("> ")) {
          return (
            <blockquote
              key={i}
              className="border-l-2 border-[var(--vscode-accent)] pl-4 italic text-[var(--vscode-text-muted)]"
            >
              {renderInline(trimmed.slice(2))}
            </blockquote>
          );
        }

        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          return (
            <div key={i} className="flex gap-2 pl-4">
              <span className="text-[var(--vscode-accent)] shrink-0">•</span>
              <span>{renderInline(trimmed.slice(2))}</span>
            </div>
          );
        }

        if (/^\d+\.\s/.test(trimmed)) {
          const match = trimmed.match(/^(\d+)\.\s(.+)$/);
          if (match) {
            return (
              <div key={i} className="flex gap-2 pl-4">
                <span className="text-[var(--vscode-accent)] shrink-0 font-mono text-[13px]">
                  {match[1]}.
                </span>
                <span>{renderInline(match[2])}</span>
              </div>
            );
          }
        }

        if (trimmed.startsWith("```")) {
          return null;
        }

        return <p key={i}>{renderInline(trimmed)}</p>;
      })}
    </div>
  );
}

function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*)|(`(.+?)`)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[2]) {
      parts.push(
        <strong key={match.index} className="text-[var(--vscode-text-bright)]">
          {match[2]}
        </strong>,
      );
    } else if (match[4]) {
      parts.push(
        <code
          key={match.index}
          className="px-1.5 py-0.5 bg-[var(--vscode-line-highlight)] rounded text-[12px] font-mono text-[var(--vscode-accent)]"
        >
          {match[4]}
        </code>,
      );
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}
