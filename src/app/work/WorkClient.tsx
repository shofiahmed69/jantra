"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight as ArrowIcon, Loader2 as LoaderIcon } from "lucide-react";
import { motion } from "framer-motion";
import api from "@/lib/api";

interface Project {
    id: string;
    title: string;
    category: string[];
    description: string;
    thumbnail: string;
    slug: string;
    tags: string[];
}

const CATEGORIES = ["All", "Web Design", "Web App", "Mobile App", "AI & ML", "Automation", "SaaS"];

export default function WorkPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // Correct endpoint is /work as per backend app.js
                const response = await api.get("/work");
                const apiData = response.data?.data || response.data || [];
                setProjects(Array.isArray(apiData) ? apiData : []);
            } catch (error) {
                console.error("Failed to fetch projects from /api/work", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const filteredProjects = filter === "All" 
        ? projects 
        : projects.filter(p => 
            p.category?.some(cat => cat.toLowerCase().includes(filter.toLowerCase())) ||
            (typeof p.category === 'string' && (p.category as string).toLowerCase().includes(filter.toLowerCase()))
        );

    const getThumbnailUrl = (p: Project) => {
        if (!p.thumbnail) return null;
        if (p.thumbnail.startsWith('http')) return p.thumbnail;
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace(/\/api$/, '');
        const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        const cleanPath = p.thumbnail.startsWith('/') ? p.thumbnail : `/${p.thumbnail}`;
        return `${cleanBase}${cleanPath}`;
    };

    return (
        <main className="w-full min-h-screen bg-white pb-32">
            <div className="max-w-[1280px] mx-auto px-6 sm:px-12 pt-28 sm:pt-40">
                
                {/* ── HEADER ── */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20 sm:mb-32 text-left">
                    <div className="max-w-2xl">
                        <span className="text-orange-600 font-bold tracking-widest text-xs uppercase mb-6 block">Case Registry</span>
                        <h1 className="text-5xl sm:text-7xl font-black text-slate-900 leading-[0.9] tracking-tighter uppercase mb-8">
                            Selected <br /> Engineering <span className="text-orange-500">.</span>
                        </h1>
                        <p className="text-slate-500 text-lg font-medium leading-relaxed uppercase tracking-tight">Archive of real-world industrial deployments.</p>
                    </div>

                    <div className="flex lg:flex-wrap gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-none">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`whitespace-nowrap px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                                    filter === cat 
                                    ? "bg-slate-950 text-white shadow-xl" 
                                    : "bg-slate-50 text-slate-400 border border-slate-100 hover:bg-white hover:text-slate-950 hover:border-slate-300"
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
                        <LoaderIcon className="w-10 h-10 animate-spin text-orange-500" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accessing Real Registry...</p>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="py-32 text-center bg-slate-50 rounded-[4rem] border border-slate-100">
                         <p className="text-slate-400 font-black uppercase tracking-widest text-[11px]">No active deployments found in the cloud registry.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20">
                        {filteredProjects.map((project, i) => {
                            const thumbUrl = getThumbnailUrl(project);
                            return (
                                <motion.div 
                                    key={project.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group relative flex flex-col transition-all duration-700 h-full"
                                >
                                    <div className="relative aspect-video rounded-[2.5rem] sm:rounded-[4rem] overflow-hidden bg-slate-900 border border-slate-100 mb-10 group-hover:shadow-2xl transition-all duration-700">
                                        {thumbUrl ? (
                                            <img src={thumbUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white/5 font-black text-7xl uppercase">Jantra</div>
                                        )}
                                        <div className="absolute top-8 left-8">
                                             <span className="px-6 py-2.5 rounded-full bg-white/90 backdrop-blur-md text-[9px] font-black uppercase tracking-widest text-slate-950 shadow-sm border border-white/50">
                                                 {Array.isArray(project.category) ? project.category[0] : project.category}
                                             </span>
                                        </div>
                                    </div>

                                    <div className="px-6 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-[1px] bg-slate-200" />
                                            <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Case Study #{i + 1}</span>
                                        </div>
                                        <h3 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tighter uppercase leading-none group-hover:text-orange-600 transition-colors">{project.title}</h3>
                                        <p className="text-slate-500 text-sm sm:text-lg font-medium leading-relaxed line-clamp-2 uppercase tracking-tight">{project.description}</p>
                                        <Link href={`/work/${project.slug}`} className="inline-flex items-center gap-4 text-[10px] font-black text-slate-950 uppercase tracking-widest pt-4 group-hover:translate-x-2 transition-transform">
                                            Investigate <ArrowIcon className="w-5 h-5 text-orange-600" />
                                        </Link>
                                    </div>
                                    <Link href={`/work/${project.slug}`} className="absolute inset-0 z-30" />
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* ── FOOTER CTA ── */}
                <div className="mt-32 p-12 sm:p-20 rounded-[4rem] bg-slate-950 text-white flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
                     <div className="space-y-4">
                         <h2 className="text-4xl font-black tracking-tighter uppercase leading-none">Genius Profile?</h2>
                         <p className="text-white/80 text-sm font-medium leading-relaxed max-w-sm uppercase tracking-tight">Deploy your CV to our open archive.</p>
                     </div>
                     <Link href="/contact" className="px-16 py-7 rounded-2xl bg-white text-slate-950 text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-orange-600 hover:text-white transition-all shadow-2xl active:scale-95">
                        Start Registry <ArrowIcon className="w-5 h-5" />
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
