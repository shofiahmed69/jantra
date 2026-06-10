"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, Award, Code, Sparkles, Zap, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  homeStats,
  homeTestimonials,
  homeServicePreview,
  homeTechStack,
} from "@/content/site";
import api from "@/lib/api";

const BLUR_DATA = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmMWY1ZjkiLz48L3N2Zz4=";
const DEFAULT_PROJECT_IMG = "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80&w=1200";

function resolveImg(thumbnail?: string): string {
  if (!thumbnail) return DEFAULT_PROJECT_IMG;
  if (thumbnail.startsWith("http")) return thumbnail;
  const base = (process.env.NEXT_PUBLIC_API_URL || "https://jontro-backend.onrender.com/api").replace(/\/api\/?$/, "");
  return `${base.replace(/\/$/, "")}/${thumbnail.replace(/^\//, "")}`;
}

// ─── PORTFOLIO CARD ───
function PortfolioCard({
  project, index,
}: {
  project: any; index: number;
}) {
  const [failed, setFailed] = useState(false);
  const src = failed ? DEFAULT_PROJECT_IMG : resolveImg(project.thumbnail);
  const category = Array.isArray(project.category)
    ? project.category[0]
    : (project.category || "Case Study");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-[2rem] bg-white/40 backdrop-blur-md border border-white/50 hover:border-orange-500/30 transition-all duration-500 hover:-translate-y-2 shadow-lg shadow-slate-100/10 hover:shadow-xl hover:shadow-orange-500/5"
    >
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100">
        <Image
          src={src}
          alt={project.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          placeholder="blur"
          blurDataURL={BLUR_DATA}
          onError={() => setFailed(true)}
        />
        
        {/* Category Pill */}
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-orange-600 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            {category}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col justify-between flex-1">
        <div>
          {/* Tech stack tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(project.tags || []).slice(0, 3).map((t: string) => (
              <span
                key={t}
                className="text-[9px] font-bold text-slate-500 uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/80 border border-slate-100"
              >
                {t}
              </span>
            ))}
          </div>

          <h3 className="font-heading font-bold text-slate-900 text-lg group-hover:text-orange-600 transition-colors duration-300">
            {project.title}
          </h3>
          <p className="text-slate-600 text-xs mt-2 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-white/40 flex items-center">
          <Link
            href={`/work/${project.slug || ""}`}
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-orange-600 hover:text-orange-700 transition-colors"
          >
            Case Study <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ─── PORTFOLIO GRID ───
function PortfolioGrid({ projects }: { projects: any[] }) {
  if (!projects || projects.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 rounded-3xl border border-dashed border-slate-200 bg-slate-50/50">
        <p className="text-xs text-slate-400 font-extrabold tracking-widest uppercase">Curating case studies...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
      {projects.slice(0, 5).map((p: any, i: number) => (
        <PortfolioCard key={p._id || i} project={p} index={i} />
      ))}
      
      {/* Symmetrical CTA Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="group relative flex flex-col justify-between rounded-[2rem] bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-md border border-white/50 hover:border-orange-500/30 p-8 hover:-translate-y-2 transition-all duration-500 shadow-lg"
      >
        <div className="relative w-full aspect-[16/10] flex items-center justify-center bg-gradient-to-br from-orange-500/5 to-transparent rounded-2xl overflow-hidden border border-white/20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.08),transparent_70%)]" />
          <div className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-orange-600 to-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-orange-500/30">
            <ArrowRight className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="mt-6 flex flex-col justify-between flex-1">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-orange-600 mb-1">Full Archive</p>
            <h3 className="font-heading font-bold text-slate-900 text-lg">View All Work</h3>
            <p className="text-slate-600 text-xs mt-2 leading-relaxed">
              Explore our complete collection of custom software builds, AI systems, and cloud architectures.
            </p>
          </div>
          
          <div className="mt-6 pt-4 border-t border-white/40 flex items-center">
            <Link
              href="/work"
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-orange-600 hover:text-orange-700 transition-colors"
            >
              Explore Archive <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── TESTIMONIAL CAROUSEL ───
function TestimonialCarousel({ testimonials }: { testimonials: any[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex(p => (p + 1) % testimonials.length), 7000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const t = testimonials[index];

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="glass-panel rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-12"
        >
          {/* Identity Side */}
          <div className="w-full md:w-[30%] flex flex-col items-center text-center shrink-0">
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-md mb-4 bg-slate-100">
              <Image
                src={t.avatarUrl}
                alt={t.author}
                fill
                className="object-cover"
              />
            </div>
            <h5 className="text-base font-bold text-slate-900 leading-tight">{t.author}</h5>
            <p className="text-[9px] font-bold text-orange-600 uppercase tracking-widest mt-1">{t.role}</p>
            <p className="text-xs text-slate-500 mt-1">{t.company}</p>
          </div>

          {/* Quote Side */}
          <div className="flex-1 text-center md:text-left">
            <span className="text-5xl font-serif text-orange-500/20 leading-none select-none">“</span>
            <blockquote className="text-base sm:text-lg text-slate-800 leading-relaxed font-medium mt-[-10px] mb-6">
              {t.quote}
            </blockquote>
            <div className="flex justify-center md:justify-start gap-1">
              {[...Array(t.rating)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation dots */}
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === i ? 'w-6 bg-orange-500' : 'bg-slate-300'}`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── MAIN HOME PAGE ───
export default function HomePage({ initialProjects = [] }: { initialProjects?: any[] }) {
  const [featuredProjects, setFeaturedProjects] = useState<any[]>(initialProjects);

  useEffect(() => {
    if (initialProjects.length > 0) return;

    const fetchProjects = async () => {
      try {
        const response = await api.get("/work");
        const data = response.data?.data || response.data || [];

        const published = Array.isArray(data) ? data
          .filter((p: any) => p.published)
          .sort((a: any, b: any) => {
            if (a.featured !== b.featured) return a.featured ? -1 : 1;
            return (a.order || 0) - (b.order || 0);
          }) : [];

        const formatted = published.map((apiProject: any) => ({
          ...apiProject,
          tags: apiProject.techStack || [],
          description: apiProject.description || apiProject.challenge || "Production software delivery.",
        }));

        setFeaturedProjects(formatted);
      } catch (e) {
        console.error(e);
      }
    };
    fetchProjects();
  }, [initialProjects]);

  return (
    <main className="min-h-screen bg-transparent relative overflow-x-hidden pt-24 pb-16">
      
      {/* ── HERO SECTION (Stitch Inspired Glassmorphic Design) ── */}
      <section className="relative w-full max-w-7xl mx-auto px-6 py-12 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Block: Glassmorphic Information Interface */}
          <div className="lg:col-span-6 z-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="glass-panel rounded-[2.5rem] p-8 md:p-12"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-600 text-[10px] font-bold tracking-widest uppercase mb-6">
                Future of Work
              </span>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-slate-900 leading-[1.1] tracking-tight uppercase">
                Enterprise Software, <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">Reimagined.</span>
              </h1>
              
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mt-6 max-w-md">
                Experience the next generation of spatial computing and AI agent automation for business. Built with modular, intuitive architecture designed for the visionaries of tomorrow.
              </p>
              
              <div className="flex flex-wrap items-center gap-4 pt-8">
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-full shadow-[0_10px_20px_-5px_rgba(249,115,22,0.3)] hover:shadow-[0_15px_25px_-5px_rgba(249,115,22,0.4)] transition-all active:scale-95 text-xs tracking-wider uppercase"
                >
                  Get Started
                </Link>
                <Link
                  href="/work"
                  className="px-8 py-4 bg-white/60 hover:bg-white/80 text-slate-800 font-bold rounded-full transition-all border border-white/50 text-xs tracking-wider uppercase shadow-sm"
                >
                  View Work
                </Link>
              </div>

              {/* Joined Companies */}
              <div className="mt-8 pt-8 border-t border-white/20 flex items-center gap-4">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-orange-100 flex items-center justify-center text-[9px] font-bold text-orange-600">AI</div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-600">API</div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-[9px] font-bold text-blue-600">SaaS</div>
                </div>
                <p className="text-xs text-slate-500 font-medium">Joined by 2,000+ companies globally</p>
              </div>
            </motion.div>
          </div>

          {/* Right Block: Simulated 3D Isometric Visual (Pure CSS/SVG/Animations) */}
          <div className="lg:col-span-6 flex items-center justify-center relative z-10 h-[300px] sm:h-[400px] lg:h-[500px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full h-full flex items-center justify-center animate-float-slow"
            >
              {/* Glowing Background Ring */}
              <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-orange-400/20 to-orange-500/10 blur-3xl animate-pulse-soft" />
              
              {/* Outer 3D Rotated Glass Box */}
              <div className="relative w-64 h-64 bg-white/20 backdrop-blur-lg border border-white/50 shadow-2xl rounded-[3rem] rotate-[45deg] flex items-center justify-center transition-all duration-700 hover:rotate-[50deg]">
                {/* Inner Spinning Gradient Sphere */}
                <div className="w-32 h-32 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 rounded-2xl shadow-inner animate-spin-slow flex items-center justify-center">
                  <Layers className="w-12 h-12 text-white/80 rotate-[-45deg]" />
                </div>
              </div>

              {/* Floating Orbit Nodes */}
              {/* Node 1: Code */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[15%] left-[20%] w-14 h-14 bg-white/40 backdrop-blur-xl rounded-full border border-white/60 shadow-lg flex items-center justify-center z-30 cursor-pointer hover:bg-white/60"
              >
                <Code className="w-5 h-5 text-orange-600" />
              </motion.div>
              
              {/* Node 2: Sparkles */}
              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-[20%] right-[15%] w-16 h-16 bg-white/40 backdrop-blur-xl rounded-full border border-white/60 shadow-lg flex items-center justify-center z-30 cursor-pointer hover:bg-white/60"
              >
                <Sparkles className="w-6 h-6 text-orange-500" />
              </motion.div>

              {/* Node 3: Launch */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-[45%] right-[5%] w-12 h-12 bg-white/50 backdrop-blur-xl rounded-full border border-white/60 shadow-lg flex items-center justify-center z-30 cursor-pointer hover:bg-white/60"
              >
                <Zap className="w-5 h-5 text-orange-600" />
              </motion.div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* ── STATS SECTION ── */}
      <section className="py-12 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {homeStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="relative group cursor-default"
              >
                <div className="absolute inset-0 rounded-[2rem] bg-orange-500/5 translate-x-2 translate-y-2 group-hover:translate-x-3.5 group-hover:translate-y-3.5 transition-transform duration-500" />
                <div className="relative py-8 px-6 rounded-[2rem] bg-white/40 backdrop-blur-md border border-white/50 shadow-sm group-hover:-translate-y-1 transition-transform duration-500 z-10 flex flex-col items-center text-center">
                  <span className="text-3xl sm:text-4xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-600 to-orange-500 mb-1">
                    {stat.value}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                    {stat.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES PREVIEW SECTION ── */}
      <section className="py-16 md:py-24 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">Our Offerings</span>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-slate-900 tracking-tight uppercase mt-2">
              Capabilities<span className="text-orange-500">.</span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-4">
              We engineer custom SaaS architectures, autonomous AI agents, and enterprise-grade automations that scale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {homeServicePreview.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="glass-panel rounded-[2rem] p-8 flex flex-col justify-between hover:border-orange-500/20 hover:-translate-y-1 transition-all duration-300"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6">
                    <Award className="w-6 h-6 text-orange-600" />
                  </div>
                  <span className="text-[9px] font-bold text-orange-600 uppercase tracking-[0.2em]">{service.eyebrow}</span>
                  <h3 className="font-heading font-bold text-slate-900 text-lg mt-1 mb-3">{service.title}</h3>
                  <p className="text-slate-600 text-xs leading-relaxed">{service.description}</p>
                </div>
                <div className="mt-8 pt-4 border-t border-white/20">
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 hover:text-orange-700 transition-colors"
                  >
                    Learn More <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SELECTED WORK SECTION ── */}
      <section id="work" className="py-16 md:py-24 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 pb-6 border-b border-white/20">
            <div>
              <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">Selected Work</span>
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-slate-900 tracking-tight uppercase mt-2">
                Portfolio<span className="text-orange-500">.</span>
              </h2>
            </div>
            <Link
              href="/work"
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 hover:text-orange-600 transition-colors mt-4 sm:mt-0"
            >
              View All Work <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <PortfolioGrid projects={featuredProjects} />
        </div>
      </section>

      {/* ── TESTIMONIALS SECTION ── */}
      <section className="py-16 md:py-24 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">Testimonials</span>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-slate-900 tracking-tight uppercase mt-2">
              Client Stories<span className="text-orange-500">.</span>
            </h2>
          </div>

          <TestimonialCarousel testimonials={homeTestimonials} />
        </div>
      </section>

      {/* ── TECH MARQUEE BANNER ── */}
      <section className="py-12 bg-white/20 backdrop-blur-sm border-y border-white/40 overflow-hidden relative z-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,white_0%,transparent_10%,transparent_90%,white_100%)] pointer-events-none z-10" />
        <div className="flex gap-8 whitespace-nowrap animate-marquee items-center">
          {[...homeTechStack, ...homeTechStack, ...homeTechStack].map((tech, i) => (
            <div key={`${tech}-${i}`} className="flex items-center gap-2 px-6 py-2 rounded-full bg-white/60 border border-white/50 shadow-sm">
              <span className="text-xs font-bold text-slate-800">{tech}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CALL TO ACTION SECTION ── */}
      <section className="py-20 md:py-32 relative z-20 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-5xl sm:text-7xl lg:text-8xl font-heading font-black text-slate-900 tracking-tighter uppercase mb-8">
            Let&apos;s build.
          </h2>
          <Link
            href="/contact"
            className="px-10 py-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-lg font-black tracking-widest uppercase rounded-full shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/35 transition-all duration-300 hover:scale-105 active:scale-95 inline-block"
          >
            Start Project
          </Link>
        </div>
      </section>

    </main>
  );
}
