import { Metadata } from "next";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
  title: "Custom Software & AI Services",
  description: "Explore Jantra Software's technical expertise in Custom Software, AI Agents, Workflow Automation, SaaS Infrastructure, and high-performance Web Apps.",
};

export default function Page() {
  return <ServicesClient />;
}
