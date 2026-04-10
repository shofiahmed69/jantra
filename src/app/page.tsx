import { Metadata } from "next";
import HomeClient from "./HomeClient";
import api from "@/lib/api";

export const metadata: Metadata = {
  title: "JANTRA | Custom Software & AI Agent Studio",
  description: "Jantra builds high-performance custom software, modern websites, AI agents, and mobile apps for visionary companies worldwide.",
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
  } catch (error) {
    console.error("Failed to fetch featured projects server-side:", error);
    return [];
  }
}

export default async function Page() {
  const projects = await getFeaturedProjects();
  return <HomeClient initialProjects={projects} />;
}
