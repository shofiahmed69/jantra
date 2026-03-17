import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import BackgroundOrbs from "@/components/BackgroundOrbs";

const bodyFont = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const headingFont = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JANTRA - Enterprise Software, Reimagined",
  description: "Experience the next generation of spatial computing for business. Modular, intuitive, and designed for the visionaries of tomorrow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${headingFont.variable}`}>
      <body className="bg-slate-50 antialiased text-slate-900 selection:bg-orange-200">
        <BackgroundOrbs />
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
