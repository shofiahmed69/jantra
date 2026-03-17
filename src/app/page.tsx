"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Blocks,
  ChevronRight,
  PencilRuler,
  Rocket,
  SearchCheck,
  Users,
  Zap,
  Shield,
  Globe,
  Star
} from "lucide-react";
import { FaAws } from "react-icons/fa";
import {
  SiDocker,
  SiFlutter,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenai,
  SiPostgresql,
  SiPython,
  SiReact,
  SiTypescript,
} from "react-icons/si";
import LottiePlayer from "@/components/LottiePlayer";
import {
  homeDifferentiators,
  homeProcess,
  homeServicePreview,
  homeStats,
  homeTechStack,
  homeTestimonials,
} from "@/content/site";
import { getFeaturedProjects, getProjectGradient } from "@/data/projects";
import api from "@/lib/api";

function Icon({ name }: { name: string }) {
  const common = "h-5 w-5";

  switch (name) {
    case "rocket":
      return <Rocket className={common} />;
    case "globe":
      return <Globe className={common} />;
    case "star":
      return <Star className={common} />;
    case "users":
      return <Users className={common} />;
    case "zap":
      return <Zap className={common} />;
    case "shield":
      return <Shield className={common} />;
    default:
      return <Zap className={common} />;
  }
}

export default function HomePage() {
  const [featuredProjects, setFeaturedProjects] = useState<any[]>([]);
  const techStackLoop = [...homeTechStack, ...homeTechStack];
  const processIcons = [SearchCheck, PencilRuler, Blocks, Rocket];
  const techIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    OpenAI: SiOpenai,
    Flutter: SiFlutter,
    PostgreSQL: SiPostgresql,
    TypeScript: SiTypescript,
    Docker: SiDocker,
    React: SiReact,
    "Next.js": SiNextdotjs,
    "Node.js": SiNodedotjs,
    Python: SiPython,
    AWS: FaAws,
  };

  useEffect(() => {
    // We prioritize local projects as requested for consistency
    setFeaturedProjects(getFeaturedProjects());
  }, []);

  return (
    <main className="relative overflow-hidden pt-24">
      <section className="relative px-6 py-6 lg:py-10">
        <div className="mx-auto max-w-[1600px]">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-orange-100/40 via-white/40 to-amber-50/40 p-1 shadow-[0_20px_50px_-20px_rgba(249,115,22,0.3)]">
            <div className="glass-panel relative overflow-hidden rounded-[calc(2.5rem-4px)] border-white/60 bg-white/20 p-6 md:p-12 lg:p-16 backdrop-blur-2xl">
              <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-7 space-y-6 md:space-y-8">
                  <header>
                    <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
                      Showcasing Technical <br className="hidden xl:block" /> Capability. <br />
                      <span className="bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
                        Building Digital Trust.
                      </span>
                    </h1>
                  </header>
                  <p className="max-w-xl text-base leading-relaxed text-slate-600 md:text-lg lg:text-xl">
                    JANTRA converts visitors into leads through premium Custom Software, AI Agents, and Agentic Workflow Automation.
                  </p>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center pt-2">
                    <button
                      onClick={() => {
                        document.getElementById('portfolio-section')
                          ?.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-4 text-base font-bold text-white shadow-xl transition-all hover:bg-slate-800 hover:scale-[1.02] active:scale-95 cursor-pointer"
                    >
                      View Our Work
                    </button>
                    <Link
                      href="/services"
                      className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/50 px-8 py-4 text-base font-semibold text-slate-800 transition-all hover:bg-white hover:border-orange-200"
                    >
                      Our Services
                    </Link>
                  </div>
                </div>

                <div className="relative hidden lg:block lg:col-span-5 h-[450px] xl:h-[550px]">
                  <LottiePlayer src="/lottie/robotics.json" className="h-full w-full scale-110" priority />
                </div>
              </div>

              {/* Scroll Down Indicator */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
                <div className="w-5 h-9 rounded-full border-2 border-orange-600 flex justify-center p-1 shadow-[0_0_15px_rgba(234,88,12,0.2)]">
                  <div className="w-1 h-2 rounded-full bg-orange-600 animate-[scroll_2s_infinite]" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-orange-600/80">Scroll</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-6">
        <div className="w-full overflow-hidden border-y border-orange-200/70 bg-gradient-to-r from-orange-50/85 via-white to-orange-100/80 py-3 shadow-[0_18px_45px_-34px_rgba(249,115,22,0.28)]">
          <div className="marquee-track">
            {techStackLoop.map((item, index) => {
              const TechIcon = techIcons[item];

              return (
                <span
                  key={`${item}-${index}`}
                  className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-gradient-to-r from-white to-orange-50 px-5 py-2 text-sm font-medium text-orange-900 shadow-[0_10px_22px_-18px_rgba(249,115,22,0.35)]"
                >
                  {TechIcon ? <TechIcon className="h-4 w-4 shrink-0" /> : null}
                  {item}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 py-4 lg:py-6">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {homeStats.map((stat, index) => (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center rounded-3xl border border-orange-100/50 bg-white/40 p-6 shadow-sm backdrop-blur-md transition-all hover:border-orange-300 hover:bg-white/60 md:p-8"
                style={{ animationDelay: `${120 + index * 100}ms` }}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-600 text-white shadow-lg">
                  <Icon name={stat.icon} />
                </div>
                <p className="text-3xl font-bold text-slate-900 md:text-4xl lg:text-5xl">{stat.value}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-widest text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 lg:py-14 px-6">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-8 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-orange-600">Services Preview</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Core services designed for modern product teams
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
              We cover the technical layers that move a company from idea to reliable software operation.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {homeServicePreview.map((service) => (
              <article
                key={service.title}
                className={`glass-panel fade-up overflow-hidden rounded-[1.75rem] p-0 transition-transform duration-300 hover:-translate-y-1 ${service.accentClassName ?? ""}`}
                style={{ animationDelay: "180ms" }}
              >
                {service.animationSrc ? (
                  <div className="border-b border-white/50 bg-gradient-to-br from-white/60 via-white/10 to-white/40 px-5 pb-3 pt-5">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
                        {service.eyebrow}
                      </p>
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70 text-slate-700 shadow-sm">
                        <Icon name={service.icon} />
                      </div>
                    </div>
                    <div className="h-44 sm:h-52">
                      <LottiePlayer
                        src={service.animationSrc}
                        className="h-full w-full scale-[1.35]"
                        priority={service.title === "Custom Software Development" || service.title === "AI Agent Development"}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="px-5 pb-3 pt-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">
                      <Icon name={service.icon} />
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900">{service.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{service.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 lg:py-14 px-6">
        <div className="mx-auto w-full grid gap-8 lg:grid-cols-[1fr_1.15fr] max-w-[1400px]">
          <div className="overflow-hidden rounded-[2rem] border border-orange-100 bg-gradient-to-br from-white via-orange-50/55 to-amber-50/70 shadow-[0_24px_60px_-36px_rgba(249,115,22,0.3)]">
            <div className="h-full p-8 text-slate-900 md:p-10">
              <div className="inline-flex items-center rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.35em] text-orange-600">
                Why JANTRA
              </div>
              <h2 className="mt-5 text-3xl font-bold tracking-tight md:text-5xl">
                A delivery model built to create trust before launch day
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
                Strong engineering matters, but so does the way we scope, communicate, and reduce uncertainty while the work is moving.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-white/70 bg-white/80 p-5 shadow-[0_12px_35px_-28px_rgba(15,23,42,0.25)]">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-orange-600">Working Style</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Clear milestones, fewer surprises, and steady client visibility through each build phase.
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-white/70 bg-white/80 p-5 shadow-[0_12px_35px_-28px_rgba(15,23,42,0.25)]">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-orange-600">Outcome Focus</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    We optimize for systems that teams can adopt, maintain, and grow into after delivery.
                  </p>
                </div>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-sm text-slate-700">
                  Transparent scope
                </span>
                <span className="rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-sm text-slate-700">
                  Fast feedback loops
                </span>
                <span className="rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-sm text-slate-700">
                  Launch-ready execution
                </span>
              </div>
            </div>
          </div>
          <div className="grid gap-4">
            {homeDifferentiators.map((item, index) => (
              <div
                key={item.title}
                className="glass-panel fade-up rounded-[1.75rem] border border-white/50 p-6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.25)] transition-transform duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${260 + index * 80}ms` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 via-orange-50 to-white text-orange-700 shadow-sm">
                    <Icon name={item.icon} />
                  </div>
                  <span className="rounded-full bg-orange-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.28em] text-orange-700">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-bold text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 lg:py-14 px-6">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-orange-600">How We Work</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
                A cleaner delivery rhythm from discovery to launch
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
                Each phase is designed to reduce ambiguity, keep momentum visible, and turn complex delivery into a sequence clients can follow.
              </p>
            </div>
            <div className="glass-panel rounded-full px-5 py-3 text-sm font-medium text-slate-700">
              Structured in 4 execution phases
            </div>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-orange-200 via-orange-300/60 to-transparent lg:block" />
            <div className="grid gap-4">
              {homeProcess.map((step, index) => {
                const StepIcon = processIcons[index] ?? Rocket;

                return (
                  <div
                    key={step.title}
                    className="glass-panel fade-up rounded-[1.9rem] border border-white/50 p-6 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.28)] transition-transform duration-300 hover:-translate-y-1"
                    style={{ animationDelay: `${180 + index * 80}ms` }}
                  >
                    <div className="grid gap-5 lg:grid-cols-[72px_160px_1fr] lg:items-center">
                      <div className="relative flex items-center justify-start lg:justify-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 text-white shadow-lg">
                          <StepIcon className="h-6 w-6" strokeWidth={1.9} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-orange-600">
                          Phase 0{index + 1}
                        </p>
                        <h3 className="text-2xl font-bold text-slate-900">{step.title}</h3>
                      </div>
                      <div className="rounded-[1.5rem] border border-white/40 bg-white/45 p-5">
                        <p className="text-sm leading-relaxed text-slate-600">{step.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="portfolio-section" className="py-10 lg:py-14 px-6 scroll-mt-32">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-orange-600">Portfolio Highlights</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
                Selected product and automation work
              </h2>
            </div>
            <Link href="/checkout" className="group flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-orange-600 transition-colors">
              View engagement models <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {featuredProjects.map((project, index) => (
              <Link
                key={project.id || project.title}
                href={`/work/${project.slug}`}
                className="group flex flex-col fade-up"
                style={{ animationDelay: `${200 + index * 100}ms` }}
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-slate-200 shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-orange-500/10 group-hover:-translate-y-2">
                  <div className={`w-full h-full bg-gradient-to-br ${getProjectGradient(index)} flex items-center justify-center overflow-hidden relative`}>
                    <span className="text-white font-black opacity-20 select-none" style={{ fontSize: '8rem', lineHeight: 1 }}>
                      {project.title.charAt(0)}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <div className="bg-white/90 backdrop-blur-md text-slate-900 px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      View Case Study <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                <div className="mt-6 px-2">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-1 rounded-md border border-orange-100">
                      {project.category?.[0] || 'Web'}
                    </span>
                    <div className="flex gap-1">
                      {(project.techStack || []).slice(0, 3).map((tag: string) => (
                        <span key={tag} className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 line-clamp-2">
                    {project.description || project.challenge}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/work"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-4 text-base font-bold text-slate-900 shadow-sm transition-all hover:border-orange-200 hover:bg-orange-50 active:scale-95"
            >
              View All Projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-10 lg:py-14 px-6">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-8 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-orange-600">Testimonials</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
              What clients say when the process feels clear
            </h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {homeTestimonials.map((testimonial) => (
              <blockquote
                key={testimonial.author}
                className="glass-panel fade-up rounded-[2rem] border border-white/40 p-6 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.35)] transition-transform duration-300 hover:-translate-y-1"
                style={{ animationDelay: "240ms" }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Image
                      src={testimonial.avatarUrl}
                      alt={testimonial.author}
                      width={56}
                      height={56}
                      sizes="56px"
                      className="h-14 w-14 rounded-full object-cover ring-2 ring-white/80 shadow-lg"
                    />
                    <div>
                      <p className="font-semibold text-slate-900">{testimonial.author}</p>
                      <p className="text-sm text-slate-500">{testimonial.role}</p>
                      <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-orange-600">
                        {testimonial.company}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700">
                    Verified Review
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-1 text-amber-400">
                  {Array.from({ length: testimonial.rating }).map((_, index) => (
                    <Icon key={index} name="star" />
                  ))}
                </div>
                <p className="mt-4 text-base leading-relaxed text-slate-700">&ldquo;{testimonial.quote}&rdquo;</p>
                <footer className="mt-6 border-t border-white/20 pt-4 text-sm text-slate-500">
                  Client feedback on delivery quality, clarity, and execution.
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 lg:py-20 px-6">
        <div className="mx-auto max-w-[1400px] rounded-[3rem] bg-gradient-to-r from-slate-900 via-slate-800 to-orange-950 p-8 md:p-12 lg:p-20 text-white shadow-[0_40px_100px_-20px_rgba(15,23,42,0.6)]">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-orange-200">Build With JANTRA</p>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
                Ready to turn an idea, workflow, or product bottleneck into something reliable?
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300 md:text-lg">
                Let&apos;s scope the right engagement model and build a roadmap your team can actually execute.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="rounded-full bg-white px-7 py-4 text-center font-bold text-slate-900 transition-all hover:bg-orange-100"
              >
                Talk to Us
              </Link>
              <Link
                href="/services"
                className="rounded-full border border-white/20 px-7 py-4 text-center font-semibold text-white transition-all hover:bg-white/10"
              >
                View Capabilities
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
