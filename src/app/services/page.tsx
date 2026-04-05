"use client";

import LottiePlayer from "@/components/LottiePlayer";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
    ArrowRight, 
    Code, Smartphone, Bot, Workflow, 
    Cloud, BarChart, ExternalLink 
} from "lucide-react";

const services = [
    {
        title: "Software Engineering",
        slug: "custom-software",
        description: "High-performance enterprise systems built for global scale and production-grade reliability.",
        icon: Code,
        lottieSrc: "/lottie/software-development-green.json",
        features: ["Scalable Architecture", "Professional Quality", "Maintenance"],
        id: "SER-01"
    },
    {
        title: "AI Solutions",
        slug: "ai-agent",
        description: "Intelligent autonomous systems and AI-powered applications to drive operational efficiency.",
        icon: Bot,
        lottieSrc: "/lottie/assistant-bot.json",
        features: ["AI Integration", "Training", "Strategic Planning"],
        id: "SER-02"
    },
    {
        title: "Mobile Development",
        slug: "mobile-app",
        description: "Premium native and cross-platform mobile experiences for iOS and Android.",
        icon: Smartphone,
        lottieSrc: "/lottie/app-development.json",
        features: ["iOS & Android", "UI/UX Design", "Launch Support"],
        id: "SER-03"
    },
    {
        title: "Process Automation",
        slug: "workflow-automation",
        description: "Streamlining complex business workflows through modern automation technologies.",
        icon: Workflow,
        lottieSrc: "/lottie/automatic.json",
        features: ["Business Logic", "API Integration", "Efficiency"],
        id: "SER-04"
    },
    {
        title: "Cloud Infrastructure",
        slug: "saas",
        description: "Cloud-native foundations and SaaS platforms architected for security and performance.",
        icon: Cloud,
        lottieSrc: "/lottie/saas.json",
        features: ["Secure Cloud", "Scaled Delivery", "Monitoring"],
        id: "SER-05"
    },
    {
        title: "Business Intelligence",
        slug: "business-intelligence",
        description: "Advanced data visualization and real-time analytics for informed decision making.",
        icon: BarChart,
        lottieSrc: "/lottie/bpo-3d.json",
        features: ["Data Analytics", "Actionable Insights", "Reporting"],
        id: "SER-06"
    }
];

export default function ServicesPage() {
    return (
        <main className="relative w-full min-h-screen bg-white pb-32">
            {/* ── BACKGROUND ACCENT [DESKTOP ONLY] ── */}
            <div className="hidden lg:block absolute top-[5%] left-0 w-full overflow-hidden opacity-[0.02] pointer-events-none select-none z-0">
                <div className="flex whitespace-nowrap animate-marquee-slow">
                    <span className="text-[12rem] font-black tracking-tighter leading-none mr-24 uppercase">EXCELLENCE. INNOVATION. QUALITY. RESULTS.</span>
                </div>
            </div>

            <div className="max-w-[1540px] mx-auto px-5 sm:px-12 pt-24 sm:pt-36 relative z-10">
                
                {/* ── HEADER ── */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 sm:mb-20">
                    <div className="space-y-4 sm:space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-[2px] bg-orange-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-600">Our Expertise</span>
                        </div>
                        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-slate-900 leading-[0.85] tracking-tighter uppercase">
                            Digital <br />
                            <span className="text-transparent" style={{ WebkitTextStroke: "1px #0f172a" }}>Solutions</span>
                            <span className="text-orange-500">.</span>
                        </h1>
                    </div>
                    <div className="max-w-md border-l-2 border-slate-100 pl-6 lg:pl-10">
                        <p className="text-[14px] text-slate-500 font-medium leading-relaxed uppercase tracking-tight">Architecting production-grade software and autonomous systems for modern industry leaders.</p>
                    </div>
                </div>

                {/* ── MAIN GRID ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    
                    {/* LEFT SIDEBAR INFO [DESKTOP ONLY] */}
                    <div className="hidden lg:block lg:col-span-3 sticky top-36 h-fit space-y-10">
                        <div className="p-10 rounded-[3rem] bg-slate-950 text-white space-y-8 relative overflow-hidden group">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[50px] rounded-full" />
                             <div className="relative z-10 flex items-center gap-2">
                                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                 <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Available For Hire</span>
                             </div>
                             <h4 className="text-2xl font-black tracking-tighter uppercase leading-none relative z-10">Scale Your Vision.</h4>
                             <Link href="/contact" className="relative z-10 w-full py-5 rounded-2xl bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white hover:text-slate-950 transition-all shadow-xl active:scale-95">
                                Talk To Us <ArrowRight className="w-4 h-4" />
                             </Link>
                        </div>
                        <div className="px-6 space-y-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Delivery</h4>
                            <p className="text-[12px] text-slate-500 font-medium leading-relaxed">Our multi-disciplinary team handles everything from initial architectural planning to final production deployment.</p>
                        </div>
                    </div>

                    {/* SERVICES GRID */}
                    <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
                        {services.map((service, i) => (
                            <motion.div 
                                key={service.slug} 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                className="group relative flex flex-col transition-all duration-700 h-full"
                            >
                                <div className="relative aspect-[16/10] rounded-[2rem] sm:rounded-[2.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center p-6 sm:p-10 mb-6 sm:mb-8 overflow-hidden group-hover:bg-white group-hover:shadow-2xl transition-all duration-1000">
                                    <div className="absolute top-8 left-8 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-orange-500 group-hover:bg-slate-950 group-hover:text-white transition-all duration-500 shadow-sm">
                                            <service.icon className="w-5 h-5" />
                                        </div>
                                        <span className="text-[9px] font-black text-slate-300 group-hover:text-slate-400 transition-colors uppercase tracking-widest">{service.id}</span>
                                    </div>
                                    
                                    <LottiePlayer src={service.lottieSrc} className="w-full h-full max-w-[280px] grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" />
                                </div>

                                <div className="px-4 text-left flex-1 flex flex-col">
                                    <h3 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tighter leading-[0.95] uppercase mb-4 group-hover:text-orange-600 transition-colors">
                                        {service.title}
                                    </h3>
                                    <p className="text-[12px] sm:text-[14px] text-slate-500 font-medium leading-relaxed mb-8 flex-1">
                                        {service.description}
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-2 mb-10">
                                        {service.features.map((feat) => (
                                            <span key={feat} className="text-[8px] font-black uppercase tracking-widest text-slate-400 px-3 py-1.5 rounded-full bg-white border border-slate-100 group-hover:text-slate-950 group-hover:border-slate-300">
                                                {feat}
                                            </span>
                                        ))}
                                    </div>

                                    <Link href={`/services/${service.slug}`} className="w-full py-4 rounded-xl bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 border border-slate-100 hover:bg-orange-600 hover:text-white hover:border-orange-500 hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-500">
                                        Service Detail <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* ── MOBILE CTA [AT BOTTOM] ── */}
                <div className="lg:hidden mt-24 p-10 rounded-[2.5rem] bg-orange-600 text-white space-y-6 text-center">
                     <h2 className="text-4xl font-black tracking-tighter uppercase leading-none">Ready to Start?</h2>
                     <p className="text-[14px] font-black uppercase tracking-tight opacity-90">Scale your vision today.</p>
                     <Link href="/contact" className="w-full py-5 rounded-2xl bg-white text-slate-900 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-transform shadow-2xl">
                        Talk To Team <ArrowRight className="w-4 h-4" />
                     </Link>
                </div>
            </div>
        </main>
    );
}
