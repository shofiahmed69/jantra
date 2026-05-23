import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ChevronRight, BarChart, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { getWorkProjects } from "@/lib/work-data";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const allProjects = await getWorkProjects();
    const project = allProjects.find((p) => p.slug === slug) || null;

    if (!project) {
        return {
            title: "Our Work",
            description: "Portfolio of software products, SaaS platforms, AI agents, and automation systems built by JANTRA.",
        };
    }

    const title = `${project.title} | JANTRA Work`;
    const description = project.description || "Case study from JANTRA's software and AI delivery portfolio.";
    const url = `https://jantrasoft.online/work/${slug}`;

    return {
        title,
        description,
        alternates: { canonical: url },
        openGraph: {
            title,
            description,
            url,
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const allProjects = await getWorkProjects();
    const project = allProjects.find((p) => p.slug === slug) || null;

    if (!project) {
        return notFound();
    }

    const getThumbnailUrl = (thumbnail?: string) => {
        if (!thumbnail) return "";
        if (thumbnail.startsWith("http")) return thumbnail;
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "https://jontro-backend.onrender.com/api").replace(/\/api$/, "");
        const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
        const cleanPath = thumbnail.startsWith("/") ? thumbnail : `/${thumbnail}`;
        return `${cleanBase}${cleanPath}`;
    };

    const currentIndex = allProjects.findIndex(p => p.slug === slug);
    const hasNext = currentIndex !== -1 && currentIndex < allProjects.length - 1;
    const nextProject = hasNext ? allProjects[currentIndex + 1] : null;

    return (
        <main className="w-full min-h-screen bg-white pb-20">
            <div className="max-w-[1140px] mx-auto px-6 sm:px-8 pt-28 sm:pt-36">
                
                {/* ── BREADCRUMB ── */}
                <Link href="/work" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-orange-600 transition-colors mb-6 uppercase tracking-wider">
                     <ArrowLeft className="w-4 h-4" /> Back to Projects
                </Link>

                {/* ── HERO ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:items-start mb-10">
                    <div className="lg:col-span-8 space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                                {Array.isArray(project.category) ? project.category[0] : project.category || "Project"}
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-4 flex-wrap pt-1">
                            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                                {project.title}
                            </h1>
                            {project.liveUrl && (
                                <Link 
                                    href={project.liveUrl} 
                                    target="_blank" 
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-[10px] uppercase tracking-wider transition-all shadow-sm hover:shadow active:scale-95 shrink-0"
                                >
                                    Live Demo <ExternalLink className="w-3 h-3" />
                                </Link>
                            )}
                        </div>
                        
                        <p className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed max-w-3xl border-l-2 border-orange-500 pl-4 mt-2">
                            {project.description}
                        </p>
                    </div>
                    <div className="lg:col-span-4 lg:text-right pt-2 lg:pt-8">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Duration</span>
                        <p className="text-lg font-bold text-slate-800 uppercase tracking-tight">{project.duration || "4 Weeks"}</p>
                    </div>
                </div>

                {/* ── MAIN IMAGE ── */}
                <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden bg-slate-900 mb-10 shadow-lg ring-1 ring-black/5">
                    {project.thumbnail ? (
                        <img 
                            src={getThumbnailUrl(project.thumbnail)} 
                            alt={project.title} 
                            className="w-full h-full object-cover opacity-100 transition-all duration-700 hover:scale-102"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/5 font-black text-6xl uppercase tracking-tighter">Jantra Archive</div>
                    )}
                </div>

                {/* ── SPECIFICATIONS GRID ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16 items-start">
                    
                    {/* LEFT CONTENT */}
                    <div className="lg:col-span-7 space-y-8">
                        
                        <div className="grid sm:grid-cols-2 gap-8">
                             <div className="space-y-2">
                                <h3 className="text-xs font-bold text-orange-600 uppercase tracking-wider">The Challenge</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">{project.challenge}</p>
                             </div>
                             <div className="space-y-2">
                                <h3 className="text-xs font-bold text-orange-600 uppercase tracking-wider">The Solution</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">{project.approach}</p>
                             </div>
                        </div>

                        {project.features && project.features.length > 0 && (
                            <div className="p-6 sm:p-8 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-orange-600" /> Key Features
                                </h3>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {project.features.map((feat: string, i: number) => (
                                        <div key={i} className="flex items-start gap-2.5 group">
                                            <div className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-2 shrink-0 group-hover:scale-120 transition-all" />
                                            <span className="text-sm font-medium text-slate-700">{feat}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT SIDEBAR */}
                    <div className="lg:col-span-5 space-y-6">
                         
                         {/* TECH STACK */}
                         {project.techStack && project.techStack.length > 0 && (
                             <div className="bg-slate-900 p-6 sm:p-8 rounded-2xl text-white space-y-4">
                                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Technologies Used</h3>
                                 <div className="flex flex-wrap gap-2">
                                     {project.techStack.map((tech: string, i: number) => (
                                         <span key={i} className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/5 text-xs font-medium text-slate-200">
                                             {tech}
                                         </span>
                                     ))}
                                 </div>
                             </div>
                         )}

                         {/* METRIC CARD */}
                         {project.results && (
                             <div className="p-6 sm:p-8 bg-orange-50 border border-orange-100 rounded-2xl text-slate-800 space-y-3">
                                 <div className="flex items-center gap-2">
                                    <BarChart className="w-4 h-4 text-orange-600" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-orange-600">Key Results</span>
                                 </div>
                                 <p className="text-sm sm:text-base font-semibold leading-relaxed text-slate-800">
                                     {project.results}
                                 </p>
                             </div>
                         )}

                         {/* LIVE LINK */}
                         {project.liveUrl && (
                             <Link href={project.liveUrl} target="_blank" className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-orange-600 transition-all shadow active:scale-98">
                                Visit Live Website <ExternalLink className="w-4 h-4" />
                             </Link>
                         )}
                    </div>
                </div>

                {/* ── NEXT PROJECT TRANSITION ── */}
                <div className="pt-10 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                     <Link href="/work" className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-800 transition-colors">
                        View All Projects
                     </Link>

                     {hasNext && nextProject && (
                        <Link href={`/work/${nextProject.slug}`} className="group flex flex-col items-end text-right gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Next Project</span>
                            <div className="flex items-center gap-4">
                                 <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight group-hover:text-orange-600 transition-all">{nextProject.title}</h2>
                                 <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                                     <ChevronRight className="w-5 h-5" />
                                 </div>
                            </div>
                        </Link>
                     )}
                </div>
            </div>
        </main>
    );
}
