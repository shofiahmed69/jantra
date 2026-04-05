import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import ClientLayout from '@/components/ClientLayout'
import BackgroundOrbs from "@/components/BackgroundOrbs";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jantra.vercel.app";
const siteTitle = "JANTRA | Custom Software, Websites, AI Agents, and Mobile Apps";
const siteDescription =
  "Jantra builds customized software, websites, AI workflow agents, mobile apps, and tailored business systems for growing companies.";

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
  title: siteTitle,
  description: siteDescription,
  icons: {
    icon: "/favicon.svg",
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
