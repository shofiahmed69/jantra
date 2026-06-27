"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, ExternalLink, Code, Cpu, Bot, CheckCircle2, HelpCircle, ChevronDown } from "lucide-react";
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "framer-motion";
import LottiePlayer from "@/components/LottiePlayer";
import Logo from "@/components/Logo";
import {
  homeStats,
  homeTechStack,
  homeTestimonials,
  homeServicePreview,
} from "@/content/site";
import { getFeaturedProjects } from "@/data/projects";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { GlassEffect, GlassButton } from "@/components/ui/liquid-glass";


const JANTRA_ORANGE_GLOW = "rgba(249, 115, 22, 0.5)";

// ─── BLUR PLACEHOLDER — Instant slate-50 render, no CLS ──────────────────────
const BLUR_DATA = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmMWY1ZjkiLz48L3N2Zz4=";
const DEFAULT_PROJECT_IMG = "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80&w=1200";

function resolveImg(thumbnail?: string): string {
  if (!thumbnail) return DEFAULT_PROJECT_IMG;
  let url = thumbnail;
  if (!url.startsWith("http")) {
    const base = (process.env.NEXT_PUBLIC_API_URL || "https://jontro-backend.onrender.com/api").replace(/\/api\/?$/, "");
    url = `${base.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
  }
  if (url.startsWith("http://") || url.includes("sslip.io")) {
    return `/api/image-proxy?url=${encodeURIComponent(url)}`;
  }
  return url;
}

// ─── PORTFOLIO CARD — Compact Glassmorphic Card with Image Overlay ─────────
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
      const size = isWide ? "w=800" : "w=600";
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
        "group relative w-full overflow-hidden rounded-xl cursor-pointer active:scale-[0.995] transition-all duration-350",
        isWide ? "lg:col-span-2" : "col-span-1"
      )}
    >
      <div className="w-full h-full rounded-xl border border-slate-200/80 hover:border-orange-500 bg-white hover:shadow-[0_12px_32px_rgba(255,69,0,0.12)] transition-all duration-350 flex flex-col">
        {/* Compact Image aspect-[16/10] */}
        <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-50 border-b border-slate-100">
          <AnimatePresence mode="wait">
            {!imageLoaded && (
              <motion.div 
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 shimmer-bg"
              />
            )}
          </AnimatePresence>

          <Image
            src={optimizedSrc}
            alt={project.title}
            fill
            priority={priority}
            sizes={isWide ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
            className={cn(
              "object-cover transition-all duration-500 group-hover:scale-[1.03]",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setFailed(true);
              setImageLoaded(true);
            }}
          />

          {/* Floating Category Badge */}
          <div className="absolute top-3 left-3 z-20">
            <div className="px-2 py-0.5 rounded bg-slate-900/90 text-white flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-orange-500" />
              <span className="text-[7px] font-bold uppercase tracking-wider font-mono">{category}</span>
            </div>
          </div>
        </div>

        {/* Compact Content Section */}
        <div className="p-4 flex flex-col flex-1 justify-between bg-white text-left">
          <div className="space-y-1">
            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <span className="text-[7.5px] font-bold font-mono uppercase tracking-wider text-orange-600 block">
                {project.tags.slice(0, 2).join(" • ")}
              </span>
            )}
            {/* Title */}
            <h3 className="font-heading font-bold text-slate-800 text-sm leading-tight tracking-tight uppercase group-hover:text-orange-600 transition-colors duration-200">
              {project.title}
            </h3>
            {/* Short Description */}
            {project.description && (
              <p className="text-[10px] text-slate-500 leading-normal line-clamp-1 group-hover:text-slate-700 transition-colors duration-200">
                {project.description}
              </p>
            )}
          </div>

          {/* Action Row */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[8px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-orange-600 transition-colors duration-200">
            <span className="flex items-center gap-1">
              Case Study <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform text-orange-500" />
            </span>
            {project.liveUrl && (
              <span className="text-[8px] text-orange-600/90 group-hover:text-orange-600 transition-colors font-mono">
                Live Link
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ScrollReveal({ 
  children, 
  delay = 0, 
  direction = "up" 
}: { 
  children: React.ReactNode; 
  delay?: number; 
  direction?: "up" | "down" | "left" | "right" 
}) {
  const directionOffset = {
    up: { y: 30, x: 0 },
    down: { y: -30, x: 0 },
    left: { x: 30, y: 0 },
    right: { x: -30, y: 0 }
  };

  return (
    <motion.div
      initial={{ 
        opacity: 0.35, 
        scale: 0.965, 
        filter: "blur(3px)",
        ...directionOffset[direction]
      }}
      whileInView={{ 
        opacity: 1, 
        scale: 1, 
        filter: "blur(0px)",
        x: 0,
        y: 0
      }}
      viewport={{ once: false, margin: "-15% 0px -15% 0px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function FocusSection({ id, children, className, disableScrollEffects = false }: { id: string; children: React.ReactNode; className?: string; disableScrollEffects?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(true);

  useEffect(() => {
    if (disableScrollEffects) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFocused(entry.isIntersecting);
      },
      {
        rootMargin: "-25% 0px -25% 0px",
        threshold: 0.1,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, [disableScrollEffects]);

  if (disableScrollEffects) {
    return <div id={id} className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      id={id}
      animate={{
        opacity: isFocused ? 1 : 0.65,
        scale: isFocused ? 1 : 0.98,
        filter: isFocused ? "blur(0px)" : "blur(1.5px)",
      }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "transition-all duration-700 relative",
        isFocused ? "z-10" : "z-0",
        className
      )}
    >
      <AnimatePresence>
        {isFocused && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.03),transparent_70%)] pointer-events-none -z-10" 
          />
        )}
      </AnimatePresence>
      {children}
    </motion.div>
  );
}


// ─── PORTFOLIO SHOWCASE — Cinematic Story Card Slider (Glass / Text Below) ───────────────────
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
      <div className="flex items-center justify-center h-64 rounded-[2rem] border border-dashed border-slate-200 bg-slate-50/50 backdrop-blur-md">
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.06 }}
              className="relative group w-full h-full"
            >
              {/* Dual-Layer Backdrop Styling: Offset vibrant orange card */}
              <div className="absolute inset-0 rounded-2xl border border-orange-500/35 bg-orange-500/[0.05] translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform duration-500" />

              {/* Foreground Compact Card */}
              <Link
                href={`/work/${project.slug}`}
                className="relative flex flex-col h-full bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.03)] group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:border-orange-500 group-hover:shadow-[0_15px_35px_rgba(255,69,0,0.12)] transition-all duration-500 z-10 text-left"
              >
                {/* Compact Image Box aspect-[16/9] */}
                <div className="relative w-full aspect-[16/9] overflow-hidden bg-slate-950 border-b border-slate-100">
                  <div className="absolute inset-0 bg-gradient-to-tr from-orange-600 to-amber-500 blur-md opacity-0 group-hover:opacity-25 transition-opacity duration-500 z-0" />
                  <Image
                    src={pOptimizedSrc}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] z-10"
                  />
                  {/* Floating Category Tag */}
                  <div className="absolute top-3 left-3 z-20">
                    <span className="px-2.5 py-1 rounded-md bg-slate-950/90 backdrop-blur-md text-[7.5px] font-black uppercase tracking-widest text-white shadow-sm border border-white/10 flex items-center gap-1.5 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                      {category}
                    </span>
                  </div>
                </div>

                {/* Compact Content Section */}
                <div className="p-4 flex flex-col flex-1 justify-between bg-white">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-black uppercase tracking-[0.2em] text-orange-600 font-mono">
                        Project #{idx + 1}
                      </span>
                    </div>
                    <h3 className="text-base font-black tracking-tight text-slate-900 group-hover:text-orange-600 transition-colors uppercase leading-snug">
                      {project.title}
                    </h3>

                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {project.tags.slice(0, 3).map((tag: string, tIdx: number) => (
                          <span key={tIdx} className="text-[7.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-orange-50/60 text-orange-800 border border-orange-200/50 group-hover:bg-orange-100/70 transition-colors">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {project.description && (
                      <p className="text-xs leading-relaxed text-slate-500 font-medium line-clamp-2 pt-1 normal-case tracking-normal">
                        {project.description}
                      </p>
                    )}
                  </div>

                  {/* Compact Hover CTA Footer */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-[8.5px] font-black text-slate-950 uppercase tracking-widest group-hover:text-orange-600 transition-colors duration-200">
                      Explore Case Study
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-orange-500 group-hover:text-white flex items-center justify-center transition-all duration-300">
                      <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
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
    <section className="lg:hidden relative min-h-[660px] h-[100svh] flex flex-col justify-between pt-12 pb-0 overflow-hidden bg-white select-none">
      {/* Crisp minimal dot pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] animated-dot-grid opacity-40 pointer-events-none" />

      {/* Soft ambient center warmth */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] ambient-glow-oklch rounded-full blur-[80px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '8s' }} />

      {/* Unified flex container for balanced centering */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4">
        
        {/* Lottie Animation + Indicators */}
        <div className="relative flex flex-col items-center justify-center shrink-0">
          <div className="w-[88vw] h-[88vw] max-w-[380px] max-h-[380px] flex items-center justify-center">
            <LottiePlayer src={current.animationSrc!} className="w-full h-full object-contain scale-[1.15]" />
          </div>
          
          <div className="mt-2 flex flex-col items-center gap-1">
            <div className="flex items-center gap-1.5">
              {services.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`rounded-full transition-all duration-300 ${i === index ? "bg-orange-500 w-4 h-1.5" : "bg-slate-200 w-1.5 h-1.5"}`}
                />
              ))}
            </div>
            <span className="text-[9px] font-mono font-bold tracking-widest text-slate-400 uppercase">
              0{index + 1} — {current.title}
            </span>
          </div>
        </div>

        {/* Text content & buttons */}
        <div className="relative z-10 text-center flex flex-col items-center shrink-0 w-full">
          <h1 className="text-[clamp(1.9rem,8vw,2.5rem)] font-black text-slate-900 leading-[1.1] tracking-tight mb-2">
            WE BUILD CUSTOM <br />
            <span className="vibrant-gradient-text">SOFTWARE & AI.</span>
          </h1>

          <p className="text-xs text-slate-500 font-medium max-w-[280px] mx-auto leading-relaxed mb-4">
            High-performance web apps, custom AI systems, and workflow automations tailored for your business.
          </p>

          <div className="flex items-center justify-center gap-3 w-full max-w-xs">
            <Link
              href="/work"
              className="flex-1 rounded-xl py-3 text-xs font-bold btn-premium-orange shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Our Work <ArrowRight className="w-3.5 h-3.5 text-white" />
            </Link>
            <Link
              href="/contact"
              className="flex-1 rounded-xl py-3 text-xs font-bold btn-premium-secondary active:scale-95 transition-all text-center"
            >
              Hire Us
            </Link>
          </div>
        </div>

      </div>

      {/* FLUSH BOTTOM STRIP */}
      <div className="w-full shrink-0 pb-1 relative z-20">
        <TechMarqueeStrip />
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
    <section className="hidden lg:flex flex-col justify-between relative h-[100svh] min-h-[720px] max-h-[1080px] pt-32 pb-0 overflow-hidden bg-white select-none">
      {/* Crisp minimal grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] animated-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Subtle warm backdrop glow */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] ambient-glow-oklch rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '10s' }} />

      {/* Main Content Grid */}
      <div className="flex-1 flex items-center px-12 xl:px-20 w-full max-w-[1500px] mx-auto relative z-10 min-h-0">
        <div className="grid grid-cols-12 items-center gap-12 w-full">

          {/* Left Column: Minimal Clean Typography */}
          <div className="col-span-7 space-y-8 animate-fade-up">

            <h1 className="text-[clamp(3.2rem,4.6vw,5.2rem)] font-black leading-[1.08] tracking-tight text-slate-900">
              WE BUILD CUSTOM <br />
              SOFTWARE & <br />
              <span className="vibrant-gradient-text">AI SOLUTIONS.</span>
            </h1>

            <p className="text-base xl:text-lg font-normal text-slate-600 leading-relaxed max-w-lg">
              We design, architect, and launch enterprise-grade web applications, custom AI pipelines, and high-throughput automation systems.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <Link
                href="/work"
                className="rounded-xl px-8 py-4 text-xs font-bold uppercase tracking-widest btn-premium-orange transition-all shadow-md active:scale-95 flex items-center gap-2.5 group"
              >
                Explore Projects <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/contact" 
                className="rounded-xl px-8 py-4 text-xs font-bold uppercase tracking-widest btn-premium-secondary transition-all active:scale-95"
              >
                Schedule Consultation
              </Link>
            </div>
          </div>

          {/* Right Column: Floating Asset & Minimal Service Switcher */}
          <div className="col-span-5 flex flex-col items-center justify-center relative animate-fade-up" style={{ animationDelay: '0.15s' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={current.title}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex flex-col items-center w-full"
              >
                <div className="w-full max-w-[500px] aspect-square flex items-center justify-center relative">
                  <LottiePlayer src={current.animationSrc!} className="w-full h-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.06)]" />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Clean Minimalist Service Card Badge - positioned slightly higher, overlapping Lottie */}
            <div className="absolute bottom-6 flex items-center justify-between w-full max-w-[380px] p-2 rounded-2xl bg-slate-50/80 backdrop-blur-md border border-slate-200/60 z-20">
              <div className="flex items-center gap-3 pl-3">
                <span className="text-xs font-mono font-bold text-orange-600">0{index + 1}</span>
                <span className="h-3 w-[1px] bg-slate-300" />
                <span className="text-xs font-bold font-mono tracking-wider text-slate-800 uppercase">{current.title}</span>
              </div>
              <div className="flex items-center gap-1 pr-2">
                {services.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    className={`rounded-full transition-all duration-300 ${i === index ? 'bg-orange-500 w-4 h-1.5' : 'bg-slate-200 hover:bg-slate-300 w-1.5 h-1.5'}`}
                  />
                ))}
              </div>
            </div>
          </div>


        </div>
      </div>

      {/* FLUSH BOTTOM STRIP */}
      <div className="w-full shrink-0 relative z-20">
        <TechMarqueeStrip />
      </div>
    </section>
  );
}

// ─── STUNNING SCROLLING TECH STACK STRIP (Seamless Marquee) ─────────────────────
function TechMarqueeStrip() {
  const techStack = [
    { name: "React", slug: "react", color: "06b6d4" },
    { name: "Next.js", slug: "nextdotjs", color: "000000" },
    { name: "TypeScript", slug: "typescript", color: "3178c6" },
    { name: "Node.js", slug: "nodedotjs", color: "339933" },
    { name: "Python", slug: "python", color: "3776ab" },
    { name: "PostgreSQL", slug: "postgresql", color: "4169e1" },
    { name: "Flutter", slug: "flutter", color: "02569b" },
    { name: "Docker", slug: "docker", color: "2496ed" },
    { name: "Tailwind CSS", slug: "tailwindcss", color: "06b6d4" },
    { name: "GraphQL", slug: "graphql", color: "e10098" },
    { name: "AWS Cloud", slug: "amazonaws", color: "ff9900" },
    { name: "OpenAI AI", slug: "openai", color: "412991" },
  ];

  const repeated = [...techStack, ...techStack, ...techStack];

  return (
    <div className="w-full bg-white border-y border-slate-100 overflow-hidden relative z-30 py-2 shrink-0 shadow-sm">
      {/* Smooth vignette edge fades */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent pointer-events-none z-20" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent pointer-events-none z-20" />

      <div className="flex gap-6 whitespace-nowrap animate-marquee items-center px-4 relative z-10 w-max hover:[animation-play-state:paused]">
        {repeated.map((tech, i) => (
          <div
            key={`${tech.name}-${i}`}
            className="relative p-[1px] rounded-full bg-gradient-to-r from-orange-100/60 via-orange-50 to-amber-100/60 group hover:from-orange-400 hover:to-amber-400 transition-all duration-300 cursor-default shadow-sm hover:shadow-[0_6px_16px_-4px_rgba(249,115,22,0.3)] hover:-translate-y-0.5 select-none"
          >
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/95 group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-amber-500 backdrop-blur-sm transition-all duration-300">
              <img
                src={`https://cdn.simpleicons.org/${tech.slug}/${tech.color}`}
                alt={tech.name}
                className="w-3 h-3 transition-transform duration-300 group-hover:scale-110 group-hover:brightness-0 group-hover:invert"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
              <span className="text-[10px] font-bold font-mono text-slate-700 group-hover:text-white transition-colors duration-300">
                {tech.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
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

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 15,
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
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12 relative">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 sm:mb-28">
          <span className="text-orange-600 font-bold tracking-widest text-[9px] uppercase mb-2.5 block">Delivery Process</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-none uppercase tracking-tighter">
            Our Scoping Cycle<span className="text-orange-500">.</span>
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm font-semibold uppercase tracking-wider mt-3">
            How we engineer custom software & automation in 5 weeks.
          </p>
        </div>

        {/* Serpentine Timeline Engine */}
        <div className="relative min-h-[800px] xs:min-h-[900px] sm:min-h-[1000px] flex flex-col justify-between">
          
          {/* SVG Serpentine Connector Line (Desktop & Mobile) */}
          <div className="absolute inset-0 pointer-events-none z-0 block">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="timelineOrangeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>
              </defs>
              
              {/* Underlying faded serpentine track */}
              <path
                d="M 25,12.5 C 85,12.5 85,37.5 75,37.5 C 15,37.5 15,62.5 25,62.5 C 85,62.5 85,87.5 75,87.5"
                fill="none"
                stroke="#fed7aa"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.4"
              />
              
              {/* Active scroll-animated path overlay */}
              <motion.path
                d="M 25,12.5 C 85,12.5 85,37.5 75,37.5 C 15,37.5 15,62.5 25,62.5 C 85,62.5 85,87.5 75,87.5"
                fill="none"
                stroke="url(#timelineOrangeGrad)"
                strokeWidth="2.5"
                strokeDasharray="8 8"
                style={{ pathLength }}
              />
            </svg>
          </div>

          {/* Timeline Nodes Layout */}
          <div className="space-y-4 sm:space-y-0 relative z-10 flex flex-col justify-between h-full">
            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              const isEven = idx % 2 === 0;
              
              // Alternating layout on both desktop and mobile
              const rowStyle = isEven 
                ? "flex flex-row items-center w-full" 
                : "flex flex-row-reverse items-center w-full";

              return (
                <div key={idx} className={`${rowStyle} relative h-[180px] xs:h-[200px] sm:h-[220px] lg:h-[240px] flex`}>
                  
                  {/* Node Circle (Center of winding path: at 25% or 75% width) */}
                  <div className={`relative flex items-center justify-center w-1/2 ${isEven ? "justify-start pl-[15%] sm:pl-[20%]" : "justify-end pr-[15%] sm:pr-[20%]"} z-20`}>
                    <motion.div 
                      initial={{ scale: 0.7, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ type: "spring", stiffness: 80, damping: 12, delay: 0.1 }}
                      className="relative flex items-center justify-center shrink-0"
                    >
                      <div className="absolute w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-orange-500/10 blur-[6px] sm:blur-[8px] animate-pulse" />
                      {/* Big Floating Number Badge */}
                      <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white border border-orange-500 flex flex-col items-center justify-center shadow-[0_4px_12px_rgba(249,115,22,0.12)] sm:shadow-[0_6px_20px_rgba(249,115,22,0.18)] z-10">
                        <span className="text-[11px] sm:text-[14px] font-black font-mono text-orange-600 leading-none">0{idx + 1}</span>
                      </div>
                    </motion.div>
                  </div>

                  {/* Content Card layout */}
                  <div className="w-1/2 px-2 sm:px-8">
                    <div className="relative group w-full h-full">
                      {/* Backdrop Offset Layer */}
                      <div className="absolute inset-0 rounded-[1.2rem] sm:rounded-[2rem] border border-orange-500/25 bg-orange-500/[0.04] translate-x-2 translate-y-2 group-hover:translate-x-3.5 group-hover:translate-y-3.5 transition-transform duration-500 z-0" />

                      {/* Foreground Card */}
                      <motion.div
                        initial={{ opacity: 0, y: 50, rotateX: 10, scale: 0.96 }}
                        whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ type: "spring", stiffness: 60, damping: 15, delay: 0.05 }}
                        whileHover={{ y: -6, scale: 1.01 }}
                        style={{ transformOrigin: "bottom center" }}
                        className="relative rounded-[1.2rem] sm:rounded-[2rem] border border-slate-200/80 bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.02)] group-hover:border-orange-500/40 group-hover:shadow-[0_20px_45px_rgba(255,69,0,0.08)] transition-all duration-500 overflow-hidden flex flex-col h-full z-10"
                      >
                        {/* Mac App Window Header */}
                        <div className="h-7 bg-slate-50 border-b border-slate-200/40 px-3 flex items-center justify-between shrink-0 select-none">
                          <div className="flex gap-1.5 items-center">
                            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#ff5f56]" />
                            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#ffbd2e]" />
                            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#27c93f]" />
                          </div>
                          <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-widest text-slate-400 font-mono">
                            {step.day}
                          </span>
                        </div>

                        {/* Window Body */}
                        <div className="p-3 sm:p-5 lg:p-7 flex flex-col justify-between flex-1 text-left bg-white/50">
                          <div className="flex items-center justify-between gap-1.5 mb-2.5 sm:mb-4">
                            <span className="inline-flex px-2 py-0.5 sm:px-3 sm:py-1 rounded-md bg-orange-50 text-[7px] sm:text-[8px] font-black uppercase tracking-widest text-orange-600 border border-orange-100/40 font-mono">
                              Phase 0{idx + 1}
                            </span>
                            
                            <div className="flex items-center gap-1.5">
                              <div className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-gradient-to-r ${step.accent} animate-pulse`} />
                              <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-widest text-slate-400 font-mono">Milestone</span>
                            </div>
                          </div>

                          <h3 className="text-[11px] xs:text-xs sm:text-base lg:text-lg font-bold uppercase text-slate-900 tracking-tight mb-1 line-clamp-1 sm:line-clamp-none">
                            {step.title}
                          </h3>
                          
                          <p className="text-[9px] sm:text-xs leading-normal sm:leading-relaxed text-slate-400 font-medium mb-3 sm:mb-5 line-clamp-2 sm:line-clamp-none">
                            {step.desc}
                          </p>

                          <div className="pt-2 sm:pt-3.5 border-t border-slate-100 flex items-center justify-between mt-auto">
                            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-slate-900 font-mono">{step.milestone}</span>
                            <motion.div
                              animate={{ y: [0, -3, 0] }}
                              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: idx * 0.4 }}
                            >
                              <StepIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500" />
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
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
    { 
      name: "Slack", 
      c1: "#a855f7", 
      c2: "#6366f1",
      desc: "Real-time pipeline notifications.",
      svg: <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523 2.528 2.528 0 0 1-2.522-2.523 2.528 2.528 0 0 1 2.522-2.52h2.52v2.52zm1.261 0a2.528 2.528 0 0 1 2.52-2.52h5.043a2.528 2.528 0 0 1 2.522 2.52v5.042a2.528 2.528 0 0 1-2.522 2.52H8.823a2.528 2.528 0 0 1-2.52-2.52v-5.042zM8.823 5.043a2.528 2.528 0 0 1-2.52-2.522A2.528 2.528 0 0 1 8.823 0a2.528 2.528 0 0 1 2.52 2.521v2.522h-2.52zm0 1.261a2.528 2.528 0 0 1 2.52 2.52v5.043a2.528 2.528 0 0 1-2.52 2.522H3.78a2.528 2.528 0 0 1-2.52-2.522V8.824a2.528 2.528 0 0 1 2.52-2.52h5.043zm10.135 3.781a2.528 2.528 0 0 1 2.521-2.52 2.528 2.528 0 0 1 2.522 2.52 2.528 2.528 0 0 1-2.522 2.52h-2.521v-2.52zm-1.262 0a2.528 2.528 0 0 1-2.52 2.52h-5.043a2.528 2.528 0 0 1-2.522-2.52V5.043a2.528 2.528 0 0 1 2.522-2.52h5.043a2.528 2.528 0 0 1 2.52 2.52v5.042zm-3.78 10.135a2.528 2.528 0 0 1 2.52 2.522a2.528 2.528 0 0 1-2.52 2.521a2.528 2.528 0 0 1-2.522-2.521v-2.522h2.522zm0-1.262a2.528 2.528 0 0 1-2.52-2.52v-5.043a2.528 2.528 0 0 1 2.52-2.522h5.043a2.528 2.528 0 0 1 2.52 2.522v5.043a2.528 2.528 0 0 1-2.52 2.52h-5.043z"/>
    },
    { 
      name: "Stripe", 
      c1: "#3b82f6", 
      c2: "#06b6d4",
      desc: "Subscriptions & global gateways.",
      svg: <path d="M20.093 11.297c0-3.696-2.532-5.328-5.832-5.328-3.672 0-6.192 1.956-6.192 5.376 0 3.732 2.928 4.908 6.444 5.928 1.956.576 2.568.96 2.568 1.776 0 .768-.696 1.176-1.74 1.176-1.524 0-2.916-.624-4.224-1.392l-1.02 2.82c1.476.84 3.396 1.344 5.232 1.344 3.768 0 6.276-1.896 6.276-5.388 0-3.792-2.916-4.884-6.456-5.892-1.908-.552-2.484-.912-2.484-1.692 0-.696.648-1.092 1.632-1.092 1.32 0 2.592.516 3.756 1.224l1.04-2.76z"/>
    },
    { 
      name: "HubSpot", 
      c1: "#f97316", 
      c2: "#f43f5e",
      desc: "CRM sync & lead workflows.",
      svg: <path d="M19.38 12.62a3.46 3.46 0 0 0-2.5-3.38V6.81a3.44 3.44 0 0 0 1.5-2.88 3.44 3.44 0 1 0-4.94 3.12l-2.07 2.07A3.46 3.46 0 0 0 8.88 9.5a3.45 3.45 0 0 0-2.5 5.75L3 18.63a1 1 0 1 0 1.42 1.42l3.38-3.38A3.45 3.45 0 0 0 14.5 15.5a3.46 3.46 0 0 0-3.38-2.5l2.07-2.07A3.44 3.44 0 0 0 15 11.06v2.44a3.46 3.46 0 1 0 4.38-.88zM15 3.93a1.44 1.44 0 1 1 1.44 1.44A1.44 1.44 0 0 1 15 3.93zm-6.12 13a1.44 1.44 0 1 1 1.44-1.44 1.44 1.44 0 0 1-1.44 1.44zm8.62-2.12a1.44 1.44 0 1 1-1.44-1.44 1.44 1.44 0 0 1 1.44 1.44z"/>
    },
    { 
      name: "OpenAI", 
      c1: "#10b981", 
      c2: "#059669",
      desc: "AI core agents & prompt models.",
      svg: <path d="M22.532 10.976a5.553 5.553 0 0 0-1.43-3.921 5.597 5.597 0 0 0-3.415-1.748 5.57 5.57 0 0 0-4.887-2.735 5.557 5.557 0 0 0-4.81 2.822 5.572 5.572 0 0 0-3.666 1.157A5.553 5.553 0 0 0 2.22 10.286a5.59 5.59 0 0 0 .543 4.148 5.558 5.558 0 0 0 2.824 2.502 5.57 5.57 0 0 0 4.884 2.738 5.568 5.568 0 0 0 4.815-2.82 5.58 5.58 0 0 0 3.667-1.158 5.555 5.555 0 0 0 2.106-3.731 5.557 5.557 0 0 0 .543-4.148 5.545 5.545 0 0 0-1.07-2.841zM12.8 4.225a3.917 3.917 0 0 1 3.2 1.637l-1.012.585a2.766 2.766 0 0 0-3.473-1.011l-1.493-.862.008-.004c.896-.232 1.83-.35 2.77-.345zm-6.242 3.6a3.917 3.917 0 0 1 1.6-3.2l1.012.584a2.766 2.766 0 0 0-1.011 3.473L6.666 9.544l-.004-.008a3.86 3.86 0 0 1-.104-1.711zm1.6 6.242L11.83 12l.004-.007a2.764 2.764 0 0 0 .538-3.585L9.645 6.77l-1.494.862a3.917 3.917 0 0 1 0 6.4zm8.625 2.378a3.918 3.918 0 0 1-3.2-1.637l1.012-.585a2.766 2.766 0 0 0 3.473 1.011l1.493.862-.008.004c-.896.232-1.83.35-2.77.345zm4.817-4.815a3.918 3.918 0 0 1-1.6 3.2l-1.012-.584a2.766 2.766 0 0 0 1.011-3.473l1.493-1.06.004.008a3.863 3.863 0 0 1 .104 1.709zM12 10.3a1.7 1.7 0 1 1-1.7 1.7 1.7 1.7 0 0 1 1.7-1.7zm1.782-2.148l2.727 1.575-1.494.862a2.764 2.764 0 0 0-3.585-.538l.004-.007L13.782 8.152zm-5.007 7.078a3.918 3.918 0 0 1 0-6.4l1.494.862a2.764 2.764 0 0 0 0 3.585z"/>
    },
    { 
      name: "AWS", 
      c1: "#f59e0b", 
      c2: "#ea580c",
      desc: "Serverless Lambda & storage.",
      svg: (
        <g>
          <path d="M13.568 12.352c0 2.272-1.376 3.472-3.648 3.472-1.2 0-2.144-.4-2.8-.976l.736-1.12c.56.496 1.312.8 2.064.8 1.456 0 2.224-.768 2.224-2.128v-.56c-.656.768-1.584 1.168-2.656 1.168-2.096 0-3.568-1.536-3.568-3.952 0-2.528 1.552-4.048 3.696-4.048 1.056 0 1.952.4 2.528 1.136V5.376h1.424zm-1.424-3.488c0-1.472-.88-2.32-2.128-2.32-1.296 0-2.176.88-2.176 2.384 0 1.456.848 2.336 2.144 2.336 1.296 0 2.16-.896 2.16-2.4zm8.384 6.848c-.96 0-1.84-.288-2.48-.816l.656-1.072c.544.432 1.2.656 1.856.656.96 0 1.456-.4 1.456-.992 0-.608-.432-.832-1.344-1.088-1.344-.384-2.32-.896-2.32-2.256 0-1.328 1.056-2.192 2.656-2.192.912 0 1.696.24 2.224.64l-.608 1.088c-.464-.32-1.04-.496-1.616-.496-.864 0-1.28.384-1.28.848 0 .544.416.736 1.328.992 1.392.384 2.352.928 2.352 2.336 0 1.44-1.12 2.352-2.88 2.352zm-12.72-9.456l1.232 4.672 1.296-4.672h1.568l1.312 4.672 1.216-4.672h1.616l-2.08 7.024h-1.504L11.536 7.44l-1.184 4.544H8.848l-2.048-7.024z"/>
          <path d="M4.32 17.52c3.552 2.064 8.016 3.2 12.56 3.2 2.912 0 5.76-.464 8.352-1.376l.496.976c-2.736.976-5.744 1.472-8.848 1.472-4.816 0-9.52-1.2-13.264-3.376zm21.36-.64c-.096.384-.288 1.136-.448 1.52-.08.208-.224.224-.336.048-.48-.688-1.072-1.376-1.584-1.952-.16-.176-.112-.32.144-.304.832.064 2.048-.064 2.656-.128.24-.032.272.16.032.32-.24.16-.416.32-.464.496z"/>
        </g>
      )
    },
    { 
      name: "WhatsApp", 
      c1: "#22c55e", 
      c2: "#10b981",
      desc: "Direct customer communication.",
      svg: <path d="M12.004 0C5.378 0 0 5.374 0 11.996c0 2.112.551 4.17 1.597 5.977L.055 24l6.19-1.622c1.728.944 3.676 1.442 5.759 1.442C18.625 23.82 24 18.446 24 11.82 24 5.374 18.625 0 12.004 0zm0 1.831c5.612 0 10.17 4.56 10.17 10.172 0 5.612-4.558 10.17-10.17 10.17-1.925 0-3.805-.544-5.437-1.572l-.39-.247-3.666.96.977-3.568-.27-.432A10.117 10.117 0 0 1 1.833 12c0-5.612 4.56-10.169 10.171-10.169zm-1.88 4.385c-.244-.543-.5-.552-.733-.561-.19-.009-.41-.009-.628-.009-.22 0-.575.082-.876.411-.3.329-1.15 1.123-1.15 2.74 0 1.616 1.176 3.179 1.34 3.4 0 .22 2.26 3.593 5.539 4.887.776.307 1.383.491 1.854.64.78.247 1.492.21 2.054.128.627-.092 1.926-.786 2.196-1.543.27-.757.27-1.407.19-1.543-.08-.137-.3-.22-.63-.384-.329-.165-1.927-.95-2.226-1.06-.299-.11-.518-.165-.734.164-.216.329-.838 1.06-1.026 1.28-.188.22-.376.247-.706.082-.33-.164-1.393-.512-2.655-1.64-1.022-.912-1.71-2.04-1.91-2.37-.2-.328-.02-.507.144-.67.148-.147.33-.385.495-.576.165-.192.22-.329.33-.548.11-.22.055-.411-.027-.575-.083-.165-.733-1.782-1.01-2.428z"/>
    },
    { 
      name: "GitHub", 
      c1: "#475569", 
      c2: "#0f172a",
      desc: "Version control & webhook updates.",
      svg: <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    },
    { 
      name: "Discord", 
      c1: "#6366f1", 
      c2: "#4f46e5",
      desc: "Automated alert pipelines.",
      svg: <path d="M20.317 4.37a18.002 18.002 0 0 0-4.485-1.388c-.08-.008-.16.03-.193.103a12.85 12.85 0 0 0-.57 1.173 16.59 16.59 0 0 0-4.854 0 12.283 12.283 0 0 0-.573-1.173.18.18 0 0 0-.192-.103 17.957 17.957 0 0 0-4.487 1.388.18.18 0 0 0-.072.07C1.113 10.149.32 15.78 1.144 21.326a.185.185 0 0 0 .071.127 18.198 18.198 0 0 0 5.483 2.756.186.186 0 0 0 .2-.065c.422-.572.79-1.183 1.103-1.815a.18.18 0 0 0-.098-.25 11.96 11.96 0 0 1-1.722-.816.188.188 0 0 1-.019-.312c.115-.085.23-.173.34-.263a.184.184 0 0 1 .192-.025 11.892 11.892 0 0 0 10.66 0 .185.185 0 0 1 .195.025c.11.09.224.178.34.263a.188.188 0 0 1-.018.312 11.933 11.933 0 0 1-1.725.816.18.18 0 0 0-.1.25c.316.632.684 1.243 1.103 1.815a.188.188 0 0 0 .201.065 18.187 18.187 0 0 0 5.485-2.756.186.186 0 0 0 .071-.127c1.077-6.223-.787-11.802-3.79-16.892a.185.185 0 0 0-.07-.07zM8.02 15.33c-1.072 0-1.954-.975-1.954-2.176s.867-2.176 1.954-2.176c1.09 0 1.968.986 1.955 2.176 0 1.2-.865 2.176-1.954 2.176zm7.98 0c-1.071 0-1.953-.975-1.953-2.176s.867-2.176 1.953-2.176c1.09 0 1.968.986 1.955 2.176 0 1.2-.865 2.176-1.955 2.176z"/>
    }
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#fcfaf8] overflow-hidden relative border-b border-orange-50/50">
      <div className="mx-auto max-w-[1300px] px-5 sm:px-8 lg:px-12 text-center relative">
        
        {/* Cyber Holographic Radial Glows */}
        <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-orange-500/[0.04] blur-[90px] rounded-full pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] bg-amber-500/[0.03] blur-[100px] rounded-full pointer-events-none" />

        {/* Header */}
        <div className="max-w-2xl mx-auto mb-20 relative z-10">
          <span className="text-orange-600 font-bold tracking-widest text-[9px] uppercase mb-2.5 block">Automatic Connections</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-none uppercase tracking-tighter">
            Connected Services<span className="text-orange-500">.</span>
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm font-semibold uppercase tracking-wider mt-3">
            We connect your platform with the industry-standard tools you use every day.
          </p>
        </div>

        {/* Cyber Orbit Deck */}
        <div className="relative left-1/2 -translate-x-1/2 w-[900px] h-[540px] flex items-center justify-center origin-center scale-[0.52] xs:scale-[0.62] sm:scale-[0.78] md:scale-[0.88] lg:scale-100 my-[-130px] xs:my-[-105px] sm:my-[-65px] md:my-[-30px] lg:my-0 transition-transform duration-500">
          
          {/* Cybernetic Rings */}
          <div className="absolute w-[440px] h-[440px] rounded-full border border-slate-200/40 border-dashed animate-[spin_80s_linear_infinite] pointer-events-none" />
          <div className="absolute w-[300px] h-[300px] rounded-full border border-orange-500/10 border-dashed animate-[spin_55s_linear_infinite_reverse] pointer-events-none" />
          <div className="absolute w-[180px] h-[180px] rounded-full border border-slate-200/60 pointer-events-none" />

          {/* Animated Connecting Lines Web SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              {integrations.map((item, idx) => (
                <linearGradient key={`line-grad-${idx}`} id={`grad-${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor={item.c1} />
                </linearGradient>
              ))}
            </defs>
            {integrations.map((item, idx) => {
              const angle = (idx * 45 * Math.PI) / 180;
              const radius = 220;
              const xTarget = 450 + radius * Math.cos(angle);
              const yTarget = 270 + radius * Math.sin(angle);
              
              return (
                <g key={`web-line-${idx}`}>
                  {/* Base faded dashed connecting line */}
                  <line 
                    x1="450" 
                    y1="270" 
                    x2={xTarget} 
                    y2={yTarget} 
                    stroke="#e2e8f0" 
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  {/* Glowing Laser line */}
                  <motion.line 
                    x1="450" 
                    y1="270" 
                    x2={xTarget} 
                    y2={yTarget} 
                    stroke={`url(#grad-${idx})`} 
                    strokeWidth="2.5"
                    initial={{ strokeDasharray: "10 25", strokeDashoffset: 100 }}
                    animate={{ strokeDashoffset: [100, 0] }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 4, 
                      ease: "linear",
                      delay: idx * 0.25 
                    }}
                  />
                </g>
              );
            })}
          </svg>

          {/* Central Jantra core node */}
          <div className="absolute left-[450px] top-[270px] -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center">
            <motion.div 
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="relative w-28 h-28 rounded-full bg-slate-950 flex items-center justify-center shadow-[0_0_60px_rgba(249,115,22,0.35)] border border-orange-500/50"
            >
              <div className="absolute inset-1 rounded-full border border-dashed border-orange-500/30 animate-[spin_25s_linear_infinite]" />
              <div className="absolute inset-3 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 blur-sm opacity-20" />
              <div className="text-center z-10 flex flex-col items-center justify-center">
                <Logo className="w-10 h-10 mb-0.5" />
                <span className="text-[9px] font-black text-orange-500 tracking-[0.25em] uppercase block">JANTRA</span>
              </div>
            </motion.div>
          </div>

          {/* Symmetrical Orbiting Integration Nodes */}
          {integrations.map((item, idx) => {
            const angle = (idx * 45 * Math.PI) / 180;
            const radius = 220;
            const xVal = 450 + radius * Math.cos(angle);
            const yVal = 270 + radius * Math.sin(angle);

            const handleNodeMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
              e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
            };

            return (
              <motion.div
                key={`node-${item.name}`}
                style={{ 
                  left: `${xVal}px`, 
                  top: `${yVal}px`,
                  "--spotlight-color": `${item.c1}25`
                } as React.CSSProperties}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100, delay: idx * 0.05 }}
                whileHover={{ scale: 1.12, zIndex: 30 }}
                onMouseMove={handleNodeMouseMove}
                className="absolute -translate-x-1/2 -translate-y-1/2 group z-10 cursor-pointer flex flex-col items-center"
              >
                {/* Brand Card - Miniature Mac App Window */}
                <div 
                  className="w-[90px] h-[95px] rounded-2xl bg-white/75 backdrop-blur-lg border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.03)] flex flex-col items-stretch overflow-hidden transition-all duration-300 group-hover:border-orange-500/40 group-hover:shadow-[0_15px_35px_rgba(0,0,0,0.08)] before:absolute before:inset-0 before:bg-[radial-gradient(130px_circle_at_var(--mouse-x,0px)_var(--mouse-y,0px),var(--spotlight-color),transparent)] before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-300 before:pointer-events-none before:z-0 relative"
                >
                  {/* Miniature Window Title Bar */}
                  <div className="h-6 bg-slate-100/40 border-b border-slate-200/35 px-2 flex items-center gap-1.5 select-none shrink-0 z-10">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff5f56]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ffbd2e]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#27c93f]" />
                  </div>

                  {/* Window Body containing Logo */}
                  <div className="flex-1 flex items-center justify-center relative p-2 z-10">
                    {/* Soft ambient background glow in card */}
                    <div 
                      className="absolute w-12 h-12 rounded-full opacity-10 blur-xl pointer-events-none transition-opacity duration-300 group-hover:opacity-30"
                      style={{ backgroundColor: item.c1 }}
                    />
                    
                    {/* Logo SVG with Gradient */}
                    <svg 
                      viewBox="0 0 24 24" 
                      className="w-8 h-8 transition-transform duration-300 z-10 group-hover:scale-105"
                    >
                      <defs>
                        <linearGradient id={`node-grad-${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor={item.c1} />
                          <stop offset="100%" stopColor={item.c2} />
                        </linearGradient>
                      </defs>
                      <g fill={`url(#node-grad-${idx})`}>
                        {item.svg}
                      </g>
                    </svg>
                  </div>
                </div>

                {/* Floating Tooltip/label on hover */}
                <div className="absolute top-26 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 w-44 bg-slate-900 border border-slate-800 text-white rounded-xl p-3 shadow-xl z-30">
                  <h4 className="text-[10px] font-black uppercase tracking-wider mb-0.5 text-orange-500">{item.name}</h4>
                  <p className="text-[8.5px] text-slate-400 leading-normal font-medium normal-case">{item.desc}</p>
                </div>
              </motion.div>
            );
          })}
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
    <div className="border border-white/50 rounded-2xl bg-white/70 backdrop-blur-md overflow-hidden transition-all duration-300 hover:bg-white/85 shadow-sm hover:shadow-[0_8px_24px_rgba(249,115,22,0.02)]">
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
      <FocusSection id="hero" disableScrollEffects={true}>
        <MobileLottieHero />
        <DesktopHero />
      </FocusSection>

      {/* ── STATS ─────────────────────────────────────────── */}
      <FocusSection id="stats">
        <section className="py-8 sm:py-16 px-5 sm:px-8 bg-white overflow-hidden">
          <div className="mx-auto max-w-[1400px] grid grid-cols-2 lg:grid-cols-4 gap-6">
            {homeStats.map((stat, idx) => {
              // Alternate direction: even index slides from left (right), odd index slides from right (left)
              const revealDirection = idx % 2 === 0 ? "right" : "left";
              return (
                <ScrollReveal key={stat.label} delay={idx * 0.08} direction={revealDirection}>
                  <div className="relative group w-full">
                    {/* Backdrop Layer: Offset orange outline and tint */}
                    <div className="absolute inset-0 rounded-2xl border border-orange-500/30 bg-orange-500/[0.04] translate-x-2 translate-y-2 group-hover:translate-x-3.5 group-hover:translate-y-3.5 transition-transform duration-500" />
                    
                    {/* Foreground Layer: Main Content Card */}
                    <div className="relative py-8 px-5 rounded-2xl bg-white border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.02)] group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-500 z-10 flex flex-col items-center text-center">
                      <div className="text-4xl sm:text-5xl font-black tracking-tight vibrant-gradient-text mb-2.5 group-hover:scale-105 transition-transform duration-500">
                        {stat.value}
                      </div>
                      <div className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-600 transition-colors duration-500 leading-tight">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}

          </div>
        </section>
      </FocusSection>



      {/* ── SELECTED WORK — Premium Bento Grid / Grid Showcase ───────────────── */}
      <FocusSection id="portfolio">
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
                  className="inline-flex items-center gap-2 text-[8.5px] font-black uppercase tracking-[0.4em] text-slate-400 hover:text-orange-600 transition-colors duration-300 group shrink-0"
                >
                  View All
                  <div className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-orange-100 flex items-center justify-center transition-colors duration-300 border border-slate-200/30">
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform duration-300" />
                  </div>
                </Link>
              </div>

              <PortfolioShowcase projects={filteredProjects} />
            </div>
          </ScrollReveal>
        </section>
      </FocusSection>

      {/* ── SCOPING TIMELINE ── */}
      <FocusSection id="timeline">
        <ScopingTimeline />
      </FocusSection>

      {/* ── INTEGRATION MATRIX ── */}
      <FocusSection id="integrations">
        <IntegrationMatrix />
      </FocusSection>

      {/* ── TESTIMONIALS CAROUSEL ─────────────────────────── */}
      <FocusSection id="testimonials">
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
      </FocusSection>

      {/* ── SCOPING FAQs ── */}
      <FocusSection id="faq">
        <FAQSection />
      </FocusSection>

      {/* ── CTA — Compact & Stunning Banner ────────────────────── */}
      <FocusSection id="cta">
        <section className="py-12 sm:py-16 px-5 sm:px-8 bg-[#fcfaf8]">
          <ScrollReveal>
            <div className="mx-auto max-w-4xl relative group">
              {/* Backdrop Offset Layer: Light orange backdrop */}
              <div className="absolute inset-0 rounded-2xl border border-orange-500/25 bg-orange-500/[0.04] translate-x-2.5 translate-y-2.5 group-hover:translate-x-3.5 group-hover:translate-y-3.5 transition-transform duration-500 z-0" />

              {/* Foreground Main Card: Premium White Glassmorphic Card */}
              <div className="relative rounded-2xl bg-white border border-slate-200 shadow-[0_12px_40px_rgba(0,0,0,0.02)] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 overflow-hidden z-10 transition-all duration-500 hover:border-orange-500/40 hover:shadow-[0_20px_50px_rgba(255,69,0,0.08)]">
                {/* Soft light orange ambient glow inside */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/[0.02] via-transparent to-orange-500/[0.02] pointer-events-none" />
                <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-orange-500/[0.03] blur-3xl rounded-full pointer-events-none" />

                {/* Left Side Info */}
                <div className="flex items-center gap-4 relative z-10 text-left">
                  <div className="relative shrink-0 w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping absolute" />
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[7.5px] font-black uppercase tracking-widest text-slate-400 font-mono">Jantra Studio</p>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">
                      Let&apos;s build<span className="text-orange-500">.</span>
                    </h2>
                    <p className="text-[9.5px] text-slate-500 font-medium normal-case tracking-normal">
                      Engineering high-performance SaaS & AI automations.
                    </p>
                  </div>
                </div>

                {/* Action button */}
                <div className="relative z-10 shrink-0">
                  <Link
                    href="/contact"
                    className="inline-flex rounded-xl px-6 py-3.5 text-[8.5px] font-black uppercase tracking-widest bg-slate-950 hover:bg-orange-600 text-white hover:text-white shadow-md hover:shadow-[0_10px_25px_rgba(249,115,22,0.2)] active:scale-95 transition-all duration-300 items-center gap-1.5"
                  >
                    Start Project <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </FocusSection>

    </main>
  );
}
