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
                            const category = Array.isArray(project.category) ? project.category[0] : project.category;
                            return (
                                <motion.article 
                                    key={project.id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ type: "spring", stiffness: 95, damping: 14, delay: i * 0.04 }}
                                    className="group flex flex-col bg-white border border-slate-100 hover:border-slate-200/80 rounded-2xl p-3 hover:shadow-[0_15px_45px_rgba(249,115,22,0.03)] active:scale-[0.995] transition-all duration-500 h-full"
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
                                    <Link href={`/work/${project.slug}`} prefetch className="flex flex-col h-full justify-between">
                                        <div>
                                            {/* Compact 16:9 Image Box with ambient orange glow */}
                                            <div className="relative mb-3.5">
                                                <div className="absolute inset-0 bg-gradient-to-tr from-orange-600 to-orange-400 blur-md opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-xl -z-10" />
                                                <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-950 transition-all duration-500">
                                                    {thumbUrl ? (
                                                        <>
                                                            {/* Blurred backdrop background */}
                                                            <Image
                                                                src={thumbUrl}
                                                                alt=""
                                                                fill
                                                                aria-hidden="true"
                                                                className="object-cover blur-md opacity-25 scale-105 select-none pointer-events-none"
                                                            />
                                                            <Image
                                                                src={thumbUrl}
                                                                alt={project.title}
                                                                fill
                                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                                priority={i < 6}
                                                                className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.02] z-10"
                                                            />
                                                        </>
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-white/5 font-black text-4xl uppercase bg-slate-900">Jantra</div>
                                                    )}
                                                    {/* Floating Category Tag */}
                                                    <div className="absolute top-2.5 left-2.5 z-20">
                                                        <span className="px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-md text-[7.5px] font-black uppercase tracking-widest text-slate-950 shadow-sm border border-slate-200/10">
                                                            {category}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Details */}
                                            <div className="space-y-1.5 px-1">
                                                <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-orange-600">
                                                    <span>Case Study #{i + 1}</span>
                                                </div>
                                                <h3 className="text-sm font-bold text-slate-900 tracking-tight uppercase leading-snug group-hover:text-orange-600 transition-colors duration-200">
                                                    {project.title}
                                                </h3>
                                                {project.description && (
                                                    <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2 mt-0.5 normal-case tracking-normal">
                                                        {project.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action link */}
                                        <div className="pt-3 mt-3.5 border-t border-slate-100/80 flex items-center justify-between px-1">
                                            <span className="inline-flex items-center gap-1 text-[8.5px] font-black text-slate-950 uppercase tracking-widest group-hover:text-orange-600 transition-colors duration-200">
                                                Investigate <ArrowIcon className="w-3 h-3 text-orange-600 group-hover:translate-x-0.5 transition-transform" />
                                            </span>
                                        </div>
                                    </Link>
                                </motion.article>
                            );
                        })}
                    </div>
                )}

                {/* ── FOOTER CTA ── */}
                <div className="mt-20 p-6 sm:p-8 rounded-2xl bg-slate-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.06)] w-full">
                     {/* Ambient glass glow */}
                     <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-orange-500/10 pointer-events-none" />
                     <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-orange-600/10 blur-3xl rounded-full pointer-events-none" />
                     
                     <div className="flex items-center gap-4 relative z-10 text-left">
                          <div className="relative shrink-0 w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                               <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping absolute" />
                               <span className="w-2 h-2 rounded-full bg-orange-500" />
                          </div>
                          <div className="space-y-0.5">
                               <p className="text-[7.5px] font-black uppercase tracking-widest text-slate-400">Join Registry</p>
                               <h2 className="text-xl sm:text-2xl font-black tracking-tight uppercase text-white leading-none">Genius Profile?</h2>
                               <p className="text-[9.5px] text-slate-400 font-medium">Deploy your CV to our open archive.</p>
                          </div>
                     </div>
                     <Link href="/contact" className="px-6 py-3.5 rounded-xl bg-white text-slate-950 text-[8.5px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 hover:bg-orange-600 hover:text-white transition-all shadow-sm hover:shadow-[0_10px_25px_rgba(249,115,22,0.2)] active:scale-95 relative z-10 shrink-0">
                        Start Registry <ArrowIcon className="w-3.5 h-3.5" />
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
