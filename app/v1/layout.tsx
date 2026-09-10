import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Arandelle — VS Code Portfolio",
  description:
    "A VS Code-themed interactive portfolio for Arandelle Paguinto, Fullstack Web Developer.",
};

export default function V1Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
