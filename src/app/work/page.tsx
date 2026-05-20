import { Metadata } from "next";
import WorkClient from "./WorkClient";
import { getWorkProjects } from "@/lib/work-data";

export const metadata: Metadata = {
  title: "Our Work",
  description: "Browse Jantra's portfolio of custom software, enterprise AI agents, and high-end web applications shipped for industry leaders.",
};

async function getInitialProjects() {
  return getWorkProjects();
}

export default async function Page() {
  const initialProjects = await getInitialProjects();
  return <WorkClient initialProjects={initialProjects} />;
}
