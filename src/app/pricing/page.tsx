"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    ArrowRight,
    HelpCircle,
    Code,
    Bot,
    Workflow,
    Cpu,
    Smartphone,
    Cloud,
    Database,
    Zap,
    CheckCircle2,
    X,
    Loader2
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

const serviceImages: Record<string, string> = {
    "custom-software-development": "/custom_software.png",
    "ai-agent-development": "/ai_agents.png",
    "workflow-automation": "/workflow_auto.png",
    "saas-product-development": "/saas_dev.png",
    "mobile-app-development": "/mobile_dev.png",
    "cloud-api-systems": "/cloud_systems.png"
};

const serviceIcons: Record<string, any> = {
    "custom-software-development": Code,
    "ai-agent-development": Bot,
    "workflow-automation": Workflow,
    "saas-product-development": Cpu,
    "mobile-app-development": Smartphone,
    "cloud-api-systems": Cloud
};

const iconMap: Record<string, any> = {
    Code,
    Bot,
    Workflow,
    Cpu,
    Smartphone,
    Cloud,
    Database,
    Zap
};

const FAQS = [
    { q: "How long does delivery take?", a: "Initial versions and MVPs are typically delivered and launched within 4-6 weeks." },
    { q: "Who owns the intellectual property?", a: "You retain 100% ownership of the source code and all intellectual property upon project completion." },
    { q: "Do you offer post-launch support?", a: "Yes, we offer ongoing maintenance, updates, and dedicated support packages tailored to your scale." },
    { q: "Can we migrate or scale plans later?", a: "Absolutely. You can start with a MVP and upgrade features or scale infrastructure as your needs evolve." }
];

type CurrencyCode = "USD" | "EUR" | "BDT";

const resolveServiceVisualUrl = (service: any) => {
    const localFallback = serviceImages[service?.slug] || "";
    const raw = service?.banner || service?.image || localFallback;
    if (!raw) return "";
    if (raw.startsWith("http")) return raw;
    // Keep built-in pricing card assets on the frontend origin.
    if (raw === localFallback) return raw;

    const apiBase = (process.env.NEXT_PUBLIC_API_URL || "https://jontro-backend.onrender.com/api").replace(/\/api\/?$/, "");
    const cleanBase = apiBase.endsWith("/") ? apiBase.slice(0, -1) : apiBase;
    const cleanPath = raw.startsWith("/") ? raw : `/${raw}`;
    return `${cleanBase}${cleanPath}`;
};

const renderServiceBanner = (service: any) => {
    const slug = service?.slug || "";

    return (
        <div className="relative w-full h-full bg-[#FCFAF8] flex items-center justify-center overflow-hidden transition-transform duration-500">
            {/* Ambient Background Grid Patterns */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.06] stroke-orange-600" width="100%" height="100%">
                <defs>
                    <pattern id={`grid-${slug}`} width="24" height="24" patternUnits="userSpaceOnUse">
                        <path d="M 24 0 L 0 0 0 24" fill="none" strokeWidth="1"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#grid-${slug})`} />
            </svg>
            
            {/* Diagonal Orange Accents */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-500/15 to-transparent rounded-full blur-xl pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />

            {/* Custom abstract graphic representation of the service */}
            <div className="relative z-10 flex items-center justify-center w-full h-full">
                {slug === "custom-software-development" && (
                    <svg className="absolute w-2/3 h-2/3 opacity-25 stroke-orange-500/60" viewBox="0 0 100 100" fill="none">
                        <rect x="10" y="20" width="80" height="60" rx="6" strokeWidth="1" />
                        <line x1="10" y1="35" x2="90" y2="35" strokeWidth="1" />
                        <circle cx="20" cy="27" r="2" fill="#ea580c" />
                        <circle cx="28" cy="27" r="2" fill="#ea580c" />
                        <circle cx="36" cy="27" r="2" fill="#ea580c" />
                    </svg>
                )}
                {slug === "ai-agent-development" && (
                    <svg className="absolute w-2/3 h-2/3 opacity-25 stroke-orange-500/60" viewBox="0 0 100 100" fill="none">
                        <circle cx="50" cy="50" r="30" strokeWidth="1" strokeDasharray="3 3" />
                        <circle cx="20" cy="50" r="4" fill="#ea580c" />
                        <circle cx="80" cy="50" r="4" fill="#ea580c" />
                        <circle cx="50" cy="20" r="4" fill="#ea580c" />
                        <circle cx="50" cy="80" r="4" fill="#ea580c" />
                        <line x1="50" y1="20" x2="50" y2="80" strokeWidth="1" />
                        <line x1="20" y1="50" x2="80" y2="50" strokeWidth="1" />
                    </svg>
                )}
                {slug === "workflow-automation" && (
                    <svg className="absolute w-2/3 h-2/3 opacity-25 stroke-orange-500/60" viewBox="0 0 100 100" fill="none">
                        <path d="M15,50 Q50,20 85,50" strokeWidth="1" />
                        <path d="M15,50 Q50,80 85,50" strokeWidth="1" />
                        <circle cx="15" cy="50" r="5" fill="#ea580c" />
                        <circle cx="50" cy="35" r="5" fill="#ea580c" />
                        <circle cx="50" cy="65" r="5" fill="#ea580c" />
                        <circle cx="85" cy="50" r="5" fill="#ea580c" />
                    </svg>
                )}
                {slug === "saas-product-development" && (
                    <svg className="absolute w-2/3 h-2/3 opacity-25 stroke-orange-500/60" viewBox="0 0 100 100" fill="none">
                        <rect x="15" y="15" width="30" height="30" rx="4" strokeWidth="1" />
                        <rect x="55" y="15" width="30" height="30" rx="4" strokeWidth="1" />
                        <rect x="15" y="55" width="30" height="30" rx="4" strokeWidth="1" />
                        <rect x="55" y="55" width="30" height="30" rx="4" strokeWidth="1" />
                        <line x1="30" y1="45" x2="30" y2="55" strokeWidth="1" />
                        <line x1="70" y1="45" x2="70" y2="55" strokeWidth="1" />
                    </svg>
                )}
                {slug === "mobile-app-development" && (
                    <svg className="absolute w-2/3 h-2/3 opacity-25 stroke-orange-500/60" viewBox="0 0 100 100" fill="none">
                        <rect x="30" y="10" width="40" height="80" rx="8" strokeWidth="1" />
                        <circle cx="50" cy="80" r="3" fill="#ea580c" />
                        <line x1="45" y1="18" x2="55" y2="18" strokeWidth="1" />
                    </svg>
                )}
                {slug === "cloud-api-systems" && (
                    <svg className="absolute w-2/3 h-2/3 opacity-25 stroke-orange-500/60" viewBox="0 0 100 100" fill="none">
                        <path d="M25,65 L35,50 L45,65 Z" strokeWidth="1" />
                        <path d="M55,65 L65,50 L75,65 Z" strokeWidth="1" />
                        <path d="M20,65 Q50,45 80,65" strokeWidth="1" />
                        <circle cx="50" cy="35" r="8" strokeWidth="1" />
                    </svg>
                )}

                {/* Central Orange Jantra Logo (Arrowhead Cut is Transparent/White) */}
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md border border-orange-100/80 relative z-20">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-8 h-8">
                        <g fill="#F97316">
                            <path d="M42,15 H85 V85 H55 V70 H70 V30 H52 Z"/>
                            <path d="M25,65 H45 V85 H25 Z"/>
                        </g>
                        <polygon points="30,90 75,35 55,75 40,90" fill="white"/>
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default function PricingPage() {
    const [services, setServices] = useState<any[]>(FALLBACK_SERVICES);
    const [loadedVisuals, setLoadedVisuals] = useState<Record<string, boolean>>({});
    const [failedVisuals, setFailedVisuals] = useState<Record<string, boolean>>({});
    const [selectedService, setSelectedService] = useState<any | null>(null);
    const [leadName, setLeadName] = useState("");
    const [leadEmail, setLeadEmail] = useState("");
    const [leadCompany, setLeadCompany] = useState("");
    const [leadDescription, setLeadDescription] = useState("");
    const [leadBudget, setLeadBudget] = useState("");
    const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const [currency, setCurrency] = useState<CurrencyCode>("USD");

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

    const handleSubmitLead = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitStatus("submitting");
        setErrorMessage("");

        try {
            await api.post("/leads", {
                name: leadName,
                email: leadEmail,
                company: leadCompany,
                service: selectedService.title,
                budget: leadBudget,
                description: leadDescription,
            });
            setSubmitStatus("success");
        } catch (error: any) {
            console.error("Failed to submit plan request:", error);
            setSubmitStatus("error");
            setErrorMessage(error?.response?.data?.error || error?.response?.data?.message || "Failed to submit plan request. Please try again.");
        }
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
                }
            } catch (error) {
                console.error("Failed to load services for pricing page:", error);
            }
        };
        loadDynamicServices();
    }, []);

    useEffect(() => {
        const cookieMatch = document.cookie.match(/(?:^|;\s*)currency_pref_auto=(USD|EUR|BDT)/);
        if (cookieMatch?.[1]) {
            setCurrency(cookieMatch[1] as CurrencyCode);
        } else {
            setCurrency("USD");
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
        const validPrimary = primary.min !== null || primary.max !== null;
        if (validPrimary) return { min: primary.min ?? null, max: primary.max ?? null };

        return {
            min: service.priceMinUsd ?? service.priceMin ?? null,
            max: service.priceMaxUsd ?? service.priceMax ?? null,
        };
    };

    return (
        <main className="w-full min-h-screen bg-slate-50/50 pb-20 selection:bg-orange-100">
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-28 sm:pt-36">

                {/* ── HEADER ── */}
                <div className="max-w-2xl mb-12 text-left">
                    <span className="text-orange-600 font-bold tracking-widest text-[10px] uppercase mb-3 block">Pricing Plans</span>
                    <h1 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight tracking-tight uppercase mb-4">
                        Simple Pricing<span className="text-orange-500">.</span>
                    </h1>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-lg">
                        Choose a pricing tier that aligns with your product goals. No hidden fees, clear deliverables, and robust code quality.
                    </p>
                </div>

                {/* ── PRICING GRID ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                    {services.map((service, i) => {
                        const range = getCurrencyRange(service, currency);
                        const hasAnyPrice = range.min !== null || range.max !== null;
                        const localVisual = serviceImages[service.slug] || "";
                        const visualUrl = resolveServiceVisualUrl(service);
                        const canRenderImage = Boolean(visualUrl) && !failedVisuals[service.id];
                        return (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03 }}
                                className="group relative p-5 rounded-3xl bg-white border border-slate-200/60 shadow-lg shadow-slate-100/30 hover:border-orange-500/25 hover:shadow-2xl hover:shadow-orange-500/5 hover:-translate-y-1 flex flex-col justify-between transition-all duration-300 h-full overflow-hidden"
                            >
                                {/* Subtle background gradient glow */}
                                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-orange-50/0 via-transparent to-orange-500/0 group-hover:from-orange-500/1 group-hover:to-orange-500/3 transition-all duration-500" />
                                
                                <div>
                                    {/* Service Photo Banner (Proper 16:9 Aspect Ratio) */}
                                    <div className="relative w-full aspect-[16/9] overflow-hidden rounded-[1.25rem] mb-6 border border-slate-200/10 bg-slate-950 shadow-inner shrink-0">
                                        {localVisual ? (
                                            <img
                                                src={localVisual}
                                                alt=""
                                                aria-hidden="true"
                                                className="absolute inset-0 w-full h-full object-cover"
                                                loading="eager"
                                            />
                                        ) : (
                                            renderServiceBanner(service)
                                        )}
                                        {canRenderImage && (
                                            <img
                                                src={visualUrl}
                                                alt={service.title || "Service Banner"}
                                                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-150 ${
                                                    loadedVisuals[service.id] ? "opacity-100" : "opacity-0"
                                                }`}
                                                loading={i < 3 ? "eager" : "lazy"}
                                                fetchPriority={i < 3 ? "high" : "auto"}
                                                decoding="async"
                                                onLoad={() =>
                                                    setLoadedVisuals((prev) => ({ ...prev, [service.id]: true }))
                                                }
                                                onError={() =>
                                                    setFailedVisuals((prev) => ({ ...prev, [service.id]: true }))
                                                }
                                            />
                                        )}
                                    </div>

                                    {/* Minimal Side-by-Side Header */}
                                    <div className="flex items-start justify-between gap-4 pt-1">
                                        <div className="min-w-0">
                                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 leading-tight truncate group-hover:text-orange-600 transition-colors" title={service.title}>
                                                {service.title}
                                            </h3>
                                            <span className="text-[7.5px] font-black text-slate-400 uppercase tracking-widest block mt-0.5">Estimated Cost</span>
                                        </div>
                                        <div className="text-right shrink-0">
                                            {hasAnyPrice ? (
                                                <span className="text-xl font-extrabold tracking-tight text-emerald-600 leading-none">
                                                    {range.min !== null ? formatCompactPrice(range.min, currency) : ""}
                                                    {range.min !== null && range.max !== null ? "-" : ""}
                                                    {range.max !== null ? formatCompactPrice(range.max, currency) : ""}
                                                </span>
                                            ) : (
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Custom Pricing</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-[11px] leading-relaxed text-slate-500 font-medium line-clamp-2 mt-3.5">
                                        {service.description}
                                    </p>

                                    {/* Horizontal Compact Features list */}
                                    {Array.isArray(service.features) && service.features.length > 0 && (
                                        <div className="flex flex-wrap gap-x-3 gap-y-1.5 pt-4">
                                            {service.features.slice(0, 3).map((feat: string, fIdx: number) => (
                                                <div key={fIdx} className="flex items-center gap-1.5">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                                                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-700 leading-none">{feat}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4 pt-4 mt-4 border-t border-slate-100/70">
                                    {/* Tech Stack Badges */}
                                    {Array.isArray(service.techStack) && service.techStack.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {service.techStack.slice(0, 3).map((tech: string, tIdx: number) => (
                                                <span key={tIdx} className="text-[7.5px] font-black uppercase tracking-widest bg-slate-50 text-slate-500 px-2 py-0.5 rounded border border-slate-200/50">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Button actions */}
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleSelectPlan(service)}
                                            className="flex-grow py-3 rounded-xl bg-orange-600 text-white hover:bg-slate-950 hover:shadow-lg hover:shadow-orange-500/20 font-black uppercase tracking-[0.15em] text-[9px] flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-98 cursor-pointer"
                                        >
                                            Select Plan <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                        </button>
                                        {service.demoUrl && (
                                             <a 
                                                 href={service.demoUrl} 
                                                 target="_blank" 
                                                 rel="noreferrer" 
                                                 className="px-4 py-3 rounded-xl border border-slate-200 hover:border-orange-500 hover:text-orange-600 font-black uppercase tracking-[0.15em] text-[9px] flex items-center justify-center gap-1 transition-all bg-white hover:shadow-md hover:shadow-orange-500/5 active:scale-98"
                                                 title="View Live Demo"
                                             >
                                                 Demo
                                             </a>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* ── FAQ GRID ── */}
                <div className="mt-24">
                    <h3 className="text-xl font-bold uppercase text-slate-900 mb-8 flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-orange-500" /> Frequently Asked Questions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {FAQS.map((item, i) => (
                            <div key={i} className="p-5 rounded-xl bg-white border border-slate-200/80 flex gap-4 shadow-sm">
                                <div className="space-y-2">
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
                            className="w-full max-w-lg bg-white rounded-3xl border border-slate-200/80 shadow-2xl overflow-hidden relative"
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
                            <div className="p-8 pb-4 border-b border-slate-100">
                                <span className="text-orange-600 font-black tracking-widest text-[9px] uppercase mb-1 block">Plan Request</span>
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                                    {selectedService.title}
                                </h3>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wide mt-1.5 flex items-center gap-1.5">
                                    Estimated Cost: <span className="font-extrabold text-emerald-600">
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

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                                            <div className="space-y-1">
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
