import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About JANTRA Software | Custom Software Company in Bangladesh",
  description: "Learn about JANTRA Software — a Dhaka-based custom software company building SaaS platforms, AI agents, mobile apps, and workflow automation for businesses worldwide.",
  alternates: { canonical: "https://jantrasoft.online/about" },
  keywords: [
    "about Jantra Software",
    "Jantra Software team",
    "software company Bangladesh",
    "IT company Dhaka",
    "software engineers Bangladesh",
    "tech company Dhaka",
    "who is Jantra Software",
  ],
  openGraph: {
    title: "About JANTRA Software | Custom Software Company in Bangladesh",
    description: "Meet the team behind JANTRA — a Dhaka-based software company building AI agents, SaaS platforms, mobile apps and automation systems for global clients.",
    url: "https://jantrasoft.online/about",
    type: "website",
    images: [{ url: "/social-logo.png", width: 1200, height: 630, alt: "About JANTRA Software" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About JANTRA Software | Custom Software Company in Bangladesh",
    description: "Meet the team behind JANTRA — a Dhaka-based software company building AI agents, SaaS platforms, and mobile apps.",
    images: ["/social-logo.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
