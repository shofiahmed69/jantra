'use client'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Mail, MessageCircle, X } from 'lucide-react'

export default function ClientLayout({
    children
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const [hideNavbarForOverlay, setHideNavbarForOverlay] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    
    const isAdmin = pathname?.startsWith('/admin')
    const isStandalonePortal = pathname?.startsWith('/report')

    useEffect(() => {
        const handleOverlayState = (event: Event) => {
            const customEvent = event as CustomEvent<{ open?: boolean }>
            setHideNavbarForOverlay(Boolean(customEvent.detail?.open))
        }

        window.addEventListener('jantra:overlay-state', handleOverlayState)
        return () => window.removeEventListener('jantra:overlay-state', handleOverlayState)
    }, [])

    const showNav = !isAdmin && !isStandalonePortal && !hideNavbarForOverlay;

    // Contact options for the floating bubble
    const contactOptions = [
        {
            icon: MessageCircle,
            label: "WhatsApp",
            href: "https://wa.me/8801625027956",
            bgColor: "bg-emerald-600 hover:bg-emerald-700",
            textColor: "text-white"
        },
        {
            icon: Mail,
            label: "Email",
            href: "mailto:contact@jantrasoft.online",
            bgColor: "bg-blue-600 hover:bg-blue-700",
            textColor: "text-white"
        },
        {
            icon: MessageSquare,
            label: "Contact HQ",
            href: "/contact",
            bgColor: "bg-orange-600 hover:bg-orange-700",
            textColor: "text-white"
        }
    ];

    return (
        <>
            {showNav && <Navbar />}
            <div className="relative z-0">
                {children}
            </div>
            {showNav && <Footer />}

            {/* Sticky Floating Contact Action Button (FAB) with dynamic overlay */}
            {showNav && (
                <div className="hidden md:flex fixed bottom-12 right-5 md:bottom-8 md:right-8 z-[150] flex-col items-end gap-3 select-none">
                    
                    {/* Animated Options Menu */}
                    <AnimatePresence>
                        {isOpen && (
                            <div className="flex flex-col items-end gap-2.5 mb-1.5">
                                {contactOptions.map((opt, index) => (
                                    <motion.div
                                        key={opt.label}
                                        initial={{ opacity: 0, y: 15, scale: 0.8 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 15, scale: 0.8 }}
                                        transition={{ 
                                            type: "spring", 
                                            stiffness: 300, 
                                            damping: 22, 
                                            delay: (contactOptions.length - 1 - index) * 0.05 
                                        }}
                                        className="flex items-center gap-3 group/item"
                                    >
                                        {/* Minimal Label */}
                                        <span className="bg-slate-900/90 text-white font-mono text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md shadow-md backdrop-blur-sm pointer-events-none opacity-0 group-hover/item:opacity-100 transition-opacity duration-200">
                                            {opt.label}
                                        </span>
                                        
                                        {/* Round Button */}
                                        {opt.href.startsWith("http") || opt.href.startsWith("mailto") ? (
                                            <a
                                                href={opt.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 active:scale-90 border border-white/10 ${opt.bgColor} ${opt.textColor}`}
                                            >
                                                <opt.icon className="w-4 h-4" />
                                            </a>
                                        ) : (
                                            <Link
                                                href={opt.href}
                                                onClick={() => setIsOpen(false)}
                                                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 active:scale-90 border border-white/10 ${opt.bgColor} ${opt.textColor}`}
                                            >
                                                <opt.icon className="w-4 h-4" />
                                            </Link>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Master FAB Toggle Button */}
                    <motion.button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-xl border border-orange-500/25 transition-all duration-300 relative overflow-hidden group outline-none ${
                            isOpen 
                            ? "bg-slate-950 text-white hover:bg-slate-900" 
                            : "bg-orange-600 text-white hover:bg-slate-950 shadow-orange-600/10 hover:shadow-slate-950/20"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Toggle Quick Contacts"
                    >
                        {/* Pulse effect rings */}
                        {!isOpen && (
                            <>
                                <span className="absolute inset-0 rounded-full bg-orange-600/30 animate-ping pointer-events-none opacity-75" />
                                <span className="absolute inset-0 rounded-full bg-orange-500/10 animate-pulse pointer-events-none" />
                            </>
                        )}

                        <div className="relative w-5 h-5 flex items-center justify-center">
                            {/* Sliding/Rotating Icons */}
                            <motion.div
                                animate={{ rotate: isOpen ? 90 : 0, scale: isOpen ? 0 : 1 }}
                                transition={{ duration: 0.25 }}
                                className="absolute"
                            >
                                <MessageSquare className="w-5 h-5" />
                            </motion.div>
                            
                            <motion.div
                                initial={{ scale: 0, rotate: -90 }}
                                animate={{ rotate: isOpen ? 0 : -90, scale: isOpen ? 1 : 0 }}
                                transition={{ duration: 0.25 }}
                                className="absolute"
                            >
                                <X className="w-5 h-5" />
                            </motion.div>
                        </div>
                    </motion.button>
                </div>
            )}
        </>
    )
}
