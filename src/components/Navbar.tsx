"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { navItems } from "@/content/site";
import Logo from "@/components/Logo";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-[100] px-4 pt-3 md:pt-5 transition-all duration-300 ${
                scrolled ? "bg-white/90 backdrop-blur-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] pb-3 md:pb-4" : "bg-transparent"
            }`}
        >
            <div className={`mx-auto max-w-6xl rounded-full px-4 sm:px-6 py-2 md:py-3 flex items-center justify-between relative transition-all duration-300 ${
                scrolled ? "border-transparent bg-transparent shadow-none" : "glass-panel"
            }`}>
                {/* Logo */}
                <div className="flex items-center gap-2 group cursor-pointer z-10">
                    <Logo className="w-7 h-7 sm:w-8 sm:h-8 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
                    <Link href="/" className="text-base md:text-lg font-black tracking-tight text-slate-900 transition-colors duration-500 group-hover:text-orange-600">
                        JANTRA<span className="text-orange-500 transition-transform duration-500 inline-block group-hover:translate-x-0.5">.</span>
                    </Link>
                </div>

                {/* Desktop nav */}
                <div className="hidden md:flex items-center gap-6 text-xs md:text-sm font-medium text-slate-600">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`relative px-1 py-2 transition-all duration-300 group ${
                                pathname === item.href
                                    ? "text-orange-600 font-semibold"
                                    : "text-slate-600 hover:text-slate-900"
                            }`}
                        >
                            <span className="relative z-10 transition-transform duration-300 group-hover:-translate-y-[1px] group-hover:text-orange-600 inline-block origin-center">
                                {item.label}
                            </span>
                            {pathname === item.href && (
                                <motion.div 
                                    layoutId="nav-pill"
                                    className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-orange-500 rounded-full"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </Link>
                    ))}
                </div>

                {/* Desktop CTA */}
                <div className="hidden md:flex items-center pr-1 md:pr-2">
                    <Link
                        href="/#work"
                        className="group relative overflow-hidden bg-slate-900 text-white px-5 py-2 md:py-2.5 rounded-full text-xs font-bold transition-all duration-500 active:scale-95 whitespace-nowrap shadow-[0_10px_20px_-8px_rgba(0,0,0,0.2)] hover:shadow-[0_15px_30px_-10px_rgba(249,115,22,0.4)]"
                    >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
                        <span className="relative z-10 flex items-center justify-center gap-2">
                           View Our Work
                           <span className="w-0 group-hover:w-4 -ml-1 transition-all duration-500 overflow-hidden opacity-0 group-hover:opacity-100 flex items-center justify-center">
                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                           </span>
                        </span>
                    </Link>
                </div>

                {/* Mobile hamburger */}
                <button
                    className="md:hidden flex flex-col gap-[5px] p-1.5 group hover:bg-slate-50 rounded-full transition-colors"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    <span className={`block w-4 h-[2px] bg-slate-800 transition-all duration-300 origin-center ${mobileOpen ? "rotate-45 translate-y-[7px]" : "group-hover:w-3"}`} />
                    <span className={`block w-4 h-[2px] bg-slate-800 transition-opacity duration-300 ${mobileOpen ? "opacity-0" : "group-hover:opacity-50"}`} />
                    <span className={`block w-4 h-[2px] bg-slate-800 transition-all duration-300 origin-center ${mobileOpen ? "-rotate-45 -translate-y-[7px]" : "group-hover:w-2"}`} />
                </button>
            </div>

            {/* Mobile dropdown */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10, filter: "blur(5px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -10, filter: "blur(5px)" }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden absolute top-full left-4 right-4 mt-2 bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 space-y-4 z-50 origin-top"
                    >
                        {navItems.map((item, index) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className={`group flex items-center justify-between p-3 rounded-2xl transition-all duration-300 ${
                                    pathname === item.href
                                    ? "bg-orange-50/50 text-orange-600 font-semibold shadow-sm"
                                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                                }`}
                            >
                                <span className="translate-x-0 group-hover:translate-x-2 transition-transform duration-300">
                                   {item.label}
                                </span>
                                <span className={`text-[10px] font-bold ${pathname === item.href ? "opacity-100" : "opacity-0 group-hover:opacity-40 transition-opacity duration-300"}`}>
                                   0{index + 1}
                                </span>
                            </Link>
                        ))}
                        <Link
                            href="/#work"
                            onClick={() => setMobileOpen(false)}
                            className="block w-full text-center bg-slate-900 text-white px-6 py-3 rounded-full text-sm font-semibold transition-all shadow-md mt-2 hover:shadow-[0_10px_20px_-5px_rgba(249,115,22,0.4)] hover:bg-orange-600 active:scale-95"
                        >
                            View Our Work
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
