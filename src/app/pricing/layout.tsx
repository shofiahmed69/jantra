import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing Plans | Custom Software Development Bangladesh | JANTRA",
  description: "Transparent, affordable pricing for custom software development, SaaS products, AI agent development, mobile apps, and workflow automation. Get started with JANTRA Software in Bangladesh.",
  alternates: { canonical: "https://jantrasoft.online/pricing" },
  keywords: [
    "software development pricing Bangladesh",
    "affordable software development",
    "custom software cost Bangladesh",
    "SaaS development price",
    "AI agent development cost",
    "mobile app development price Bangladesh",
    "software company pricing",
    "Jantra pricing plans",
  ],
  openGraph: {
    title: "Pricing Plans | Custom Software Development Bangladesh | JANTRA",
    description: "Transparent, affordable pricing for custom software, SaaS, AI agents, mobile apps and automation. No hidden fees. Get a quote from JANTRA Software.",
    url: "https://jantrasoft.online/pricing",
    type: "website",
    images: [{ url: "/social-logo.png", width: 1200, height: 630, alt: "JANTRA Software Pricing" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing Plans | JANTRA Software Bangladesh",
    description: "Transparent, affordable pricing for custom software, SaaS, AI agents, and mobile apps from JANTRA Software.",
    images: ["/social-logo.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
