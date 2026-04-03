"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Box,
    Users,
    Briefcase,
    FileText,
    LogOut,
    LayoutDashboard,
    Bell,
    User,
    Server
} from "lucide-react";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { logout, user, loading, token } = useAuth();

    React.useEffect(() => {
        if (!loading && !token && pathname !== "/admin/login") {
            router.push("/admin/login");
        }
    }, [loading, token, pathname, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    if (!token) {
        return null; // Will redirect in useEffect
    }

    const menuItems = [
        { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
        { label: "Leads", href: "/admin/leads", icon: Bell },
        { label: "Work Reports", href: "/admin/report", icon: Box },
        { label: "Architecture", href: "/admin/architecture", icon: Server },
        { label: "Team Management", href: "/admin/team", icon: User },
        { label: "Applications", href: "/admin/careers", icon: Users },
        { label: "Blog Posts", href: "/admin/blog", icon: FileText },
        { label: "Work/Portfolio", href: "/admin/work", icon: Briefcase },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50 relative overflow-hidden">
            {/* Cinematic Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />
            
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white/70 backdrop-blur-3xl m-4 rounded-[2.5rem] border border-white/60 shadow-xl hidden md:flex md:flex-col z-50">
                <div className="p-8 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-tr from-orange-500 to-orange-400 rounded-lg shadow-lg" />
                    <h2 className="text-xl font-bold tracking-tight text-slate-800">Admin</h2>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-6 py-4 rounded-3xl transition-all duration-300 font-medium",
                                    isActive
                                        ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                                        : "text-slate-500 hover:bg-orange-50 hover:text-orange-600"
                                )}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/20">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 w-full px-6 py-4 rounded-3xl text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all font-medium"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            <nav className="fixed bottom-3 left-1/2 z-50 flex w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 items-center justify-between rounded-[2rem] border border-white/70 bg-white/85 px-2 py-2 shadow-[0_18px_50px_-18px_rgba(15,23,42,0.45)] backdrop-blur-2xl md:hidden">
                <a href="/admin/dashboard"
                    className={cn(
                        "flex min-w-0 flex-1 flex-col items-center justify-center rounded-[1.4rem] px-2 py-2 text-[10px] font-semibold transition-all",
                        pathname === "/admin/dashboard"
                            ? "bg-slate-900 text-orange-400 shadow-lg shadow-slate-900/20"
                            : "text-gray-500 hover:bg-orange-50 hover:text-orange-500"
                    )}>
                    <svg className="mb-1 h-5 w-5" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>Home</span>
                </a>
                <a href="/admin/leads"
                    className={cn(
                        "flex min-w-0 flex-1 flex-col items-center justify-center rounded-[1.4rem] px-2 py-2 text-[10px] font-semibold transition-all",
                        pathname === "/admin/leads"
                            ? "bg-slate-900 text-orange-400 shadow-lg shadow-slate-900/20"
                            : "text-gray-500 hover:bg-orange-50 hover:text-orange-500"
                    )}>
                    <svg className="mb-1 h-5 w-5" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Leads</span>
                </a>
                <a href="/admin/report"
                    className={cn(
                        "flex min-w-0 flex-1 flex-col items-center justify-center rounded-[1.4rem] px-2 py-2 text-[10px] font-semibold transition-all",
                        pathname === "/admin/report"
                            ? "bg-slate-900 text-orange-400 shadow-lg shadow-slate-900/20"
                            : "text-gray-500 hover:bg-orange-50 hover:text-orange-500"
                    )}>
                    <svg className="mb-1 h-5 w-5" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Reports</span>
                </a>
                <a href="/admin/work"
                    className={cn(
                        "flex min-w-0 flex-1 flex-col items-center justify-center rounded-[1.4rem] px-2 py-2 text-[10px] font-semibold transition-all",
                        pathname === "/admin/work"
                            ? "bg-slate-900 text-orange-400 shadow-lg shadow-slate-900/20"
                            : "text-gray-500 hover:bg-orange-50 hover:text-orange-500"
                    )}>
                    <svg className="mb-1 h-5 w-5" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 7h18M6 7V5a2 2 0 012-2h8a2 2 0 012 2v2m-1 0v11a2 2 0 01-2 2H8a2 2 0 01-2-2V7h10z" />
                    </svg>
                    <span>Work</span>
                </a>
                <a href="/admin/blog"
                    className={cn(
                        "flex min-w-0 flex-1 flex-col items-center justify-center rounded-[1.4rem] px-2 py-2 text-[10px] font-semibold transition-all",
                        pathname === "/admin/blog"
                            ? "bg-slate-900 text-orange-400 shadow-lg shadow-slate-900/20"
                            : "text-gray-500 hover:bg-orange-50 hover:text-orange-500"
                    )}>
                    <svg className="mb-1 h-5 w-5" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Blog</span>
                </a>
            </nav>


            {/* Main Content */}
            <main className="flex-1 md:ml-72 p-4 md:p-8 pb-28 md:pb-0">
                <header className="flex md:hidden items-center justify-between px-4 py-3 bg-white/90 backdrop-blur-xl rounded-[1.25rem] border border-white sticky top-3 z-40 mb-4 shadow-lg shadow-slate-200/40">
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 bg-orange-500 rounded-lg shrink-0" />
                        <span className="font-bold text-sm truncate">JANTRA Admin</span>
                    </div>
                    <a href="/admin/dashboard"
                        className="text-xs text-gray-500 shrink-0">
                        Dashboard
                    </a>
                </header>
                {/* Modernized Global Header */}
                <header className="mb-6 md:mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between bg-white/40 backdrop-blur-3xl p-4 sm:p-6 rounded-[1.75rem] md:rounded-[2rem] border border-white/60 shadow-lg shadow-slate-200/40">
                    <div className="flex items-start sm:items-center gap-4 sm:gap-5 min-w-0">
                        <div className="relative group shrink-0">
                            <div className="absolute inset-0 bg-orange-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white text-lg sm:text-xl font-black shadow-2xl border border-white/10 group-hover:scale-105 transition-transform">
                                {user?.email?.[0].toUpperCase()}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                        </div>
                        <div className="space-y-0.5 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">MISSION CONTROL</h1>
                                <span className="text-[10px] bg-orange-500 text-white px-2 py-0.5 rounded-full font-black tracking-widest">v4.0</span>
                            </div>
                            <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-widest opacity-60 break-all">Welcome Back, <span className="text-slate-900">{user?.email}</span></p>
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center gap-8 pr-4">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ENVIRONMENT</p>
                            <div className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 justify-end">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span>PRODUCTION LIVE</span>
                            </div>
                        </div>
                        <div className="w-px h-10 bg-slate-200" />
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SYSTEM STATUS</p>
                            <p className="text-xs font-bold text-slate-900">ALL SYSTEMS NOMINAL</p>
                        </div>
                    </div>
                </header>

                <section className="animate-fade-up">
                    {children}
                </section>
            </main>
        </div>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <AdminLayoutContent>{children}</AdminLayoutContent>
        </AuthProvider>
    );
}
