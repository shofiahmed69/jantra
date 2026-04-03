"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink, Loader2, Sparkles, Binary } from "lucide-react";
import api from "@/lib/api";
import { projects as staticProjects } from "@/data/projects";
import { motion } from "framer-motion";

interface Project {
    id: string;
    title: string;
    category: string | string[];
    image: string;
    thumbnail: string;
    thumbnailUrl: string;
    slug: string;
    description: string;
}

// Master Category List matching Admin standards
const WORK_CATEGORIES = [
    "All",
    "Web Design", 
    "Web App",
    "Mobile App", 
    "AI & ML", 
    "Automation", 
    "SaaS", 
    "Cloud Infra", 
    "UI/UX Design", 
    "Enterprise", 
    "E-Commerce",
    "Software Dev",
    "Data Science",
    "Cybersecurity",
    "Branding",
    "IoT & Embedded"
];

export default function WorkPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await api.get("/work");
                const apiData = response.data?.projects || response.data?.data || response.data || [];
                
                const merged = Array.isArray(apiData) && apiData.length > 0 
                  ? apiData.map((ap: any) => {
                      const local = staticProjects.find(sp => sp.slug === ap.slug);
                      return { ...local, ...ap };
                    })
                  : staticProjects as unknown as Project[];

                setProjects(merged);
            } catch (error) {
                console.error("Failed to fetch projects, using static fallback", error);
                setProjects(staticProjects as unknown as Project[]);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const safeProjects = Array.isArray(projects) ? projects : [];

    // Filter projects based on selection
    const filteredProjects = filter === "All" 
        ? safeProjects 
        : safeProjects.filter(p => {
            if (Array.isArray(p.category)) return p.category.includes(filter);
            return p.category === filter;
        });

    const getProjectImage = (p: Project) => {
        const rawUrl = p.image || p.thumbnail || p.thumbnailUrl;
        if (!rawUrl) return null;
        if (rawUrl.startsWith('http')) return rawUrl;
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace(/\/api$/, '');
        const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        const cleanPath = rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`;
        return `${cleanBase}${cleanPath}`;
    };

    return (
        <main className="relative w-full min-h-screen bg-white overflow-hidden pb-32">
            <div className="absolute top-[5%] left-0 w-full overflow-hidden opacity-[0.03] pointer-events-none select-none z-0">
                <div className="flex whitespace-nowrap animate-marquee-slow">
                    <span className="text-[12rem] font-black tracking-tighter leading-none mr-24 uppercase">EXCELLENCE. PORTFOLIO. CASE STUDIES. IMPACT.</span>
                </div>
            </div>

            <div className="max-w-[1540px] mx-auto px-6 sm:px-12 pt-28 sm:pt-36 relative z-10">
                <div className="grid lg:grid-cols-12 gap-12 items-start mb-12">
                    
                    {/* LEFT SIDEBAR HERO */}
                    <div className="lg:col-span-3 space-y-12 sticky top-36">
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-[2px] bg-orange-500" />
                                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-orange-600">Our Portfolio</span>
                            </div>
                            <h1 className="text-5xl sm:text-6xl font-black text-slate-900 leading-[0.85] tracking-tighter uppercase whitespace-nowrap">
                                Selected <br />
                                <span className="text-transparent" style={{ WebkitTextStroke: "1px #0f172a" }}>Work</span>
                                <span className="text-orange-500">.</span>
                            </h1>
                        </div>

                        {/* FIXED CATEGORY FILTER HUB */}
                        <div className="space-y-6">
                             <div className="flex items-center gap-3">
                                <Sparkles className="w-3 h-3 text-orange-500" />
                                <span className="text-[10px] font-black uppercase tracking-[.4em] text-slate-400">Project Sectors</span>
                             </div>
                             <div className="flex flex-wrap gap-2">
                                {WORK_CATEGORIES.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setFilter(cat)}
                                        className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                                            filter === cat 
                                            ? "bg-slate-950 text-white shadow-2xl" 
                                            : "bg-slate-50 text-slate-400 border border-slate-200 hover:bg-white hover:text-slate-950"
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                             </div>
                        </div>

                        <div className="p-8 rounded-[3rem] bg-orange-50/50 border border-orange-100/50 space-y-6 relative overflow-hidden group">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[50px] rounded-full" />
                             <p className="text-[12px] font-bold text-orange-900 leading-relaxed uppercase tracking-tight relative z-10">Deploy your professional engineering solution today.</p>
                             <Link href="/contact" className="relative z-10 w-full py-4 rounded-xl bg-slate-950 text-white text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-orange-600 transition-all shadow-xl active:scale-95">
                                Connect Now <ArrowRight className="w-3 h-3" />
                             </Link>
                        </div>
                    </div>

                    {/* PROJECT ARCHIVE GRID */}
                    <div className="lg:col-span-9">
                        {loading ? (
                            <div className="py-32 text-center flex flex-col items-center gap-6">
                                <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.5em]">Populating Portfolio...</p>
                            </div>
                        ) : filteredProjects.length === 0 ? (
                            <div className="py-32 text-center p-20 bg-slate-50 rounded-[3rem] border border-slate-200">
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">No data detected in <span className="text-orange-600">{filter}</span> sector yet.<br/>Please select another category below.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {filteredProjects.map((project, i) => {
                                    const imgUrl = getProjectImage(project);
                                    const categoryLabel = Array.isArray(project.category) ? project.category[0] : project.category;
                                    
                                    return (
                                        <motion.div 
                                            key={project.id}
                                            whileHover={{ y: -6 }}
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="group relative rounded-[3.5rem] bg-white border border-slate-100 p-6 flex flex-col transition-all duration-700 hover:shadow-2xl hover:border-slate-200"
                                        >
                                            <div className="absolute inset-x-24 -bottom-5 h-20 bg-orange-500/10 blur-[70px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                            
                                            <div 
                                                className="relative w-full rounded-[2.5rem] overflow-hidden bg-slate-50 mb-8 border border-slate-100/50 flex items-center justify-center p-8 transition-all duration-700 group-hover:bg-white"
                                                style={{ aspectRatio: "17 / 9" }}
                                            >
                                                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-[0.03]" />
                                                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900/5 to-transparent" />
                                                 
                                                 {imgUrl ? (
                                                     <img 
                                                        src={imgUrl} 
                                                        alt={project.title} 
                                                        className="max-w-full max-h-full object-contain relative z-10 transition-transform duration-1000 group-hover:scale-[1.03] drop-shadow-2xl"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).style.opacity = '0';
                                                        }}
                                                     />
                                                 ) : (
                                                     <div className="text-slate-200 select-none">
                                                          <Binary className="w-16 h-16 opacity-20" />
                                                     </div>
                                                 )}

                                                 <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/0 group-hover:bg-slate-950/5 transition-colors">
                                                      <div className="w-16 h-16 rounded-full bg-slate-950 text-white flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 shadow-2xl">
                                                          <ExternalLink className="w-6 h-6" />
                                                      </div>
                                                 </div>
                                            </div>

                                            <div className="px-4 pb-4 space-y-4 relative z-10 text-left">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="px-3 py-1 bg-orange-100 rounded-lg">
                                                            <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest">{categoryLabel}</span>
                                                        </div>
                                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Case Study</span>
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-4">
                                                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter leading-none group-hover:text-orange-600 transition-colors uppercase truncate">
                                                        {project.title}
                                                    </h3>
                                                    <p className="text-[13px] text-slate-500 font-medium leading-relaxed line-clamp-2 max-w-xl">
                                                        {project.description}
                                                    </p>
                                                </div>

                                                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                                                    <Link href={`/work/${project.slug}`} className="flex items-center gap-3 text-[10px] font-black text-slate-900 uppercase tracking-widest hover:text-orange-500 transition-colors pointer-events-auto">
                                                        Expand Analysis <ArrowRight className="w-4 h-4" />
                                                    </Link>
                                                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-[.4em]">DEPLOYED-2026</span>
                                                </div>
                                            </div>

                                            <Link href={`/work/${project.slug}`} className="absolute inset-0 z-30" />
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
