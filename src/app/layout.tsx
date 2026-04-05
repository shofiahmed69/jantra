import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import ClientLayout from '@/components/ClientLayout'
import BackgroundOrbs from "@/components/BackgroundOrbs";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jantra.soft";
const siteTitle = "JANTRA - Enterprise Software, Reimagined";
const siteDescription =
  "Experience the next generation of spatial computing for business. Modular, intuitive, and designed for the visionaries of tomorrow.";

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
