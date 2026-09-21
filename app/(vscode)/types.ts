import type { LucideIcon } from "lucide-react";

export type FileId = string;

export interface FileItem {
  id: FileId;
  name: string;
  icon: LucideIcon;
  iconColor?: string;
  children?: FileItem[];
}

export interface Tab {
  id: FileId;
  name: string;
  icon: LucideIcon;
  iconColor?: string;
}

export interface PortfolioData {
  experiences?: {
    title?: string;
    role?: string;
    company: string;
    description: string;
    startDate?: string | Date | null;
    endDate?: string | Date | null;
    current?: boolean;
    isCurrent?: boolean;
    technologies?: string[];
    companyUrl?: string | null;
    location?: string | null;
  }[];
  projects?: {
    id?: string;
    name: string;
    description: string;
    url: string;
    image?: string | null;
    tags?: string[];
    featured?: boolean;
  }[];
  articles?: {
    id?: string;
    slug: string;
    title: string;
    date: string | Date | null;
    readingTime?: string | null;
    excerpt: string;
    content: string;
    published?: boolean;
  }[];
  expertise?: {
    heading?: string;
    name?: string;
    skills: string[];
  }[];
  certifications?: {
    name: string;
    issuer: string;
    url?: string | null;
    date?: string | Date | null;
  }[];
  timeline?: {
    title: string;
    org: string;
    startDate: string;
    endDate: string;
  }[];
  profile: {
    name: string;
    location: string;
    email: string;
    role: string;
    bioParagraphs: string[];
  };
  socials?: {
    label: string;
    href: string;
    icon: string;
  }[];
}

export type SidebarPanel =
  | "explorer"
  | "search"
  | "source-control"
  | "extensions"
  | "settings"
  | "account";
