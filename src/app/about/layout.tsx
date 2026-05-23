import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Jantra Software",
  description: "Learn about Jantra Software, an elite cohort of senior software engineers and designers building custom software and AI agents in Bangladesh.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
