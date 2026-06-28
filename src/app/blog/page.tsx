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
  title: "Blog | Software Engineering & AI Insights | JANTRA Bangladesh",
  description: "Read JANTRA Software's blog for expert insights on custom software development, AI agents, SaaS product strategy, workflow automation, and mobile app development in Bangladesh.",
  alternates: { canonical: "https://jantrasoft.online/blog" },
  keywords: [
    "software development blog Bangladesh",
    "AI development blog",
    "SaaS product blog",
    "workflow automation blog",
    "tech blog Bangladesh",
    "software engineering insights",
    "mobile app development blog",
    "Jantra Software blog",
  ],
  openGraph: {
    title: "Blog | Software Engineering & AI Insights | JANTRA Bangladesh",
    description: "Expert insights on custom software, AI agents, SaaS strategy, and automation from JANTRA Software's engineering team.",
    url: "https://jantrasoft.online/blog",
    type: "website",
    images: [{ url: "/social-logo.png", width: 1200, height: 630, alt: "JANTRA Software Blog" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | JANTRA Software Bangladesh",
    description: "Expert insights on custom software, AI agents, SaaS and automation from JANTRA's engineering team.",
    images: ["/social-logo.png"],
  },
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
