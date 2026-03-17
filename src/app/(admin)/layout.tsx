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
            <aside className="fixed left-0 top-0 bottom-0 w-64 glass-panel m-4 rounded-[2.5rem] border-white/40 shadow-xl hidden lg:flex flex-col z-50">
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

            {/* Mobile Header */}
            <header className="flex lg:hidden items-center justify-between p-4 bg-white border-b sticky top-0 z-40">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg shadow-sm" />
                    <span className="font-bold text-slate-800">JANTRA Admin</span>
                </div>
                <span className="text-sm text-slate-500 font-medium">Dashboard</span>
            </header>

            {/* Mobile Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-50 flex lg:hidden shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                {menuItems.slice(0, 5).map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex-1 flex flex-col items-center py-3 text-[10px] font-bold transition-colors",
                                isActive ? "text-orange-600" : "text-gray-400 hover:text-orange-500"
                            )}
                        >
                            <item.icon className="w-5 h-5 mb-1" />
                            <span>{item.label.split(' ')[0]}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Main Content */}
            <main className="flex-1 lg:ml-72 p-4 md:p-8 pb-24 lg:pb-8">
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
