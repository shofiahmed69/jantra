import { Metadata } from "next";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
  title: "Our Expertise",
  description: "Explore Jantra's technical expertise in Custom Software, AI Automation, SaaS Infrastructure, and high-performance Web Interfaces.",
};

export default function Page() {
  return <ServicesClient />;
}
