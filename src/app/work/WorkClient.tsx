"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight as ArrowIcon, Loader2 as LoaderIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { PREFETCH_TTL_MS, prefetchStore } from "@/lib/prefetchStore";

interface Project {
    id: string;
    title: string;
    category: string[] | string;
    description: string;
    thumbnail?: string;
    slug: string;
    tags?: string[];
}

const CATEGORIES = ["All", "Web Design", "Web App", "Mobile App", "AI & ML", "Automation", "SaaS"];

interface WorkClientProps {
    initialProjects: Project[];
}

export default function WorkPage({ initialProjects }: WorkClientProps) {
    const [projects] = useState<Project[]>(initialProjects);
    const [loading] = useState(false);
    const [filter, setFilter] = useState("All");
    const router = useRouter();
    const prefetchedSlugsRef = useRef<Set<string>>(new Set());
    const cardRefs = useRef<Map<string, HTMLElement>>(new Map());

    const categoryMatches = (category: Project["category"], selectedFilter: string) => {
        if (Array.isArray(category)) {
            return category.some((cat) => cat.toLowerCase().includes(selectedFilter.toLowerCase()));
        }
        if (typeof category === "string") {
            return category.toLowerCase().includes(selectedFilter.toLowerCase());
        }
        return false;
    };

    const filteredProjects = filter === "All"
        ? projects
        : projects.filter((p) => categoryMatches(p.category, filter));
    const sortedForPrefetch = useMemo(() => filteredProjects.slice(0, 4), [filteredProjects]);

    const prefetchProject = (project: Project) => {
        if (!project?.slug) return;
        if (prefetchedSlugsRef.current.has(project.slug)) return;

        const key = `work:${project.slug}`;
        if (!prefetchStore.fresh(key, PREFETCH_TTL_MS)) {
            prefetchStore.set(key, project);
        }
        prefetchStore.set("work:list", projects);
        prefetchedSlugsRef.current.add(project.slug);
        router.prefetch(`/work/${project.slug}`);
    };

    useEffect(() => {
        for (const project of sortedForPrefetch) {
            prefetchProject(project);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortedForPrefetch]);

    useEffect(() => {
        if (filteredProjects.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (!entry.isIntersecting) continue;
                    const slug = entry.target.getAttribute("data-project-slug");
                    if (!slug) continue;
                    const project = filteredProjects.find((p) => p.slug === slug);
                    if (!project) continue;
                    prefetchProject(project);
                    observer.unobserve(entry.target);
                }
            },
            { rootMargin: "250px 0px", threshold: 0.1 }
        );

        for (const project of filteredProjects) {
            const element = cardRefs.current.get(project.slug);
            if (element) observer.observe(element);
        }

        return () => observer.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filteredProjects]);

    const getThumbnailUrl = (p: Project) => {
        if (!p.thumbnail) return null;
        if (p.thumbnail.startsWith('http')) return p.thumbnail;
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4005').replace(/\/api$/, '');
        const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        const cleanPath = p.thumbnail.startsWith('/') ? p.thumbnail : `/${p.thumbnail}`;
        return `${cleanBase}${cleanPath}`;
    };

    return (
        <main className="w-full min-h-screen bg-slate-50/50 pb-20">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-8 pt-28 sm:pt-36">
                
                {/* ── HEADER ── */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 text-left border-b border-slate-100 pb-8">
                    <div className="max-w-2xl">
                        <span className="text-orange-600 font-bold tracking-widest text-[10px] uppercase mb-2 block">Case Registry</span>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight uppercase mb-3">
                            Selected Engineering<span className="text-orange-500">.</span>
                        </h1>
                        <p className="text-slate-500 text-sm font-medium tracking-tight">Archive of real-world industrial deployments.</p>
                    </div>

                    <div className="flex lg:flex-wrap gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`whitespace-nowrap px-5 py-2 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all duration-300 ${
                                    filter === cat 
                                    ? "bg-slate-950 text-white shadow-md shadow-slate-950/10" 
                                    : "bg-white text-slate-500 border border-slate-200/80 hover:bg-slate-50 hover:text-slate-950 hover:border-slate-300"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── GRID ── */}
                {loading ? (
                    <div className="py-20 text-center flex flex-col items-center gap-6">
                        <LoaderIcon className="w-8 h-8 animate-spin text-orange-500" />
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Accessing Real Registry...</p>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="py-20 text-center bg-white rounded-3xl border border-slate-100">
                         <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No active deployments found in the cloud registry.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {filteredProjects.map((project, i) => {
                            const thumbUrl = getThumbnailUrl(project);
                            return (
                                <motion.article 
                                    key={project.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="group flex flex-col bg-white border border-slate-100 rounded-2xl p-4 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-900/5 transition-all duration-500 h-full"
                                    onMouseEnter={() => prefetchProject(project)}
                                    onTouchStart={() => prefetchProject(project)}
                                    data-project-slug={project.slug}
                                    ref={(node) => {
                                        if (!node) {
                                            cardRefs.current.delete(project.slug);
                                            return;
                                        }
                                        cardRefs.current.set(project.slug, node);
                                    }}
                                >
                                    <Link href={`/work/${project.slug}`} prefetch className="flex flex-col h-full">
                                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-900 mb-5 group-hover:shadow-md transition-all duration-500">
                                        {thumbUrl ? (
                                            <Image
                                                src={thumbUrl}
                                                alt={project.title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                priority={i < 6}
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white/5 font-black text-5xl uppercase">Jantra</div>
                                        )}
                                        <div className="absolute top-4 left-4">
                                             <span className="px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[8px] font-extrabold uppercase tracking-widest text-slate-950 shadow-sm border border-white/50">
                                                 {Array.isArray(project.category) ? project.category[0] : project.category}
                                             </span>
                                        </div>
                                    </div>

                                    <div className="space-y-3 flex-1 flex flex-col justify-between">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-[1px] bg-slate-200" />
                                                <span className="text-[9px] font-bold text-orange-600 uppercase tracking-widest">Case Study #{i + 1}</span>
                                            </div>
                                            <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight uppercase leading-tight group-hover:text-orange-600 transition-colors">{project.title}</h3>
                                            <p className="text-slate-500 text-xs font-normal leading-relaxed line-clamp-3 normal-case tracking-normal">{project.description}</p>
                                        </div>
                                        
                                        <div className="pt-4 border-t border-slate-50">
                                            <span className="inline-flex items-center gap-2 text-[9px] font-bold text-slate-950 uppercase tracking-widest group-hover:text-orange-600 transition-colors">
                                                Investigate <ArrowIcon className="w-3.5 h-3.5 text-orange-600 group-hover:translate-x-1 transition-transform" />
                                            </span>
                                        </div>
                                    </div>
                                    </Link>
                                </motion.article>
                            );
                        })}
                    </div>
                )}

                {/* ── FOOTER CTA ── */}
                <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-slate-950 text-white flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                     <div className="space-y-2">
                          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase">Genius Profile?</h2>
                          <p className="text-white/80 text-xs sm:text-sm font-medium tracking-tight uppercase">Deploy your CV to our open archive.</p>
                     </div>
                     <Link href="/contact" className="px-8 py-4 rounded-xl bg-white text-slate-950 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-orange-600 hover:text-white transition-all shadow-md active:scale-95">
                        Start Registry <ArrowIcon className="w-4 h-4" />
                     </Link>
                </div>
            </div>

            <style jsx global>{`
                .scrollbar-none::-webkit-scrollbar { display: none; }
                .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </main>
    );
}
