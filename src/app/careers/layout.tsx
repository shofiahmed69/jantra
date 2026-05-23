import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers & Open Positions",
  description: "Explore open roles at Jantra Software and join our engineering team building software products, AI agents, and automation platforms in Bangladesh.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
