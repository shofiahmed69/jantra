"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, ChevronRight, BarChart, ExternalLink, Loader2 } from "lucide-react";
import { getProjectBySlug, getProjectGradient, projects as localProjects } from "@/data/projects";
import api from "@/lib/api";

export default function CaseStudyPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await api.get(`/work/${slug}`);
                if (response.data.data) {
                    setProject(response.data.data);
                } else {
                    setProject(getProjectBySlug(slug));
                }
            } catch (error) {
                console.error("Failed to fetch from API, using local:", error);
                setProject(getProjectBySlug(slug));
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [slug]);

    if (loading) {
        return (
            <main className="relative w-full min-h-screen pt-24 pb-20 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
            </main>
        );
    }

    if (!project) {
        return (
            <main className="relative w-full min-h-screen pt-24 pb-20 flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-slate-900 mb-4">Project not found</h1>
                <Link href="/work" className="text-orange-600 font-medium hover:underline">← Back to Portfolio</Link>
            </main>
        );
    }

    const projectIndex = localProjects.findIndex(p => p.slug === slug);

    return (
        <main className="relative w-full min-h-screen pt-24 pb-20 overflow-x-hidden">
            <div className="max-w-4xl mx-auto px-6">

                <Link href="/work" className="inline-flex items-center gap-2 text-slate-500 hover:text-orange-600 font-medium text-sm transition-colors mb-8">
                    <ArrowLeft className="w-4 h-4" /> Back to Portfolio
                </Link>

                {/* Hero Section */}
                <header className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-orange-600 font-bold tracking-widest text-[10px] md:text-xs uppercase bg-orange-100/50 px-3 py-1.5 rounded-full inline-block">
                            {(project.category || [])[0]}
                        </span>
                        {project.duration && (
                            <span className="text-slate-400 text-sm font-medium">{project.duration}</span>
                        )}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight leading-tight mb-6">
                        {project.title}
                    </h1>
                </header>

                {/* Hero Image */}
                <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden relative mb-10">
                    {project.thumbnail ? (
                        <img
                            src={project.thumbnail}
                            alt={project.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = 'none';
                                (e.currentTarget.nextElementSibling as HTMLElement)?.classList.remove('hidden');
                            }}
                        />
                    ) : null}
                    <div className={`${project.thumbnail ? 'hidden' : ''} w-full h-full bg-gradient-to-br ${getProjectGradient(projectIndex >= 0 ? projectIndex : 0)} flex items-center justify-center`}>
                        <span className="text-white font-black opacity-10 select-none" style={{ fontSize: '14rem', lineHeight: 1 }}>
                            {project.title.charAt(0)}
                        </span>
                    </div>
                </div>

                {/* Live URL / GitHub buttons */}
                {(project.liveUrl || project.githubUrl) && (
                    <div className="flex flex-wrap gap-3 mb-10">
                        {project.liveUrl && (
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-600 transition"
                            >
                                <ExternalLink className="w-4 h-4" /> View Live Project
                            </a>
                        )}
                        {project.githubUrl && (
                            <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-medium hover:border-slate-400 transition"
                            >
                                GitHub Repo
                            </a>
                        )}
                    </div>
                )}

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">

                    {/* Main Content (Left) */}
                    <div className="lg:col-span-2 space-y-12">
                        {(project.description || project.challenge) && (
                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">Project Overview</h2>
                                <p className="text-slate-600 leading-relaxed text-lg">{project.description || project.challenge}</p>
                            </section>
                        )}

                        {project.challenge && (
                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">The Challenge</h2>
                                <p className="text-slate-600 leading-relaxed">{project.challenge}</p>
                            </section>
                        )}

                        {project.approach && (
                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Approach</h2>
                                <p className="text-slate-600 leading-relaxed">{project.approach}</p>
                            </section>
                        )}

                        {project.features && project.features.length > 0 && (
                            <section className="bg-slate-50 rounded-[2rem] p-8 md:p-10 border border-slate-100">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <CheckCircle2 className="w-6 h-6 text-orange-500" /> Features Built
                                </h2>
                                <ul className="space-y-4">
                                    {project.features.map((feature: string, i: number) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 shrink-0"></div>
                                            <span className="text-slate-700 font-medium">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}
                    </div>

                    {/* Sidebar (Right) */}
                    <div className="space-y-10">
                        {project.techStack && project.techStack.length > 0 && (
                            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)]">
                                <h3 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-xs block">Technology Stack</h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.techStack.map((tech: string, i: number) => (
                                        <span key={i} className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200/50">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {project.results && (
                            <div>
                                <h3 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-xs block flex items-center gap-2">
                                    <BarChart className="w-4 h-4 text-orange-500" /> Key Metrics
                                </h3>
                                <div className="space-y-4 p-6 bg-orange-50/50 rounded-2xl border border-orange-100">
                                    <p className="text-slate-700 font-medium leading-relaxed italic">
                                        {project.results}
                                    </p>
                                </div>
                            </div>
                        )}

                        {project.client && (
                            <div className="bg-white rounded-3xl p-6 border border-slate-200">
                                <h3 className="font-bold text-slate-900 mb-2 uppercase tracking-wider text-xs">Client</h3>
                                <p className="text-slate-700 font-medium">{project.client}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Next Project Nav */}
                <div className="mt-10 border-t border-slate-200 pt-8 flex justify-between items-center">
                    <Link href="/work" className="text-slate-500 hover:text-slate-900 font-medium transition-colors text-sm md:text-base">
                        View All Projects
                    </Link>
                    {projectIndex >= 0 && projectIndex < localProjects.length - 1 && (
                        <Link href={`/work/${localProjects[projectIndex + 1].slug}`} className="flex items-center gap-2 font-bold text-orange-600 hover:text-orange-700 transition-colors text-sm md:text-base group">
                            Next Case Study <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    )}
                </div>
            </div>
        </main>
    );
}
