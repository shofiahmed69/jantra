import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import ClientLayout from '@/components/ClientLayout'
import BackgroundOrbs from "@/components/BackgroundOrbs";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jantrasoft.online";
const siteTitle = "JANTRA Software | #1 Custom Software & AI Company in Bangladesh";
const siteDescription =
  "JANTRA Software is Bangladesh's leading custom software development company. We build SaaS platforms, AI agents, mobile apps, and workflow automation systems. Trusted by businesses in Dhaka and worldwide.";

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
    canonical: siteUrl,
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
    "JANTRA",
    "JANTRA Software Bangladesh",
    "Jantra Software Dhaka",
    "best software company in Bangladesh",
    "best software company in Dhaka",
    "custom software development Bangladesh",
    "software company Bangladesh",
    "IT company Dhaka",
    "software development company Dhaka",
    "SaaS development company Bangladesh",
    "SaaS product development",
    "AI agent development Bangladesh",
    "AI software company Bangladesh",
    "workflow automation Bangladesh",
    "web app development Bangladesh",
    "mobile app development Bangladesh",
    "iOS app development Bangladesh",
    "Android app development Bangladesh",
    "React Next.js development Bangladesh",
    "Node.js backend development",
    "custom web application Bangladesh",
    "enterprise software Bangladesh",
    "startup software development",
    "software outsourcing Bangladesh",
    "affordable software development",
  ],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/icon.png",
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
    locale: "en_US",
    images: [
      {
        url: "/social-logo.png",
        width: 1200,
        height: 630,
        alt: "JANTRA Software — Custom Software & AI Company in Bangladesh",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/social-logo.png"],
    creator: "@JantraSoftware",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Jantra Software",
    alternateName: "JANTRA",
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/logo.png`,
      width: 200,
      height: 60
    },
    image: `${siteUrl}/social-logo.png`,
    description: siteDescription,
    foundingDate: "2024",
    numberOfEmployees: { "@type": "QuantitativeValue", value: 10 },
    sameAs: [
      "https://www.linkedin.com/company/112998098",
      "https://www.facebook.com/profile.php?id=61578641909784"
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: "contact@jantrasoft.online",
        availableLanguage: ["English", "Bengali"]
      },
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "contact@jantrasoft.online"
      }
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dhaka",
      addressCountry: "BD",
      addressRegion: "Dhaka Division"
    },
    areaServed: [
      { "@type": "Country", name: "Bangladesh" },
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "United Kingdom" },
      { "@type": "Country", name: "Canada" },
      { "@type": "Country", name: "Australia" }
    ],
    knowsAbout: [
      "Custom Software Development",
      "SaaS Product Development",
      "AI Agent Development",
      "Workflow Automation",
      "Mobile App Development",
      "Web Application Development"
    ]
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "SoftwareApplication"],
    name: "Jantra Software",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    image: `${siteUrl}/social-logo.png`,
    description: siteDescription,
    priceRange: "$$",
    currenciesAccepted: "USD, BDT",
    paymentAccepted: "Credit Card, Bank Transfer",
    areaServed: ["Bangladesh", "United States", "United Kingdom", "Worldwide"],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dhaka",
      addressCountry: "BD"
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Software Development Services",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Custom Software Development" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "SaaS Product Development" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI Agent Development" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Workflow Automation" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Mobile App Development" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "UI/UX Design" } }
      ]
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Jantra Software",
    alternateName: "JANTRA",
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
