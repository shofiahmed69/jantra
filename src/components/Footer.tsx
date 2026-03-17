"use client";

import Link from 'next/link';
import Logo from '@/components/Logo';

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-white pt-16 pb-8 px-6 md:px-12">
            <div className="max-w-6xl mx-auto">
                {/* Top section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
                    {/* Brand column */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <Logo className="w-8 h-8" />
                            <span className="text-xl font-bold tracking-wide">
                                JANTRA
                            </span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                            Building digital excellence through custom software, AI agents, and workflow automation.
                        </p>
                        <p className="text-slate-500 text-xs mt-4">
                            Dhaka, Bangladesh 🇧🇩<br />
                            Mon–Fri, 9AM–6PM (GMT+6)
                        </p>
                        {/* Social links */}
                        <div className="flex gap-3 mt-6">
                            <a href="https://linkedin.com" target="_blank" rel="noreferrer"
                                className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-orange-500 transition text-sm">
                                in
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noreferrer"
                                className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-orange-500 transition text-sm">
                                𝕏
                            </a>
                            <a href="https://github.com" target="_blank" rel="noreferrer"
                                className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-orange-500 transition text-sm">
                                gh
                            </a>
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

                        {/* Newsletter */}
                        <div className="mt-8">
                            <h3 className="text-xs uppercase tracking-widest text-orange-500 font-bold mb-4">
                                Stay Updated
                            </h3>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="flex-1 bg-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500 min-w-0"
                                />
                                <button className="bg-orange-500 text-white px-3 py-2 rounded-xl text-sm font-medium hover:bg-orange-600 transition whitespace-nowrap">
                                    →
                                </button>
                            </div>
                        </div>
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
