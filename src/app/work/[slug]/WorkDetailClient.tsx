'use client'

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ChevronRight, BarChart, ExternalLink, Play } from "lucide-react";
import { motion } from "framer-motion";

type Project = {
    title: string;
    slug: string;
    description?: string;
    category?: string | string[];
    liveUrl?: string;
    duration?: string;
    thumbnail?: string;
    challenge?: string;
    approach?: string;
    features?: string[];
    techStack?: string[];
    results?: string;
};

export default function WorkDetailClient({
    project,
    nextProject,
    hasNext
}: {
    project: Project;
    nextProject: Project | null;
    hasNext: boolean;
}) {
    // Client-side thumbnail URL resolver
    const getThumbnailUrl = (thumbnail?: string) => {
        if (!thumbnail) return "";
        let url = thumbnail;
        if (!url.startsWith("http")) {
            const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "https://jontro-backend.onrender.com/api").replace(/\/api$/, "");
            const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
            const cleanPath = url.startsWith("/") ? url : `/${url}`;
            url = `${cleanBase}${cleanPath}`;
        }
        if (url.startsWith("http://144.79.249.162:9000") || url.includes(":9000/")) {
            return `/api/image-proxy?url=${encodeURIComponent(url)}`;
        }
        return url;
    };

    // Mouse hover coordinates for container tracking (spotlight effect)
    const [coords, setCoords] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setCoords({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    return (
        <main 
            className="relative w-full min-h-screen bg-white pb-24 overflow-x-hidden selection:bg-orange-100"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                "--mouse-x": `${coords.x}px`,
                "--mouse-y": `${coords.y}px`,
            } as React.CSSProperties}
        >
            {/* Dynamic mouse-tracking spotlight radial gradient */}
            {isHovered && (
                <div 
                    className="absolute inset-0 pointer-events-none -z-10 transition-opacity duration-500 opacity-25"
                    style={{
                        background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), oklch(0.85 0.15 45 / 0.12), transparent 80%)`
                    }}
                />
            )}

            {/* Dynamic ambient background glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-orange-200/10 blur-[130px] rounded-full -z-20 pointer-events-none" />
            <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-blue-100/5 blur-[120px] rounded-full -z-20 pointer-events-none" />

            {/* Grid pattern background */}
            <div className="absolute top-0 inset-x-0 h-[600px] overflow-hidden pointer-events-none select-none -z-10 opacity-[0.015] md:opacity-[0.02]">
                <div className="w-full h-full bg-[linear-gradient(to_right,#ea580c_1px,transparent_1px),linear-gradient(to_bottom,#ea580c_1px,transparent_1px)] bg-[size:4rem_4rem]" />
            </div>

            <div className="max-w-[1140px] mx-auto px-6 sm:px-8 pt-24 sm:pt-36">
                
                {/* ── BREADCRUMB ── */}
                <Link href="/work" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-orange-600 transition-colors mb-12">
                     <ArrowLeft className="w-3.5 h-3.5" /> Back to Projects
                </Link>

                {/* ── HERO ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:items-start mb-16 text-left">
                    <div className="lg:col-span-8 space-y-5">
                        <div className="flex items-center gap-3">
                            <span className="text-[9px] font-black uppercase tracking-widest text-orange-600 bg-orange-50 px-4 py-2 rounded-full border border-orange-100">
                                {Array.isArray(project.category) ? project.category[0] : project.category || "Project"}
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-4 flex-wrap pt-1">
                            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none uppercase">
                                {project.title}
                            </h1>
                            {project.liveUrl && (
                                <Link 
                                    href={project.liveUrl} 
                                    target="_blank" 
                                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-slate-950 text-white font-black text-[9px] uppercase tracking-widest transition-all shadow-md hover:shadow active:scale-95 shrink-0"
                                >
                                    Live Demo <ExternalLink className="w-3.5 h-3.5 text-white" />
                                </Link>
                            )}
                        </div>
                        
                        <p className="text-slate-500 text-sm sm:text-base font-medium leading-relaxed max-w-3xl border-l-2 border-orange-500 pl-4 mt-2">
                            {project.description}
                        </p>
                    </div>
                    <div className="lg:col-span-4 lg:text-right pt-2 lg:pt-8 shrink-0">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Duration</span>
                        <p className="text-lg font-black text-slate-900 uppercase tracking-tight">{project.duration || "4 Weeks"}</p>
                    </div>
                </div>

                {/* ── MAIN IMAGE (Dual-Layer Premium Layout) ── */}
                <div className="relative group aspect-[16/9] sm:aspect-[21/9] mb-16 select-none">
                    <div className="absolute inset-0 bg-slate-950 rounded-[2rem] translate-x-3 translate-y-3 transition-transform group-hover:translate-x-1.5 group-hover:translate-y-1.5 duration-300" />
                    <div className="absolute inset-0 rounded-[2rem] overflow-hidden bg-slate-900 border border-slate-200 shadow-xl">
                        {project.thumbnail ? (
                            <img 
                                src={getThumbnailUrl(project.thumbnail)} 
                                alt={project.title} 
                                className="w-full h-full object-cover opacity-100 transition-all duration-700 hover:scale-[1.01]"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/5 font-black text-6xl uppercase tracking-tighter">Jantra Archive</div>
                        )}
                    </div>
                </div>

                {/* ── SPECIFICATIONS GRID ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-left mb-20">
                    
                    {/* LEFT CONTENT */}
                    <div className="lg:col-span-7 space-y-12">
                        
                        <div className="grid sm:grid-cols-2 gap-8">
                             {/* Challenge Card */}
                             <div className="relative group h-full">
                                <div className="absolute inset-0 bg-slate-950 rounded-2xl translate-x-2 translate-y-2 transition-transform group-hover:translate-x-1 group-hover:translate-y-1 duration-300" />
                                <div className="relative p-6 rounded-2xl bg-white border border-slate-200 space-y-2.5 h-full">
                                    <h3 className="text-[10px] font-black text-orange-600 uppercase tracking-widest">The Challenge</h3>
                                    <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">{project.challenge}</p>
                                </div>
                             </div>

                             {/* Solution Card */}
                             <div className="relative group h-full">
                                <div className="absolute inset-0 bg-slate-950 rounded-2xl translate-x-2 translate-y-2 transition-transform group-hover:translate-x-1 group-hover:translate-y-1 duration-300" />
                                <div className="relative p-6 rounded-2xl bg-white border border-slate-200 space-y-2.5 h-full">
                                    <h3 className="text-[10px] font-black text-orange-600 uppercase tracking-widest">The Solution</h3>
                                    <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">{project.approach}</p>
                                </div>
                             </div>
                        </div>

                        {/* Features checklist */}
                        {project.features && project.features.length > 0 && (
                            <div className="relative group w-full">
                                <div className="absolute inset-0 bg-slate-950 rounded-[2rem] translate-x-2.5 translate-y-2.5 transition-transform group-hover:translate-x-1 group-hover:translate-y-1 duration-300" />
                                <div className="relative p-8 rounded-[2rem] bg-white border border-slate-200 space-y-5">
                                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-orange-600" /> Key Features
                                    </h3>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {project.features.map((feat: string, i: number) => (
                                            <div key={i} className="flex items-start gap-2.5 group/item">
                                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0 group-hover/item:scale-125 transition-transform duration-200" />
                                                <span className="text-xs sm:text-sm font-medium text-slate-600 leading-normal">{feat}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT SIDEBAR */}
                    <div className="lg:col-span-5 space-y-8">
                         
                         {/* TECH STACK */}
                         {project.techStack && project.techStack.length > 0 && (
                             <div className="relative group w-full">
                                 <div className="absolute inset-0 bg-slate-950 rounded-[2rem] translate-x-2.5 translate-y-2.5 transition-transform group-hover:translate-x-1 group-hover:translate-y-1 duration-300" />
                                 <div className="relative bg-slate-900 border border-slate-900 p-8 rounded-[2rem] text-white space-y-5">
                                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Technologies Used</h3>
                                     <div className="flex flex-wrap gap-2">
                                         {project.techStack.map((tech: string, i: number) => (
                                             <span key={i} className="px-3.5 py-2 rounded-xl bg-white/10 border border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-200 hover:bg-orange-600 hover:border-orange-500/20 transition-all duration-200 cursor-default">
                                                 {tech}
                                             </span>
                                         ))}
                                     </div>
                                 </div>
                             </div>
                         )}

                         {/* METRIC CARD */}
                         {project.results && (
                             <div className="relative group w-full">
                                 <div className="absolute inset-0 bg-slate-950 rounded-[2rem] translate-x-2.5 translate-y-2.5 transition-transform group-hover:translate-x-1 group-hover:translate-y-1 duration-300" />
                                 <div className="relative p-8 bg-orange-50 border border-orange-200 rounded-[2rem] text-slate-800 space-y-3">
                                     <div className="flex items-center gap-2">
                                        <BarChart className="w-4 h-4 text-orange-600" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">Key Results</span>
                                     </div>
                                     <p className="text-xs sm:text-sm font-bold leading-relaxed text-slate-800 uppercase tracking-wide">
                                         {project.results}
                                     </p>
                                 </div>
                             </div>
                         )}

                         {/* LIVE LINK */}
                         {project.liveUrl && (
                             <div className="relative group w-full">
                                 <div className="absolute inset-0 bg-slate-950 rounded-xl translate-x-1.5 translate-y-1.5 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5 duration-300" />
                                 <Link href={project.liveUrl} target="_blank" className="relative flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-orange-600 text-white border border-orange-500 font-black uppercase tracking-widest text-xs hover:bg-slate-950 hover:border-slate-800 transition-colors shadow active:scale-98">
                                    Visit Live Website <ExternalLink className="w-4 h-4 text-white" />
                                 </Link>
                             </div>
                         )}
                    </div>
                </div>

                {/* ── NEXT PROJECT TRANSITION ── */}
                <div className="pt-12 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
                     <Link href="/work" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-950 transition-colors">
                        View All Projects
                     </Link>

                     {hasNext && nextProject && (
                        <Link href={`/work/${nextProject.slug}`} className="group flex flex-col items-end text-right gap-2 max-w-[280px]">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Next Project</span>
                            <div className="flex items-center gap-4">
                                 <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight group-hover:text-orange-600 transition-all uppercase leading-none">{nextProject.title}</h2>
                                 <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all shrink-0">
                                     <ChevronRight className="w-4 h-4" />
                                 </div>
                            </div>
                        </Link>
                     )}
                </div>
            </div>
        </main>
    );
}
