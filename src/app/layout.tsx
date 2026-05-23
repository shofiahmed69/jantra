import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import ClientLayout from '@/components/ClientLayout'
import BackgroundOrbs from "@/components/BackgroundOrbs";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jantrasoft.online";
const siteTitle = "JANTRA Software | Best Software Company in Bangladesh";
const siteDescription =
  "Jantra Software is the leading custom software company in Bangladesh building SaaS products, AI agents, and workflow automations. We design, build, and launch reliable software.";

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
    template: "%s | JANTRA Software",
  },
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  keywords: [
    "Jantra Software",
    "JANTRA Software Bangladesh",
    "Jantra Software Dhaka",
    "SaaS development company",
    "AI agent development",
    "workflow automation services",
    "custom software development",
    "best software company in Bangladesh",
    "best software company in dhaka",
    "web app development",
    "mobile app development",
    "software company Bangladesh",
    "JANTRA"
  ],
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
    siteName: "JANTRA Software",
    url: siteUrl,
    images: [
      {
        url: "/social-logo.png",
        width: 1200,
        height: 630,
        alt: "JANTRA Software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/social-logo.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Jantra Software",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    sameAs: [
      "https://www.linkedin.com/company/112998098",
      "https://www.facebook.com/profile.php?id=61578641909784"
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: "contact@jantrasoft.online"
      }
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dhaka",
      addressCountry: "BD"
    }
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareCompany",
    name: "Jantra Software",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    image: `${siteUrl}/social-logo.png`,
    description: siteDescription,
    areaServed: ["Bangladesh", "Worldwide"],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dhaka",
      addressCountry: "BD"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Jantra Software",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/blog?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="en" className={`${bodyFont.variable} ${headingFont.variable}`}>
      <head>
        <link rel="preconnect" href="https://jontro-backend.onrender.com" />
        <link rel="dns-prefetch" href="https://jontro-backend.onrender.com" />
        <link rel="preconnect" href="https://jantrasoft.online" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="bg-slate-50 antialiased text-slate-900 selection:bg-orange-200">
        <BackgroundOrbs />
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
