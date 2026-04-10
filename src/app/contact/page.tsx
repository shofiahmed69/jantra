import { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Get in Touch",
  description: "Ready to build something extraordinary? Contact Jantra for elite software development, AI agent consultation, and technical strategy.",
};

export default function Page() {
  return <ContactClient />;
}
