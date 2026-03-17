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
        { label: "Architecture", href: "/admin/architecture", icon: Server },
        { label: "Team Management", href: "/admin/team", icon: User },
        { label: "Applications", href: "/admin/careers", icon: Users },
        { label: "Blog Posts", href: "/admin/blog", icon: FileText },
        { label: "Work/Portfolio", href: "/admin/work", icon: Briefcase },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 bottom-0 w-64 glass-panel m-4 rounded-[2.5rem] border-white/40 shadow-xl hidden md:flex md:flex-col z-50">
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

            <nav className="fixed bottom-0 left-0 right-0 
  bg-white border-t border-gray-200 
  flex md:hidden z-50">
                <a href="/admin/dashboard"
                    className="flex-1 flex flex-col items-center 
    justify-center py-3 text-xs text-gray-500 
    hover:text-orange-500">
                    <svg className="w-5 h-5 mb-1" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>Home</span>
                </a>
                <a href="/admin/leads"
                    className="flex-1 flex flex-col items-center 
    justify-center py-3 text-xs text-gray-500 
    hover:text-orange-500">
                    <svg className="w-5 h-5 mb-1" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Leads</span>
                </a>
                <a href="/admin/applications"
                    className="flex-1 flex flex-col items-center 
    justify-center py-3 text-xs text-gray-500 
    hover:text-orange-500">
                    <svg className="w-5 h-5 mb-1" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Apps</span>
                </a>
                <a href="/admin/blog"
                    className="flex-1 flex flex-col items-center 
    justify-center py-3 text-xs text-gray-500 
    hover:text-orange-500">
                    <svg className="w-5 h-5 mb-1" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Blog</span>
                </a>
                <a href="/admin/team"
                    className="flex-1 flex flex-col items-center 
    justify-center py-3 text-xs text-gray-500 
    hover:text-orange-500">
                    <svg className="w-5 h-5 mb-1" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span>Team</span>
                </a>
            </nav>


            {/* Main Content */}
            <main className="flex-1 md:ml-72 p-4 md:p-8 pb-20 md:pb-0">
                <header className="flex md:hidden items-center 
  justify-between px-4 py-3 bg-white 
  border-b sticky top-0 z-40">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-orange-500 rounded-lg" />
                        <span className="font-bold text-sm">JANTRA Admin</span>
                    </div>
                    <a href="/admin/dashboard"
                        className="text-xs text-gray-500">
                        Dashboard
                    </a>
                </header>
                <header className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Welcome Back</h1>
                        <p className="text-sm text-slate-500">{user?.email}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold border-2 border-white shadow-sm uppercase">
                            {user?.email[0]}
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
