"use client";

import { useState, useEffect, useRef } from "react";
import { Linkedin, Mail, Globe, Clock, Send, CheckCircle2, ArrowRight, Binary, Target, ShieldCheck, Sparkles, User, Briefcase, MessageSquare, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        country: "",
        service: "",
        budget: "",
        description: "",
        referral: ""
    });

    const [uiState, setUiState] = useState<"form" | "loading" | "success" | "error">("form");
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (uiState === "loading") {
            timerRef.current = setTimeout(() => {
                setUiState("success");
            }, 3000);
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [uiState]);

    const handleChange = (name: string, value: any) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.service || !formData.budget) {
            alert("Please select a service and budget range.");
            return;
        }
        setUiState("loading");
        
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/leads`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        }).catch(() => {});
    };

    const services = ["Software", "AI", "Automation", "SaaS"];
    const budgets = ["$5k-15k", "$15k-30k", "$30k+"];

    return (
        <main className="relative w-full min-h-screen bg-slate-50 overflow-hidden pb-20 font-sans selection:bg-orange-500 selection:text-white">
            {/* ── BACKGROUND ORCHESTRATION ── */}
            <div className="absolute top-[5%] left-0 w-full overflow-hidden opacity-[0.03] pointer-events-none select-none z-0">
                <div className="flex whitespace-nowrap animate-marquee-slow">
                    <span className="text-[10rem] font-black tracking-tighter leading-none mr-24 uppercase">CONTACT. CONNECT. BUILD. GROW. SCALE. COLLABORATE.</span>
                </div>
            </div>

            <div className="max-w-[1540px] mx-auto px-6 sm:px-12 pt-28 sm:pt-32 relative z-10">
                <div className="grid lg:grid-cols-12 gap-10 items-start">
                    
                    {/* LEFT SIDEBAR — COMPACT HERO */}
                    <div className="lg:col-span-3 space-y-8 sticky top-32">
                        <div className="flex flex-col gap-4 text-left">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-[3px] bg-orange-500 rounded-full" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-600">Inquiry Terminal</span>
                            </div>
                            <h1 className="text-5xl sm:text-6xl font-black text-slate-950 leading-[0.85] tracking-tighter uppercase whitespace-nowrap">
                                Let's <br />
                                <span className="text-orange-500">Sync</span>
                                <span className="text-slate-950">.</span>
                            </h1>
                            <p className="text-[13px] text-slate-500 font-bold leading-relaxed border-l-2 border-orange-500/20 pl-6 max-w-[240px] uppercase tracking-tight">
                                Partner with our engineering squad to architect elite digital systems.
                            </p>
                        </div>

                        {/* STUDIO STATUS — ORANGE VIBRANCY */}
                        <div className="p-6 rounded-[2.5rem] bg-orange-600 shadow-[0_20px_50px_-10px_rgba(249,115,22,0.4)] text-white space-y-4 relative overflow-hidden group">
                             <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 blur-[30px] rounded-full" />
                             <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white">Status: Online</span>
                                </div>
                                <span className="text-[8px] font-black text-white/40 uppercase tracking-widest leading-none">High Priority</span>
                             </div>
                             <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden relative z-10">
                                <motion.div initial={{ width: 0 }} animate={{ width: "95%" }} transition={{ duration: 2 }} className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
                             </div>
                             <p className="text-[10px] font-black leading-tight uppercase tracking-widest text-white/90 relative z-10">Accepting Industrial Missions.</p>
                        </div>

                        {/* QUICK UPLINKS */}
                        <div className="space-y-3">
                             {[
                                { icon: Mail, label: "UPLINK", value: "hello@jantra.soft" },
                                { icon: Linkedin, label: "NETWORK", value: "jantra.soft" }
                             ].map((item, i) => (
                                <div key={i} className="p-4 rounded-[1.5rem] bg-white border border-slate-200 flex items-center gap-4 group hover:border-orange-500 transition-all shadow-sm">
                                     <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-orange-500 group-hover:text-white transition-all shadow-sm">
                                         <item.icon className="w-4 h-4" />
                                     </div>
                                     <div className="space-y-0.5">
                                         <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">{item.label}</span>
                                         <p className="text-[11px] font-black text-slate-950 uppercase tracking-tighter truncate">{item.value}</p>
                                     </div>
                                </div>
                             ))}
                        </div>
                    </div>

                    {/* RIGHT CONTENT — COMPACT & HIGH CONTRAST FORM */}
                    <div className="lg:col-span-9 relative">
                        <div className="relative z-10 bg-white border border-slate-200 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] rounded-[3.5rem] p-8 sm:p-14 overflow-hidden min-h-[750px] flex flex-col">
                            
                            <AnimatePresence mode="wait">
                                {uiState === "form" ? (
                                    <motion.form 
                                        key="form"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} // Custom ease
                                        onSubmit={handleSubmit}
                                        className="space-y-8 relative z-10"
                                    >
                                        <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-xl shadow-orange-500/20">
                                                    <Binary className="w-4 h-4" />
                                                </div>
                                                <h2 className="text-xl font-black text-slate-950 uppercase tracking-tighter">Inquiry Terminal [v.5.0]</h2>
                                            </div>
                                            <div className="hidden sm:flex gap-1">
                                                 <div className="w-2 h-2 rounded-full bg-orange-500" />
                                                 <div className="w-2 h-2 rounded-full bg-slate-100" />
                                                 <div className="w-2 h-2 rounded-full bg-slate-100" />
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            {/* Name */}
                                            <div className="space-y-2">
                                                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] pl-1">Identity</label>
                                                 <input required name="name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-[13px] font-bold text-slate-950 uppercase placeholder:text-slate-300 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all outline-none" placeholder="FULL NAME" />
                                            </div>
                                            {/* Email */}
                                            <div className="space-y-2">
                                                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] pl-1">Endpoint (Email)</label>
                                                 <input required name="email" type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-[13px] font-bold text-slate-950 uppercase placeholder:text-slate-300 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all outline-none" placeholder="BUSINESS EMAIL" />
                                            </div>
                                        </div>

                                        {/* BUBBLE GRID — SERVICE (MORE COMPACT) */}
                                        <div className="space-y-4">
                                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] pl-1 flex items-center gap-2">
                                                <Layers className="w-3.5 h-3.5 text-orange-600" /> Service Architecture
                                             </label>
                                             <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                 {services.map((s) => (
                                                     <button
                                                        key={s}
                                                        type="button"
                                                        onClick={() => handleChange('service', s)}
                                                        className={`py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 border ${
                                                            formData.service === s 
                                                            ? "bg-slate-950 text-white border-slate-950 shadow-lg scale-[1.02]" 
                                                            : "bg-slate-50 text-slate-400 border-slate-100 hover:bg-white hover:text-slate-950 hover:border-slate-300"
                                                        }`}
                                                     >
                                                         {s}
                                                     </button>
                                                 ))}
                                             </div>
                                        </div>

                                        {/* BUBBLE GRID — BUDGET (MORE COMPACT) */}
                                        <div className="space-y-4">
                                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] pl-1 flex items-center gap-2">
                                                <Target className="w-3.5 h-3.5 text-orange-600" /> Capital Allocation
                                             </label>
                                             <div className="grid grid-cols-3 gap-3">
                                                 {budgets.map((b) => (
                                                     <button
                                                        key={b}
                                                        type="button"
                                                        onClick={() => handleChange('budget', b)}
                                                        className={`py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 border ${
                                                            formData.budget === b 
                                                            ? "bg-orange-600 text-white border-orange-600 shadow-xl shadow-orange-500/20 scale-[1.02]" 
                                                            : "bg-slate-50 text-slate-400 border-slate-100 hover:bg-white hover:text-orange-600 hover:border-orange-200"
                                                        }`}
                                                     >
                                                         {b}
                                                     </button>
                                                 ))}
                                             </div>
                                        </div>

                                        {/* Brief */}
                                        <div className="space-y-4">
                                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] pl-1 flex items-center gap-2">
                                                <MessageSquare className="w-3.5 h-3.5 text-orange-600" /> Mission Brief
                                             </label>
                                             <textarea 
                                                required 
                                                name="description" 
                                                rows={5}
                                                value={formData.description} 
                                                onChange={(e) => handleChange('description', e.target.value)} 
                                                className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-8 py-6 text-[13px] font-bold text-slate-950 uppercase placeholder:text-slate-200 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all outline-none resize-none min-h-[160px]" 
                                                placeholder="DESCRIBE YOUR ARCHITECTURAL GOALS..." 
                                             />
                                        </div>

                                        <div className="pt-6 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-8">
                                             <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                 <ShieldCheck className="w-4 h-4 text-emerald-500" /> Verified 256-Bit Link
                                             </div>
                                             <button type="submit" className="w-full sm:w-auto px-16 py-6 bg-orange-600 text-white rounded-2xl font-black uppercase tracking-[0.5em] text-[12px] hover:bg-slate-950 transition-all transform hover:scale-[1.03] active:scale-95 shadow-2xl shadow-orange-500/20 flex items-center justify-center gap-5 group">
                                                Initialize Engage <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                             </button>
                                        </div>
                                    </motion.form>
                                ) : uiState === "loading" ? (
                                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-grow flex flex-col items-center justify-center space-y-10 py-20">
                                        <div className="relative">
                                            <div className="w-24 h-24 border-4 border-slate-50 rounded-full" />
                                            <div className="absolute inset-0 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                                        </div>
                                        <div className="text-center space-y-2">
                                            <h3 className="text-2xl font-black text-slate-950 uppercase tracking-tighter">Syncing Protocol</h3>
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.6em]">Establishing high-priority uplink...</p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-grow flex flex-col items-center justify-center text-center space-y-10 py-20">
                                        <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-[2rem] flex items-center justify-center border border-emerald-100 shadow-2xl shadow-emerald-500/10">
                                             <CheckCircle2 className="w-12 h-12" />
                                        </div>
                                        <div className="space-y-4">
                                            <h2 className="text-6xl font-black text-slate-950 tracking-tighter uppercase">Success<span className="text-orange-500">.</span></h2>
                                            <p className="text-base text-slate-500 font-bold max-w-sm mx-auto uppercase tracking-tighter">Mission Brief Received. Tactical response within 24H.</p>
                                        </div>
                                        <button onClick={() => setUiState("form")} className="inline-flex items-center gap-5 px-14 py-5 bg-slate-950 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-orange-600 transition-all shadow-2xl active:scale-95 group">
                                            Reset Terminal <ArrowRight className="w-4 h-4 group-hover:rotate-180 transition-transform" />
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
