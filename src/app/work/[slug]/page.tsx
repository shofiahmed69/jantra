import Link from "next/link";
import { ArrowLeft, CheckCircle2, ChevronRight, BarChart, ExternalLink, Globe, Cpu, Zap } from "lucide-react";
import { getProjectBySlug, projects as staticProjects } from "@/data/projects";
import { notFound } from "next/navigation";
import api from "@/lib/api";

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    
    let allProjects: any[] = [];
    let project = null;

    try {
        const response = await api.get("/work");
        const data = response.data?.data || response.data || [];
        if (Array.isArray(data) && data.length > 0) {
            allProjects = data.map((apiP: any) => {
                const local = staticProjects.find(l => l.slug === apiP.slug);
                return { 
                    ...local, 
                    ...apiP, 
                    title: apiP.title || apiP.name || local?.title,
                    description: apiP.description || apiP.summary || local?.description,
                    tags: local?.tags || apiP.techStack || [] 
                };
            });
            project = allProjects.find((p: any) => p.slug === slug);
        } else {
            allProjects = staticProjects;
            project = getProjectBySlug(slug);
        }
    } catch {
        allProjects = staticProjects;
        project = getProjectBySlug(slug);
    }

    if (!project) {
        return notFound();
    }

    const currentIndex = allProjects.findIndex(p => p.slug === slug);
    const hasNext = currentIndex !== -1 && currentIndex < allProjects.length - 1;
    const nextProject = hasNext ? allProjects[currentIndex + 1] : null;

    return (
        <main className="w-full min-h-screen bg-white pb-32">
            
            <div className="max-w-[1280px] mx-auto px-6 sm:px-12 pt-28 sm:pt-40">
                
                {/* ── BREADCRUMB ── */}
                <Link href="/work" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-orange-600 transition-colors mb-12 uppercase tracking-widest">
                     <ArrowLeft className="w-4 h-4" /> Portfolio Index
                </Link>

                {/* ── HERO ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:items-end mb-20 sm:mb-32">
                    <div className="lg:col-span-8 space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 bg-orange-50 px-4 py-2 rounded-full border border-orange-100">
                                {Array.isArray(project.category) ? project.category[0] : project.category || "Case Study"}
                            </span>
                            <div className="w-12 h-[1px] bg-slate-200" />
                        </div>
                        <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-slate-900 tracking-tighter uppercase leading-[0.9]">
                            {project.title} <span className="text-orange-500">.</span>
                        </h1>
                        <p className="text-slate-500 text-lg sm:text-2xl font-medium leading-relaxed max-w-2xl border-l-4 border-orange-500/20 pl-8">
                            {project.description}
                        </p>
                    </div>
                    <div className="lg:col-span-4 space-y-2">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">TIMELINE</span>
                        <p className="text-xl font-black text-slate-900 uppercase tracking-tight">{project.duration || "48 Wks Cycle"}</p>
                    </div>
                </div>

                {/* ── MAIN IMAGE ── */}
                <div className="relative aspect-[16/10] sm:aspect-[16/7] rounded-[2.5rem] sm:rounded-[4rem] overflow-hidden bg-slate-900 mb-20 shadow-2xl ring-1 ring-black/5">
                    {project.thumbnail ? (
                        <img 
                            src={project.thumbnail} 
                            alt={project.title} 
                            className="w-full h-full object-cover opacity-100 transition-all duration-700 hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/5 font-black text-8xl uppercase tracking-tighter">Jantra Archive</div>
                    )}
                </div>

                {/* ── SPECIFICATIONS GRID ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-32 items-start">
                    
                    {/* LEFT CONTENT */}
                    <div className="lg:col-span-7 space-y-20">
                        
                        <div className="grid sm:grid-cols-2 gap-12">
                             <div className="space-y-4">
                                <h3 className="text-[10px] font-black text-orange-600 uppercase tracking-[0.4em]">The Challenge</h3>
                                <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-semibold uppercase tracking-tight">{project.challenge}</p>
                             </div>
                             <div className="space-y-4">
                                <h3 className="text-[10px] font-black text-orange-600 uppercase tracking-[0.4em]">The Solution</h3>
                                <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-semibold uppercase tracking-tight">{project.approach}</p>
                             </div>
                        </div>

                        <div className="p-8 sm:p-14 bg-slate-50 rounded-[3rem] border border-slate-100 space-y-10">
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-4">
                                <CheckCircle2 className="w-6 h-6 text-orange-600" /> Key Features
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-6">
                                {project.features && project.features.map((feat: string, i: number) => (
                                    <div key={i} className="flex items-center gap-4 group">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-600 group-hover:scale-150 transition-all" />
                                        <span className="text-[10px] font-black uppercase text-slate-950 tracking-widest">{feat}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDEBAR */}
                    <div className="lg:col-span-5 space-y-8">
                         
                         {/* TECH STACK */}
                         <div className="bg-slate-950 p-10 sm:p-14 rounded-[3rem] text-white space-y-10">
                             <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Technology Hub</h3>
                             <div className="flex flex-wrap gap-2">
                                 {project.techStack && project.techStack.map((tech: string, i: number) => (
                                     <span key={i} className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-slate-300">
                                         {tech}
                                     </span>
                                 ))}
                             </div>
                         </div>

                         {/* METRIC CARD */}
                         <div className="p-10 sm:p-14 bg-orange-600 rounded-[3rem] text-white space-y-6">
                             <div className="flex items-center gap-3">
                                <BarChart className="w-5 h-5 text-white/60" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">Registry Metrics</span>
                             </div>
                             <p className="text-xl sm:text-2xl font-black leading-tight uppercase tracking-tighter">
                                 &ldquo;{project.results}&rdquo;
                             </p>
                         </div>

                         {/* LIVE LINK */}
                         {project.liveUrl && (
                             <Link href={project.liveUrl} target="_blank" className="flex items-center justify-center gap-4 w-full py-8 rounded-[2rem] bg-slate-950 text-white font-black uppercase tracking-[0.4em] text-[11px] hover:bg-orange-600 transition-all shadow-2xl active:scale-95">
                                Visit Protocol <ExternalLink className="w-4 h-4" />
                             </Link>
                         )}
                    </div>
                </div>

                {/* ── NEXT PROJECT TRANSITION ── */}
                <div className="pt-20 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-12">
                     <Link href="/work" className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 hover:text-slate-950 transition-colors">
                        All Cases Registry
                     </Link>

                     {hasNext && nextProject && (
                        <Link href={`/work/${nextProject.slug}`} className="group flex flex-col items-end text-right gap-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Next Case Study</span>
                            <div className="flex items-center gap-8">
                                 <h2 className="text-4xl sm:text-7xl font-black text-slate-950 tracking-tighter uppercase leading-none group-hover:text-orange-600 transition-all">{nextProject.title}</h2>
                                 <div className="w-14 h-14 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-slate-950 group-hover:text-white transition-all">
                                     <ChevronRight className="w-6 h-6" />
                                 </div>
                            </div>
                        </Link>
                     )}
                </div>
            </div>
        </main>
    );
}
