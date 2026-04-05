"use client";

import Link from 'next/link';
import { Mail, Linkedin, Facebook, MessageCircle } from 'lucide-react';
import Logo from '@/components/Logo';

export default function Footer() {
    return (
        <footer className="bg-slate-950 text-white pt-20 pb-10 px-6 md:px-12 border-t border-white/5">
            <div className="max-w-[1440px] mx-auto">
                {/* Top section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-white/5">
                    {/* Brand column */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-3 mb-6">
                            <Logo className="w-10 h-10" />
                            <span className="text-2xl font-black tracking-tighter uppercase italic">
                                JANTRA<span className="text-orange-500">.</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-sm mb-8 opacity-80 uppercase tracking-tight">
                            Architecting digital excellence through elite <span className="text-white">software engineering</span>, <span className="text-white">AI agents</span>, and <span className="text-white">autonomous workflows</span>.
                        </p>
                        
                        {/* Social links - PREMIUM ICONS */}
                        <div className="flex flex-wrap gap-3">
                            {[
                                { icon: Linkedin, href: "https://www.linkedin.com/company/112998098", label: "LinkedIn" },
                                { icon: Facebook, href: "https://www.facebook.com/profile.php?id=61578641909784", label: "Facebook" },
                                { icon: MessageCircle, href: "https://wa.me/8801625027956", label: "WhatsApp" },
                                { icon: Mail, href: "mailto:jantrasoftinfo@gmail.com", label: "Email" }
                            ].map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-orange-600 hover:border-orange-500 transition-all duration-500 group"
                                >
                                    <social.icon className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Company links */}
                    <div>
                        <h3 className="text-xs uppercase tracking-widest text-orange-500 font-bold mb-5">
                            Company
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { label: "About Us", href: "/about" },
                                { label: "Our Work", href: "/work" },
                                { label: "Blog", href: "/blog" },
                                { label: "Careers", href: "/careers" },
                                { label: "Pricing", href: "/pricing" },
                                { label: "Contact", href: "/contact" },
                            ].map(link => (
                                <li key={link.href}>
                                    <Link href={link.href}
                                        className="text-slate-400 text-sm hover:text-orange-400 transition">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services links */}
                    <div>
                        <h3 className="text-xs uppercase tracking-widest text-orange-500 font-bold mb-5">
                            Services
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { label: "Custom Software", href: "/services/custom-software" },
                                { label: "AI Agents", href: "/services/ai-agent" },
                                { label: "Workflow Automation", href: "/services/workflow-automation" },
                                { label: "SaaS Development", href: "/services/saas" },
                                { label: "Mobile Apps", href: "/services/mobile-app" },
                                { label: "UI/UX Design", href: "/services/ui-ux-design" },
                            ].map(link => (
                                <li key={link.href}>
                                    <Link href={link.href}
                                        className="text-slate-400 text-sm hover:text-orange-400 transition">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal links */}
                    <div>
                        <h3 className="text-xs uppercase tracking-widest text-orange-500 font-bold mb-5">
                            Legal
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { label: "Privacy Policy", href: "/privacy" },
                                { label: "Terms of Service", href: "/terms" },
                            ].map(link => (
                                <li key={link.href}>
                                    <Link href={link.href}
                                        className="text-slate-400 text-sm hover:text-orange-400 transition">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                    </div>
                </div>


                {/* Bottom bar */}
                <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-slate-500 text-xs">
                        © {new Date().getFullYear()} JANTRA. All rights reserved.
                    </p>
                    <p className="text-slate-500 text-xs text-center md:text-right">
                        Built with ❤️ in Dhaka, Bangladesh
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                        </span>
                        <span className="text-slate-500 text-xs">
                            All systems operational
                        </span>
                    </div>
                </div>
            </div>
        </footer >
    );
}
