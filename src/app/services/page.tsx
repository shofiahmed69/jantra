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
        <main className="relative w-full min-h-screen bg-white overflow-hidden pb-20">
            {/* ── BACKGROUND TEXT ── */}
            <div className="absolute top-[5%] left-0 w-full overflow-hidden opacity-[0.03] pointer-events-none select-none z-0">
                <div className="flex whitespace-nowrap animate-marquee-slow">
                    <span className="text-[12rem] font-black tracking-tighter leading-none mr-24 uppercase">EXCELLENCE. INNOVATION. QUALITY. RESULTS.</span>
                </div>
            </div>

            <div className="max-w-[1540px] mx-auto px-6 sm:px-12 pt-28 sm:pt-36 relative z-10">
                
                {/* ── PROFESSIONAL INTEGRATED HERO ── */}
                <div className="grid lg:grid-cols-12 gap-8 items-start mb-12">
                    
                    {/* Left Column Header (Spans 3 cols) */}
                    <div className="lg:col-span-3 space-y-8 sticky top-36">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-[2px] bg-orange-500" />
                                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-orange-600">Our Services</span>
                            </div>
                            <h1 className="text-5xl sm:text-6xl font-black text-slate-900 leading-[0.85] tracking-tighter uppercase">
                                Our <br />
                                <span className="text-transparent" style={{ WebkitTextStroke: "1px #0f172a" }}>Expertise</span>
                                <span className="text-orange-500">.</span>
                            </h1>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed border-l-2 border-slate-100 pl-6">
                                Delivering professional digital solutions for industry leaders.
                            </p>
                        </div>

                        <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]" />
                                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Available for Hire</span>
                            </div>
                            <Link href="/contact" className="w-full py-4 rounded-xl bg-orange-600 text-white text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-950 transition-colors shadow-lg shadow-orange-500/20">
                                Get In Touch <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </div>

                    {/* Services Grid (Spans 9 cols) */}
                    <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {services.map((service, i) => (
                            <motion.div 
                                key={service.slug} 
                                whileHover={{ y: -4 }}
                                className="group relative rounded-3xl sm:rounded-[2.5rem] bg-slate-50 border border-slate-100 p-4 sm:p-6 flex flex-col items-stretch transition-all duration-700 hover:bg-white hover:border-slate-200"
                            >
                                {/* RADIANT UNDERGLOW */}
                                <div className="absolute inset-x-12 -bottom-5 h-16 bg-orange-500/10 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                
                                <div className="flex justify-between items-center mb-4 sm:mb-6 relative z-10">
                                   <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-orange-500 group-hover:bg-slate-950 group-hover:text-white transition-colors duration-500">
                                            <service.icon className="w-4 h-4" />
                                        </div>
                                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">{service.id}</span>
                                   </div>
                                   <Link href={`/services/${service.slug}`} className="w-6 h-6 rounded-full border border-slate-100 flex items-center justify-center hover:bg-slate-100 transition-colors">
                                       <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-slate-950" />
                                   </Link>
                                </div>

                                <div className="relative aspect-[16/10] rounded-2xl sm:rounded-[2rem] bg-white border border-slate-100/50 flex items-center justify-center p-4 sm:p-6 mb-4 sm:mb-6 overflow-hidden">
                                    <LottiePlayer src={service.lottieSrc} className="w-full h-full grayscale-0 opacity-80 group-hover:opacity-100 transition-all duration-1000" />
                                </div>

                                <div className="space-y-4">
                                    <h3 className="h-[2.5rem] text-[18px] sm:text-xl font-black text-slate-900 tracking-tighter leading-[0.9] group-hover:text-orange-600 transition-colors duration-500 uppercase overflow-hidden line-clamp-2">{service.title}</h3>
                                    <div className="h-[2.5rem] overflow-hidden">
                                        <p className="text-[11px] sm:text-[12px] text-slate-500 font-medium leading-relaxed line-clamp-2">{service.description}</p>
                                    </div>
                                    
                                    <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                                        {service.features.map((feat, fIdx) => (
                                            <span key={fIdx} className="text-[7px] font-black uppercase tracking-widest text-slate-400 px-2 py-0.5 rounded-full bg-white border border-slate-100 group-hover:text-slate-950 group-hover:border-slate-200">
                                                {feat}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <Link href={`/services/${service.slug}`} className="mt-6 py-3 rounded-xl bg-orange-50/50 text-orange-600 border border-orange-100 flex items-center justify-center gap-2 group-hover:bg-orange-600 group-hover:text-white transition-all duration-500 shadow-sm">
                                    <span className="text-[8px] font-black uppercase tracking-[0.3em]">Learn More</span>
                                    <ArrowRight className="w-3 h-3" />
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                </div>

                {/* ── FOOTER CTA ── */}
                <footer className="mt-12 relative overflow-hidden rounded-[3rem] bg-slate-950 p-10 text-center">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-600 opacity-10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
                    <div className="relative z-10">
                        <h2 className="text-3xl sm:text-5xl font-black mb-6 text-white tracking-tighter leading-none uppercase">Start Your Project.</h2>
                        <Link href="/contact" className="inline-flex items-center gap-4 px-10 py-4 bg-orange-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-slate-950 transition-all shadow-2xl active:scale-95 group">
                            Contact Our Team <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </footer>
            </div>
        </main>
    );
}
