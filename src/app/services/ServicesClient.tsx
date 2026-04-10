"use client";

import LottiePlayer from "@/components/LottiePlayer";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
    ArrowRight, 
    Code, Smartphone, Bot, Workflow, 
    Cloud, Layout, Cpu, Database
} from "lucide-react";
import { homeServicePreview } from "@/content/site";

export default function ServicesPage() {
    const services = homeServicePreview.map((s, i) => ({
        ...s,
        id: `0${i + 1}`,
        icon: s.title.toLowerCase().includes('mobile') ? Smartphone :
              s.title.toLowerCase().includes('ai') ? Bot :
              s.title.toLowerCase().includes('automation') ? Workflow :
              s.title.toLowerCase().includes('cloud') ? Cloud :
              s.title.toLowerCase().includes('saas') ? Cpu :
              s.title.toLowerCase().includes('software') ? Code :
              s.title.toLowerCase().includes('interface') ? Layout : Database,
        slug: s.title.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-')
    }));

    return (
        <main className="w-full min-h-screen bg-white pb-32">
            <div className="max-w-[1280px] mx-auto px-6 sm:px-12 pt-28 sm:pt-40">
                
                {/* ── HEADER ── */}
                <div className="max-w-2xl mb-16 sm:mb-24">
                    <span className="text-orange-600 font-bold tracking-widest text-xs uppercase mb-6 block">EXPERTISE Registry</span>
                    <h1 className="text-5xl sm:text-7xl font-black text-slate-900 leading-[0.9] tracking-tighter uppercase mb-8">
                        Our <br /> Expertise <span className="text-orange-500">.</span>
                    </h1>
                    <p className="text-slate-500 text-lg font-medium leading-relaxed">
                        High-performance engineering solutions designed to solve complex industrial digital challenges.
                    </p>
                </div>

                {/* ── SIMPLE CLEAN GRID: 1-COL MOBILE, 2-COL DESKTOP ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
                    {services.map((service) => (
                        <motion.div 
                            key={service.slug} 
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="group relative bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8 sm:p-12 flex flex-col md:flex-row items-center gap-10 hover:bg-white hover:border-slate-300 hover:shadow-2xl transition-all duration-700"
                        >
                            {/* LOTTIE AREA */}
                            <div className="w-full md:w-1/3 aspect-square max-w-[200px] flex items-center justify-center p-4">
                                <LottiePlayer 
                                    src={service.animationSrc!} 
                                    className="w-full h-full opacity-100 group-hover:scale-110 transition-transform duration-1000" 
                                />
                            </div>

                            {/* CONTENT AREA */}
                            <div className="flex-1 space-y-4 text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                                        <service.icon className="w-5 h-5" />
                                    </div>
                                    <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">#{service.id}</span>
                                </div>
                                <h3 className="text-3xl font-black text-slate-950 tracking-tighter uppercase leading-none">{service.title}</h3>
                                <p className="text-[13px] text-slate-500 font-medium leading-relaxed line-clamp-2">{service.description}</p>
                                <Link href={`/services/${service.slug}`} className="inline-flex items-center gap-2 text-[10px] font-black text-slate-950 uppercase tracking-widest pt-2 group-hover:text-orange-600 transition-colors">
                                    Explore Protocol <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                            <Link href={`/services/${service.slug}`} className="absolute inset-0 z-20" />
                        </motion.div>
                    ))}
                </div>

                {/* ── BOTTOM CTA BOX ── */}
                <div className="mt-24 p-12 sm:p-16 rounded-[4rem] bg-slate-950 text-white flex flex-col md:flex-row items-center justify-between gap-12">
                     <div className="space-y-4 text-center md:text-left">
                         <h2 className="text-4xl font-black tracking-tighter uppercase">Ready to Start?</h2>
                         <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-sm uppercase tracking-tight">Our squad operates across time zones to ensure elite project delivery speed.</p>
                     </div>
                     <Link href="/contact" className="px-12 py-6 rounded-2xl bg-orange-600 text-white text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white hover:text-slate-950 transition-all shadow-xl active:scale-95">
                        Initialize Discovery <ArrowRight className="w-5 h-5" />
                     </Link>
                </div>
            </div>
        </main>
    );
}
