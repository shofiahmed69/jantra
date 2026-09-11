'use client'

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle2, ChevronRight, ChevronLeft, BarChart, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Project = {
    title: string;
    slug: string;
    description?: string;
    category?: string | string[];
    liveUrl?: string;
    duration?: string;
    thumbnail?: string;
    mobileThumbnail?: string;
    images?: string[];
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
    // Client-side image URL resolver
    const resolveImageUrl = (thumbnail?: string) => {
        if (!thumbnail) return "";
        let url = thumbnail;
        if (!url.startsWith("http")) {
            const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "https://jontro-backend.onrender.com/api").replace(/\/api$/, "");
            const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
            const cleanPath = url.startsWith("/") ? url : `/${url}`;
            url = `${cleanBase}${cleanPath}`;
        }
        if (url.startsWith("http://") || url.includes("sslip.io")) {
            return `/api/image-proxy?url=${encodeURIComponent(url)}`;
        }
        return url;
    };

    // Calculate all available showcase perspective slides
    const slides = useMemo(() => {
        if (project.images && project.images.length > 0) {
            return project.images.map(resolveImageUrl).filter(Boolean);
        }
        const derived: string[] = [];
        if (project.thumbnail) {
            derived.push(resolveImageUrl(project.thumbnail));
            if (project.thumbnail.includes('01_hero_desktop.webp')) {
                derived.push(resolveImageUrl(project.thumbnail.replace('01_hero_desktop.webp', '05_mobile_view.webp')));
                derived.push(resolveImageUrl(project.thumbnail.replace('01_hero_desktop.webp', '02_showcase_section.webp')));
                derived.push(resolveImageUrl(project.thumbnail.replace('01_hero_desktop.webp', '03_features_catalog.webp')));
                derived.push(resolveImageUrl(project.thumbnail.replace('01_hero_desktop.webp', '04_full_page.webp')));
            }
        }
        if (project.mobileThumbnail) {
            const resolvedMob = resolveImageUrl(project.mobileThumbnail);
            if (!derived.includes(resolvedMob)) {
                derived.splice(1, 0, resolvedMob);
            }
        }
        return derived.filter(Boolean);
    }, [project]);

    // Slide perspective details
    const getSlideMeta = (url: string, idx: number) => {
        const lower = url.toLowerCase();
        if (lower.includes('01_hero') || lower.includes('hero')) {
            return { title: 'Desktop Viewport (Hero)', type: 'Desktop View', isMobile: false };
        }
        if (lower.includes('05_mobile') || lower.includes('mobile')) {
            return { title: 'Mobile Responsive View', type: 'Mobile UI', isMobile: true };
        }
        if (lower.includes('02_showcase') || lower.includes('showcase')) {
            return { title: 'Interactive Showcase', type: 'Interactive UX', isMobile: false };
        }
        if (lower.includes('03_features') || lower.includes('features')) {
            return { title: 'Features & Architecture', type: 'Catalog & Data', isMobile: false };
        }
        if (lower.includes('04_full_page') || lower.includes('full_page')) {
            return { title: 'Full System Architecture', type: 'Full Flow', isMobile: false };
        }
        return { title: `Perspective 0${idx + 1}`, type: 'Preview', isMobile: false };
    };

    // Auto-scrolling carousel state
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isCarouselHovered, setIsCarouselHovered] = useState(false);

    const nextSlide = useCallback(() => {
        if (slides.length <= 1) return;
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, [slides.length]);

    const prevSlide = useCallback(() => {
        if (slides.length <= 1) return;
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }, [slides.length]);

    useEffect(() => {
        if (isCarouselHovered || slides.length <= 1) return;
        const interval = setInterval(nextSlide, 3800);
        return () => clearInterval(interval);
    }, [isCarouselHovered, slides.length, nextSlide]);

    const currentSlideMeta = slides[currentSlide] ? getSlideMeta(slides[currentSlide], currentSlide) : { title: 'Overview', type: 'Desktop', isMobile: false };

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

                {/* ── INTERACTIVE PERSPECTIVE CAROUSEL (Auto-Scrolling Showcase) ── */}
                <div 
                    className="relative group mb-16 select-none"
                    onMouseEnter={() => setIsCarouselHovered(true)}
                    onMouseLeave={() => setIsCarouselHovered(false)}
                    onTouchStart={() => setIsCarouselHovered(true)}
                >
                    {/* Background offset shadow layer (Signature Jantra style) */}
                    <div className="absolute inset-0 bg-slate-950 rounded-[2rem] translate-x-3 translate-y-3 transition-transform group-hover:translate-x-1.5 group-hover:translate-y-1.5 duration-300 -z-10" />

                    {/* Main Carousel Viewport Frame */}
                    <div className="relative aspect-[16/10] sm:aspect-[21/10] w-full rounded-[2rem] overflow-hidden bg-slate-950 border border-slate-200/90 shadow-2xl flex flex-col justify-between">
                        
                        {/* Browser Top Navigation Bar */}
                        <div className="relative z-30 h-10 sm:h-12 bg-slate-900/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 flex items-center justify-between pointer-events-none">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-red-400/90" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400/90" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/90" />
                                </div>
                                <div className="hidden sm:flex items-center gap-2 ml-4 bg-white/5 rounded-md px-3 py-1 border border-white/10 text-[9px] font-mono text-slate-300">
                                    <span className="text-emerald-400 font-bold">https://</span>
                                    <span>{project.liveUrl ? project.liveUrl.replace(/^https?:\/\//, '').replace(/\/$/, '') : `${project.slug}.jantrasoft.online`}</span>
                                </div>
                            </div>

                            {/* Perspective Badge & Slide Counter */}
                            <div className="flex items-center gap-3 pointer-events-auto">
                                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 text-[8.5px] font-mono text-white">
                                    <span className={`w-1.5 h-1.5 rounded-full ${isCarouselHovered ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`} />
                                    <span className="font-bold text-orange-400">{currentSlideMeta.type}:</span>
                                    <span className="hidden xs:inline">{currentSlideMeta.title}</span>
                                </div>
                                <span className="bg-slate-950/80 px-2.5 py-1 rounded-md text-[9px] font-mono font-black text-slate-400 border border-white/10">
                                    {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                                </span>
                            </div>
                        </div>

                        {/* Slide Display Canvas */}
                        <div className="relative flex-1 w-full h-full overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentSlide}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    className="relative w-full h-full"
                                >
                                    {currentSlideMeta.isMobile ? (
                                        /* Centered Mobile Device Viewport */
                                        <div className="relative w-full h-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-3 sm:p-5 overflow-hidden">
                                            {/* Blurred ambient backdrop of the screenshot */}
                                            {slides[currentSlide] && (
                                                <Image
                                                    src={slides[currentSlide]}
                                                    alt=""
                                                    fill
                                                    className="object-cover opacity-20 blur-3xl scale-125 pointer-events-none"
                                                />
                                            )}
                                            {/* Centered Smartphone Frame */}
                                            <div className="relative h-full max-h-[360px] sm:max-h-[420px] aspect-[9/19] rounded-[2rem] bg-slate-950 p-2 sm:p-2.5 shadow-[0_25px_60px_rgba(0,0,0,0.9)] border-2 border-white/20 z-10 flex flex-col justify-center">
                                                <div className="relative w-full h-full rounded-[1.4rem] overflow-hidden bg-slate-900">
                                                    {/* Dynamic Island Notch */}
                                                    <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-3 bg-black rounded-full z-30 pointer-events-none" />
                                                    {slides[currentSlide] && (
                                                        <Image
                                                            src={slides[currentSlide]}
                                                            alt={`${project.title} Mobile View`}
                                                            fill
                                                            priority
                                                            sizes="(max-width: 768px) 50vw, 300px"
                                                            className="object-cover object-top"
                                                        />
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none z-20" />
                                                </div>
                                            </div>

                                            {/* Side info callout */}
                                            <div className="hidden md:flex flex-col text-left absolute right-8 bottom-8 z-10 max-w-[220px] bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-white/10 text-white shadow-xl pointer-events-none">
                                                <p className="text-[8px] font-mono text-orange-400 font-bold uppercase tracking-widest mb-1">Mobile Architecture</p>
                                                <p className="text-[11px] font-bold uppercase text-slate-200">Responsive Touch Viewport</p>
                                                <p className="text-[9px] text-slate-400 mt-1 leading-relaxed">Full mobile parity optimized for iOS & Android screens.</p>
                                            </div>
                                        </div>
                                    ) : (
                                        /* Desktop Viewport Canvas */
                                        <div className="relative w-full h-full bg-slate-950">
                                            {slides[currentSlide] ? (
                                                <Image
                                                    src={slides[currentSlide]}
                                                    alt={`${project.title} - ${currentSlideMeta.title}`}
                                                    fill
                                                    priority
                                                    sizes="(max-width: 768px) 100vw, 1200px"
                                                    className="object-cover object-top opacity-100 transition-transform duration-700 hover:scale-[1.015]"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-white/5 font-black text-6xl uppercase tracking-tighter">Jantra Archive</div>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            {/* Floating Prev / Next Controls */}
                            {slides.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={prevSlide}
                                        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-slate-950/70 hover:bg-orange-600 text-white backdrop-blur-md border border-white/15 transition-all shadow-xl active:scale-90 hover:scale-105"
                                        aria-label="Previous Perspective"
                                    >
                                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={nextSlide}
                                        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-slate-950/70 hover:bg-orange-600 text-white backdrop-blur-md border border-white/15 transition-all shadow-xl active:scale-90 hover:scale-105"
                                        aria-label="Next Perspective"
                                    >
                                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Bottom Status / Auto-Scroll Progress Bar */}
                        <div className="relative z-30 h-1 bg-white/10 w-full overflow-hidden">
                            <motion.div
                                key={`${currentSlide}-${isCarouselHovered}`}
                                initial={{ width: "0%" }}
                                animate={{ width: isCarouselHovered ? "0%" : "100%" }}
                                transition={{ duration: isCarouselHovered ? 0 : 3.8, ease: "linear" }}
                                className="h-full bg-orange-500"
                            />
                        </div>
                    </div>

                    {/* Perspective Navigation Tabs Strip (Below Frame) */}
                    {slides.length > 1 && (
                        <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
                            {slides.map((slideUrl, idx) => {
                                const meta = getSlideMeta(slideUrl, idx);
                                const isActive = idx === currentSlide;
                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setCurrentSlide(idx)}
                                        className={`group/btn flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[8.5px] font-mono font-bold uppercase tracking-wider transition-all ${
                                            isActive
                                                ? "bg-slate-950 text-white border-orange-500 shadow-md scale-105"
                                                : "bg-white text-slate-500 border-slate-200 hover:border-slate-400 hover:text-slate-900"
                                        }`}
                                    >
                                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-orange-500' : 'bg-slate-300 group-hover/btn:bg-slate-400'}`} />
                                        <span>{meta.title}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
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
