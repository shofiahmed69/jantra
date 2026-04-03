"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Target, Users, Zap, Shield, Globe, User, Sparkles, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

interface TeamMember {
    id: string;
    name: string;
    role: string;
    avatar?: string;
}

export default function AboutPage() {
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const response = await api.get("/team");
                setTeam(response.data || []);
            } catch (error) {
                console.error("Failed to fetch team", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTeam();
    }, []);

    return (
        <main className="relative w-full min-h-screen bg-white overflow-hidden pb-40">
            {/* ── Signature Atmospheric Glow ── */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120vw] h-[500px] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

            <div className="max-w-[1440px] mx-auto px-6 sm:px-12 pt-32 sm:pt-48">
                
                {/* ── CINEMATIC HERO BANNER ── */}
                <header className="mb-24 sm:mb-40">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-[2px] bg-orange-500" />
                            <span className="text-[11px] font-black uppercase tracking-[0.6em] text-orange-600">Identity</span>
                        </div>
                        
                        <div className="grid lg:grid-cols-[1.5fr,1fr] gap-12 items-end">
                            <h1 className="text-7xl sm:text-[9rem] font-black text-slate-900 leading-[0.8] tracking-tighter">
                                Engineering <br />
                                <span className="text-transparent" style={{ WebkitTextStroke: "1px #0f172a" }}>Potential</span>
                                <span className="text-orange-500">.</span>
                            </h1>
                            
                            <p className="text-xl sm:text-2xl text-slate-500 font-medium leading-relaxed max-w-md border-l-4 border-slate-100 pl-8">
                                JANTRA is a premium software lab architecting high-fidelity systems and AI automation for global visionaries.
                            </p>
                        </div>
                    </div>
                </header>

                {/* ── COMPANY STORY STAGE ── */}
                <section className="mb-40">
                    <div className="group relative w-full aspect-[21/9] rounded-[4rem] bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center p-12 sm:p-24 transition-all duration-1000 group-hover:bg-white group-hover:border-slate-200">
                        {/* RADIANT UNDERGLOW */}
                        <div className="absolute inset-x-20 -bottom-10 h-40 bg-orange-500/10 blur-[100px] rounded-full opacity-60" />
                        
                        <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center w-full h-full">
                            <div className="space-y-6">
                                 <div className="flex items-center gap-3">
                                     <Sparkles className="w-5 h-5 text-orange-500" />
                                     <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Our Origin</span>
                                 </div>
                                 <h2 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter leading-none">
                                     The Architecture <br /> of <span className="text-orange-600">Innovation.</span>
                                 </h2>
                            </div>
                            <div className="space-y-6 text-xl text-slate-500 font-medium leading-relaxed border-l-2 border-slate-100 pl-10">
                                <p>Founded in 2024, JANTRA was architected to bridge the gap between complex theoretical compute and scalable enterprise deployments.</p>
                                <p>We don't just write code; we design systems that think, scale, and secure themselves autonomously.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── CORE STRENGTHS LEDGER ── */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-40">
                    {[
                        { icon: Shield, title: "Zero Trust", desc: "Security isn't a feature; it's the foundation of every line we architect." },
                        { icon: Zap, title: "Relentless Compute", desc: "We obsess over milliseconds and compute costs. Performance is non-negotiable." },
                        { icon: Globe, title: "Global Velocity", desc: "Silicon Valley-grade engineering delivered with Dhaka's relentless agility." }
                    ].map((val, i) => (
                        <div key={i} className="group relative p-10 rounded-[3rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500">
                            <div className="w-16 h-16 bg-slate-50 text-slate-900 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-orange-600 group-hover:text-white transition-all duration-500 transform group-hover:rotate-6">
                                <val.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter">{val.title}</h3>
                            <p className="text-base text-slate-500 font-medium leading-relaxed border-t border-slate-50 pt-4">{val.desc}</p>
                            <div className="absolute top-8 right-8 text-[8px] font-black text-slate-100 group-hover:text-orange-500 transition-colors uppercase tracking-[0.4em]">Strength {i+1}</div>
                        </div>
                    ))}
                </section>

                {/* ── TEAM ARCHITECTS GALLERY ── */}
                <section className="mb-40">
                    <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-4">
                            <h2 className="text-5xl sm:text-7xl font-black text-slate-900 tracking-tighter leading-none">The Architects<span className="text-orange-500">.</span></h2>
                            <p className="text-xl text-slate-500 font-medium max-w-md">An elite cohort of senior engineers and product designers.</p>
                        </div>
                        <div className="text-[9px] font-black text-slate-300 uppercase tracking-[0.6em] whitespace-nowrap">Cohort of 2026</div>
                    </header>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                        {loading ? (
                            [...Array(4)].map((_, i) => (
                                <div key={i} className="aspect-[4/5] bg-slate-50 rounded-[2.5rem] flex items-center justify-center overflow-hidden">
                                     <Loader2 className="w-10 h-10 text-orange-200 animate-spin" />
                                </div>
                            ))
                        ) : (
                            team.map((member, i) => (
                                <div key={member.id} className="group relative">
                                    {/* Visual Stage */}
                                    <div className="relative aspect-[4/5] bg-slate-50 rounded-[3rem] overflow-hidden border border-slate-100 transition-all duration-1000 group-hover:border-orange-500/20 group-hover:bg-white group-hover:shadow-2xl group-hover:-translate-y-3">
                                        {/* RADIANT UNDERGLOW */}
                                        <div className="absolute inset-x-12 -bottom-10 h-32 bg-orange-500/20 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                        
                                        {member.avatar ? (
                                            <img src={member.avatar} alt={member.name} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 scale-105 group-hover:scale-110" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-200">
                                                <User className="w-20 h-20" />
                                            </div>
                                        )}
                                        {/* Overlay Details */}
                                        <div className="absolute inset-0 p-10 flex flex-col justify-end z-20 pointer-events-none translate-y-6 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-700">
                                            <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-2 px-3 py-1 bg-white/90 rounded-full w-fit">Architect</span>
                                            <h4 className="text-2xl font-black text-white drop-shadow-2xl">{member.name}</h4>
                                        </div>
                                        {/* Gradient Mask */}
                                        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                    </div>
                                    <div className="mt-8 px-4 space-y-2 group-hover:opacity-0 transition-opacity duration-500">
                                        <h4 className="text-xl font-black text-slate-900 tracking-tight leading-none">{member.name}</h4>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none border-l-2 border-slate-100 pl-4">{member.role}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* ── CAREERS CONVERSION ── */}
                <footer className="relative overflow-hidden rounded-[4rem] sm:rounded-[6rem] bg-slate-950 p-10 sm:p-24 text-center">
                    <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-orange-500 opacity-10 blur-[150px] rounded-full -translate-x-1/2 -translate-y-1/2" />
                    <div className="relative z-10">
                         <h2 className="text-5xl sm:text-7xl font-black mb-10 text-white tracking-tighter leading-none">Assemble your <br /><span className="text-orange-500">High-Performance</span> team.</h2>
                         <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                             <Link href="/contact" className="inline-flex items-center gap-4 px-12 py-5 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-orange-500 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-2xl">
                                 Start Conversations <ArrowRight className="w-4 h-4" />
                             </Link>
                             <Link href="/careers" className="inline-flex items-center gap-4 px-12 py-5 border border-white/20 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-white/5 transition-all">
                                 View Open Roles
                             </Link>
                         </div>
                    </div>
                </footer>
            </div>
        </main>
    );
}

