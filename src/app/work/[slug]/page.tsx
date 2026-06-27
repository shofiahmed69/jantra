import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ChevronRight, BarChart, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { getWorkProjects } from "@/lib/work-data";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const allProjects = await getWorkProjects();
    const project = allProjects.find((p) => p.slug === slug) || null;

    if (!project) {
        return {
            title: "Our Work",
            description: "Portfolio of software products, SaaS platforms, AI agents, and automation systems built by JANTRA.",
        };
    }

    const title = `${project.title} | JANTRA Work`;
    const description = project.description || "Case study from JANTRA's software and AI delivery portfolio.";
    const url = `https://jantrasoft.online/work/${slug}`;

    return {
        title,
        description,
        alternates: { canonical: url },
        openGraph: {
            title,
            description,
            url,
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}

import WorkDetailClient from "./WorkDetailClient";

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const allProjects = await getWorkProjects();
    const project = allProjects.find((p) => p.slug === slug) || null;

    if (!project) {
        return notFound();
    }

    const getThumbnailUrl = (thumbnail?: string) => {
        if (!thumbnail) return "";
        if (thumbnail.startsWith("http")) return thumbnail;
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "https://jontro-backend.onrender.com/api").replace(/\/api$/, "");
        const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
        const cleanPath = thumbnail.startsWith("/") ? thumbnail : `/${thumbnail}`;
        return `${cleanBase}${cleanPath}`;
    };

    const currentIndex = allProjects.findIndex(p => p.slug === slug);
    const hasNext = currentIndex !== -1 && currentIndex < allProjects.length - 1;
    const nextProject = hasNext ? allProjects[currentIndex + 1] : null;

    return (
        <WorkDetailClient
            project={project}
            nextProject={nextProject}
            hasNext={hasNext}
        />
    );
}
