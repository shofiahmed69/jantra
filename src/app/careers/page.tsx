"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Clock, Zap, Heart, Monitor, Loader2, Sparkles, Terminal, Binary } from "lucide-react";
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
        <main className="relative w-full min-h-screen bg-white overflow-hidden pb-32">
            {/* ── BACKGROUND MONIKER ── */}
            <div className="absolute top-[5%] left-0 w-full overflow-hidden opacity-[0.03] pointer-events-none select-none z-0">
                <div className="flex whitespace-nowrap animate-marquee-slow">
                    <span className="text-[12rem] font-black tracking-tighter leading-none mr-24 uppercase">EXCELLENCE. TALENT. RECRUITMENT. GROWTH.</span>
                </div>
            </div>

            <div className="max-w-[1540px] mx-auto px-6 sm:px-12 pt-28 sm:pt-36 relative z-10">
                
                <div className="grid lg:grid-cols-12 gap-12 items-start mb-12">
                    
                    {/* LEFT SIDEBAR HERO */}
                    <div className="lg:col-span-3 space-y-12 sticky top-36">
                        <div className="flex flex-col gap-6 text-left">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-[2px] bg-orange-500" />
                                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-orange-600">Join the Squad</span>
                            </div>
                            <h1 className="text-5xl sm:text-6xl font-black text-slate-900 leading-[0.85] tracking-tighter uppercase">
                                Open <br />
                                <span className="text-transparent" style={{ WebkitTextStroke: "1px #0f172a" }}>Positions</span>
                                <span className="text-orange-500">.</span>
                            </h1>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed border-l-2 border-slate-100 pl-6">
                                We are recruiting the next cohort of engineers to architect elite digital systems.
                            </p>
                        </div>

                        {/* STATUS CARD */}
                        <div className="p-8 rounded-[3rem] bg-orange-50 border border-orange-100 space-y-6 relative overflow-hidden group">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[50px] rounded-full" />
                             <div className="flex items-center gap-3 relative z-10">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] font-black text-orange-700 uppercase tracking-widest">Active Recruitment</span>
                             </div>
                             <p className="text-[11px] font-bold text-slate-600 leading-relaxed uppercase tracking-tight relative z-10">Our studio is scaling. We prioritize technical precision over everything.</p>
                        </div>

                        {/* QUICK BENEFITS */}
                        <div className="space-y-4">
                             <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Squad Benefits</span>
                             <div className="grid grid-cols-2 gap-2">
                                {[
                                    { icon: Zap, label: "M3 Max" },
                                    { icon: Heart, label: "Premium" },
                                    { icon: Terminal, label: "Labs" },
                                    { icon: Monitor, label: "Remote+" }
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col gap-2 p-4 bg-slate-50 border border-slate-100 rounded-2xl items-center text-center">
                                        <item.icon className="w-4 h-4 text-orange-500" />
                                        <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">{item.label}</span>
                                    </div>
                                ))}
                             </div>
                        </div>
                    </div>

                    {/* RIGHT CONTENT — HIGH DENSITY JOB BOARD */}
                    <div className="lg:col-span-9 space-y-8">
                        {loading ? (
                            <div className="py-32 text-center flex flex-col items-center gap-6">
                                <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.5em]">Decrypting Registry...</p>
                            </div>
                        ) : jobs.length === 0 ? (
                            <div className="py-32 text-center p-20 bg-slate-50 rounded-[3rem] border border-slate-200">
                                <p className="text-slate-400 font-medium uppercase tracking-widest text-[11px]">Our cohort is currently at capacity.</p>
                                <p className="text-slate-300 text-[10px] mt-2">Send an open application to our contact terminal.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {jobs.map((job, i) => (
                                    <motion.div 
                                        key={job.id}
                                        whileHover={{ y: -4 }}
                                        onClick={() => setSelectedJob(job)}
                                        className="group relative flex flex-col md:flex-row items-center justify-between p-8 rounded-[3rem] bg-white border border-slate-100 transition-all duration-700 hover:shadow-2xl hover:border-slate-200 cursor-pointer overflow-hidden"
                                    >
                                        <div className="absolute inset-x-40 -bottom-10 h-20 bg-orange-500/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                        
                                        <div className="flex items-center gap-8 relative z-10 w-full md:w-auto">
                                            <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-orange-500 group-hover:bg-orange-50 transition-all duration-700">
                                                <Binary className="w-6 h-6" />
                                            </div>
                                            <div className="space-y-4 text-left">
                                                <div className="flex items-center gap-3">
                                                    <span className="px-3 py-1 bg-slate-50 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest">{job.department}</span>
                                                    <span className="px-3 py-1 bg-orange-50 rounded-lg text-[9px] font-black text-orange-600 uppercase tracking-widest">{job.type}</span>
                                                </div>
                                                <h3 className="text-3xl font-black text-slate-900 tracking-tighter leading-none group-hover:text-orange-600 transition-colors uppercase">
                                                    {job.title}
                                                </h3>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-12 relative z-10 w-full md:w-auto shrink-0 pt-6 md:pt-0">
                                            <div className="flex flex-col border-l border-slate-100 pl-8">
                                                <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Base Operations</span>
                                                <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                                                    <MapPin className="w-3 h-3 text-orange-500" /> {job.location}
                                                </span>
                                            </div>
                                            <button className="flex-1 md:flex-none inline-flex items-center justify-center gap-4 px-12 py-5 bg-slate-950 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] group-hover:bg-orange-600 transition-all transform active:scale-95 shadow-xl shadow-slate-900/10">
                                                Initialize <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        <div className="p-12 rounded-[4rem] bg-slate-950 text-white relative overflow-hidden text-center sm:text-left">
                             <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-600 opacity-10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
                             <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-12">
                                 <div className="space-y-4">
                                     <h2 className="text-4xl font-black tracking-tighter leading-none uppercase">Genius Profile?</h2>
                                     <p className="text-slate-400 text-sm max-w-sm font-medium">If your specific niche isn't listed, send us your technical archive for our open registry.</p>
                                 </div>
                                 <Link href="/contact" className="inline-flex items-center gap-6 px-12 py-5 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-orange-500 hover:text-white transition-all shadow-2xl group active:scale-95">
                                     Submit Archive <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                 </Link>
                             </div>
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
