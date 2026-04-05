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
        <main className="w-full min-h-screen bg-white pb-32">
            
            <div className="max-w-[1280px] mx-auto px-6 sm:px-12 pt-28 sm:pt-40">
                
                {/* ── HEADER ── */}
                <div className="max-w-2xl mb-20 sm:mb-32 text-left">
                    <span className="text-orange-600 font-bold tracking-widest text-xs uppercase mb-6 block">Join the Squad</span>
                    <h1 className="text-5xl sm:text-7xl font-black text-slate-900 leading-[0.9] tracking-tighter uppercase mb-8">
                        Our Open <br /> Positions <span className="text-orange-500">.</span>
                    </h1>
                    <p className="text-slate-500 text-lg font-medium leading-relaxed uppercase tracking-tight max-w-lg">Recruiting the next cohort of engineers to architect elite digital systems.</p>
                </div>

                {/* ── CLEAN JOB BOARD: 1-COL ── */}
                <div className="space-y-6 sm:space-y-8">
                    {loading ? (
                        <div className="py-20 text-center flex flex-col items-center gap-6">
                            <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Decrypting Registry...</p>
                        </div>
                    ) : jobs.length === 0 ? (
                        <div className="py-32 text-center p-20 bg-slate-50 rounded-[4rem] border border-slate-200">
                            <p className="text-slate-400 font-black uppercase tracking-widest text-[11px]">The cohort is currently at capacity.</p>
                        </div>
                    ) : (
                        jobs.map((job, i) => (
                            <motion.div 
                                key={job.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => setSelectedJob(job)}
                                className="group relative bg-white border border-slate-100 rounded-[2.5rem] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-10 hover:bg-slate-50 hover:border-slate-300 hover:shadow-2xl transition-all duration-700 cursor-pointer"
                            >
                                <div className="flex items-center gap-8 text-left w-full">
                                    <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-orange-500 group-hover:bg-orange-50 transition-all duration-700">
                                        <Binary className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-4 py-1.5 bg-slate-50 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest">{job.department}</span>
                                            <span className="px-4 py-1.5 bg-orange-50 rounded-full text-[9px] font-black text-orange-600 uppercase tracking-widest">{job.type}</span>
                                        </div>
                                        <h3 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tighter uppercase leading-none group-hover:text-orange-600 transition-colors">{job.title}</h3>
                                        <span className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-tight flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-orange-500" /> {job.location}
                                        </span>
                                    </div>
                                </div>

                                <button className="w-full md:w-auto px-12 py-6 bg-slate-950 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] group-hover:bg-orange-600 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3">
                                    Initialize <ArrowRight className="w-4 h-4 ml-2" />
                                </button>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* ── CTA BOX ── */}
                <div className="mt-32 p-12 sm:p-20 rounded-[4rem] bg-slate-950 text-white flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left overflow-hidden relative">
                     <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 blur-[100px] rounded-full" />
                     <div className="space-y-4 relative z-10">
                         <h2 className="text-4xl font-black tracking-tighter uppercase leading-none">Genius Profile?</h2>
                         <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-sm uppercase tracking-tight">Deploy your CV to our open archive.</p>
                     </div>
                     <Link href="/contact" className="relative z-10 px-16 py-7 rounded-2xl bg-white text-slate-950 text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-orange-600 hover:text-white transition-all shadow-2xl active:scale-95">
                        Submit Archive <ArrowRight className="w-5 h-5" />
                     </Link>
                </div>
            </div>

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
