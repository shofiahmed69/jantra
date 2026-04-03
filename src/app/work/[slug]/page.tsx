import Link from "next/link";
import { ArrowLeft, CheckCircle2, ChevronRight, BarChart, ExternalLink } from "lucide-react";
import { getProjectBySlug, getProjectGradient, projects as staticProjects } from "@/data/projects";
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
            allProjects = data.sort((a: any, b: any) => a.order - b.order).map((apiP: any) => {
                const local = staticProjects.find(l => l.slug === apiP.slug);
                return { ...local, ...apiP, tags: local?.tags || apiP.techStack || [] };
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
        <main className="relative w-full min-h-screen pt-32 pb-24 overflow-x-hidden bg-[#fcfcfc]">
            <div className="max-w-7xl mx-auto px-6">

                {/* Back Link — Floating Navigation */}
                <div className="mb-12">
                   <Link href="/work" className="inline-flex items-center gap-3 text-slate-400 hover:text-orange-600 font-black text-[10px] uppercase tracking-[0.3em] transition-all group">
                       <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center group-hover:border-orange-200 group-hover:bg-orange-50 transition-all">
                          <ArrowLeft className="w-4 h-4" /> 
                       </div>
                       Portfolio Index
                   </Link>
                </div>

                {/* Hero Section — Massive Editorial Layout */}
                <header className="mb-16 grid grid-cols-1 lg:grid-cols-12 items-end gap-12">
                    <div className="lg:col-span-8 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-[2px] bg-orange-500" />
                            <span className="text-orange-600 font-black uppercase tracking-[0.5em] text-[10px]">
                                {Array.isArray(project.category) ? project.category[0] : project.category}
                            </span>
                        </div>
                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-slate-900 tracking-[calc(-0.04em)] leading-[0.85]">
                           {project.title.split(' ')[0]} <br/>
                           <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">
                              {project.title.split(' ').slice(1).join(' ') || "Delivery"}
                           </span>
                        </h1>
                    </div>
                    <div className="lg:col-span-4 lg:pb-2">
                       <p className="text-lg font-bold text-slate-400 uppercase tracking-[0.4em] mb-3">Timeline</p>
                       <p className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{project.duration || "Spring 2024"}</p>
                    </div>
                </header>

                {/* Imagery — Architectural Display */}
                <div className="relative w-full aspect-[21/9] rounded-[3rem] overflow-hidden bg-slate-900 mb-20 flex items-center justify-center group shadow-[0_50px_100px_-30px_rgba(0,0,0,0.15)] ring-1 ring-black/5">
                    
                    {/* Background Ambient Glow */}
                    {project.thumbnail && (
                       <img 
                         src={project.thumbnail} 
                         className="absolute inset-0 w-full h-full object-cover blur-3xl scale-150 opacity-40 saturate-200" 
                         alt="" 
                       />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/80 via-slate-900/20 to-transparent z-10" />

                    {/* Foreground Uncropped Image */}
                    <div className="relative z-20 w-fit h-fit max-w-[90%] max-h-[85%] p-6 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl flex items-center justify-center transition-transform duration-700 group-hover:scale-[1.02]">
                       {project.thumbnail ? (
                          <img 
                             src={project.thumbnail} 
                             alt={project.title}
                             className="max-w-full max-h-[500px] object-contain rounded-xl shadow-2xl"
                          />
                       ) : (
                          <span className="text-white font-black opacity-10 select-none text-[15vw] leading-none">
                              {project.title.charAt(0)}
                          </span>
                       )}
                    </div>
                </div>

                {/* Content Architecture */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 relative">
                    
                    {/* Floating Vertical Label (Desktop Only) */}
                    <div className="hidden lg:block absolute -left-16 top-0 bottom-0 pointer-events-none">
                       <span className="sticky top-40 text-[10px] font-black uppercase tracking-[1em] text-slate-200 [writing-mode:vertical-rl] rotate-180">
                          CASE STUDY SPECIFICATIONS
                       </span>
                    </div>

                    {/* Main Content (Left) */}
                    <div className="lg:col-span-7 space-y-24">
                        <section className="space-y-6">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-orange-600 flex items-center gap-4">
                               <div className="w-8 h-[1px] bg-orange-600/30" /> Project Brief
                            </h2>
                            <p className="text-2xl sm:text-3xl font-black text-slate-800 leading-[1.2] tracking-tight">{project.description}</p>
                        </section>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 pt-8">
                           <section className="space-y-6">
                               <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">The Challenge</h3>
                               <p className="text-base text-slate-600 leading-relaxed font-medium">{project.challenge}</p>
                           </section>

                           <section className="space-y-6">
                               <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Our Strategy</h3>
                               <p className="text-base text-slate-600 leading-relaxed font-medium">{project.approach}</p>
                           </section>
                        </div>

                        <section className="bg-white rounded-[2.5rem] p-10 sm:p-14 border border-slate-100 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.04)] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-[80px] rounded-full pointer-events-none" />
                            
                            <h2 className="text-3xl font-black text-slate-900 mb-10 flex items-center gap-4">
                                <CheckCircle2 className="w-8 h-8 text-orange-500" /> Key Features
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
                                {project.features && project.features.map((feature: string, i: number) => (
                                    <div key={i} className="flex items-start gap-4 group/item">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2.5 transition-all group-hover/item:scale-150" />
                                        <span className="text-slate-800 font-bold uppercase tracking-widest text-[11px] leading-relaxed transition-all group-hover/item:text-orange-600">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar — Precision Specs (Right) */}
                    <div className="lg:col-span-5 space-y-12">
                        
                        {/* Tech Stack Card */}
                        <div className="bg-slate-950 rounded-[2.5rem] p-10 lg:p-12 text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-10">Technology Protocol</h3>
                            <div className="flex flex-wrap gap-3">
                                {project.techStack && project.techStack.map((tech: string, i: number) => (
                                    <span key={i} className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.3em] text-white hover:bg-white/10 hover:border-orange-500/30 transition-all cursor-default">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Results Card */}
                        <div className="bg-orange-50 rounded-[2.5rem] p-10 lg:p-12 border border-orange-100/50">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-600/60 mb-10 flex items-center gap-3">
                                <BarChart className="w-4 h-4" /> Performance Metrics
                            </h3>
                            <p className="text-2xl font-black text-slate-900 leading-[1.3] tracking-tight">
                                &ldquo;{project.results}&rdquo;
                            </p>
                        </div>

                        {/* Action Link */}
                        {project.liveUrl && (
                            <Link
                                href={project.liveUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="group relative flex items-center justify-center gap-4 rounded-full bg-slate-900 py-8 text-[11px] font-black uppercase tracking-[.4em] text-white transition-all hover:bg-orange-600 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] active:scale-95"
                            >
                                Launch Platform <ExternalLink className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                            </Link>
                        )}
                    </div>
                </div>

                {/* Footer Navigation — Cinematic Transition */}
                <div className="mt-48 border-t border-slate-100 pt-20">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-12">
                        <Link href="/work" className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 hover:text-slate-900 transition-colors">
                            Portfolio Full Index
                        </Link>
                        
                        {hasNext && nextProject && (
                            <Link href={`/work/${nextProject.slug}`} className="group flex flex-col items-end text-right gap-4">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Next Case Study</span>
                                <div className="flex items-center gap-6">
                                   <p className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter leading-none transition-all group-hover:text-orange-600">
                                      {nextProject.title}
                                   </p>
                                   <div className="w-14 h-14 rounded-full bg-white border border-slate-100 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                                      <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                   </div>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
