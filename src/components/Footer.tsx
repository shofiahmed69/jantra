import Link from "next/link";
import { Linkedin, Twitter, Github, Dribbble, ArrowRight } from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative z-10 pt-20 pb-10 px-6 mt-auto bg-white/5 border-t border-slate-200 backdrop-blur-md">
            <div className="container mx-auto max-w-7xl">
                {/* Top Section: Newsletter & Intro */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 mb-16">
                    <div>
                        <Link href="/" className="inline-block mb-6">
                            <span className="text-xl md:text-2xl font-bold tracking-widest uppercase text-slate-900 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-black text-sm">
                                    J
                                </div>
                                JANTRA
                            </span>
                        </Link>
                        <p className="text-slate-600 mb-8 max-w-md text-sm md:text-base leading-relaxed">
                            We design and build bespoke software solutions, autonomous agents, and scalable platforms for modern enterprises.
                        </p>

                        {/* Newsletter Mini */}
                        <div className="space-y-3 max-w-md">
                            <h4 className="text-sm font-bold text-slate-900">Subscribe for insights</h4>
                            <div className="flex items-center gap-2">
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-sm"
                                />
                                <button className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-orange-600 transition-colors shadow-md">
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                        {/* Column 1 */}
                        <div>
                            <h4 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Services</h4>
                            <ul className="space-y-3">
                                <li><Link href="/services/custom-software-development" className="text-slate-500 hover:text-orange-600 text-sm transition-colors">Custom Software</Link></li>
                                <li><Link href="/services/ai-agent-development" className="text-slate-500 hover:text-orange-600 text-sm transition-colors">AI Agents</Link></li>
                                <li><Link href="/services/mobile-app-development" className="text-slate-500 hover:text-orange-600 text-sm transition-colors">Mobile Apps</Link></li>
                                <li><Link href="/services/agentic-workflow-automation" className="text-slate-500 hover:text-orange-600 text-sm transition-colors">Workflow Automation</Link></li>
                                <li><Link href="/services" className="text-orange-600 font-medium hover:text-orange-700 text-sm transition-colors flex items-center gap-1 mt-2">View all <ArrowRight className="w-3 h-3" /></Link></li>
                            </ul>
                        </div>

                        {/* Column 2 */}
                        <div>
                            <h4 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Company</h4>
                            <ul className="space-y-3">
                                <li><Link href="/about" className="text-slate-500 hover:text-orange-600 text-sm transition-colors">About Us</Link></li>
                                <li><Link href="/work" className="text-slate-500 hover:text-orange-600 text-sm transition-colors">Portfolio</Link></li>
                                <li><Link href="/pricing" className="text-slate-500 hover:text-orange-600 text-sm transition-colors">Pricing</Link></li>
                                <li><Link href="/careers" className="text-slate-500 hover:text-orange-600 text-sm transition-colors flex items-center gap-2">Careers <span className="bg-orange-100 text-orange-600 text-[10px] px-1.5 py-0.5 rounded font-bold">HIRING</span></Link></li>
                                <li><Link href="/blog" className="text-slate-500 hover:text-orange-600 text-sm transition-colors">Blog</Link></li>
                            </ul>
                        </div>

                        {/* Column 3 */}
                        <div className="col-span-2 sm:col-span-1">
                            <h4 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Connect</h4>
                            <ul className="space-y-3 mb-6">
                                <li><Link href="/contact" className="text-slate-500 hover:text-orange-600 text-sm transition-colors">Contact Us</Link></li>
                                <li><a href="mailto:hello@jantra.agency" className="text-slate-500 hover:text-orange-600 text-sm transition-colors">hello@jantra.agency</a></li>
                            </ul>

                            <h4 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Socials</h4>
                            <div className="flex items-center gap-3">
                                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-orange-100 hover:text-orange-600 transition-colors">
                                    <Linkedin className="w-4 h-4" />
                                </a>
                                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-orange-100 hover:text-orange-600 transition-colors">
                                    <Twitter className="w-4 h-4" />
                                </a>
                                <a href="https://github.com" target="_blank" rel="noreferrer" className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-orange-100 hover:text-orange-600 transition-colors">
                                    <Github className="w-4 h-4" />
                                </a>
                                <a href="https://dribbble.com" target="_blank" rel="noreferrer" className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-orange-100 hover:text-orange-600 transition-colors">
                                    <Dribbble className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-xs font-medium">
                        &copy; {currentYear} JANTRA. ALL RIGHTS RESERVED.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="/privacy" className="text-slate-500 hover:text-slate-900 text-xs font-medium transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="text-slate-500 hover:text-slate-900 text-xs font-medium transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
