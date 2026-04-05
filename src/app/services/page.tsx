"use client";

import LottiePlayer from "@/components/LottiePlayer";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
    ArrowRight, 
    Code, Smartphone, Bot, Workflow, 
    Cloud, BarChart
} from "lucide-react";

const services = [
    {
        title: "Software Eng",
        slug: "custom-software",
        description: "Scale high-performance enterprise systems with production-grade infra.",
        icon: Code,
        lottieSrc: "/lottie/software-development-green.json",
        features: ["Scalable", "Pro Quality"],
        id: "01"
    },
    {
        title: "AI Solutions",
        slug: "ai-agent",
        description: "Autonomous intelligent agents and deep learning automation.",
        icon: Bot,
        lottieSrc: "/lottie/assistant-bot.json",
        features: ["AI Logic", "Automation"],
        id: "02"
    },
    {
        title: "Mobile App",
        slug: "mobile-app",
        description: "Premium native experiences for iOS and Android ecosystems.",
        icon: Smartphone,
        lottieSrc: "/lottie/app-development.json",
        features: ["iOS", "Android"],
        id: "03"
    },
    {
        title: "Automation",
        slug: "workflow-automation",
        description: "Strategic workflow optimization and process engineering.",
        icon: Workflow,
        lottieSrc: "/lottie/automatic.json",
        features: ["API", "Logic"],
        id: "04"
    },
    {
        title: "Cloud Infra",
        slug: "saas",
        description: "Secure foundations for global SaaS and platform delivery.",
        icon: Cloud,
        lottieSrc: "/lottie/saas.json",
        features: ["Cloud", "Security"],
        id: "05"
    },
    {
        title: "BI Analytics",
        slug: "business-intelligence",
        description: "Data-driven visualization and strategic market insights.",
        icon: BarChart,
        lottieSrc: "/lottie/bpo-3d.json",
        features: ["Data", "Reports"],
        id: "06"
    }
];

export default function ServicesPage() {
    return (
        <main className="relative w-full min-h-screen bg-white pb-32">
            {/* ── BG SYMBOLS [UNOBTRUSIVE] ── */}
            <div className="absolute top-[10%] right-0 w-[500px] h-[500px] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-[1540px] mx-auto px-4 sm:px-12 pt-24 sm:pt-36 relative z-10">
                
                {/* ── COMPACT HEADER ── */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 sm:mb-16">
                    <div className="space-y-3 sm:space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-[2px] bg-orange-500" />
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-orange-600">Expertise</span>
                        </div>
                        <h1 className="text-4xl sm:text-7xl lg:text-8xl font-black text-slate-900 leading-[0.85] tracking-tighter uppercase">
                            Digital <br />
                            <span className="text-transparent" style={{ WebkitTextStroke: "1px #0f172a" }}>Expertise</span>
                            <span className="text-orange-500">.</span>
                        </h1>
                    </div>
                </div>

                {/* ── HIGH-DENSITY GRID ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10">
                    
                    {/* SIDEBAR [HIDDEN ON MOBILE] */}
                    <div className="hidden lg:block lg:col-span-3 sticky top-36 h-fit">
                        <div className="p-10 rounded-[2.5rem] bg-slate-950 text-white space-y-6 relative overflow-hidden group">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[50px] rounded-full" />
                             <h4 className="text-xl font-black tracking-tighter uppercase relative z-10">Scale Today.</h4>
                             <Link href="/contact" className="relative z-10 w-full py-4 rounded-xl bg-orange-600 text-white text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white hover:text-slate-950 transition-all active:scale-95">
                                Talk To Us <ArrowRight className="w-4 h-4" />
                             </Link>
                        </div>
                    </div>

                    {/* DENSE SERVICE GRID - 2 COLUMN ON ALL SCREENS */}
                    <div className="lg:col-span-9 grid grid-cols-2 gap-3 sm:gap-8">
                        {services.map((service, i) => (
                            <motion.div 
                                key={service.slug} 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                className="group relative flex flex-col transition-all duration-700 h-full"
                            >
                                <div className="relative aspect-square sm:aspect-[16/10] rounded-[1.5rem] sm:rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center justify-center p-4 sm:p-10 mb-4 sm:mb-6 overflow-hidden group-hover:bg-white group-hover:shadow-xl transition-all duration-700">
                                    <div className="absolute top-4 left-4 z-20">
                                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-orange-500 group-hover:bg-slate-950 group-hover:text-white transition-all shadow-sm">
                                            <service.icon className="w-4 h-4 sm:w-5 s:h-5 " />
                                        </div>
                                    </div>
                                    
                                    <LottiePlayer src={service.lottieSrc} className="w-full h-full max-w-[120px] sm:max-w-[240px] opacity-100 group-hover:scale-110 transition-transform duration-1000" />
                                </div>

                                <div className="px-1 sm:px-4 text-left flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[7px] font-black text-orange-500/40 uppercase tracking-widest">#{service.id}</span>
                                        <div className="h-[1px] flex-1 bg-slate-100" />
                                    </div>
                                    <h3 className="text-base sm:text-3xl font-black text-slate-900 tracking-tighter leading-[0.95] uppercase mb-2 group-hover:text-orange-600 transition-colors">
                                        {service.title}
                                    </h3>
                                    <p className="hidden sm:block text-[11px] sm:text-[13px] text-slate-500 font-medium leading-tight mb-4 flex-1">
                                        {service.description}
                                    </p>
                                    
                                    <Link href={`/services/${service.slug}`} className="group-hover:translate-x-1 transition-transform inline-flex items-center gap-2 text-[8px] sm:text-[10px] font-black text-slate-950 uppercase tracking-widest mt-auto pb-4">
                                        Explore <ArrowRight className="w-3 h-3 text-orange-500" />
                                    </Link>
                                </div>
                                <Link href={`/services/${service.slug}`} className="absolute inset-0 z-30" />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* ── MOBILE CTA [STUNNING & STICKY BOTTOM ATTEMPT — FLOATING] ── */}
                <div className="lg:hidden mt-20 p-8 rounded-[2rem] bg-orange-600 text-white space-y-4 text-center shadow-2xl shadow-orange-500/30">
                     <h2 className="text-2xl font-black tracking-tighter uppercase leading-none">Global Delivery</h2>
                     <Link href="/contact" className="w-full py-4 rounded-xl bg-white text-slate-900 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-transform">
                        Hire Team <ArrowRight className="w-3 h-3" />
                     </Link>
                </div>
            </div>
        </main>
    );
}
