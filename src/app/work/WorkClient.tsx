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
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeftIndicator, setShowLeftIndicator] = useState(false);
    const [showRightIndicator, setShowRightIndicator] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (!scrollRef.current) return;
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeftIndicator(scrollLeft > 5);
            setShowRightIndicator(scrollLeft < scrollWidth - clientWidth - 5);
        };

        const el = scrollRef.current;
        if (el) {
            el.addEventListener("scroll", handleScroll);
            handleScroll();
            // Fallback for rendering delays
            const t = setTimeout(handleScroll, 300);
            window.addEventListener("resize", handleScroll);
            return () => {
                el.removeEventListener("scroll", handleScroll);
                window.removeEventListener("resize", handleScroll);
                clearTimeout(t);
            };
        }
    }, [projects]);

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
        <main className="w-full min-h-screen bg-[#fcfaf8] pb-20 selection:bg-orange-100 relative overflow-x-hidden">
            {/* Ambient background glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-orange-500/[0.02] blur-[150px] rounded-full -z-20 pointer-events-none" />
            <div className="absolute top-[35%] right-[-10%] w-[600px] h-[600px] bg-amber-500/[0.015] blur-[140px] rounded-full -z-20 pointer-events-none" />

            {/* Clean minimal background grid */}
            <div className="absolute top-0 inset-x-0 h-[700px] overflow-hidden pointer-events-none select-none -z-10 opacity-[0.02] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,#000_80%,transparent_100%)]">
                <div className="w-full h-full bg-[linear-gradient(to_right,#ea580c_1px,transparent_1px),linear-gradient(to_bottom,#ea580c_1px,transparent_1px)] bg-[size:4rem_4rem]" />
            </div>

            <div className="max-w-[1240px] mx-auto px-5 sm:px-8 pt-28 sm:pt-36">
                
                {/* ── HEADER ── */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16 text-left border-b border-slate-200/50 pb-8 relative z-10">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-2.5 mb-2.5">
                            <div className="w-4 h-[1.5px] bg-orange-500 rounded-full" />
                            <span className="text-orange-600 font-bold tracking-widest text-[9px] uppercase font-mono">Case Registry</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tighter uppercase mb-3">
                            Selected Work<span className="text-orange-500">.</span>
                        </h1>
                        <p className="text-slate-500 text-xs sm:text-sm font-semibold uppercase tracking-wider">Archive of real-world custom digital deployments.</p>
                    </div>

                    <div className="relative max-w-full lg:max-w-none">
                        {/* Scroll indicator overlay left */}
                        <div 
                            className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#fcfaf8] to-transparent pointer-events-none transition-opacity duration-300 z-20"
                            style={{ opacity: showLeftIndicator ? 1 : 0 }}
                        />
                        {/* Scroll indicator overlay right */}
                        <div 
                            className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#fcfaf8] to-transparent pointer-events-none transition-opacity duration-300 z-20"
                            style={{ opacity: showRightIndicator ? 1 : 0 }}
                        />
                        <div 
                            ref={scrollRef}
                            className="flex lg:flex-wrap gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none max-w-full"
                        >
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setFilter(cat)}
                                    className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all duration-300 ${
                                        filter === cat 
                                        ? "bg-slate-950 text-white border-transparent shadow-md shadow-slate-950/15" 
                                        : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:text-slate-950 hover:border-slate-300"
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── GRID ── */}
                {loading ? (
                    <div className="py-20 text-center flex flex-col items-center gap-6 relative z-10">
                        <LoaderIcon className="w-6 h-6 animate-spin text-orange-500" />
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Accessing Registry...</p>
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <div className="py-20 text-center bg-white rounded-2xl border border-slate-200/80 relative z-10">
                         <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No active deployments found in the registry.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                        {filteredProjects.map((project, i) => {
                            const thumbUrl = getThumbnailUrl(project);
                            const category = Array.isArray(project.category) ? project.category[0] : project.category;
                            
                            const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              const x = e.clientX - rect.left;
                              const y = e.clientY - rect.top;
                              e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
                              e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
                            };

                            return (
                                <motion.article 
                                    key={project.id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: i * 0.05, ease: "easeOut" }}
                                    onMouseMove={handleMouseMove}
                                    style={{
                                      "--spotlight-color": "rgba(249, 115, 22, 0.12)"
                                    } as React.CSSProperties}
                                    className="group relative flex flex-col justify-between cursor-pointer"
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
                                    {/* 1. Background offset card layer (Dual layer styling) */}
                                    <div className="absolute inset-0 rounded-2xl border border-orange-500/25 bg-orange-500/[0.03] translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform duration-500 -z-10" />

                                    {/* 2. Foreground main card layer */}
                                    <div className="w-full h-full rounded-2xl bg-white border border-slate-200/90 p-4 flex flex-col justify-between transition-all duration-500 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:border-slate-400 group-hover:shadow-[0_15px_35px_rgba(0,0,0,0.03)] before:absolute before:inset-0 before:bg-[radial-gradient(130px_circle_at_var(--mouse-x,0px)_var(--mouse-y,0px),var(--spotlight-color),transparent)] before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-300 before:pointer-events-none before:z-0 overflow-hidden relative">
                                        
                                        <div className="flex flex-col text-left relative z-10">
                                            {/* Image Box - floats directly inside the foreground card */}
                                            <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-950 mb-4 transition-all duration-500">
                                                {thumbUrl ? (
                                                    <>
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
                                                    <span className="px-2.5 py-1 rounded bg-slate-950/90 text-[7.5px] font-black uppercase tracking-widest text-white shadow-sm border border-white/10 font-mono">
                                                        {category}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Details */}
                                            <div className="space-y-1.5 px-0.5">
                                                <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-orange-600 font-mono">
                                                    <span>Deployment #{i + 1}</span>
                                                </div>
                                                <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase leading-snug group-hover:text-orange-600 transition-colors duration-200">
                                                    {project.title}
                                                </h3>
                                                {project.description && (
                                                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mt-0.5">
                                                        {project.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action link & Tags */}
                                        <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between px-0.5 z-10">
                                            <span className="inline-flex items-center gap-1 text-[8.5px] font-black text-slate-950 uppercase tracking-widest group-hover:text-orange-600 transition-colors duration-200">
                                                Explore Study <ArrowIcon className="w-3 h-3 text-orange-600 group-hover:translate-x-0.5 transition-transform" />
                                            </span>
                                            
                                            {project.tags && project.tags.length > 0 && (
                                                <div className="font-mono text-[8px] font-extrabold uppercase text-slate-400">
                                                    {project.tags.slice(0, 2).join(" / ")}
                                                </div>
                                            )}
                                        </div>
                                        
                                        <Link href={`/work/${project.slug}`} className="absolute inset-0 z-20" />
                                    </div>
                                </motion.article>
                            );
                        })}
                    </div>
                )}

                {/* ── FOOTER CTA ── */}
                <div className="mt-20 relative group">
                     {/* Dynamic glowing backdrop offset */}
                     <div className="absolute inset-0 rounded-2xl border border-orange-500/25 bg-orange-500/[0.04] translate-x-2.5 translate-y-2.5 group-hover:translate-x-3.5 group-hover:translate-y-3.5 transition-transform duration-500 z-0" />

                     <div className="relative z-10 p-8 sm:p-12 rounded-2xl bg-white border border-slate-200 shadow-[0_12px_40px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-6 overflow-hidden transition-all duration-500 hover:border-orange-500/40 hover:shadow-[0_20px_50px_rgba(255,69,0,0.08)]">
                          {/* Inner light orange ambient glow */}
                          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/[0.01] via-transparent to-orange-500/[0.01] pointer-events-none" />
                          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-orange-600/[0.02] blur-3xl rounded-full pointer-events-none" />
                          
                          <div className="flex items-center gap-4 relative z-10 text-left">
                               <div className="relative shrink-0 w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping absolute" />
                                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                               </div>
                               <div className="space-y-0.5">
                                    <p className="text-[7.5px] font-black uppercase tracking-widest text-slate-400 font-mono">Join Registry</p>
                                    <h2 className="text-xl sm:text-2xl font-black tracking-tight uppercase text-slate-900 leading-none">Genius Profile?</h2>
                                    <p className="text-[9.5px] text-slate-500 font-medium normal-case">Deploy your CV to our open archive.</p>
                               </div>
                          </div>
                          <Link href="/contact" className="px-6 py-3.5 rounded-xl bg-slate-950 text-white text-[8.5px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 hover:bg-orange-600 transition-all shadow-md active:scale-95 relative z-10 shrink-0">
                             Start Registry <ArrowIcon className="w-3.5 h-3.5" />
                          </Link>
                     </div>
                </div>
            </div>

            <style jsx global>{`
                .scrollbar-none::-webkit-scrollbar { display: none; }
                .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </main>
    );
}
