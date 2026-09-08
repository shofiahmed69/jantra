"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Code2,
  Cpu,
  Layers,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Mail,
  Phone,
  Globe,
  User,
  Loader2,
  ExternalLink,
} from "lucide-react";
import api from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  bio?: string;
  linkedIn?: string;
  twitter?: string;
}

const servicesList = [
  {
    title: "Custom Web & SaaS Development",
    description: "Full-stack web applications, customer portals, and subscription software built with Next.js, Node.js, and PostgreSQL.",
  },
  {
    title: "AI Integration & Automation",
    description: "Custom AI assistants, document processing, and automated workflow pipelines integrated into existing business systems.",
  },
  {
    title: "Mobile Application Development",
    description: "Cross-platform mobile applications for iOS and Android built for reliability, performance, and clean user experience.",
  },
  {
    title: "Cloud Infrastructure & APIs",
    description: "RESTful API development, database architecture, containerized deployments, and managed server hosting.",
  },
];

const principles = [
  {
    title: "Engineering Discipline",
    description: "We write clean, typed, and well-structured code that your team can maintain and scale without technical bottlenecks.",
  },
  {
    title: "Transparent Collaboration",
    description: "Clients have direct access to our engineers. Weekly sprint reviews, staging links, and clear milestone tracking ensure complete visibility.",
  },
  {
    title: "Security & Reliability",
    description: "Proper authentication, input validation, role-based access control, and automated server backups are standard practice across all deliverables.",
  },
  {
    title: "Long-Term Support",
    description: "We provide ongoing infrastructure management, security updates, and performance monitoring after systems go live.",
  },
];

const techStack = [
  { category: "Frontend", tools: "Next.js, React, TypeScript, Tailwind CSS" },
  { category: "Backend", tools: "Node.js, Express, PostgreSQL, Prisma, Redis" },
  { category: "AI & Data", tools: "Python, OpenAI API, LangChain" },
  { category: "Infrastructure", tools: "Docker, Linux VPS, Nginx/Traefik, CI/CD" },
];

export default function AboutPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await api.get("/team");
        const data = response.data?.data || response.data || [];
        setTeam(Array.isArray(data) ? data : []);
      } catch {
        setTeam([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 selection:bg-orange-500 selection:text-white pb-24">
      {/* Hero Section */}
      <section className="px-6 pt-32 pb-16 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-orange-400 text-xs font-mono font-medium tracking-wide uppercase mb-6">
            Company Overview
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-6">
            About JANTRA Software
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed font-normal">
            JANTRA Software is a custom software engineering studio headquartered in Khulshi, Chittagong, Bangladesh. We design, develop, and maintain digital products, software platforms, and AI automation systems for domestic and international clients.
          </p>
        </motion.div>
      </section>

      {/* Mission & Background */}
      <section className="px-6 py-16 max-w-5xl mx-auto border-t border-slate-900">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-orange-500 mb-3">
              Who We Are
            </h2>
            <h3 className="text-2xl font-bold text-white tracking-tight mb-4">
              Building Reliable Software with Modern Engineering Standards
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              We started JANTRA to provide businesses with engineering-grade software development. Instead of complex agency layers, we work directly with founders and technical leaders to translate business objectives into functional, maintainable code.
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              Our work covers the full product lifecycle: from initial systems architecture and database design to frontend implementation, automated deployments, and post-launch maintenance.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-800">
              Company Facts
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-500 font-mono">Entity Name</span>
                <span className="text-white font-medium">JANTRA Software Ltd.</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-500 font-mono">Headquarters</span>
                <span className="text-white font-medium">Khulshi, Chittagong, Bangladesh</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-500 font-mono">Core Focus</span>
                <span className="text-white font-medium">Web Systems, Mobile Apps, AI Workflows</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-500 font-mono">Primary Language</span>
                <span className="text-white font-medium">TypeScript, JavaScript, Python, SQL</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-mono">Business Contact</span>
                <span className="text-orange-400 font-mono">contact@jantrasoft.online</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="px-6 py-16 max-w-5xl mx-auto border-t border-slate-900">
        <div className="mb-10 text-left">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-orange-500 mb-2">
            What We Deliver
          </h2>
          <h3 className="text-2xl font-bold text-white tracking-tight">
            Core Service Offerings
          </h3>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {servicesList.map((service, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-left"
            >
              <h4 className="text-base font-bold text-white mb-2">
                {service.title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Working Principles */}
      <section className="px-6 py-16 max-w-5xl mx-auto border-t border-slate-900">
        <div className="mb-10 text-left">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-orange-500 mb-2">
            How We Work
          </h2>
          <h3 className="text-2xl font-bold text-white tracking-tight">
            Our Working Principles
          </h3>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {principles.map((item, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-left"
            >
              <h4 className="text-base font-bold text-white mb-2">
                {item.title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Technology Stack */}
      <section className="px-6 py-16 max-w-5xl mx-auto border-t border-slate-900">
        <div className="mb-10 text-left">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-orange-500 mb-2">
            Technical Stack
          </h2>
          <h3 className="text-2xl font-bold text-white tracking-tight">
            Technologies in Production
          </h3>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {techStack.map((tech, index) => (
            <div
              key={index}
              className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 text-left"
            >
              <div className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider mb-2">
                {tech.category}
              </div>
              <div className="text-xs text-slate-300 font-medium leading-relaxed">
                {tech.tools}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="px-6 py-16 max-w-5xl mx-auto border-t border-slate-900">
        <div className="mb-10 text-left">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-orange-500 mb-2">
            The Team
          </h2>
          <h3 className="text-2xl font-bold text-white tracking-tight">
            Engineering &amp; Product Team
          </h3>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
          </div>
        ) : team.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-left max-w-md">
            <div className="text-xs font-bold text-white mb-1">JANTRA Engineering Team</div>
            <p className="text-xs text-slate-400">
              Our engineering team is managed through our central administrative console.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence>
              {team.map((member) => (
                <div
                  key={member.id}
                  className="p-5 bg-slate-900/40 rounded-2xl border border-slate-800 text-center"
                >
                  <div className="w-14 h-14 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-3 overflow-hidden">
                    {member.avatar ? (
                      <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <h4 className="font-bold text-white text-xs">{member.name}</h4>
                  <p className="text-[11px] font-mono text-orange-400/90 mt-0.5">{member.role}</p>
                </div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* Studio Location & Contact */}
      <section className="px-6 py-16 max-w-5xl mx-auto border-t border-slate-900">
        <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 grid md:grid-cols-2 gap-8 items-start">
          <div>
            <h3 className="text-xl font-bold text-white mb-3">Headquarters</h3>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
                <span>Khulshi, Chittagong, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                <a href="mailto:contact@jantrasoft.online" className="hover:text-white transition-colors">
                  contact@jantrasoft.online
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                <span>+880 1625 027956</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-orange-400 shrink-0" />
                <a href="https://jantrasoft.online" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  https://jantrasoft.online
                </a>
              </div>
            </div>
          </div>

          <div className="text-left md:border-l md:border-slate-800 md:pl-8">
            <h3 className="text-xl font-bold text-white mb-2">Project Inquiries</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Have an upcoming project or need technical support for an existing system? Get in touch to review requirements, feasibility, and timelines.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Contact Us
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <a
                href="https://wa.me/8801625027956"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium transition-colors"
              >
                WhatsApp
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
