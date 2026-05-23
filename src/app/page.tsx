import { Metadata } from "next";
import HomeClient from "./HomeClient";
import api from "@/lib/api";

export const metadata: Metadata = {
  title: "Jantra Software | Custom Software & AI Agent Studio",
  description: "Looking for Jantra Software? We are the leading custom software company in Bangladesh building SaaS products, AI agents, and workflow automations.",
};

async function getFeaturedProjects() {
  try {
    const response = await api.get("/work");
    const data = response.data?.data || response.data || [];
    
    if (!Array.isArray(data)) return [];

    return data
      .filter((p: any) => p.published)
      .sort((a: any, b: any) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return (a.order || 0) - (b.order || 0);
      })
      .slice(0, 4); // Keep Home page light
  } catch {
    return [];
  }
}

export default async function Page() {
  const projects = await getFeaturedProjects();
  return <HomeClient initialProjects={projects} />;
}
