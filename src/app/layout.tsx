import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import ClientLayout from '@/components/ClientLayout'
import BackgroundOrbs from "@/components/BackgroundOrbs";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jantrasoft.online";
const siteTitle = "JANTRA | Custom Software & AI Agent Studio";
const siteDescription =
  "Jantra builds high-performance custom software, modern websites, AI agents, and mobile apps for visionary companies worldwide.";

const bodyFont = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const headingFont = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s | JANTRA",
  },
  description: siteDescription,
  keywords: ["Software Development", "AI Agents", "Next.js Development", "SaaS Engineering", "Custom Websites", "Jantra"],
  icons: {
    icon: "/favicon.svg",
  },
  verification: {
    google: "72KPVrUPshP-PwkFkBl-_Ot5wohhpK7AIy78BzyNCqU",
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    type: "website",
    siteName: "JANTRA",
    url: siteUrl,
    images: [
      {
        url: "/social-preview.png",
        width: 1200,
        height: 630,
        alt: "JANTRA logo and brand preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/social-preview.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${headingFont.variable}`}>
      <body className="bg-slate-50 antialiased text-slate-900 selection:bg-orange-200">
        <BackgroundOrbs />
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
