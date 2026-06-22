"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, ExternalLink, Code, Cpu, Bot, CheckCircle2, HelpCircle, ChevronDown } from "lucide-react";
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "framer-motion";
import LottiePlayer from "@/components/LottiePlayer";
import {
  homeStats,
  homeTechStack,
  homeTestimonials,
  homeServicePreview,
} from "@/content/site";
import { getFeaturedProjects } from "@/data/projects";
import api from "@/lib/api";
import { cn } from "@/lib/utils";


const JANTRA_ORANGE_GLOW = "rgba(249, 115, 22, 0.5)";

// ─── BLUR PLACEHOLDER — Instant slate-50 render, no CLS ──────────────────────
const BLUR_DATA = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmMWY1ZjkiLz48L3N2Zz4=";
const DEFAULT_PROJECT_IMG = "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80&w=1200";

function resolveImg(thumbnail?: string): string {
  if (!thumbnail) return DEFAULT_PROJECT_IMG;
  if (thumbnail.startsWith("http")) return thumbnail;
  const base = (process.env.NEXT_PUBLIC_API_URL || "https://jontro-backend.onrender.com/api").replace(/\/api\/?$/, "");
  return `${base.replace(/\/$/, "")}/${thumbnail.replace(/^\//, "")}`;
}

// ─── PORTFOLIO CARD — Compact Minimal Card with Full Component Image Overlay ─────────
function PortfolioCard({
  project, index, priority = false, isWide = false
}: {
  project: any; index: number; priority?: boolean; isWide?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const src = failed ? DEFAULT_PROJECT_IMG : resolveImg(project.thumbnail);
  const category = Array.isArray(project.category)
    ? project.category[0]
    : (project.category || "Case Study");

  const optimizedSrc = useMemo(() => {
    if (src.includes("images.unsplash.com")) {
      const size = isWide ? "w=1000" : "w=700";
      return src.replace(/w=\d+/, size).replace(/q=\d+/, "q=85");
    }
    return src;
  }, [src, isWide]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl bg-slate-950 border border-slate-800 hover:border-orange-500/30 cursor-pointer shadow-[0_4px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(249,115,22,0.08)] active:scale-[0.995] transition-all duration-500",
        isWide ? "lg:col-span-2" : "col-span-1"
      )}
    >
      {/* Intrinsic aspect ratio box to lock 16:9 ratio and prevent image deformation */}
      <div className="relative w-full aspect-[16/9] overflow-hidden">
        {/* Shimmer skeleton */}
        <AnimatePresence>
          {!imageLoaded && (
            <motion.div 
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 shimmer-bg"
            />
          )}
        </AnimatePresence>

        {/* Blurred background to fill the 16:9 frame without empty bars */}
        <Image
          src={optimizedSrc}
          alt=""
          fill
          aria-hidden="true"
          className="object-cover blur-md opacity-35 scale-105 select-none pointer-events-none"
        />

        <Image
          src={optimizedSrc}
          alt={project.title}
          fill
          priority={priority}
          sizes={isWide ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
          className={cn(
            "object-contain transition-all duration-750 ease-out group-hover:scale-[1.03] z-10",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setFailed(true);
            setImageLoaded(true);
          }}
        />

        {/* Modern Gradient Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent opacity-95 group-hover:opacity-100 transition-opacity duration-500 z-10" />

        {/* Floating Category Badge (Glassmorphic) */}
        <div className="absolute top-4 left-4 z-20">
          <div className="px-2.5 py-1 rounded-md bg-slate-900/60 backdrop-blur-md border border-white/10 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-[7.5px] font-black uppercase tracking-widest text-white/95">{category}</span>
          </div>
        </div>

        {/* Info panel floating over the bottom of the card */}
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 flex flex-col justify-end text-left text-white z-20 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent pt-12">
          <div className="space-y-1">
            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div className="flex items-center gap-1.5 text-[7px] font-black uppercase tracking-widest text-orange-400">
                <span className="opacity-80 font-mono">{project.tags.slice(0, 2).join(" • ")}</span>
              </div>
            )}

            {/* Title */}
            <h3 className="font-heading font-bold text-white text-sm sm:text-base leading-tight tracking-tight uppercase group-hover:text-orange-300 transition-colors duration-250">
              {project.title}
            </h3>

            {/* Short description */}
            {project.description && (
              <p className="text-[10px] text-slate-350 leading-normal line-clamp-1 max-w-xl group-hover:text-white transition-colors duration-200">
                {project.description}
              </p>
            )}
          </div>

          {/* Action row */}
          <div className="mt-3.5 pt-3 border-t border-white/5 flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-white/90 group-hover:text-white">
            <span className="flex items-center gap-1">
              Case Study <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-orange-400" />
            </span>
            {project.liveUrl && (
              <span className="text-[8px] text-slate-350 group-hover:text-orange-400 transition-colors flex items-center gap-1 font-mono uppercase">
                Live Link
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── PORTFOLIO SHOWCASE — Cinematic Story Card Slider (Light Theme / Text Below) ───────────────────
const slideVariants: any = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
    scale: 0.99,
    filter: "blur(3px)"
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      x: { type: "spring", stiffness: 380, damping: 32 },
      opacity: { duration: 0.18 },
      scale: { duration: 0.18 },
      filter: { duration: 0.12 }
    }
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
    scale: 0.99,
    filter: "blur(3px)"
  })
};

function PortfolioShowcase({ projects }: { projects: any[] }) {
  if (!projects || projects.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 rounded-[2rem] border border-dashed border-slate-200 bg-slate-50">
        <p className="text-xs text-slate-400 font-extrabold tracking-widest uppercase">Curating case studies...</p>
      </div>
    );
  }

  const displayProjects = projects.slice(0, 6);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayProjects.map((project, idx) => {
          const pSrc = resolveImg(project.thumbnail);
          const pOptimizedSrc = pSrc.includes("images.unsplash.com") 
            ? pSrc.replace(/w=\d+/, "w=800").replace(/q=\d+/, "q=80")
            : pSrc;
          const category = Array.isArray(project.category) ? project.category[0] : (project.category || "Case Study");
          
          return (
            <motion.div
              key={project.id || idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.05 }}
              whileHover={{ y: -8 }}
              className="group relative flex flex-col h-full bg-white border border-slate-200/60 rounded-[2rem] p-5 hover:border-slate-300 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] transition-all duration-500"
            >
              {/* Image Box (Aspect 16/10 & Object Contain) */}
              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-slate-50 border border-slate-200/40 shrink-0 mb-6 shadow-sm">
                <Image
                  src={pOptimizedSrc}
                  alt=""
                  fill
                  aria-hidden="true"
                  className="object-cover blur-xl opacity-20 scale-110 select-none pointer-events-none transition-transform duration-750 group-hover:scale-120 z-0"
                />
                <Image
                  src={pOptimizedSrc}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-contain p-2.5 scale-[0.97] drop-shadow-md transition-transform duration-700 ease-out group-hover:scale-100 z-10"
                />
                
                {/* Floating Category Tag */}
                <div className="absolute top-3.5 left-3.5 z-20">
                  <span className="px-3 py-1 rounded-full text-[8.5px] font-black uppercase tracking-wider backdrop-blur-md bg-white/95 text-slate-800 border border-slate-200/40 shadow-sm">
                    {category}
                  </span>
                </div>
              </div>

              {/* Title & Info */}
              <div className="flex-1 flex flex-col justify-between space-y-4 px-1">
                <div className="space-y-3 text-left">
                  <h3 className="text-lg font-black tracking-tight text-slate-900 group-hover:text-orange-500 transition-colors uppercase leading-none">
                    {project.title}
                  </h3>
                  
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.slice(0, 3).map((tag: string, tIdx: number) => (
                        <span key={tIdx} className="text-[7.5px] font-black uppercase tracking-widest bg-slate-50 text-slate-500 px-2.5 py-1 rounded-full border border-slate-200/50 hover:bg-slate-100 transition-colors duration-200">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {project.description && (
                    <p className="text-xs leading-relaxed text-slate-500 font-medium line-clamp-2 mt-2">
                      {project.description}
                    </p>
                  )}
                </div>

                {/* Explore Case Study CTA Row */}
                <div className="pt-5 border-t border-slate-100">
                  <Link 
                    href={`/work/${project.slug}`} 
                    className="inline-flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-900 bg-slate-50 group-hover:bg-slate-950 group-hover:text-white border border-slate-100 group-hover:border-transparent py-3.5 px-4 rounded-xl transition-all duration-300 w-full text-center"
                  >
                    Explore Case Study <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── REVIEW CAROUSEL — Stunning Trust Module ────────────────────────
function ReviewCarousel({ testimonials }: { testimonials: any[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex(p => (p + 1) % testimonials.length), 7000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const t = testimonials[index];

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 20, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -20, scale: 0.98 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative min-h-[300px] sm:min-h-[340px] rounded-[2rem] overflow-hidden bg-white border border-slate-100 flex flex-col md:flex-row items-stretch shadow-[0_24px_60px_-30px_rgba(0,0,0,0.2)]"
        >
          {/* Identity Side */}
          <div className="md:w-[34%] bg-slate-900 p-6 sm:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/15 to-transparent pointer-events-none" />
            <div className="relative space-y-4">

              <div className="space-y-1">
                <h5 className="text-base font-black text-white tracking-tight leading-none">{t.author}</h5>
                <p className="text-[9px] font-black text-orange-400 uppercase tracking-[0.28em]">{t.role}</p>
                <p className="text-[10px] font-semibold text-slate-300 tracking-wide pt-1">{t.company}</p>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="w-1 h-1 rounded-full bg-green-500" />
                <span className="text-[8px] font-black text-slate-300 uppercase tracking-wider">Verified Review</span>
              </div>
            </div>
          </div>

          {/* Quote Side */}
          <div className="md:w-[66%] p-6 sm:p-8 lg:p-10 flex flex-col justify-center relative bg-white">
            <div className="absolute top-4 left-4 pointer-events-none">
              <span className="text-6xl sm:text-7xl font-black text-slate-100 select-none leading-none">“</span>
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="relative z-10"
            >
              <blockquote className="text-base sm:text-lg lg:text-xl font-semibold text-slate-800 leading-relaxed tracking-tight mb-5">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} className="w-3 h-3 fill-orange-500 text-orange-500" />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-slate-500 tracking-wide">Client feedback</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* High Fidelity Timer/Nav Dots */}
      <div className="flex justify-center gap-3 mt-6 pb-1">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className="group relative py-2"
          >
            <div className={`h-[3px] transition-all duration-700 ${index === i ? 'w-10 bg-orange-500' : 'w-3 bg-slate-200 group-hover:bg-slate-300'}`} />
            {index === i && (
              <div className="absolute inset-0 bg-orange-500/10 blur-[6px] -z-10" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Mobile: Blended Cinematic Full-Canvas Hero ────────────────────────────────
function MobileLottieHero() {
  const services = useMemo(() => homeServicePreview.filter(s => s.animationSrc), []);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex(p => (p + 1) % services.length), 4200);
    return () => clearInterval(timer);
  }, [services.length]);

  const current = services[index];

  return (
    <section
      className="lg:hidden relative min-h-[640px] h-[100svh] flex flex-col justify-between pt-24 sm:pt-28 pb-5 sm:pb-6 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #fffcf9 0%, #fffbf7 35%, #fffaf8 60%, #f8fafc 100%)" }}
    >
      {/* ── Background Moniker scrolling ── */}
      <div className="absolute top-[12%] left-0 w-full overflow-hidden opacity-[0.03] pointer-events-none select-none z-0">
        <div className="flex whitespace-nowrap animate-marquee-slow">
          <span className="text-[8rem] font-black tracking-tighter leading-none mr-12">JANTRA STUDIO. JANTRA STUDIO. JANTRA STUDIO.</span>
        </div>
      </div>

      {/* ── Massive cinematic background glow ── */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[140vw] h-[140vw] rounded-full blur-[64px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(249,115,22,0.3) 0%, rgba(251,146,60,0.1) 45%, transparent 70%)" }}
      />

      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-400/40 to-transparent" />

      {/* ── CINEMATIC LOTTIE HERO ── */}
      <div className="relative flex-1 flex flex-col items-center justify-center py-3 sm:py-4 min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.title}
            initial={{ scale: 0.8, opacity: 0, filter: "blur(16px)", y: 20 }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)", y: 0 }}
            exit={{ scale: 0.82, opacity: 0, filter: "blur(16px)", y: -20 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex-1 w-full max-h-[clamp(220px,34vh,360px)] flex items-center justify-center"
            style={{ maxWidth: "min(88vw, 520px)" }}
          >
            <div className="w-full h-full max-w-[min(78vw,390px)] max-h-[min(36vh,390px)] aspect-square [filter:drop-shadow(0_0_60px_rgba(249,115,22,0.3))]">
              <LottiePlayer
                src={current.animationSrc!}
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Indicators ── */}
      <div className="flex justify-center gap-2 pb-2">
        {services.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`rounded-full transition-all duration-700 ${i === index ? "bg-orange-500 w-8 h-1" : "bg-orange-200/50 w-1 h-1"}`}
          />
        ))}
      </div>

      <div className="flex justify-center pb-2 relative z-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-4 px-4 py-2.5 rounded-xl border border-orange-200/40 bg-white/60 backdrop-blur-3xl shadow-sm ring-1 ring-white/50"
          >
            <span className="text-lg font-black text-orange-500/40 leading-none">0{index + 1}</span>
            <div className="w-[1px] h-3 bg-orange-500/30" />
            <span className="text-[9px] font-black text-slate-900 uppercase tracking-[0.4em] whitespace-nowrap leading-none">{current.title}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── SEAMLESS GRADIENT BLEND ── */}
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          bottom: "0",
          height: "40%",
          background: "linear-gradient(to bottom, transparent 0%, rgba(248,250,252,0.7) 40%, #f8fafc 85%)"
        }}
      />

      {/* ── CONTENT ── */}
      <div className="relative z-10 px-5 sm:px-6 flex flex-col items-center text-center pb-5 sm:pb-6 shrink-0">
        <div className="w-full">
          <h2 className="text-[clamp(1.9rem,7.5vw,2.8rem)] font-black text-slate-900 leading-[1.15] tracking-tight mb-3 uppercase">
            Building Custom Software <br />& AI <span className="text-orange-500">Solutions.</span>
          </h2>
          <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-[0.2em] mb-5 max-w-xs mx-auto leading-relaxed">
            Jantra Software | Custom SaaS, AI Agents, & Enterprise Automation
          </p>

          {/* CTAs */}
          <div className="flex flex-row gap-3 w-full">
            <Link
              href="/work"
              className="flex-[1.2] button-primary rounded-xl py-3.5 text-[11px] font-black flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
            >
              Our Work <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/contact"
              className="flex-1 rounded-xl py-3.5 text-[11px] font-black text-slate-800 text-center border border-slate-200 bg-white/100 active:scale-95 transition-transform shadow-sm flex items-center justify-center"
            >
              Hire Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Desktop Hero ─────────────────────────────────────────────────────────────
function DesktopHero() {
  const services = useMemo(() => homeServicePreview.filter(s => s.animationSrc), []);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex(p => (p + 1) % services.length), 4500);
    return () => clearInterval(timer);
  }, [services.length]);

  const current = services[index];

  return (
    <section className="hidden lg:flex flex-col justify-between relative h-[100svh] min-h-[760px] max-h-[1120px] pt-28 xl:pt-32 pb-0 overflow-hidden bg-[linear-gradient(180deg,#fffaf5_0%,#fff8f2_45%,#f8fafc_100%)]">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-orange-500/10 blur-[80px] rounded-full -translate-y-1/2 -z-10" />

      {/* Main Grid Content */}
      <div className="flex-1 flex items-center px-8 xl:px-14 w-full max-w-[1560px] mx-auto relative z-10 min-h-0">
        <div className="grid grid-cols-12 items-center gap-8 xl:gap-12 w-full">

          <div className="col-span-7 animate-fade-up">
            <div className="relative pl-8 sm:pl-12 py-2 space-y-6 xl:space-y-8">
              {/* Single accent line spanning the entire text block */}
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-orange-500 via-orange-500/40 to-transparent rounded-full" />
              
              <h1 className="text-[clamp(3.1rem,4.4vw,4.8rem)] 2xl:text-[clamp(4.2rem,4.5vw,5.6rem)] font-black leading-[1.1] tracking-tight text-slate-900 uppercase">
                Building Custom Software <br />& AI <span className="text-orange-500">Solutions.</span>
              </h1>

              <p className="text-[clamp(0.8rem,0.95vw,1.1rem)] font-semibold text-slate-400 uppercase tracking-[0.24em] leading-relaxed max-w-xl">
                Jantra Software | Custom SaaS, AI Agents, & Enterprise Automation
              </p>

              <div className="flex items-center gap-4 pt-2">
                <Link
                  href="/work"
                  className="rounded-full px-7 py-3.5 text-xs xl:text-sm font-bold flex items-center gap-2.5 shadow-lg shadow-orange-500/10 hover:-translate-y-0.5 active:scale-95 transition-transform bg-orange-600 text-white hover:bg-orange-500"
                >
                  Our Work <ArrowRight className="w-4 h-4" />
                </Link>
                <Link 
                  href="/contact" 
                  className="rounded-full px-7 py-3.5 text-xs xl:text-sm font-bold border border-orange-200 text-orange-700 bg-white/80 hover:bg-orange-50 transition-all active:scale-95 hover:-translate-y-0.5"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
          </div>

          <div className="col-span-5 animate-fade-up flex flex-col items-center" style={{ animationDelay: '0.2s' }}>
            <div className="relative flex flex-col items-center justify-center min-h-0 w-full">
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4], rotate: [0, 45, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-[-40px] blur-[60px] rounded-full -z-20"
                style={{ backgroundColor: JANTRA_ORANGE_GLOW }}
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.title}
                  initial={{ x: 40, opacity: 0, scale: 0.95, filter: "blur(6px)" }}
                  animate={{ x: 0, opacity: 1, scale: 1.02, filter: "blur(0px)" }}
                  exit={{ x: -40, opacity: 0, scale: 0.95, filter: "blur(6px)" }}
                  transition={{ duration: 0.8, ease: [0.2, 1, 0.3, 1] }}
                  className="relative flex flex-col items-center w-full"
                >
                  <div className="w-full max-w-[min(46vw,620px)] max-h-[min(54vh,620px)] aspect-square flex items-center justify-center">
                    <LottiePlayer src={current.animationSrc!} className="w-full h-full drop-shadow-[0_0_60px_rgba(249,115,22,0.25)]" />
                  </div>
                  <div className="mt-2 flex flex-col items-center">
                    <motion.div
                      className="flex items-center gap-3.5 px-6 py-3 rounded-xl bg-white/40 backdrop-blur-xl border border-slate-100 shadow-[0_12px_35px_-8px_rgba(0,0,0,0.04)] ring-1 ring-white/50"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="text-xl font-black text-orange-500 opacity-20 select-none leading-none">0{index + 1}</div>
                      <div className="h-5 w-[1px] bg-slate-200" />
                      <div className="text-left">
                        <p className="text-[7px] font-black text-orange-600 uppercase tracking-[0.6em] mb-0.5">Service Platform</p>
                        <h4 className="text-xs xl:text-sm font-black text-slate-900 uppercase tracking-[0.2em] leading-none">
                          {current.title}
                        </h4>
                      </div>
                    </motion.div>
                  </div>
                  <div className="flex gap-1.5 justify-center mt-4">
                    {services.map((_, i) => (
                      <button key={i} onClick={() => setIndex(i)} className={`rounded-full transition-all duration-300 ${i === index ? 'bg-orange-500 w-4 h-1' : 'bg-slate-300 w-1 h-1'}`} />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>

      {/* ── TECH MARQUEE (Desktop Version - fits without scroll) ── */}
      <div className="w-full bg-white border-y border-slate-100 overflow-hidden relative z-30 py-2 shrink-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,white_0%,transparent_10%,transparent_90%,white_100%)] pointer-events-none z-20 w-full" />
        <div className="flex gap-6 whitespace-nowrap animate-marquee items-center px-4 relative z-10">
          {[
            "React", "Next.js", "Node.js", "Python", "AWS", "OpenAI", "Flutter", "PostgreSQL", "TypeScript", "Docker",
            "React", "Next.js", "Node.js", "Python", "AWS", "OpenAI", "Flutter", "PostgreSQL", "TypeScript", "Docker",
            "React", "Next.js", "Node.js", "Python", "AWS", "OpenAI", "Flutter", "PostgreSQL", "TypeScript", "Docker",
          ].map((tech, i) => {
            const map: Record<string, string> = { React: "react", "Next.js": "nextdotjs", "Node.js": "nodedotjs", Python: "python", AWS: "amazonaws", OpenAI: "openai", Flutter: "flutter", PostgreSQL: "postgresql", TypeScript: "typescript", Docker: "docker" };
            const slug = map[tech];
            const broken = slug === "amazonaws" || slug === "openai";
            return (
              <div key={`${tech}-${i}`} className="relative p-[1px] rounded-full bg-gradient-to-r from-orange-100/50 via-orange-50 to-orange-200/50 group hover:from-orange-300 hover:to-orange-400 transition-all duration-500 cursor-default shadow-sm hover:shadow-[0_6px_18px_-6px_rgba(249,115,22,0.25)] hover:-translate-y-0.5">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm">
                  {!broken && <img src={`https://cdn.simpleicons.org/${slug}/c2410c`} alt={tech} className="w-3 h-3" />}
                  <span className="text-[10px] font-bold text-orange-950/70 group-hover:text-orange-900 transition-colors">{tech}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── SCROLL REVEAL WRAPPER ──────
// ─── SCOPING TIMELINE ────────────────────────────────────────────────────────
function ScopingTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const steps = [
    {
      day: "Day 1-3",
      title: "Scoping & Layout Planning",
      desc: "We sit down to plan your project, map out exactly how it will work, and define how everything connects so there are no surprises.",
      icon: Code,
      accent: "from-orange-500 to-amber-500",
      milestone: "Blueprint Approved"
    },
    {
      day: "Week 1-3",
      title: "Core Feature Building",
      desc: "Our team builds the main features and clean user screens in a private testing space where you can watch the progress live.",
      icon: Cpu,
      accent: "from-orange-600 to-rose-500",
      milestone: "Interactive Staging"
    },
    {
      day: "Week 4",
      title: "Testing & Security Polish",
      desc: "We test every button, optimize performance, and run checks to make sure your user data and transactions are completely secure.",
      icon: Bot,
      accent: "from-red-500 to-orange-500",
      milestone: "Quality Certification"
    },
    {
      day: "Week 5",
      title: "Launch & Ownership Handover",
      desc: "We launch the live website to your servers and transfer complete ownership of the source code and files directly to you.",
      icon: ExternalLink,
      accent: "from-orange-500 to-emerald-500",
      milestone: "Full Code Ownership"
    }
  ];

  return (
    <section ref={ref} className="py-20 sm:py-28 bg-[#fcfaf8] border-y border-orange-50/50 relative overflow-hidden">
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-12 relative">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-24">
          <span className="text-orange-600 font-bold tracking-widest text-[9px] uppercase mb-2.5 block">Delivery Process</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-none uppercase tracking-tighter">
            Our Scoping Cycle<span className="text-orange-500">.</span>
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm font-semibold uppercase tracking-wider mt-3">
            How we engineer custom software & automation in 5 weeks.
          </p>
        </div>

        {/* Timeline Engine */}
        <div className="relative">
          
          {/* Scroll progress bar (Center on PC, Left on Mobile) */}
          <div className="absolute left-6 lg:left-1/2 top-4 bottom-4 w-[3px] -translate-x-[1.5px] bg-slate-200/50 rounded-full" />
          <motion.div 
            className="absolute left-6 lg:left-1/2 top-4 bottom-4 w-[3px] -translate-x-[1.5px] bg-gradient-to-b from-orange-500 via-orange-600 to-orange-500 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.6)]"
            style={{ scaleY, transformOrigin: "top" }}
          />

          {/* Timeline Nodes */}
          <div className="space-y-12 lg:space-y-24 relative">
            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              const isEven = idx % 2 === 0;
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 30, filter: "blur(3px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: 0.05 }}
                  className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
                >
                  {/* Left Column (PC only) */}
                  <div className={`hidden lg:block lg:col-span-5 text-right ${isEven ? "" : "lg:order-last text-left"}`}>
                    <div className="space-y-3 px-4">
                      <span className="inline-flex px-3 py-1 rounded-full bg-orange-50 text-[8.5px] font-black uppercase tracking-widest text-orange-600 border border-orange-100/50 mb-2 font-mono">
                        {step.day}
                      </span>
                      <h3 className="text-xl font-bold uppercase text-slate-900 tracking-tight">
                        {step.title}
                      </h3>
                      <p className="text-xs leading-relaxed text-slate-550 font-medium max-w-md ml-auto mr-0">
                        {step.desc}
                      </p>
                    </div>
                  </div>

                  {/* Center Node Column (col-span-2) */}
                  <div className="lg:col-span-2 flex justify-start lg:justify-center items-center pl-1 lg:pl-0 z-20 relative">
                    <div className="relative flex items-center justify-center">
                      <div className="absolute w-14 h-14 rounded-full bg-orange-500/10 blur-[8px] animate-pulse" />
                      <div className="w-10 h-10 rounded-2xl bg-white border-2 border-orange-500 flex items-center justify-center shadow-[0_6px_20px_rgba(249,115,22,0.18)]">
                        <StepIcon className="w-4.5 h-4.5 text-orange-600" />
                      </div>
                    </div>
                  </div>

                  {/* Right Column / Content on mobile */}
                  <div className={`col-span-1 lg:col-span-5 pl-14 lg:pl-0 ${isEven ? "lg:order-last" : ""}`}>
                    {/* Mobile Text (Hidden on PC) */}
                    <div className="lg:hidden space-y-2 mb-4 text-left">
                      <span className="inline-flex px-3 py-1 rounded-full bg-orange-50 text-[8.5px] font-black uppercase tracking-widest text-orange-600 border border-orange-100/50 mb-2 font-mono">
                        {step.day}
                      </span>
                      <h3 className="text-base font-bold uppercase text-slate-900 tracking-tight">
                        {step.title}
                      </h3>
                      <p className="text-xs leading-relaxed text-slate-500 font-medium">
                        {step.desc}
                      </p>
                    </div>

                    {/* Decorative Milestone Card (Both Mobile and PC) */}
                    <div className="p-6 rounded-3xl border border-slate-150 bg-white shadow-sm hover:shadow-[0_15px_35px_-10px_rgba(249,115,22,0.06)] hover:border-orange-500/10 transition-all duration-500 transform hover:-translate-y-0.5 text-left">
                      <div className="flex items-center gap-3 mb-2.5">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${step.accent} animate-pulse`} />
                        <span className="text-[8.5px] font-black uppercase tracking-widest text-slate-400 font-mono">Milestone Goal</span>
                      </div>
                      <h4 className="text-xs font-black uppercase tracking-tight text-slate-900 mb-1">{step.milestone}</h4>
                      <p className="text-[10px] leading-relaxed font-semibold text-slate-400">
                        100% verified design guidelines verified inside Jantra sandbox.
                      </p>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}


// ─── INTEGRATION MATRIX ──────────────────────────────────────────────────────
function IntegrationMatrix() {
  const integrations = [
    { name: "Slack", icon: "slack", color: "#4A154B", hoverGlow: "rgba(74, 21, 75, 0.12)", desc: "Real-time pipeline notifications." },
    { name: "HubSpot", icon: "hubspot", color: "#FF7A59", hoverGlow: "rgba(255, 122, 89, 0.12)", desc: "CRM sync & lead workflows." },
    { name: "Stripe", icon: "stripe", color: "#635BFF", hoverGlow: "rgba(99, 91, 255, 0.12)", desc: "Subscriptions & global gateways." },
    { name: "OpenAI", icon: "openai", color: "#000000", hoverGlow: "rgba(16, 163, 127, 0.12)", desc: "AI core agents & prompt models." },
    { name: "AWS", icon: "amazon", color: "#FF9900", hoverGlow: "rgba(255, 153, 0, 0.12)", desc: "Serverless Lambda & storage." },
    { name: "WhatsApp", icon: "whatsapp", color: "#25D366", hoverGlow: "rgba(37, 211, 102, 0.12)", desc: "Direct customer communication." },
    { name: "GitHub", icon: "github", color: "#24292F", hoverGlow: "rgba(36, 41, 47, 0.12)", desc: "Version control & webhook updates." },
    { name: "Discord", icon: "discord", color: "#5865F2", hoverGlow: "rgba(88, 101, 242, 0.12)", desc: "Automated alert pipelines." }
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#f8fafc] overflow-hidden relative border-b border-slate-100">
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-12 text-center">
        
        {/* Header */}
        <div className="max-w-2xl mx-auto mb-16">
          <span className="text-orange-600 font-bold tracking-widest text-[9px] uppercase mb-2.5 block">Automated Sync</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-none uppercase tracking-tighter">
            Integration Matrix<span className="text-orange-500">.</span>
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm font-semibold uppercase tracking-wider mt-3">
            We bridge your platform with the industry-standard services.
          </p>
        </div>

        {/* Honeycomb Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {integrations.map((item, idx) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: idx * 0.04 }}
              whileHover={{ 
                scale: 1.025,
                borderColor: item.color,
                boxShadow: `0 15px 40px -10px ${item.hoverGlow}`
              }}
              className="group relative p-5 rounded-2xl bg-white border border-slate-200/50 flex flex-col items-center justify-between text-center transition-all duration-300 h-full cursor-default"
            >
              <div className="flex flex-col items-center gap-4">
                {/* Brand Logo Container */}
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-white transition-all duration-300 relative overflow-hidden">
                  {/* Default monochrome logo */}
                  <img
                    src={`https://cdn.simpleicons.org/${item.icon}/94a3b8`}
                    alt={item.name}
                    className="w-5 h-5 transition-opacity duration-300 group-hover:opacity-0"
                  />
                  {/* Hover colored version */}
                  <img
                    src={`https://cdn.simpleicons.org/${item.icon}/${item.color.replace("#", "")}`}
                    alt={item.name}
                    className="w-5 h-5 absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                    {item.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold leading-relaxed max-w-[150px] mx-auto">
                    {item.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

// ─── FAQ ACCORDION SECTION ──────────────────────────────────────────────────
function FAQSection() {
  const faqs = [
    {
      q: "Do we retain 100% intellectual property of the built software?",
      a: "Yes, completely. Once the scoping checkpoints are complete and payment requirements are resolved, all codebases, database schemas, and digital assets are securely transferred directly to your organization."
    },
    {
      q: "How fast can you launch a production-ready MVP?",
      a: "Our standard scoping cycle completes a fully operational MVP sandbox in 3 to 4 weeks. Hardening, security validations, and production deployment are finalized in Week 5."
    },
    {
      q: "Can you work with our existing database and software stack?",
      a: "Absolutely. We scope API integrations for legacy databases, custom CRMs, and SaaS tools to bridge your legacy stack with modern automation features."
    },
    {
      q: "What options do you offer for ongoing post-launch support?",
      a: "We offer dedicated monthly support SLAs for scaling infrastructure, API maintenance, and incremental feature updates starting immediately after handover."
    }
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#fcfaf8] relative overflow-hidden border-b border-slate-100">
      <div className="mx-auto max-w-[800px] px-5 sm:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-orange-600 font-bold tracking-widest text-[9px] uppercase mb-2.5 block">FAQ</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-none uppercase tracking-tighter">
            Scoping Registry FAQs<span className="text-orange-500">.</span>
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm font-semibold uppercase tracking-wider mt-3">
            Common answers regarding our custom software scoping.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4 text-left">
          {faqs.map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>

      </div>
    </section>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-slate-200/60 rounded-2xl bg-white overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4.5 px-6 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors"
      >
        <span className="text-xs font-bold uppercase tracking-tight text-slate-900 pr-4">
          {q}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="shrink-0"
        >
          <ChevronDown className="w-4 h-4 text-orange-600" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
          >
            <div className="px-6 pb-5 pt-1 text-[11.5px] leading-relaxed text-slate-500 font-medium">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function HomePage({ initialProjects = [] }: { initialProjects?: any[] }) {
  const [featuredProjects, setFeaturedProjects] = useState<any[]>(initialProjects);
  const [loading, setLoading] = useState(initialProjects.length === 0);
  const [activeTab, setActiveTab] = useState("All");

  const filteredProjects = useMemo(() => {
    if (activeTab === "All") return featuredProjects;
    return featuredProjects.filter((p: any) => {
      const catStr = Array.isArray(p.category) ? p.category.join(" ") : (p.category || "");
      return catStr.toLowerCase().includes(activeTab.toLowerCase());
    });
  }, [featuredProjects, activeTab]);

  useEffect(() => {
    if (initialProjects.length > 0) return;

    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await api.get("/work");
        const data = response.data?.data || response.data || [];

        const published = Array.isArray(data) ? data
          .filter((p: any) => p.published)
          .sort((a: any, b: any) => {
            // Prioritize featured, then sort by order
            if (a.featured !== b.featured) return a.featured ? -1 : 1;
            return (a.order || 0) - (b.order || 0);
          }) : [];

        const formatted = published.map((apiProject: any) => ({
          ...apiProject,
          tags: apiProject.techStack || [],
          description: apiProject.description || apiProject.challenge || "Production software delivery.",
        }));

        // Take top 4 for home if many projects
        setFeaturedProjects(formatted);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [initialProjects]);

  return (
    <main className="min-h-screen bg-[#f8fafc] overflow-x-hidden">

      {/* Hero — dedicated per breakpoint */}
      <MobileLottieHero />
      <DesktopHero />

      {/* ── STATS ─────────────────────────────────────────── */}
      <section className="py-6 sm:py-12 lg:py-16 px-5 sm:px-8 bg-[#fcfaf8] border-y border-orange-50">
        <div className="mx-auto max-w-[1400px] grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
          {homeStats.map((stat, idx) => (
            <ScrollReveal key={stat.label} delay={idx * 0.06}>
              <div className="relative group w-full">
                <div className="absolute inset-0 rounded-[2rem] bg-orange-200/40 translate-x-2 translate-y-2 group-hover:translate-x-3.5 group-hover:translate-y-3.5 transition-transform duration-500" />
                <div className="absolute inset-0 rounded-[2rem] bg-orange-100/25 translate-x-4 translate-y-4 group-hover:translate-x-6 group-hover:translate-y-6 transition-transform duration-500 delay-75" />
                <div className="relative py-8 sm:py-12 px-4 sm:px-6 rounded-[2rem] bg-white border border-orange-100/60 shadow-sm group-hover:-translate-y-1 transition-transform duration-500 z-10 flex flex-col items-center text-center">
                  <div className="text-3xl sm:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-orange-500 to-orange-700 mb-2 group-hover:scale-105 transition-transform duration-500">
                    {stat.value}
                  </div>
                  <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] text-orange-950/60 group-hover:text-orange-900 transition-colors duration-500 leading-tight">
                    {stat.label}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── SELECTED WORK — Premium Bento Grid / Grid Showcase ───────────────── */}
      {/* ── SELECTED WORK — Premium Bento Grid / Grid Showcase ───────────────── */}
      <section id="work" className="py-20 sm:py-28 bg-[#f8fafc] relative overflow-hidden">
        {/* Soft Ambient Light Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-orange-500/[0.03] to-transparent blur-[130px] pointer-events-none" />
        
        <ScrollReveal>
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 relative z-10">
            {/* Compact Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-slate-200/60">
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-5 h-[2px] bg-orange-500 rounded-full" />
                  <p className="text-[8.5px] font-black uppercase tracking-[0.65em] text-orange-600">Selected Work</p>
                </div>
                <h2 className="text-4xl sm:text-5xl font-black text-slate-900 leading-none tracking-tighter">
                  Portfolio<span className="text-orange-500">.</span>
                </h2>
              </div>

              {/* Premium Category Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 max-w-full">
                {["All", "AI & ML", "SaaS", "Automation"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap border",
                      activeTab === tab
                        ? "bg-slate-950 text-white border-transparent shadow-md shadow-slate-950/15"
                        : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-950 hover:border-slate-300"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <Link
                href="/work"
                className="hidden sm:inline-flex items-center gap-2 text-[8.5px] font-black uppercase tracking-[0.4em] text-slate-400 hover:text-orange-600 transition-colors duration-300 group shrink-0"
              >
                View All
                <div className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-orange-100 flex items-center justify-center transition-colors duration-300 border border-slate-200/30">
                  <ArrowRight className="w-3 h-3 text-slate-500 group-hover:translate-x-0.5 transition-transform duration-300" />
                </div>
              </Link>
            </div>

            <PortfolioShowcase projects={filteredProjects} />
          </div>
        </ScrollReveal>
      </section>

      {/* ── SCOPING TIMELINE ── */}
      <ScopingTimeline />

      {/* ── INTEGRATION MATRIX ── */}
      <IntegrationMatrix />

      {/* ── TESTIMONIALS CAROUSEL ─────────────────────────── */}
      <section className="py-14 sm:py-20 lg:py-24 px-5 sm:px-8 border-y border-slate-100 bg-[#f8fafc] relative overflow-hidden">
        {/* Subtle background moniker */}
        <div className="absolute top-[15%] left-[-5%] w-[110%] overflow-hidden opacity-[0.015] pointer-events-none select-none z-0">
          <div className="flex whitespace-nowrap animate-marquee-slow">
            <span className="text-[18rem] font-black tracking-tighter leading-none mr-24 uppercase">TESTIMONIALS. REVIEWS. TRUST. FEEDBACK.</span>
          </div>
        </div>

        <ScrollReveal>
          <div className="mx-auto max-w-3xl relative z-10 text-center">
            <div className="space-y-3 mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100/50 border border-orange-200/50">
                <Star className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-800">Elite Client Trust</span>
              </div>
              <h3 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tighter">Client Stories.</h3>
            </div>

            <ReviewCarousel testimonials={homeTestimonials} />
          </div>
        </ScrollReveal>
      </section>

      {/* ── SCOPING FAQs ── */}
      <FAQSection />

      {/* ── CTA — Compact & Stunning Banner ────────────────────── */}
      <section className="py-12 sm:py-16 px-5 sm:px-8 bg-[#f8fafc]">
        <ScrollReveal>
          <div className="mx-auto max-w-4xl rounded-2xl bg-slate-950 text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
            {/* Ambient glass glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-orange-500/10 pointer-events-none" />
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-orange-600/10 blur-3xl rounded-full pointer-events-none" />

            {/* Left Side Info */}
            <div className="flex items-center gap-4 relative z-10 text-left">
              <div className="relative shrink-0 w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping absolute" />
                <span className="w-2 h-2 rounded-full bg-orange-500" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[7.5px] font-black uppercase tracking-widest text-slate-400">Jantra Studio</p>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase leading-none">
                  Let&apos;s build<span className="text-orange-500">.</span>
                </h2>
                <p className="text-[9.5px] text-slate-400 font-medium">
                  Engineering high-performance SaaS & AI automations.
                </p>
              </div>
            </div>

            {/* Action button */}
            <div className="relative z-10 shrink-0">
              <Link
                href="/contact"
                className="inline-flex rounded-xl px-6 py-3.5 text-[8.5px] font-black uppercase tracking-widest bg-white hover:bg-orange-600 text-slate-950 hover:text-white shadow-sm hover:shadow-[0_10px_25px_rgba(249,115,22,0.2)] active:scale-95 transition-all duration-300 items-center gap-1.5"
              >
                Start Project <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

    </main>
  );
}
