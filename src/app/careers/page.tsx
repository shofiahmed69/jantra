"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Zap, Heart, Monitor, Loader2, Terminal, Binary } from "lucide-react";
import api from "@/lib/api";
import ApplyModal from "@/components/ApplyModal";
import { motion, AnimatePresence } from "framer-motion";

interface Job {
    id: string;
    title: string;
    type: string;
    location: string;
    department: string;
}

const BENEFITS = [
    { icon: Zap, label: "M3 Max" },
    { icon: Heart, label: "Medical" },
    { icon: Terminal, label: "Labs" },
    { icon: Monitor, label: "Remote+" }
];

export default function CareersPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await api.get("/careers");
                setJobs(response.data || []);
            } catch (error) {
                console.error("Failed to fetch jobs", error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    return (
        <main className="relative w-full min-h-screen bg-white pb-32">
            {/* ── BACKGROUND ACCENT [DESKTOP ONLY] ── */}
            <div className="hidden lg:block absolute top-[5%] left-0 w-full overflow-hidden opacity-[0.02] pointer-events-none select-none z-0">
                <div className="flex whitespace-nowrap animate-marquee-slow">
                    <span className="text-[12rem] font-black tracking-tighter leading-none mr-24 uppercase">EXCELLENCE. TALENT. RECRUITMENT. GROWTH.</span>
                </div>
            </div>

            <div className="max-w-[1540px] mx-auto px-4 sm:px-12 pt-24 sm:pt-36 relative z-10">
                
                {/* ── HEADER SECTION ── */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 sm:mb-20">
                    <div className="space-y-4 sm:space-y-6 text-left">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-[2px] bg-orange-500" />
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-orange-600">Join the Squad</span>
                        </div>
                        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-slate-900 leading-[0.85] tracking-tighter uppercase">
                            Open <br />
                            <span className="text-transparent" style={{ WebkitTextStroke: "1px #0f172a" }}>Positions</span>
                            <span className="text-orange-500">.</span>
                        </h1>
                    </div>

                    {/* QUICK BENEFITS - HIGH DENSITY PILLS */}
                    <div className="flex flex-wrap gap-2">
                        {BENEFITS.map((item, i) => (
                            <div key={i} className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-full">
                                <item.icon className="w-3 h-3 text-orange-500" />
                                <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── MAIN CONTENT GRID ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    
                    {/* LEFT SIDEBAR [DESKTOP ONLY] */}
                    <div className="hidden lg:block lg:col-span-3 sticky top-36 h-fit space-y-10">
                        <div className="p-10 rounded-[3rem] bg-slate-950 border border-slate-900 space-y-8 relative overflow-hidden group">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[50px] rounded-full" />
                             <div className="flex items-center gap-2 relative z-10">
                                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                 <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Scaling Hub</span>
                             </div>
                             <p className="text-[14px] font-bold text-white leading-relaxed uppercase tracking-tight relative z-10">We are recruiting the next cohort of engineers to architect elite systems.</p>
                             <Link href="/contact" className="relative z-10 w-full py-5 rounded-2xl bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white hover:text-slate-950 transition-all shadow-xl active:scale-95">
                                Submit Registry <ArrowRight className="w-4 h-4" />
                             </Link>
                        </div>
                    </div>

                    {/* JOB GRID - 2 COLUMN ON ALL SCREENS */}
                    <div className="lg:col-span-9">
                        {loading ? (
                            <div className="py-40 text-center flex flex-col items-center gap-6">
                                <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Decrypting Registry...</p>
                            </div>
                        ) : jobs.length === 0 ? (
                            <div className="py-40 text-center p-20 bg-slate-50 rounded-[3rem] border border-slate-200">
                                <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">No open positions in <span className="text-orange-600">Active Recruitment</span> yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3 sm:gap-8">
                                {jobs.map((job, i) => (
                                    <motion.div 
                                         key={job.id}
                                         layout
                                         onClick={() => setSelectedJob(job)}
                                         initial={{ opacity: 0, scale: 0.95 }}
                                         animate={{ opacity: 1, scale: 1 }}
                                         transition={{ delay: i * 0.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                         className="group relative flex flex-col p-5 sm:p-10 rounded-[1.5rem] sm:rounded-[3rem] bg-white border border-slate-100 transition-all duration-700 hover:shadow-2xl hover:border-orange-500/20 cursor-pointer overflow-hidden"
                                     >
                                         <div className="absolute inset-x-20 -bottom-10 h-20 bg-orange-500/5 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                         
                                         <div className="relative z-10 w-full text-left space-y-4 sm:space-y-6">
                                             <div className="flex items-center justify-between">
                                                 <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-xl sm:rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-orange-500 group-hover:bg-orange-50 transition-all duration-700">
                                                     <Binary className="w-5 h-5 sm:w-8 sm:h-8" />
                                                 </div>
                                                 <span className="hidden sm:block px-4 py-1.5 rounded-full bg-slate-50 text-[8px] font-black uppercase tracking-widest text-slate-400">{job.department}</span>
                                             </div>

                                             <div className="space-y-2">
                                                 <span className="text-[7px] sm:text-[9px] font-black text-orange-600 uppercase tracking-widest">{job.type}</span>
                                                 <h3 className="text-base sm:text-4xl font-black text-slate-900 tracking-tighter leading-[0.95] uppercase group-hover:text-orange-600 transition-colors">
                                                     {job.title}
                                                 </h3>
                                             </div>

                                             <div className="pt-2 sm:pt-4 border-t border-slate-50 flex items-center justify-between">
                                                 <span className="text-[8px] sm:text-[11px] font-black text-slate-400 uppercase tracking-tight flex items-center gap-1.5">
                                                     <MapPin className="w-3 h-3 text-orange-500" /> {job.location}
                                                 </span>
                                                 <button className="w-6 h-6 sm:w-10 sm:h-10 rounded-full bg-slate-950 text-white flex items-center justify-center group-hover:bg-orange-600 transition-all active:scale-90">
                                                     <ArrowRight className="w-3 h-3 sm:w-5 sm:h-5" />
                                                 </button>
                                             </div>
                                         </div>
                                     </motion.div>
                                ))}
                            </div>
                        )}

                        {/* MOBILE ONLY CONNECT BOX [AT BOTTOM] */}
                        <div className="lg:hidden mt-20 p-8 rounded-[2rem] bg-slate-950 text-white space-y-6 text-center">
                             <h2 className="text-3xl font-black tracking-tighter uppercase leading-none">Open Registry</h2>
                             <p className="text-[12px] font-bold uppercase tracking-tight opacity-70">If your niche isn't listed, submit your archive.</p>
                             <Link href="/contact" className="w-full py-5 rounded-2xl bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-transform shadow-2xl">
                                Submit CV <ArrowRight className="w-4 h-4" />
                             </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Apply Modal */}
            <AnimatePresence>
                {selectedJob && (
                    <ApplyModal
                        jobId={selectedJob.id}
                        jobTitle={selectedJob.title}
                        onClose={() => setSelectedJob(null)}
                    />
                )}
            </AnimatePresence>
        </main>
    );
}
