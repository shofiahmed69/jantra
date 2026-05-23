"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Loader2, Briefcase } from "lucide-react";
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
                console.error("Error fetching jobs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    useEffect(() => {
        window.dispatchEvent(
            new CustomEvent("jantra:overlay-state", {
                detail: { open: Boolean(selectedJob) }
            })
        );

        return () => {
            window.dispatchEvent(
                new CustomEvent("jantra:overlay-state", {
                    detail: { open: false }
                })
            );
        };
    }, [selectedJob]);

    return (
        <main className="w-full min-h-screen bg-slate-50/50 pb-20 selection:bg-orange-100">
            <div className="max-w-[1140px] mx-auto px-4 sm:px-6 pt-28 sm:pt-36">
                
                {/* ── HEADER ── */}
                <div className="max-w-2xl mb-12 text-left">
                    <span className="text-orange-600 font-bold tracking-widest text-[10px] uppercase mb-3 block">Careers</span>
                    <h1 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight tracking-tight uppercase mb-4">
                        Join Our Team<span className="text-orange-500">.</span>
                    </h1>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-lg">
                        Build the future of custom software, AI agents, and high-performance applications with us. We value clean code, quick iterations, and user-centric design.
                    </p>
                </div>

                {/* ── JOB BOARD ── */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="py-16 text-center flex flex-col items-center gap-4">
                            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Loading open positions...</p>
                        </div>
                    ) : jobs.length === 0 ? (
                        <div className="py-16 text-center p-8 bg-white rounded-2xl border border-slate-100">
                            <p className="text-slate-400 font-bold uppercase tracking-wide text-xs">We are not actively hiring at the moment. Please check back later.</p>
                        </div>
                    ) : (
                        jobs.map((job, i) => (
                            <motion.div 
                                key={job.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03 }}
                                onClick={() => setSelectedJob(job)}
                                className="group relative bg-white border border-slate-100 rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-slate-50/50 hover:border-slate-300 hover:shadow-md transition-all duration-300 cursor-pointer"
                            >
                                <div className="flex items-center gap-4 text-left w-full">
                                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-orange-500 group-hover:bg-orange-50 transition-all">
                                        <Briefcase className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1.5 flex-1 min-w-0">
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-2.5 py-0.5 bg-slate-100 rounded-md text-[8px] font-bold text-slate-500 uppercase tracking-wider">{job.department}</span>
                                            <span className="px-2.5 py-0.5 bg-orange-50 rounded-md text-[8px] font-bold text-orange-600 uppercase tracking-wider">{job.type}</span>
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight uppercase group-hover:text-orange-600 transition-colors truncate">{job.title}</h3>
                                        <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-tight flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5 text-orange-500" /> {job.location}
                                        </span>
                                    </div>
                                </div>

                                <button className="w-full sm:w-auto px-6 py-3 bg-orange-600 text-white rounded-lg font-bold uppercase tracking-wider text-[10px] group-hover:bg-slate-950 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                                    Apply Now <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* ── CTA BOX ── */}
                <div className="mt-16 p-8 sm:p-10 rounded-2xl bg-slate-950 text-white flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/10 blur-[80px] rounded-full pointer-events-none" />
                     <div className="space-y-2 relative z-10">
                          <h2 className="text-2xl font-bold tracking-tight uppercase">Don&apos;t see a matching role?</h2>
                          <p className="text-slate-400 text-xs font-medium max-w-sm">We are always looking for talented developers, designers, and innovators. Send us your resume.</p>
                     </div>
                     <Link href="/contact" className="relative z-10 px-8 py-3.5 rounded-lg bg-white text-slate-950 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-orange-600 hover:text-white transition-all shadow-md active:scale-95">
                        Send Open Application <ArrowRight className="w-4 h-4" />
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
