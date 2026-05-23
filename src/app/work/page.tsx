import { Metadata } from "next";
import WorkClient from "./WorkClient";
import { getWorkProjects } from "@/lib/work-data";

export const metadata: Metadata = {
  title: "Case Studies & Work Registry",
  description: "Browse Jantra Software's portfolio of custom software, enterprise AI agents, and high-end web applications shipped for industry leaders.",
};

async function getInitialProjects() {
  return getWorkProjects();
}

export default async function Page() {
  const initialProjects = await getInitialProjects();
  return <WorkClient initialProjects={initialProjects} />;
}
