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
              "relative w-full rounded-3xl transition-all duration-700 ease-out",
              scrolled
                ? "bg-white/80 border border-slate-200/50 shadow-[0_20px_40px_rgba(0,0,0,0.06)] backdrop-blur-xl"
                : "bg-white/60 border border-slate-200/30 shadow-[0_10px_30px_rgba(0,0,0,0.03)] backdrop-blur-md"
            )}
          >
            <div className="relative z-10 flex items-center justify-between gap-4 px-4 py-2 text-left">
              
              {/* DESKTOP LOGO (Clean Floating Style) */}
              <Link
                href="/"
                className="hidden md:flex group relative items-center gap-3 transition-all duration-500"
              >
                <div className="relative transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
                  <Logo className="h-8 w-8" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[0.6rem] font-bold uppercase tracking-[0.4em] text-slate-400 transition-colors group-hover:text-orange-500">
                    Jantra
                  </span>
                  <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-sm font-black tracking-tight text-transparent transition-all">
                    Enterprise Software
                  </span>
                </div>
              </Link>

              {/* MOBILE LOGO (Enhanced Visibility) */}
              <Link
                href="/"
                className="md:hidden group/logo relative flex items-center gap-2 transition-all duration-500"
              >
                <div className="relative">
                   <Logo className="h-9 w-9" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-orange-600 leading-none">Jantra</span>
                  <span className="text-[0.75rem] font-black tracking-tight text-slate-800 uppercase leading-none mt-1">Enterprise Software</span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden min-w-0 flex-1 items-center justify-center md:flex">
                <div className="flex items-center gap-1 rounded-2xl bg-slate-900/[0.03] p-1 ring-1 ring-slate-950/5">
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
                          "relative rounded-xl px-4 py-2 text-[0.8rem] font-bold transition-all duration-500",
                          active
                            ? "text-slate-950"
                            : "text-slate-500 hover:text-slate-900 hover:bg-white/40",
                        )}
                      >
                        {active && (
                          <motion.div
                            layoutId="nav-active-pill"
                            className="absolute inset-0 rounded-xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,1)]"
                            transition={{
                              type: "spring",
                              bounce: 0.25,
                              duration: 0.6,
                            }}
                          />
                        )}
                        <span className="relative z-10 flex items-center gap-1">
                          {item.label}
                          {active && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="h-1.0 w-1.0 rounded-full bg-orange-500"
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
                   <Link
                    href="/contact"
                    className="group px-6 py-2.5 rounded-xl btn-premium-orange transition-all flex items-center gap-2 shadow-md"
                  >
                    <span className="flex items-center gap-1.5 text-[0.8rem] font-bold uppercase tracking-wider">
                      Let&apos;s Build 
                      <Sparkles className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-125" />
                    </span>
                  </Link>
                </div>

                <button
                  type="button"
                  aria-label="Toggle menu"
                  onClick={() => setMobileOpen((current) => !current)}
                  className={cn(
                    "group/menu relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-500 md:hidden",
                    "bg-slate-50/80 backdrop-blur-md border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.05)]",
                    "hover:border-orange-500/30 hover:shadow-[0_4px_15px_rgba(249,115,22,0.1)] active:scale-95",
                    mobileOpen && "bg-orange-600 border-orange-600 text-white shadow-[0_10px_25px_rgba(249,115,22,0.4)]"
                  )}
                >
                   {/* Unique Segments inside a Proper Circular Button */}
                   <div className="relative w-4 h-3 flex flex-col justify-between items-center transition-transform duration-500 group-hover/menu:scale-110">
                      <motion.span 
                        animate={mobileOpen ? { rotate: 45, y: 5, width: "100%", x: 0, backgroundColor: "#fff" } : { rotate: 0, y: 0, width: "60%", x: -3, backgroundColor: "#f97316" }}
                        className="h-[2px] rounded-full transition-all duration-500" 
                      />
                      <motion.span 
                        animate={mobileOpen ? { opacity: 0, scale: 0.5 } : { opacity: 1, scale: 1, x: 0, backgroundColor: "#f97316" }}
                        className="h-[2px] w-full rounded-full transition-all duration-300"
                      />
                      <motion.span 
                        animate={mobileOpen ? { rotate: -45, y: -5, width: "100%", x: 0, backgroundColor: "#fff" } : { rotate: 0, y: 0, width: "60%", x: 3, backgroundColor: "#f97316" }}
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
            <GlassEffect className="overflow-hidden rounded-3xl bg-white/90 p-5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] backdrop-blur-3xl border border-slate-200/50">
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
                          "group flex items-center justify-between rounded-xl px-5 py-4 transition-all duration-300",
                          active
                            ? "btn-premium-orange text-white shadow-md"
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
                          <span className="text-sm font-bold tracking-tight">
                            {item.label}
                          </span>
                        </div>
                        <div className={cn(
                          "rounded-full p-2 transition-transform duration-500 group-hover:translate-x-1",
                          active ? "bg-white/20" : "bg-slate-100"
                        )}>
                          <ArrowRight className="h-3.5 w-3.5" />
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
                    className="flex items-center justify-center gap-3 rounded-xl btn-premium-orange py-4 text-xs font-bold uppercase tracking-widest text-white shadow-xl transition-all"
                  >
                    Start a Project
                    <Sparkles className="h-4 w-4 text-white" />
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
