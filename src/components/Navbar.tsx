"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Menu, X, Sparkles } from "lucide-react";
import Logo from "@/components/Logo";
import { navItems } from "@/content/site";
import {
  GlassButton,
  GlassEffect,
  GlassFilter,
} from "@/components/ui/liquid-glass";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  // Dynamic transforms based on scroll
  // Dynamic transforms based on scroll - Optimized for performance
  const navPadding = useTransform(scrollY, [0, 50], ["1.5rem", "1rem"]);
  const navScale = useTransform(scrollY, [0, 50], [1, 1]); // Disabled scaling for smoother performance

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed inset-x-0 top-[-16px] z-[100] transition-all duration-500">
      <GlassFilter />
      
      <div className="mx-auto max-w-7xl px-3 pt-3 sm:px-6 sm:pt-6 text-left">
        <motion.div
          style={{ padding: navPadding, scale: navScale }}
          className="relative group w-full"
        >
          <GlassEffect
            className={cn(
              "relative w-full rounded-[2.5rem] transition-all duration-700 ease-out",
              // Desktop: Previous style | Mobile: Orbital style
              scrolled
                ? "bg-white/40 md:bg-white/40 ring-1 ring-white/40 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] backdrop-blur-xl"
                : "bg-white/25 md:bg-white/25 ring-1 ring-white/30 shadow-[0_20px_40px_-15px_rgba(249,115,22,0.25)] backdrop-blur-md",
              "md:border-none border-t border-white/40" 
            )}
          >
            <div className="relative z-10 flex items-center justify-between gap-4 px-3 py-2 sm:px-4 sm:py-1 text-left">
              
              {/* DESKTOP LOGO (Clean Floating Style) */}
              <Link
                href="/"
                className="hidden md:flex group relative items-center gap-3 transition-all duration-500"
              >
                <div className="relative transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
                  <Logo className="h-9 w-9" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[0.65rem] font-bold uppercase tracking-[0.4em] text-slate-500 transition-colors group-hover:text-orange-500">
                    Jantra
                  </span>
                  <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-base font-black tracking-tight text-transparent transition-all sm:text-lg">
                    Enterprise Software
                  </span>
                </div>
              </Link>

              {/* MOBILE LOGO (Enhanced Visibility) */}
              <Link
                href="/"
                className="md:hidden group/logo relative flex items-center gap-3 transition-all duration-500"
              >
                <div className="relative">
                   <Logo className="h-11 w-11" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[0.8rem] font-black uppercase tracking-[0.35em] text-orange-600 leading-none">Jantra</span>
                  <span className="text-[0.95rem] font-black tracking-tighter text-slate-900 uppercase leading-none mt-1">Enterprise Software</span>
                </div>
              </Link>

              {/* Desktop Navigation (Previous style) */}
              <div className="hidden min-w-0 flex-1 items-center justify-center md:flex">
                <div className="flex items-center gap-1 rounded-full bg-slate-900/[0.03] p-1.5 ring-1 ring-slate-950/5">
                  {navItems.map((item) => {
                    const active =
                      item.href === "/"
                        ? pathname === item.href
                        : pathname?.startsWith(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "relative rounded-full px-5 py-2.5 text-[0.85rem] font-bold transition-all duration-500",
                          active
                            ? "text-slate-950"
                            : "text-slate-500 hover:text-slate-900 hover:bg-white/40",
                        )}
                      >
                        {active && (
                          <motion.div
                            layoutId="nav-active-pill"
                            className="absolute inset-0 rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,1)]"
                            transition={{
                              type: "spring",
                              bounce: 0.25,
                              duration: 0.6,
                            }}
                          />
                        )}
                        <span className="relative z-10 flex items-center gap-1.5">
                          {item.label}
                          {active && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="h-1 w-1 rounded-full bg-orange-500"
                            />
                          )}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Action Terminal */}
              <div className="flex items-center gap-3">
                <div className="hidden lg:block">
                   <GlassButton
                    href="/contact"
                    className="group border-none bg-orange-600/90 py-3.5 text-white transition-all duration-500 hover:bg-orange-600 hover:shadow-[0_10px_30px_-10px_rgba(249,115,22,0.5)]"
                  >
                    <span className="flex items-center gap-2 text-[0.85rem] font-black uppercase tracking-wider">
                      Let&apos;s Build 
                      <Sparkles className="h-4 w-4 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-125" />
                    </span>
                  </GlassButton>
                </div>

                <button
                  type="button"
                  aria-label="Toggle menu"
                  onClick={() => setMobileOpen((current) => !current)}
                  className={cn(
                    "group/menu relative flex h-12 w-12 items-center justify-center rounded-full transition-all duration-500 md:hidden",
                    "bg-slate-50/80 backdrop-blur-md border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.05)]",
                    "hover:border-orange-500/30 hover:shadow-[0_4px_15px_rgba(249,115,22,0.1)] active:scale-95",
                    mobileOpen && "bg-orange-600 border-orange-600 text-white shadow-[0_10px_25px_rgba(249,115,22,0.4)]"
                  )}
                >
                   {/* Unique Segments inside a Proper Circular Button */}
                   <div className="relative w-5 h-3 flex flex-col justify-between items-center transition-transform duration-500 group-hover/menu:scale-110">
                      <motion.span 
                        animate={mobileOpen ? { rotate: 45, y: 6, width: "100%", x: 0, backgroundColor: "#fff" } : { rotate: 0, y: 0, width: "60%", x: -4, backgroundColor: "#f97316" }}
                        className="h-[2px] rounded-full transition-all duration-500" 
                      />
                      <motion.span 
                        animate={mobileOpen ? { opacity: 0, scale: 0.5 } : { opacity: 1, scale: 1, x: 0, backgroundColor: "#f97316" }}
                        className="h-[2px] w-full rounded-full transition-all duration-300"
                      />
                      <motion.span 
                        animate={mobileOpen ? { rotate: -45, y: -6, width: "100%", x: 0, backgroundColor: "#fff" } : { rotate: 0, y: 0, width: "60%", x: 4, backgroundColor: "#f97316" }}
                        className="h-[2px] rounded-full transition-all duration-500" 
                      />
                   </div>
                </button>
              </div>
            </div>
          </GlassEffect>
        </motion.div>
      </div>

      {/* Mobile Menu Overlay (Stunning Dropdown Style) */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-x-0 top-full mt-4 px-4 sm:px-6 md:hidden"
          >
            <GlassEffect className="overflow-hidden rounded-[2.5rem] bg-white/80 p-5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] backdrop-blur-3xl ring-1 ring-white/50 border border-white/20">
              <div className="flex flex-col gap-2">
                {navItems.map((item, index) => {
                  const active =
                    item.href === "/"
                      ? pathname === item.href
                      : pathname?.startsWith(item.href);

                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "group flex items-center justify-between rounded-[1.5rem] px-5 py-4 transition-all duration-300",
                          active
                            ? "bg-orange-600 text-white shadow-lg shadow-orange-500/20"
                            : "text-slate-600 hover:bg-white hover:text-slate-950",
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <span className={cn(
                            "text-[8px] font-black uppercase tracking-[0.3em] transition-opacity",
                            active ? "opacity-40" : "opacity-20"
                          )}>
                            0{index + 1}
                          </span>
                          <span className="text-base font-bold tracking-tight">
                            {item.label}
                          </span>
                        </div>
                        <div className={cn(
                          "rounded-full p-2 transition-transform duration-500 group-hover:translate-x-1",
                          active ? "bg-white/20" : "bg-slate-100"
                        )}>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navItems.length * 0.05 }}
                  className="mt-2"
                >
                  <Link
                    href="/contact"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-3 rounded-[1.5rem] bg-slate-900 py-5 text-sm font-black uppercase tracking-widest text-white shadow-xl transition-all hover:bg-slate-800"
                  >
                    Start a Project
                    <Sparkles className="h-4 w-4 text-orange-400" />
                  </Link>
                </motion.div>
              </div>
            </GlassEffect>
          </motion.div>
        )}
      </AnimatePresence>

    </nav>
  );
}
