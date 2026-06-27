import type { Metadata } from "next";
import Link from "next/link";
import { 
    ArrowLeft, ArrowRight, CheckCircle2, LayoutTemplate, Layers, Cpu, ShieldCheck, Mail,
    Code2, Smartphone, Terminal, Activity, FileJson, Sparkles, Workflow, Zap, Database, Cloud, Palette, ChevronDown
} from "lucide-react";
import LottiePlayer from "@/components/LottiePlayer";
import React from "react";
import { serviceDataMap, ServiceDetail, IconHelper } from "@/data/services";

export const revalidate = 300;

export function generateStaticParams() {
    return Object.keys(serviceDataMap).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const service = serviceDataMap[slug];

    if (!service) {
        return {
            title: "Services",
            description: "Custom software, SaaS, AI agents, and workflow automation services by JANTRA.",
        };
    }

    const title = `${service.title} Service | JANTRA`;
    const description = service.description;
    const url = `https://jantrasoft.online/services/${slug}`;

    return {
        title,
        description,
        alternates: { canonical: url },
        openGraph: {
            title,
            description,
            url,
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}

import ServiceDetailClient from "./ServiceDetailClient";

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const service: ServiceDetail = serviceDataMap[slug] || {
        title: "Expert Engineering",
        category: "Core Service",
        lottie: "/lottie/cloud.json",
        description: "High-performance technical solutions designed for global scale.",
        descBg: "bg-slate-50",
        longDescription: "High-performance technical solutions designed for global scale.",
        deliverables: [
            { title: "Discovery", desc: "Detailed system diagrams & data maps.", icon: "layout" },
            { title: "Building", desc: "Production code with full documentation.", icon: "layers" },
            { title: "Scaling", desc: "Infrastructure pipelines & CI/CD workflows.", icon: "full" }
        ],
        process: [
            { num: "01", title: "Architecture Design", desc: "Mapping business logic into technical schemas." },
            { num: "02", title: "Agile Development", desc: "2-week sprints with constant feedback loops." },
            { num: "03", title: "QA & Security", desc: "Automated testing and rigorous code audits." },
            { num: "04", title: "Deployment", desc: "Smooth go-live with continuous support." }
        ],
        techStack: ["React", "Node.js", "Python", "AWS", "PostgreSQL", "Docker"],
        faqs: [
            { question: "What is your typical project timeline?", answer: "Project timelines vary depending on complexity, but an average initial phase takes between 4 to 8 weeks to design, develop, and launch." }
        ]
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": service.faqs.map((faq) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <ServiceDetailClient service={service} slug={slug} />
        </>
    );
}
