"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { navItems } from "@/content/site";
import Logo from "@/components/Logo";

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
            className={`fixed top-0 left-0 right-0 z-[100] px-4 pt-4 md:pt-6 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm pb-4" : "bg-transparent"
                }`}
        >
            <div className={`mx-auto max-w-6xl glass-panel rounded-full px-4 sm:px-8 py-3 md:py-4 flex items-center justify-between relative transition-all duration-300 ${scrolled ? "border-transparent bg-transparent shadow-none" : ""}`}>
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <Logo className="w-9 h-9" />
                    <Link href="/" className="text-lg md:text-xl font-bold tracking-tight text-slate-900">
                        JANTRA
                    </Link>
                </div>

                {/* Desktop nav */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={
                                pathname === item.href
                                    ? "text-orange-600 font-semibold"
                                    : "hover:text-orange-600 transition-colors"
                            }
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                {/* Desktop CTA */}
                <div className="hidden md:flex items-center pr-2">
                    <Link
                        href="/#work-section"
                        className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-800 transition-all active:scale-95 whitespace-nowrap"
                    >
                        View Our Work
                    </Link>
                </div>

                {/* Mobile hamburger */}
                <button
                    className="md:hidden flex flex-col gap-1.5 p-2"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    <span className={`block w-5 h-0.5 bg-slate-800 transition-transform ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
                    <span className={`block w-5 h-0.5 bg-slate-800 transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
                    <span className={`block w-5 h-0.5 bg-slate-800 transition-transform ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
                </button>
            </div>

            {/* Mobile dropdown */}
            {mobileOpen && (
                <div className="md:hidden absolute top-full left-4 right-4 mt-2 bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4 z-50">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={`block text-base font-medium ${pathname === item.href
                                ? "text-orange-600 font-semibold"
                                : "text-slate-700 hover:text-orange-600"
                                }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                    <Link
                        href="/checkout"
                        onClick={() => setMobileOpen(false)}
                        className="block w-full text-center bg-slate-900 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-slate-800 transition-all"
                    >
                        View Our Work
                    </Link>
                </div>
            )}
        </nav>
    );
}
