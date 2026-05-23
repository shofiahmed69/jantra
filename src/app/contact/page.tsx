import { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Start a Project | Contact Us",
  description: "Ready to build something extraordinary? Contact Jantra Software for custom software development, AI agent consultation, and workflow automation.",
};

export default function Page() {
  return <ContactClient />;
}
