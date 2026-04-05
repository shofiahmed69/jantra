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

const WORK_CATEGORIES = [
    "All", "Web Design", "Web App", "Mobile App", "AI & ML", 
    "Automation", "SaaS", "Cloud Infra", "UI/UX Design", 
    "Enterprise", "Software Dev", "Branding"
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
                setProjects(staticProjects as unknown as Project[]);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const filteredProjects = filter === "All" 
        ? (Array.isArray(projects) ? projects : [])
        : (Array.isArray(projects) ? projects : []).filter(p => {
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
        <main className="relative w-full min-h-screen bg-white">
            {/* ── BACKGROUND ACCENT [DESKTOP ONLY] ── */}
            <div className="hidden lg:block absolute top-[5%] left-0 w-full overflow-hidden opacity-[0.02] pointer-events-none select-none z-0">
                <div className="flex whitespace-nowrap animate-marquee-slow">
                    <span className="text-[12rem] font-black tracking-tighter leading-none mr-24 uppercase">EXCELLENCE. PORTFOLIO. CASE STUDIES. IMPACT.</span>
                </div>
            </div>

            <div className="max-w-[1540px] mx-auto px-5 sm:px-12 pt-24 sm:pt-36 pb-20 relative z-10">
                
                {/* ── HERO SECTION ── */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 sm:mb-20">
                    <div className="space-y-4 sm:space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-[2px] bg-orange-500" />
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-orange-600">Our Portfolio</span>
                        </div>
                        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-slate-900 leading-[0.85] tracking-tighter uppercase">
                            Selected <br />
                            <span className="text-transparent" style={{ WebkitTextStroke: "1px #0f172a" }}>Work</span>
                            <span className="text-orange-500">.</span>
                        </h1>
                    </div>

                    {/* CATEGORY NAV - PREMIUM PILLS */}
                    <div className="w-full lg:w-auto -mx-5 px-5 lg:mx-0 lg:px-0 relative group/nav">
                        <div className="flex lg:flex-wrap gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-none relative z-10">
                            {WORK_CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setFilter(cat)}
                                    className={`whitespace-nowrap px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                                        filter === cat 
                                        ? "bg-slate-950 text-white shadow-xl shadow-slate-900/10 scale-105" 
                                        : "bg-slate-50 text-slate-400 border border-slate-100 hover:bg-white hover:text-slate-950 hover:border-slate-300"
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── MAIN CONTENT GRID ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    
                    {/* LEFT SIDE INFO [DESKTOP ONLY] */}
                    <div className="hidden lg:block lg:col-span-3 sticky top-36 h-fit space-y-10">
                        <div className="p-10 rounded-[3rem] bg-orange-50/50 border border-orange-100/50 space-y-8 relative overflow-hidden group">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[50px] rounded-full" />
                             <p className="text-[14px] font-bold text-orange-900 leading-relaxed uppercase tracking-tight relative z-10">Deploy your professional engineering solution today.</p>
                             <Link href="/contact" className="relative z-10 w-full py-5 rounded-2xl bg-slate-950 text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-orange-600 transition-all shadow-xl active:scale-95">
                                Connect Now <ArrowRight className="w-4 h-4" />
                             </Link>
                        </div>
                        <div className="px-6 space-y-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Industry Standards</h4>
                            <p className="text-[12px] text-slate-500 font-medium leading-relaxed">We architect production-grade software for market leaders. Every project here represents a journey from abstract concept to technical excellence.</p>
                        </div>
                    </div>

                    {/* PROJECT GRID [SPANS 9 COLS ON DESKTOP, FULL ON MOBILE] */}
                    <div className="lg:col-span-9">
                        {loading ? (
                            <div className="py-40 text-center flex flex-col items-center gap-6">
                                <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Populating Archive...</p>
                            </div>
                        ) : filteredProjects.length === 0 ? (
                            <div className="py-40 text-center p-20 bg-slate-50 rounded-[3rem] border border-slate-200">
                                <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">No projects in <span className="text-orange-600">{filter}</span> sector yet.<br/>Please select another category above.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
                                {filteredProjects.map((project, i) => {
                                    const imgUrl = getProjectImage(project);
                                    const categoryLabel = Array.isArray(project.category) ? project.category[0] : project.category;
                                    
                                    return (
                                        <motion.div 
                                             key={project.id}
                                             layout
                                             initial={{ opacity: 0, y: 30 }}
                                             animate={{ opacity: 1, y: 0 }}
                                             transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                             className="group relative flex flex-col transition-all duration-700"
                                         >
                                             {/* IMAGE TILE */}
                                             <div className="relative aspect-[16/10] sm:aspect-[17/10] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden bg-slate-100 border border-slate-100/50 mb-6 sm:mb-8 group-hover:shadow-2xl transition-all duration-700">
                                                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-[0.03]" />
                                                 {imgUrl ? (
                                                     <img 
                                                        src={imgUrl} 
                                                        alt={project.title} 
                                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                                     />
                                                 ) : (
                                                     <div className="w-full h-full flex items-center justify-center text-slate-200 bg-white">
                                                          <Binary className="w-12 h-12 opacity-20" />
                                                     </div>
                                                 )}
                                                 
                                                 {/* OVERLAY COMMANDS */}
                                                 <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/20 flex items-center justify-center transition-all duration-500 opacity-0 group-hover:opacity-100 backdrop-blur-sm">
                                                     <div className="w-14 h-14 rounded-full bg-white text-slate-950 flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500">
                                                         <ExternalLink className="w-6 h-6" />
                                                     </div>
                                                 </div>

                                                 {/* TAG */}
                                                 <div className="absolute top-6 left-6 z-20">
                                                     <span className="px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[8px] font-black uppercase tracking-widest text-slate-900 border border-white/50">{categoryLabel}</span>
                                                 </div>
                                             </div>

                                             {/* CONTENT AREA */}
                                             <div className="px-4 text-left">
                                                 <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tighter leading-[0.95] uppercase mb-4 group-hover:text-orange-600 transition-colors">
                                                     {project.title}
                                                 </h3>
                                                 <p className="text-[12px] sm:text-[14px] text-slate-500 font-medium leading-relaxed line-clamp-3 mb-6">
                                                     {project.description}
                                                 </p>
                                                 <Link href={`/work/${project.slug}`} className="inline-flex items-center gap-4 text-[10px] font-black text-slate-900 uppercase tracking-widest hover:text-orange-500 transition-colors duration-300">
                                                     View Project Detail <ArrowRight className="w-4 h-4" />
                                                 </Link>
                                             </div>

                                             <Link href={`/work/${project.slug}`} className="absolute inset-0 z-30" />
                                         </motion.div>
                                    );
                                })}
                            </div>
                        )}

                        {/* MOBILE ONLY CONNECT BOX [AT BOTTOM] */}
                        <div className="lg:hidden mt-20 p-10 rounded-[2.5rem] bg-orange-600 text-white space-y-6 text-center">
                             <h2 className="text-3xl font-black tracking-tighter uppercase leading-none">Ready for Blastoff?</h2>
                             <p className="text-[12px] font-bold uppercase tracking-tight opacity-90">Start your engineering journey with our team.</p>
                             <Link href="/contact" className="w-full py-5 rounded-2xl bg-white text-slate-900 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-transform">
                                Hire Us Now <ArrowRight className="w-4 h-4" />
                             </Link>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .scrollbar-none::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-none {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </main>
    );
}
