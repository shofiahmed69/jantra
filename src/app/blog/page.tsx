import { Metadata } from "next";
import api from "@/lib/api";
import BlogClient from "./BlogClient";
import { blogPosts as staticPosts } from "@/data/blogPosts";

interface BlogPost {
    id: string;
    title: string;
    category: string;
    image: string;
    slug: string;
    excerpt: string;
    createdAt: string;
}

export const metadata: Metadata = {
  title: "Studio Insights & Engineering Blog",
  description: "Insights on software engineering, AI agents, workflow automation, and SaaS product strategy from the Jantra Software team.",
};

async function getInitialPosts(): Promise<BlogPost[]> {
    try {
        const response = await api.get("/blog");
        const apiData = response.data?.data || response.data || [];

        if (Array.isArray(apiData) && apiData.length > 0) {
            return apiData.map((ap: any) => {
                const local = staticPosts.find((sp) => sp.slug === ap.slug);
                return { ...local, ...ap, image: ap.heroImage || ap.image || "" };
            }) as BlogPost[];
        }

        return staticPosts as unknown as BlogPost[];
    } catch {
        return staticPosts as unknown as BlogPost[];
    }
}

export default async function Page() {
    const initialPosts = await getInitialPosts();
    return <BlogClient initialPosts={initialPosts} />;
}
