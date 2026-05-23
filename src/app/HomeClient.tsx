"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Star, ExternalLink, Cpu, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LottiePlayer from "@/components/LottiePlayer";
import {
  homeStats,
  homeTechStack,
  homeTestimonials,
  homeServicePreview,
} from "@/content/site";
import { getFeaturedProjects } from "@/data/projects";
import api from "@/lib/api";

const JANTRA_ORANGE_GLOW = "rgba(249, 115, 22, 0.5)";

// ─── PROJECT CAROUSEL — Signature High-End Editorial Fader ──────────────────
function ProjectCarousel({ projects }: { projects: any[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!projects || projects.length <= 1) return;
    const timer = setInterval(() => setIndex(p => (p + 1) % projects.length), 7000);
    return () => clearInterval(timer);
  }, [projects.length]);

  if (!projects || projects.length === 0) return (
    <div className="w-full h-[400px] sm:h-[600px] bg-slate-50 rounded-[3rem] border border-slate-100 flex flex-col items-center justify-center gap-6 group overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="text-center space-y-2 relative z-10">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-600/50">Gallery Archive</p>
        <p className="text-slate-400 font-medium text-sm">Case studies are being indexed...</p>
      </div>
    </div>
  );

  const project = projects[index];
  const defaultImage = "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80&w=2070"; // Modern abstract gradient instead of a black screen
  const projectImage = project.thumbnail || defaultImage;

  return (
    <div className="relative group w-full max-w-[1240px] mx-auto">
      {/* Dynamic Brand Ambient Halo */}
      <div className="absolute inset-x-12 -bottom-6 top-12 bg-orange-500/10 blur-[64px] rounded-full pointer-events-none z-0" />

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)", y: 20 }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)", y: 0 }}
          exit={{ opacity: 0, scale: 0.98, filter: "blur(10px)", y: -20 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full flex flex-col lg:flex-row items-stretch rounded-[2.5rem] sm:rounded-[3.5rem] overflow-hidden bg-white border border-slate-100 shadow-[0_50px_100px_-40px_rgba(30,41,59,0.08)]"
        >
          {/* Visual Column — Responsive Aspect Ratio Control */}
          <div className="min-h-[280px] sm:h-[450px] lg:h-auto lg:w-[55%] relative overflow-hidden bg-slate-50 flex items-center justify-center p-6 sm:p-14 border-b lg:border-b-0 lg:border-r border-slate-50">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,1)_0%,rgba(248,250,252,0.5)_100%)]" />

            {/* Focal Core Animation */}
            <motion.div
              animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.2, 1] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute w-2/3 h-2/3 bg-orange-500/10 blur-[40px] rounded-full z-0"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.15, ease: "easeOut" }}
              className="relative z-10 w-full h-full flex items-center justify-center"
            >
              <img
                src={projectImage}
                alt={project.title}
                className="max-w-[100%] max-h-full object-contain rounded-2xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.22)] border border-white/40"
              />
            </motion.div>

            {/* Editorial Numbering */}
            <div className="absolute top-8 left-8 sm:top-12 sm:left-12 z-20">
              <span className="text-6xl sm:text-8xl font-black text-slate-900/5 select-none leading-none tracking-tighter">
                0{index + 1}
              </span>
            </div>
          </div>

          {/* Content Column — High Density Fine Typography */}
          <div className="lg:w-[45%] p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
            <div className="space-y-4 sm:space-y-8">
              <div className="flex items-center gap-4 group/cat">
                <div className="h-[2.5px] w-8 bg-orange-500 origin-left group-hover/cat:scale-x-125 transition-transform duration-500" />
                <span className="text-[9px] font-black uppercase tracking-[0.6em] text-orange-600">
                  {Array.isArray(project.category) ? project.category[0] : (project.category || "Case Study")}
                </span>
              </div>

              <div className="space-y-2 sm:space-y-4 min-h-[3.5rem] sm:min-h-[6rem] lg:min-h-[10rem] flex flex-col justify-end">
                <h4 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-[0.95] tracking-tighter line-clamp-2 uppercase">
                  {project.title}
                </h4>
                <div className="flex flex-wrap gap-1.5 pt-1.5">
                  {(project.tags || []).slice(0, 3).map((t: string) => (
                    <span key={t} className="text-[7px] sm:text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] border border-slate-50 px-3 py-1.5 rounded-full bg-slate-50/50">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="h-[3.5rem] sm:h-[6rem] overflow-hidden">
                <p className="text-[12px] sm:text-base lg:text-lg text-slate-500 font-medium leading-relaxed max-w-md line-clamp-3">
                  {project.description}
                </p>
              </div>

              {/* Precision Command Unit — Fixed Overflow & Redesigned */}
              <div className="pt-3 sm:pt-6">
                <div className="inline-flex flex-col sm:flex-row items-stretch sm:items-center p-1.5 sm:p-2 bg-slate-50 border border-slate-100 rounded-[2rem] sm:rounded-full shadow-inner">
                  {/* Primary Unit */}
                  <Link
                    href={`/work/${project.slug}`}
                    className="group/btn flex items-center justify-between sm:justify-start gap-4 px-8 py-4 sm:py-3.5 bg-orange-600 text-white rounded-[1.5rem] sm:rounded-full hover:bg-slate-950 transition-all duration-700 shadow-xl shadow-orange-500/10 active:scale-95"
                  >
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Case Study</span>
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover/btn:bg-white/20 transition-colors">
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>

                  {/* Aesthetic Divider — Desktop Only */}
                  <div className="hidden sm:block w-[1px] h-6 bg-slate-200 mx-4" />

                  {/* Secondary Unit */}
                  <Link
                    href={project.liveUrl || `/work/${project.slug}`}
                    target={project.liveUrl ? "_blank" : undefined}
                    className="flex-1 sm:flex-none group/live flex items-center justify-center sm:justify-start gap-4 px-8 py-5 sm:py-3.5 text-slate-500 hover:text-slate-900 transition-colors active:scale-95"
                  >
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Live Preview</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-40 group-hover/live:opacity-100 transition-opacity" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Rhythmic Progress Engine */}
      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-4 z-30">
        {projects.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`group relative py-4 flex items-center justify-center transition-all duration-700 ${index === i ? 'w-20 sm:w-24' : 'w-4'}`}
          >
            <div className={`h-[4px] rounded-full transition-all duration-1000 ${index === i ? 'w-full bg-orange-600' : 'w-3 bg-slate-200 group-hover:bg-slate-300'}`} />
            {index === i && (
              <div className="absolute h-[1px] w-full bg-orange-500/20 blur-[2px] top-1/2 animate-pulse" />
            )}
          </button>
        ))}
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
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-orange-500 blur-[12px] opacity-35 rounded-full" />
                <div className="relative w-16 h-16 rounded-full border-2 border-white/10 overflow-hidden ring-2 ring-slate-900">
                  <img src={`https://i.pravatar.cc/150?u=jantra_rev_main_${index}`} className="w-full h-full object-cover" alt={t.author} />
                </div>
              </div>
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

// ─── Main Page ────────────────────────────────────────────────────────────────
import { projects as localProjects } from "@/data/projects";

export default function HomePage({ initialProjects = [] }: { initialProjects?: any[] }) {
  const [featuredProjects, setFeaturedProjects] = useState<any[]>(initialProjects);
  const [loading, setLoading] = useState(initialProjects.length === 0);

  useEffect(() => {
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
  }, []);

  return (
    <main className="min-h-screen bg-[#f8fafc] overflow-x-hidden">

      {/* Hero — dedicated per breakpoint */}
      <MobileLottieHero />
      <DesktopHero />

      {/* ── STATS ─────────────────────────────────────────── */}
      <section className="py-6 sm:py-12 lg:py-16 px-5 sm:px-8 bg-[#fcfaf8] border-y border-orange-50">
        <div className="mx-auto max-w-[1400px] grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
          {homeStats.map(stat => (
            <div key={stat.label} className="relative group">
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
          ))}
        </div>
      </section>

      {/* ── SELECTED WORK CAROUSEL ───────────────────────────── */}
      <section id="work" className="py-10 sm:py-16 lg:py-20 bg-white overflow-hidden relative">
        {/* ── SELECTION HEADER — Precision Grid ── */}
        <div className="mx-auto max-w-[1400px] px-5 sm:px-12 relative mb-12 sm:mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-100 pb-10">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-[2px] bg-orange-500" />
                <p className="text-[10px] font-black uppercase tracking-[0.6em] text-orange-600">Selected Work</p>
              </div>
              <h2 className="text-5xl sm:text-7xl font-black text-slate-900 leading-none tracking-tighter">
                Portfolio<span className="text-orange-500">.</span>
              </h2>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[1400px] px-5 sm:px-12 relative z-10">
          {/* Carousel Engine */}
          <ProjectCarousel projects={featuredProjects} />
        </div>
      </section>

      {/* ── TESTIMONIALS CAROUSEL ─────────────────────────── */}
      <section className="py-14 sm:py-20 lg:py-24 px-5 sm:px-8 border-y border-slate-100 bg-[#f8fafc] relative overflow-hidden">
        {/* Subtle background moniker */}
        <div className="absolute top-[15%] left-[-5%] w-[110%] overflow-hidden opacity-[0.015] pointer-events-none select-none z-0">
          <div className="flex whitespace-nowrap animate-marquee-slow">
            <span className="text-[18rem] font-black tracking-tighter leading-none mr-24 uppercase">TESTIMONIALS. REVIEWS. TRUST. FEEDBACK.</span>
          </div>
        </div>

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
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="py-20 sm:py-40 lg:py-48 px-5 sm:px-8 text-center">
        <div className="mx-auto max-w-3xl space-y-8 sm:space-y-14">
          <h2 className="text-5xl sm:text-8xl lg:text-[10rem] font-black text-slate-900 leading-[0.85] tracking-tighter">
            Let&apos;s build.
          </h2>
          <Link
            href="/contact"
            className="button-primary inline-flex rounded-full px-10 sm:px-20 py-5 sm:py-8 text-lg sm:text-3xl font-black active:scale-95 transition-all shadow-[0_15px_40px_-8px_rgba(249,115,22,0.4)] hover:shadow-[0_30px_70px_-12px_rgba(249,115,22,0.55)]"
          >
            Start Project
          </Link>
        </div>
      </section>

    </main>
  );
}
