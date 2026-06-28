import { Metadata } from "next";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
  title: "Services | Custom Software, AI Agents & Mobile Apps | JANTRA Bangladesh",
  description: "JANTRA Software offers custom software development, SaaS product development, AI agent development, mobile app development, workflow automation, and UI/UX design services in Bangladesh.",
  alternates: { canonical: "https://jantrasoft.online/services" },
  keywords: [
    "software development services Bangladesh",
    "custom software development",
    "SaaS development Bangladesh",
    "AI agent development Bangladesh",
    "mobile app development Bangladesh",
    "workflow automation Bangladesh",
    "UI UX design Bangladesh",
    "web app development Bangladesh",
    "Jantra Software services",
    "software outsourcing Bangladesh",
  ],
  openGraph: {
    title: "Services | Custom Software, AI & Mobile Apps | JANTRA Bangladesh",
    description: "Custom software, SaaS platforms, AI agents, mobile apps, workflow automation and UI/UX design by JANTRA Software in Bangladesh.",
    url: "https://jantrasoft.online/services",
    type: "website",
    images: [{ url: "/social-logo.png", width: 1200, height: 630, alt: "JANTRA Software Services" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Services | JANTRA Software Bangladesh",
    description: "Custom software, SaaS, AI agents, mobile apps and automation by JANTRA Software in Bangladesh.",
    images: ["/social-logo.png"],
  },
};

export default function Page() {
  return <ServicesClient />;
}
