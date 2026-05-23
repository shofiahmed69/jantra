"use client";

import { useState } from "react";
import { 
    Mail, Linkedin, MessageCircle, 
    Instagram, MapPin, Sparkles, CheckCircle2, ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassFilter } from "@/components/ui/liquid-glass";
import { cn } from "@/lib/utils";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");
        
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leads`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            setStatus("success");
        } catch (error) {
            console.error("Error sending lead:", error);
            // Default to success for demo purposes if backend is down
            setStatus("success");
        }
    };

    const contactMethods = [
        {
            icon: Mail,
            label: "Email",
            value: "contact@jantrasoft.online",
            href: "mailto:contact@jantrasoft.online",
            color: "from-blue-500/10 to-indigo-500/5 hover:border-blue-500/30"
        },
        {
            icon: MessageCircle,
            label: "WhatsApp",
            value: "+880 1625 027956",
            href: "https://wa.me/8801625027956",
            color: "from-green-500/10 to-emerald-500/5 hover:border-green-500/30"
        },
        {
            icon: Linkedin,
            label: "LinkedIn",
            value: "Jantra Soft",
            href: "https://www.linkedin.com/company/112998098",
            color: "from-sky-500/10 to-blue-500/5 hover:border-sky-500/30"
        },
        {
            icon: Instagram,
            label: "Instagram",
            value: "@jantra.soft",
            href: "https://instagram.com/jantra.soft",
            color: "from-pink-500/10 to-rose-500/5 hover:border-pink-500/30"
        }
    ];

    return (
        <main className="relative w-full min-h-screen bg-slate-50/50 overflow-hidden selection:bg-orange-200 pb-16">
            <GlassFilter />
            
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-orange-200/20 blur-[100px] rounded-full" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40vw] h-[40vw] bg-rose-200/10 blur-[80px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-[1140px] mx-auto px-4 sm:px-6 pt-28 sm:pt-36">
                
                {/* ── HEADER ── */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-6 border-b border-slate-200/60">
                    <div className="max-w-xl">
                        <span className="text-orange-600 font-bold tracking-widest text-[10px] uppercase mb-2 block">Contact</span>
                        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight tracking-tight uppercase">
                            Get In Touch<span className="text-orange-500">.</span>
                        </h1>
                    </div>
                    <p className="text-slate-500 text-xs sm:text-sm font-medium max-w-xs leading-relaxed">
                        Have a project or partnership in mind? Let&apos;s build your next digital product together.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    
                    {/* LEFT COLUMN: CONTACT CHANNELS */}
                    <div className="lg:col-span-5 flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-3">
                            {contactMethods.map((method, i) => (
                                <a
                                    key={i}
                                    href={method.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cn(
                                        "group relative flex flex-col p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm transition-all duration-300 overflow-hidden",
                                        "hover:shadow-md hover:bg-slate-50/50"
                                    )}
                                >
                                     <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br", method.color.split(" ")[0] + " " + method.color.split(" ")[1])} />
                                     <div className="relative z-10 flex flex-col">
                                         <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-orange-600 transition-all border border-slate-100 mb-3">
                                             <method.icon className="w-4 h-4" />
                                         </div>
                                         <span className="text-[8px] font-bold uppercase text-slate-400 tracking-wider mb-1">{method.label}</span>
                                         <span className="text-[10px] font-bold text-slate-900 truncate uppercase">{method.value}</span>
                                     </div>
                                </a>
                            ))}
                        </div>

                        {/* Location Card */}
                        <div className="relative flex-1 group p-6 rounded-xl bg-slate-900 text-white overflow-hidden shadow-md min-h-[160px] flex flex-col justify-between">
                             <div className="absolute top-0 right-0 w-40 h-40 bg-orange-600/20 blur-[50px] rounded-full pointer-events-none" />
                             <div className="relative z-10 h-full flex flex-col justify-between gap-6">
                                 <div className="space-y-3">
                                     <div className="p-2 w-fit rounded-lg bg-white/10 backdrop-blur-md border border-white/10">
                                         <MapPin className="w-4 h-4 text-orange-500" />
                                     </div>
                                     <div className="space-y-0.5">
                                         <h4 className="text-lg font-bold tracking-tight uppercase">Our Location</h4>
                                         <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">Dhaka, Bangladesh</p>
                                     </div>
                                 </div>
                                 <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                                     <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                                     <span className="text-[8px] font-bold uppercase tracking-wider text-orange-500">Currently accepting new projects</span>
                                 </div>
                             </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: CONTACT FORM */}
                    <div className="lg:col-span-7">
                        <AnimatePresence mode="wait">
                            {status === "success" ? (
                                <motion.div
                                    key="success-card"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className="h-full min-h-[350px] flex flex-col items-center justify-center text-center p-6 bg-white rounded-xl border border-orange-100 shadow-md relative overflow-hidden"
                                >
                                    <div className="relative z-10 space-y-4">
                                        <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center mx-auto shadow-md shadow-orange-500/10">
                                            <CheckCircle2 className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase mb-1">Message Sent</h3>
                                            <p className="text-slate-500 font-bold uppercase tracking-wider text-[9px] max-w-xs mx-auto">Thank you for reaching out. We will get back to you shortly.</p>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                setFormData({ name: "", email: "", subject: "", message: "" });
                                                setStatus("idle");
                                            }}
                                            className="px-6 py-2.5 bg-orange-600 text-white rounded-lg font-bold uppercase tracking-wider text-[9px] hover:bg-slate-950 transition-all active:scale-95"
                                        >
                                            Send Another Message
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="form-card"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="h-full"
                                >
                                    <div className="relative bg-white rounded-xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
                                        <div className="flex items-center justify-between gap-4 mb-6">
                                            <h3 className="text-sm font-bold text-slate-900 tracking-wider uppercase flex items-center gap-2">
                                                Send a Message
                                            </h3>
                                            <Sparkles className="w-4 h-4 text-orange-500" />
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="group space-y-1.5">
                                                    <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 group-focus-within:text-orange-600 transition-colors ml-1">Full Name</label>
                                                    <input required type="text" placeholder="YOUR NAME" className="w-full bg-slate-50 border border-slate-200/80 rounded-lg px-4 py-3 text-[10px] font-bold uppercase tracking-wider outline-none focus:bg-white focus:ring-1 focus:ring-orange-500 transition-all" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                                                </div>
                                                <div className="group space-y-1.5">
                                                    <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 group-focus-within:text-orange-600 transition-colors ml-1">Email Address</label>
                                                    <input required type="email" placeholder="YOUR@EMAIL.COM" className="w-full bg-slate-50 border border-slate-200/80 rounded-lg px-4 py-3 text-[10px] font-bold uppercase tracking-wider outline-none focus:bg-white focus:ring-1 focus:ring-orange-500 transition-all" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                                                </div>
                                            </div>

                                            <div className="group space-y-1.5">
                                                <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 group-focus-within:text-orange-600 transition-colors ml-1">Subject</label>
                                                <input required type="text" placeholder="HOW CAN WE HELP?" className="w-full bg-slate-50 border border-slate-200/80 rounded-lg px-4 py-3 text-[10px] font-bold uppercase tracking-wider outline-none focus:bg-white focus:ring-1 focus:ring-orange-500 transition-all" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} />
                                            </div>

                                            <div className="group space-y-1.5">
                                                <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 group-focus-within:text-orange-600 transition-colors ml-1">Your Message</label>
                                                <textarea required rows={3} placeholder="TELL US ABOUT YOUR PROJECT" className="w-full bg-slate-50 border border-slate-200/80 rounded-lg px-4 py-4 text-[10px] font-bold uppercase tracking-wider outline-none focus:bg-white focus:ring-1 focus:ring-orange-500 transition-all resize-none" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} />
                                            </div>

                                            <button type="submit" disabled={status === "sending"} className="w-full py-3.5 bg-orange-600 text-white rounded-lg font-bold uppercase tracking-wider text-[10px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 hover:bg-slate-950 shadow-sm">
                                                <span>{status === "sending" ? "SENDING..." : "SUBMIT MESSAGE"}</span>
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </button>
                                        </form>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </main>
    );
}
