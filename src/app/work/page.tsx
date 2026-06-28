import { Metadata } from "next";
import WorkClient from "./WorkClient";
import { getWorkProjects } from "@/lib/work-data";

export const metadata: Metadata = {
  title: "Portfolio & Case Studies | Custom Software Projects | JANTRA",
  description: "Browse JANTRA Software's portfolio of custom software, SaaS platforms, AI agent systems, mobile apps, and automation tools built for businesses in Bangladesh and worldwide.",
  alternates: { canonical: "https://jantrasoft.online/work" },
  keywords: [
    "software portfolio Bangladesh",
    "custom software case studies",
    "SaaS product examples Bangladesh",
    "AI agent projects Bangladesh",
    "mobile app portfolio Bangladesh",
    "software company work Bangladesh",
    "Jantra Software portfolio",
  ],
  openGraph: {
    title: "Portfolio & Case Studies | JANTRA Software Bangladesh",
    description: "Browse our portfolio of custom software, SaaS platforms, AI agents, and mobile apps built for clients across Bangladesh and globally.",
    url: "https://jantrasoft.online/work",
    type: "website",
    images: [{ url: "/social-logo.png", width: 1200, height: 630, alt: "JANTRA Software Portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio | JANTRA Software Bangladesh",
    description: "Browse our portfolio of custom software, SaaS, AI agents, and mobile apps built in Bangladesh.",
    images: ["/social-logo.png"],
  },
};

async function getInitialProjects() {
  return getWorkProjects();
}

export default async function Page() {
  const initialProjects = await getInitialProjects();
  return <WorkClient initialProjects={initialProjects} />;
}
