"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowRight,
    HelpCircle,
    CheckCircle2,
    X,
    Loader2,
    Code,
    Smartphone,
    Bot,
    Workflow,
    Cloud,
    Cpu,
    Database
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";

// Fallback services if database is unpopulated or backend is offline
const FALLBACK_SERVICES = [
    {
        id: "fallback-1",
        title: "Custom Software Development",
        slug: "custom-software-development",
        description: "Business systems, internal tools, and client platforms built to scale cleanly.",
        features: ["UI/UX Design", "Responsive Frontend", "Core REST APIs"],
        techStack: ["React", "Next.js"],
        priceMin: 5000,
        priceMax: 15000,
        published: true
    },
    {
        id: "fallback-2",
        title: "AI Agent Development",
        slug: "ai-agent-development",
        description: "Custom virtual assistants, data extraction tools, and decision-support systems.",
        features: ["Custom AI Models", "Search Systems", "AI Chat Integration"],
        techStack: ["Python", "OpenAI"],
        priceMin: 15000,
        priceMax: 30000,
        published: true
    },
    {
        id: "fallback-3",
        title: "Workflow Automation",
        slug: "workflow-automation",
        description: "Automatic data transfer and task synchronization across your business software.",
        features: ["System Integration", "Automatic Alerts", "Data Syncing"],
        techStack: ["Make.com", "n8n"],
        priceMin: 4000,
        priceMax: 10000,
        published: true
    },
    {
        id: "fallback-4",
        title: "SaaS Product Development",
        slug: "saas-product-development",
        description: "Subscription-based web applications with user dashboards and automated billing.",
        features: ["Secure Login", "Subscription Billing", "User Dashboards"],
        techStack: ["Next.js", "Stripe"],
        priceMin: 20000,
        priceMax: 50000,
        published: true
    },
    {
        id: "fallback-5",
        title: "Mobile App Development",
        slug: "mobile-app-development",
        description: "Bespoke mobile applications for iOS and Android with offline capability.",
        features: ["iOS & Android Apps", "Offline Support", "Push Notifications"],
        techStack: ["React Native", "Expo"],
        priceMin: 12000,
        priceMax: 25000,
        published: true
    },
    {
        id: "fallback-6",
        title: "Cloud & API Systems",
        slug: "cloud-api-systems",
        description: "Secure backend databases and custom APIs connecting your platforms and external services.",
        features: ["Cloud Hosting", "Custom APIs", "Secure Databases"],
        techStack: ["AWS", "Docker"],
        priceMin: 25000,
        priceMax: 60000,
        published: true
    }
];

const FAQS = [
    { q: "How long does delivery take?", a: "Initial versions and MVPs are typically delivered and launched within 4-6 weeks." },
    { q: "Who owns the intellectual property?", a: "You retain 100% ownership of the source code and all intellectual property upon project completion." },
    { q: "Do you offer post-launch support?", a: "Yes, we offer ongoing maintenance, updates, and dedicated support packages tailored to your scale." },
    { q: "Can we migrate or scale plans later?", a: "Absolutely. You can start with a MVP and upgrade features or scale infrastructure as your needs evolve." }
];

type CurrencyCode = "USD" | "EUR" | "BDT";

const resolveServiceVisualUrl = (service: any) => {
    const raw = service?.banner || service?.image;
    if (!raw) return "";
    let url = raw;
    if (!url.startsWith("http")) {
        const apiBase = (process.env.NEXT_PUBLIC_API_URL || "https://jontro-backend.onrender.com/api").replace(/\/api\/?$/, "");
        const cleanBase = apiBase.endsWith("/") ? apiBase.slice(0, -1) : apiBase;
        const cleanPath = url.startsWith("/") ? url : `/${url}`;
        url = `${cleanBase}${cleanPath}`;
    }
    if (url.startsWith("http://") || url.includes("sslip.io")) {
        return `/api/image-proxy?url=${encodeURIComponent(url)}`;
    }
    return url;
};

const getServiceIcon = (slug: string) => {
    if (slug.includes('mobile')) return Smartphone;
    if (slug.includes('ai')) return Bot;
    if (slug.includes('automation')) return Workflow;
    if (slug.includes('cloud')) return Cloud;
    if (slug.includes('saas')) return Cpu;
    if (slug.includes('software')) return Code;
    return Database;
};

export default function PricingPage() {
    const [services, setServices] = useState<any[]>([]);
    const [selectedService, setSelectedService] = useState<any | null>(null);
    const [leadName, setLeadName] = useState("");
    const [leadEmail, setLeadEmail] = useState("");
    const [leadCompany, setLeadCompany] = useState("");
    const [leadDescription, setLeadDescription] = useState("");
    const [leadBudget, setLeadBudget] = useState("");
    const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const [currency, setCurrency] = useState<CurrencyCode>("USD");
    const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
    const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

    const handleSelectPlan = (service: any) => {
        setSelectedService(service);
        setLeadName("");
        setLeadEmail("");
        setLeadCompany("");
        setLeadDescription("");
        setSubmitStatus("idle");
        setErrorMessage("");
        setLeadBudget("");
    };

    const handleSubmitLead = (e: React.FormEvent) => {
        e.preventDefault();
        
        const payload = {
            name: leadName,
            email: leadEmail,
            company: leadCompany,
            service: selectedService.title,
            budget: leadBudget,
            description: leadDescription,
        };

        setSubmitStatus("success");
        setErrorMessage("");

        api.post("/leads", payload).catch((error: any) => {
            console.error("Failed to submit plan request in background:", error);
        });
    };

    useEffect(() => {
        window.dispatchEvent(
            new CustomEvent("jantra:overlay-state", {
                detail: { open: Boolean(selectedService) }
            })
        );

        return () => {
            window.dispatchEvent(
                new CustomEvent("jantra:overlay-state", {
                    detail: { open: false }
                })
            );
        };
    }, [selectedService]);

    useEffect(() => {
        const loadDynamicServices = async () => {
            try {
                const response = await api.get("/services");
                const servicesData = response.data?.data || response.data || [];
                if (Array.isArray(servicesData) && servicesData.length > 0) {
                    setServices(servicesData);
                } else {
                    setServices(FALLBACK_SERVICES);
                }
            } catch (error) {
                console.error("Failed to load services for pricing page:", error);
                setServices(FALLBACK_SERVICES);
            }
        };
        loadDynamicServices();
    }, []);

    useEffect(() => {
        const cookieMatch = document.cookie.match(/(?:^|;\s*)currency_pref_auto=(USD|EUR|BDT)/);
        if (cookieMatch?.[1]) {
            setCurrency(cookieMatch[1] as CurrencyCode);
        } else {
            // Client-side Geo-IP fallback detection for local development and edge failures
            fetch("https://ipapi.co/json/")
                .then((r) => r.json())
                .then((data) => {
                    const country = (data.country_code || "").toUpperCase();
                    if (country === "BD") {
                        setCurrency("BDT");
                    } else if ([
                        "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
                        "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK",
                        "SI", "ES", "SE"
                    ].includes(country)) {
                        setCurrency("EUR");
                    } else {
                        setCurrency("USD");
                    }
                })
                .catch((err) => {
                    console.error("Failed client-side Geo-IP check:", err);
                    setCurrency("USD");
                });
        }
    }, []);

    const formatCompactPrice = (amount: number, code: CurrencyCode) => {
        if (code === "BDT") {
            if (amount >= 100000) {
                const lakh = amount / 100000;
                const value = Number.isInteger(lakh) ? lakh.toString() : lakh.toFixed(1);
                return `৳${value}L`;
            }
            return new Intl.NumberFormat("en-BD", {
                style: "currency",
                currency: "BDT",
                maximumFractionDigits: 0,
            }).format(amount);
        }

        const locale = code === "EUR" ? "de-DE" : "en-US";
        const symbol = code === "EUR" ? "€" : "$";
        if (amount >= 1000) {
            const k = amount / 1000;
            const value = Number.isInteger(k) ? k.toString() : k.toFixed(1);
            return `${symbol}${value}k`;
        }
        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency: code,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const getCurrencyRange = (service: any, code: CurrencyCode): { min: number | null; max: number | null } => {
        const pick = () => {
            if (code === "USD") return { min: service.priceMinUsd, max: service.priceMaxUsd };
            if (code === "EUR") return { min: service.priceMinEur, max: service.priceMaxEur };
            return { min: service.priceMinBdt, max: service.priceMaxBdt };
        };

                const primary = pick();
        const validPrimary = (primary.min !== null && primary.min !== undefined) || (primary.max !== null && primary.max !== undefined);
        if (validPrimary) return { min: primary.min ?? null, max: primary.max ?? null };

        return {
            min: service.priceMinUsd ?? service.priceMin ?? null,
            max: service.priceMaxUsd ?? service.priceMax ?? null,
        };
    };

    return (
        <main className="w-full min-h-screen bg-[#fcfaf8] pb-20 selection:bg-orange-100 relative overflow-x-hidden">
            {/* Ambient dynamic background glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-orange-500/[0.02] blur-[150px] rounded-full -z-20 pointer-events-none" />
            <div className="absolute top-[35%] right-[-10%] w-[600px] h-[600px] bg-amber-500/[0.015] blur-[140px] rounded-full -z-20 pointer-events-none" />

            {/* Clean minimal background grid */}
            <div className="absolute top-0 inset-x-0 h-[700px] overflow-hidden pointer-events-none select-none -z-10 opacity-[0.02] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,#000_80%,transparent_100%)]">
                <div className="w-full h-full bg-[linear-gradient(to_right,#ea580c_1px,transparent_1px),linear-gradient(to_bottom,#ea580c_1px,transparent_1px)] bg-[size:4rem_4rem]" />
            </div>

            <div className="max-w-[1240px] mx-auto px-5 sm:px-8 pt-28 sm:pt-36">

                {/* ── HEADER ── */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16 text-left border-b border-slate-200/50 pb-8 relative z-10">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-2.5 mb-2.5">
                            <div className="w-4 h-[1.5px] bg-orange-500 rounded-full" />
                            <span className="text-orange-600 font-bold tracking-widest text-[9px] uppercase font-mono">Pricing Plans</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tighter uppercase mb-3">
                            Simple Pricing<span className="text-orange-500">.</span>
                        </h1>
                        <p className="text-slate-500 text-xs sm:text-sm font-semibold uppercase tracking-wider">Choose a pricing tier that aligns with your product goals.</p>
                    </div>

                </div>

                {/* ── PRICING GRID ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch relative z-10">
                    {services.map((service, i) => {
                        const range = getCurrencyRange(service, currency);
                        const hasAnyPrice = range.min !== null || range.max !== null;
                        const visualUrl = resolveServiceVisualUrl(service);
                        const hasImage = visualUrl && !failedImages[service.id];
                        const ServiceIcon = getServiceIcon(service.slug || "");
                        
                        const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const x = e.clientX - rect.left;
                          const y = e.clientY - rect.top;
                          e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
                          e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
                        };

                        return (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.05, ease: "easeOut" }}
                                onMouseMove={handleMouseMove}
                                style={{
                                  "--spotlight-color": "rgba(249, 115, 22, 0.12)"
                                } as React.CSSProperties}
                                className="group relative flex flex-col justify-between cursor-pointer"
                            >
                                {/* 1. Background offset card layer */}
                                <div className="absolute inset-0 rounded-2xl border border-orange-500/25 bg-orange-500/[0.03] translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform duration-500 -z-10" />

                                {/* 2. Foreground main card layer */}
                                <div className="w-full h-full rounded-2xl bg-white border border-slate-200/90 p-5 flex flex-col justify-between transition-all duration-500 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:border-slate-400 group-hover:shadow-[0_15px_35px_rgba(0,0,0,0.03)] before:absolute before:inset-0 before:bg-[radial-gradient(130px_circle_at_var(--mouse-x,0px)_var(--mouse-y,0px),var(--spotlight-color),transparent)] before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-300 before:pointer-events-none before:z-0 overflow-hidden relative">
                                    
                                    <div className="flex flex-col text-left relative z-10">
                                        
                                        {/* Real Banner Image (No SVG mock placeholders) */}
                                        <div className="relative w-full aspect-[16/9] overflow-hidden rounded-xl mb-5 border border-slate-200/60 bg-[#fcfaf8] flex items-center justify-center shrink-0">
                                            {/* Clean minimal icon backdrop (always rendered underneath as loading placeholder) */}
                                            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-50 to-orange-500/[0.02] flex items-center justify-center">
                                                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ea580c_1px,transparent_1px),linear-gradient(to_bottom,#ea580c_1px,transparent_1px)] bg-[size:16px_16px] opacity-[0.015]" />
                                                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/60 flex items-center justify-center shadow-sm">
                                                    <ServiceIcon className="w-4 h-4 text-orange-500" />
                                                </div>
                                            </div>

                                            {hasImage && (
                                                <img
                                                     src={visualUrl}
                                                     alt={service.title || "Service Banner"}
                                                     className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 group-hover:scale-[1.02] z-10 ${
                                                         loadedImages[service.id] ? "opacity-100 scale-100" : "opacity-0 scale-[0.98]"
                                                     }`}
                                                     onLoad={() => setLoadedImages(prev => ({ ...prev, [service.id]: true }))}
                                                     onError={() => setFailedImages(prev => ({ ...prev, [service.id]: true }))}
                                                 />
                                            )}
                                        </div>

                                        {/* Pricing Header info */}
                                        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
                                            <div className="min-w-0">
                                                <h3 className="text-xs font-black uppercase tracking-tight text-slate-900 leading-tight group-hover:text-orange-600 transition-colors" title={service.title}>
                                                    {service.title}
                                                </h3>
                                                <span className="text-[7.5px] font-black text-slate-400 uppercase tracking-widest block mt-1 font-mono">Estimated Cost</span>
                                            </div>
                                            <div className="text-right shrink-0 font-mono">
                                                {hasAnyPrice ? (
                                                    <span className="text-lg sm:text-xl font-black tracking-tight text-emerald-600 leading-none">
                                                        {range.min !== null ? formatCompactPrice(range.min, currency) : ""}
                                                        {range.min !== null && range.max !== null ? "-" : ""}
                                                        {range.max !== null ? formatCompactPrice(range.max, currency) : ""}
                                                    </span>
                                                ) : (
                                                    <span className="text-[8.5px] font-black uppercase tracking-widest text-slate-400">Custom Quote</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <p className="text-xs leading-relaxed text-slate-500 font-medium line-clamp-3">
                                            {service.description}
                                        </p>

                                        {/* Features checklist */}
                                        {Array.isArray(service.features) && service.features.length > 0 && (
                                            <div className="flex flex-col gap-2 pt-6">
                                                {service.features.slice(0, 3).map((feat: string, fIdx: number) => (
                                                    <div key={fIdx} className="flex items-center gap-2">
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                                                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-700 leading-none">{feat}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4 pt-6 mt-6 border-t border-slate-100 relative z-10">
                                        {/* Tech Stack List */}
                                        {Array.isArray(service.techStack) && service.techStack.length > 0 && (
                                            <div className="flex flex-wrap gap-1 font-mono text-[8px] font-extrabold uppercase text-slate-400">
                                                {service.techStack.slice(0, 3).map((tech: string, tIdx: number) => (
                                                    <span key={tIdx} className="after:content-['/'] after:mx-1.5 last:after:content-none">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Button Actions */}
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleSelectPlan(service)}
                                                className="flex-grow py-3 rounded-xl bg-slate-950 text-white hover:bg-orange-600 font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-98 cursor-pointer"
                                            >
                                                Select Plan <ArrowRight className="w-3.5 h-3.5" />
                                            </button>
                                            {service.demoUrl && (
                                                 <a 
                                                     href={service.demoUrl} 
                                                     target="_blank" 
                                                     rel="noreferrer" 
                                                     className="px-4 py-3 rounded-xl border border-slate-200 hover:border-slate-400 font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-1 transition-all bg-white active:scale-98 text-slate-700"
                                                     title="View Live Demo"
                                                 >
                                                     Demo
                                                 </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* ── FAQ GRID ── */}
                <div className="mt-24">
                    <h3 className="text-base font-black uppercase text-slate-900 mb-8 flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-orange-500" /> Frequently Asked Questions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         {FAQS.map((item, i) => (
                            <div key={i} className="p-5 rounded-xl bg-white border border-slate-200/80 flex gap-4 shadow-sm text-left">
                                <div className="space-y-1.5">
                                    <h4 className="text-xs font-bold uppercase tracking-wide text-slate-900">{item.q}</h4>
                                    <p className="text-xs font-medium leading-relaxed text-slate-500">{item.a}</p>
                                </div>
                            </div>
                         ))}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {selectedService && (
                    <div className="fixed inset-0 z-[200] overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedService(null)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="w-full max-w-lg bg-white rounded-2xl border border-slate-200/80 shadow-2xl overflow-hidden relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => {
                                    setSelectedService(null);
                                    setSubmitStatus("idle");
                                }}
                                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Header */}
                            <div className="p-8 pb-4 border-b border-slate-100 text-left">
                                <span className="text-orange-600 font-black tracking-widest text-[9px] uppercase mb-1 block font-mono">Plan Request</span>
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                                    {selectedService.title}
                                </h3>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wide mt-1.5 flex items-center gap-1.5">
                                    Estimated Cost: <span className="font-extrabold text-emerald-600 font-mono">
                                        {(() => {
                                            const range = getCurrencyRange(selectedService, currency);
                                            const hasAny = range.min !== null || range.max !== null;
                                            if (!hasAny) return "Custom Pricing";
                                            return (
                                            <>
                                                {range.min !== null ? formatCompactPrice(range.min, currency) : ""}
                                                {range.min !== null && range.max !== null ? " - " : ""}
                                                {range.max !== null ? formatCompactPrice(range.max, currency) : ""}
                                            </>
                                            );
                                        })()}
                                    </span>
                                </p>
                            </div>

                            {/* Body */}
                            <div className="p-8">
                                <AnimatePresence mode="wait">
                                    {submitStatus === "success" ? (
                                        <motion.div
                                            key="success"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="text-center py-6 space-y-4"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto shadow-md">
                                                <CheckCircle2 className="w-6 h-6" />
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="text-lg font-black text-slate-900 uppercase">Request Received</h4>
                                                <p className="text-slate-500 font-bold uppercase tracking-wider text-[9px] max-w-xs mx-auto">
                                                    Thank you! Our engineering team will contact you shortly to scope your custom solution.
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setSelectedService(null);
                                                    setSubmitStatus("idle");
                                                }}
                                                className="px-6 py-2.5 bg-slate-950 text-white rounded-xl font-bold uppercase tracking-wider text-[9px] hover:bg-orange-600 transition-all active:scale-95 mt-4 cursor-pointer"
                                            >
                                                Done
                                            </button>
                                        </motion.div>
                                    ) : (
                                        <motion.form
                                            key="form"
                                            onSubmit={handleSubmitLead}
                                            className="space-y-4"
                                        >
                                            {submitStatus === "error" && (
                                                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-[10px] font-bold uppercase tracking-wider">
                                                    {errorMessage || "Submission failed. Please try again."}
                                                </div>
                                            )}

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 ml-1">Full Name *</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        placeholder="Your Name"
                                                        value={leadName}
                                                        onChange={(e) => setLeadName(e.target.value)}
                                                        className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 text-[10px] font-bold uppercase tracking-wider outline-none focus:bg-white focus:ring-1 focus:ring-orange-500 transition-all"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 ml-1">Email Address *</label>
                                                    <input
                                                        required
                                                        type="email"
                                                        placeholder="email@example.com"
                                                        value={leadEmail}
                                                        onChange={(e) => setLeadEmail(e.target.value)}
                                                        className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 text-[10px] font-bold uppercase tracking-wider outline-none focus:bg-white focus:ring-1 focus:ring-orange-500 transition-all"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 ml-1">Company (Optional)</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Company Name"
                                                        value={leadCompany}
                                                        onChange={(e) => setLeadCompany(e.target.value)}
                                                        className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 text-[10px] font-bold uppercase tracking-wider outline-none focus:bg-white focus:ring-1 focus:ring-orange-500 transition-all"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 ml-1">Budget (Optional)</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. Budget range in your preferred currency"
                                                        value={leadBudget}
                                                        onChange={(e) => setLeadBudget(e.target.value)}
                                                        className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 text-[10px] font-bold uppercase tracking-wider outline-none focus:bg-white focus:ring-1 focus:ring-orange-500 transition-all"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1 text-left">
                                                <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 ml-1">Project Details *</label>
                                                <textarea
                                                    required
                                                    rows={3}
                                                    placeholder="Briefly describe your product goals, deliverables, and timeline"
                                                    value={leadDescription}
                                                    onChange={(e) => setLeadDescription(e.target.value)}
                                                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 text-[10px] font-bold uppercase tracking-wider outline-none focus:bg-white focus:ring-1 focus:ring-orange-500 transition-all resize-none"
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={submitStatus === "submitting"}
                                                className="w-full mt-4 py-3.5 bg-orange-600 hover:bg-slate-950 text-white font-black uppercase tracking-[0.15em] text-[9px] rounded-xl shadow-lg hover:shadow-orange-500/10 flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-98 disabled:opacity-50 cursor-pointer"
                                            >
                                                {submitStatus === "submitting" ? (
                                                    <>
                                                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Submitting...
                                                    </>
                                                ) : (
                                                    <>
                                                        Submit Plan Request <ArrowRight className="w-3 h-3" />
                                                    </>
                                                )}
                                            </button>
                                        </motion.form>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    );
}
