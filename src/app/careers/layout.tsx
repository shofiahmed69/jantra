import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers at JANTRA Software | Software Jobs in Bangladesh",
  description: "Join the JANTRA Software team in Dhaka, Bangladesh. We're hiring software engineers, mobile developers, AI engineers, and UI/UX designers. Apply now for open positions.",
  alternates: { canonical: "https://jantrasoft.online/careers" },
  keywords: [
    "software jobs Bangladesh",
    "software engineer jobs Dhaka",
    "IT jobs Bangladesh",
    "developer jobs Dhaka",
    "AI engineer jobs Bangladesh",
    "mobile developer jobs Bangladesh",
    "tech jobs Bangladesh",
    "Jantra careers",
    "software company jobs Bangladesh",
  ],
  openGraph: {
    title: "Careers at JANTRA Software | Software Jobs in Bangladesh",
    description: "Join JANTRA Software in Dhaka. We're hiring engineers, designers and AI specialists. Work on cutting-edge software products.",
    url: "https://jantrasoft.online/careers",
    type: "website",
    images: [{ url: "/social-logo.png", width: 1200, height: 630, alt: "Careers at JANTRA Software" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers at JANTRA Software | Jobs in Bangladesh",
    description: "Join JANTRA Software. We're hiring software engineers, AI developers and designers in Dhaka, Bangladesh.",
    images: ["/social-logo.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
