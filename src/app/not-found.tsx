"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import LottiePlayer from "@/components/LottiePlayer";
import { motion } from "framer-motion";

export default function NotFound() {
  // Hide Navbar and Footer using the custom event mechanism
  useEffect(() => {
    const event = new CustomEvent("jantra:overlay-state", {
      detail: { open: true },
    });
    window.dispatchEvent(event);

    return () => {
      const cleanupEvent = new CustomEvent("jantra:overlay-state", {
        detail: { open: false },
      });
      window.dispatchEvent(cleanupEvent);
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#030014] text-white flex flex-col items-center justify-center relative overflow-hidden select-none font-body">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(255,255,255,0))]" />
      
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />

      {/* Cyber Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      <div className="relative z-10 max-w-2xl px-6 text-center flex flex-col items-center">
        {/* Animated Compass Icon Header */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/5 text-purple-300 text-sm font-medium backdrop-blur-md"
        >
          <Compass className="w-4 h-4 animate-spin-slow text-purple-400" />
          <span>ROUTE NOT RESOLVED</span>
        </motion.div>

        {/* Stunning Lottie Player Animation */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="w-72 h-72 sm:w-96 sm:h-96 relative flex items-center justify-center"
        >
          <LottiePlayer 
            src="/lottie/404.json" 
            className="w-full h-full" 
            loop={true} 
            autoplay={true} 
            priority={true}
          />
        </motion.div>

        {/* Dynamic Text Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="space-y-4"
        >
          <h1 className="text-4xl sm:text-5xl font-heading font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
            Lost in Space
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-md mx-auto font-light leading-relaxed">
            The page you are looking for has drifted out of orbit, or is completely hidden from unauthorized access.
          </p>
        </motion.div>

        {/* Interactive Premium CTA Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-8"
        >
          <Link href="/">
            <button className="group relative px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 overflow-hidden cursor-pointer">
              {/* Button inner glow overlay */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <ArrowLeft className="w-4 h-4 relative z-10 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="relative z-10">Back to Safety</span>
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
