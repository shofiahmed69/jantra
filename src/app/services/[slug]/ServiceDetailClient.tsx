'use client'

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronDown, Compass, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ServiceDetail, IconHelper } from "@/data/services";
import LottiePlayer from "@/components/LottiePlayer";

export default function ServiceDetailClient({ 
    service,
    slug 
}: { 
    service: ServiceDetail;
    slug: string;
}) {
    // FAQ expanded states
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    // Mouse position state for container tracking (spotlight effect)
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
            className="relative w-full min-h-screen bg-white pb-32 overflow-x-hidden selection:bg-orange-100"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                // Consumption of mouse coordinates in CSS variables for ambient background spotlights
                "--mouse-x": `${coords.x}px`,
                "--mouse-y": `${coords.y}px`,
            } as React.CSSProperties}
        >
            {/* Dynamic mouse-tracking spotlight radial gradient */}
            {isHovered && (
                <div 
                    className="absolute inset-0 pointer-events-none -z-10 transition-opacity duration-500 opacity-30"
                    style={{
                        background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), oklch(0.85 0.15 45 / 0.15), transparent 80%)`
                    }}
                />
            )}

            {/* Dynamic ambient background glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-orange-200/10 blur-[130px] rounded-full -z-20 pointer-events-none" />
            <div className="absolute top-[35%] right-[-10%] w-[500px] h-[500px] bg-blue-100/5 blur-[120px] rounded-full -z-20 pointer-events-none" />

            {/* Grid pattern background */}
            <div className="absolute top-0 inset-x-0 h-[600px] overflow-hidden pointer-events-none select-none -z-10 opacity-[0.015] md:opacity-[0.02]">
                <div className="w-full h-full bg-[linear-gradient(to_right,#ea580c_1px,transparent_1px),linear-gradient(to_bottom,#ea580c_1px,transparent_1px)] bg-[size:4rem_4rem]" />
            </div>

            <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-24 sm:pt-36">
                
                {/* ── BREADCRUMB ── */}
                <Link href="/services" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-orange-600 transition-colors mb-12">
                     <ArrowLeft className="w-3.5 h-3.5" /> Back to Services
                 </Link>

                {/* ── HERO section with clean dual-layer side illustration ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-24 sm:mb-32">
                    <div className="lg:col-span-7 space-y-8 text-left">
                         <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-[9px] font-black uppercase tracking-widest text-orange-600 bg-orange-50 px-4 py-2 rounded-full border border-orange-100">{service.category}</span>
                            {service.demoUrl && (
                                <a 
                                    href={service.demoUrl} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-[9px] font-black uppercase tracking-widest text-slate-600 hover:text-orange-600 bg-slate-50 px-4 py-2 rounded-full border border-slate-100 flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
                                >
                                    View Live Demo <Play className="w-3 h-3 text-orange-500 fill-orange-500" />
                                </a>
                            )}
                            <div className="w-12 h-[1px] bg-slate-200" />
                         </div>
                         <h1 className="text-[clamp(2.5rem,6.5vw,4.5rem)] font-black text-slate-900 tracking-tight leading-none uppercase">
                             {service.title}<span className="text-orange-500">.</span>
                         </h1>
                         <p className="text-slate-500 text-sm sm:text-base font-medium leading-relaxed max-w-xl">
                             {service.longDescription || service.description}
                         </p>
                    </div>

                    <div className="lg:col-span-5 aspect-[1.1] relative group select-none">
                         {/* Dual-Layer Offset Style Backdrop */}
                         <div className="absolute inset-0 bg-slate-950 rounded-[2.5rem] translate-x-3 translate-y-3 transition-transform group-hover:translate-x-1 group-hover:translate-y-1 duration-300" />
                         
                         <div className={`absolute inset-0 ${service.descBg} rounded-[2.5rem] border border-slate-200 shadow-lg flex items-center justify-center overflow-hidden ${service.banner ? 'p-0' : 'p-10'} bg-white`}>
                              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ea580c_1px,transparent_1px),linear-gradient(to_bottom,#ea580c_1px,transparent_1px)] bg-[size:16px_16px] opacity-[0.01]" />
                              {service.banner ? (
                                  <img src={service.banner.startsWith("http://") || service.banner.includes("sslip.io") ? `/api/image-proxy?url=${encodeURIComponent(service.banner)}` : service.banner} alt={service.title} className="w-full h-full object-cover" />
                              ) : (
                                  <LottiePlayer src={service.lottie} className="w-full h-full max-w-[320px] object-contain scale-110" />
                              )}
                         </div>
                    </div>
                </div>

                {/* ── CORE DELIVERABLES (Dual-Layer Premium Layout) ── */}
                <div className="space-y-8 mb-28 sm:mb-36">
                    <div className="text-left max-w-xl">
                        <span className="text-orange-600 font-bold tracking-widest text-[9px] uppercase mb-2 block">Key Capabilities</span>
                        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight uppercase">What We Deliver<span className="text-orange-500">.</span></h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                        {service.deliverables.map((del, i) => (
                            <div key={i} className="relative group text-left h-full">
                                {/* Dual-Layer Backdrop */}
                                <div className="absolute inset-0 bg-slate-950 rounded-[2rem] translate-x-2.5 translate-y-2.5 transition-transform group-hover:translate-x-1 group-hover:translate-y-1 duration-300" />
                                
                                <div className="relative h-full p-8 rounded-[2rem] bg-white border border-slate-200 flex flex-col justify-between">
                                    <div>
                                        <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6 border border-orange-100 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                                            <IconHelper name={del.icon} className="w-5 h-5" />
                                        </div>
                                        <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight mb-3">{del.title}</h3>
                                        <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">{del.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── PROCESS STEPS (Clean Interactive Step Layout) ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-28 sm:mb-36">
                    <div className="lg:col-span-4 text-left lg:sticky lg:top-24">
                        <span className="text-orange-600 font-bold tracking-widest text-[9px] uppercase mb-2 block">Methodology</span>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight uppercase leading-tight mb-4">Our <br className="hidden lg:block"/>Process.</h2>
                        <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed max-w-sm">We operate in highly organized, iterative sprints to ensure maximum visibility, transparency, and product alignment.</p>
                    </div>
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        {service.process.map((step, i) => (
                            <div key={i} className="relative group text-left">
                                <div className="absolute inset-0 bg-slate-950 rounded-[1.75rem] translate-x-2 translate-y-2 transition-transform group-hover:translate-x-1 group-hover:translate-y-1 duration-300" />
                                <div className="relative p-6 rounded-[1.75rem] bg-white border border-slate-200 flex items-center gap-6 sm:gap-8">
                                    <span className="text-3xl sm:text-4xl font-black text-slate-200 group-hover:text-orange-500 transition-colors duration-300">{step.num}</span>
                                    <div className="space-y-1">
                                        <h4 className="font-black text-slate-900 text-sm sm:text-base uppercase tracking-tight">{step.title}</h4>
                                        <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-normal">{step.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── TECH & CALL-TO-ACTION (Dual-Layer Side-by-Side) ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-28 sm:mb-36">
                    
                    {/* TECH STACK */}
                    <div className="relative group text-left h-full">
                        <div className="absolute inset-0 bg-slate-950 rounded-[2.5rem] translate-x-3 translate-y-3 transition-transform group-hover:translate-x-1 group-hover:translate-y-1 duration-300" />
                        <div className="relative p-8 sm:p-12 rounded-[2.5rem] bg-white border border-slate-200 space-y-8 flex flex-col justify-between h-full">
                            <div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-orange-600 bg-orange-50 px-3.5 py-1.5 rounded-full border border-orange-100 mb-6 inline-block">Architecture</span>
                                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 uppercase">Tech Stack.</h2>
                                <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed mt-2">
                                    We utilize modern, proven tools and frameworks to engineer robust databases and maintain clean module separations.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2 pt-4">
                                {service.techStack.map((tech, i) => (
                                    <span key={i} className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-orange-500/30 hover:text-orange-600 hover:bg-orange-50/20 hover:scale-102 transition-all duration-300">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* REDESIGNED DUAL-LAYER CTA */}
                    <div className="relative group text-left h-full">
                        <div className="absolute inset-0 bg-slate-950 rounded-[2.5rem] translate-x-3 translate-y-3 transition-transform group-hover:translate-x-1 group-hover:translate-y-1 duration-300" />
                        <div className="relative p-8 sm:p-12 rounded-[2.5rem] bg-gradient-to-br from-orange-500 to-orange-600 text-white flex flex-col justify-between h-full overflow-hidden border border-orange-600/30 shadow-xl shadow-orange-500/10">
                             {/* Ambient overlay grid pattern */}
                             <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none select-none opacity-40" />
                             <div className="space-y-4 relative z-10">
                                <span className="text-[9px] font-black uppercase tracking-widest text-orange-100 bg-orange-700/30 px-3.5 py-1.5 rounded-full border border-white/10 inline-block mb-2">Instant Consultation</span>
                                <h2 className="text-3xl font-black tracking-tight uppercase leading-none">Ready to Build?</h2>
                                <p className="text-orange-50 text-xs sm:text-sm font-medium leading-relaxed max-w-sm">
                                    Schedule a brief discovery call to explore your project architecture and get a comprehensive scope of work.
                                </p>
                             </div>
                             <div className="relative z-10 pt-8 sm:pt-12">
                                 <Link href="/contact" className="w-full py-5 rounded-2xl bg-white text-orange-600 font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-950 hover:text-white transition-all duration-300 shadow-xl active:scale-95 cursor-pointer">
                                    Get A Quote <ArrowRight className="w-4 h-4" />
                                 </Link>
                             </div>
                        </div>
                    </div>
                </div>

                {/* ── ACCORDION FAQ SECTION (Fluid Smooth Transition) ── */}
                <div className="max-w-3xl mx-auto space-y-8 text-left mb-16">
                    <div className="text-center space-y-2">
                        <span className="text-orange-600 font-bold tracking-widest text-[9px] uppercase">Got Questions?</span>
                        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight uppercase">Service FAQs<span className="text-orange-500">.</span></h2>
                    </div>
                    
                    <div className="border-t border-b border-slate-200 divide-y divide-slate-100">
                        {service.faqs.map((faq, i) => {
                            const isFaqOpen = openFaqIndex === i;
                            return (
                                <div key={i} className="py-4">
                                    <button
                                        onClick={() => setOpenFaqIndex(isFaqOpen ? null : i)}
                                        className="w-full flex items-center justify-between text-left py-2 outline-none group"
                                    >
                                        <h3 className={`font-bold text-sm sm:text-base uppercase tracking-tight transition-colors duration-200 ${isFaqOpen ? 'text-orange-600' : 'text-slate-800 group-hover:text-orange-500'}`}>
                                            {faq.question}
                                        </h3>
                                        <span className={`shrink-0 rounded-full border p-1.5 transition-all duration-300 ${isFaqOpen ? 'rotate-180 bg-orange-50 border-orange-200 text-orange-600' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                                            <ChevronDown className="w-4 h-4" />
                                        </span>
                                    </button>
                                    
                                    <AnimatePresence initial={false}>
                                        {isFaqOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.25, ease: "easeInOut" }}
                                                className="overflow-hidden"
                                            >
                                                <p className="pt-2 pb-4 text-xs sm:text-sm leading-relaxed text-slate-500 font-medium">
                                                    {faq.answer}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── AVAILABLE LOCATIONS (Refined Minimalist Styling) ── */}
                <div className="max-w-3xl mx-auto border-t border-slate-200 pt-12 text-center">
                    <span className="text-slate-400 font-bold tracking-widest text-[9px] uppercase mb-4 block">Available in Major Tech Hubs</span>
                    <div className="flex flex-wrap justify-center gap-4">
                        {["new-york", "san-francisco", "london", "austin", "toronto", "berlin"].map((city) => (
                            <Link 
                                key={city} 
                                href={`/services/${slug}/${city}`} 
                                className="text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-orange-600 bg-slate-50 hover:bg-orange-50/20 px-3 py-1.5 rounded-lg border border-slate-200/50 hover:border-orange-500/20 transition-all duration-200"
                            >
                                {city.replace('-', ' ')}
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </main>
    );
}
