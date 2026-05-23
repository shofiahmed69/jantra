import type { Metadata } from "next";
import "./globals.css";
import { AuthGate } from "@/components/layout/auth-gate";

export const metadata: Metadata = {
  title: "Jantra Pharmacy Management",
  description: "Local pharmacy management system",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthGate>{children}</AuthGate>
      </body>
    </html>
  );
}
