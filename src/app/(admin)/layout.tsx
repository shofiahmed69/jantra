"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Bell,
    Briefcase,
    FileText,
    LayoutDashboard,
    Layers,
    LogOut,
    Server,
    ShieldCheck,
    Users,
    UserSquare2,
    DollarSign
} from "lucide-react";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import Logo from "@/components/Logo";

const menuItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Services", href: "/admin/services", icon: Layers },
    { label: "Pricing", href: "/admin/pricing", icon: DollarSign },
    { label: "Leads", href: "/admin/leads", icon: Bell },
    { label: "Reports", href: "/admin/report", icon: ShieldCheck },
    { label: "Architecture", href: "/admin/architecture", icon: Server },
    { label: "Team", href: "/admin/team", icon: UserSquare2 },
    { label: "Careers", href: "/admin/careers", icon: Users },
    { label: "Blog", href: "/admin/blog", icon: FileText },
    { label: "Portfolio", href: "/admin/work", icon: Briefcase }
];

const mobileMenu = [
    { label: "Home", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Leads", href: "/admin/leads", icon: Bell },
    { label: "Reports", href: "/admin/report", icon: ShieldCheck },
    { label: "Work", href: "/admin/work", icon: Briefcase }
];

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
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="h-10 w-10 rounded-full border-4 border-orange-500 border-t-transparent animate-spin" />
            </div>
        );
    }

    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    if (!token) {
        return null;
    }

    return (
        <div className="relative min-h-screen bg-slate-50">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_500px_at_10%_-10%,rgba(249,115,22,0.16),transparent),radial-gradient(900px_460px_at_100%_0%,rgba(148,163,184,0.2),transparent),linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)]" />
            <aside className="fixed left-4 top-4 bottom-4 z-40 hidden w-64 rounded-3xl border border-slate-200/70 bg-white/85 p-4 shadow-xl backdrop-blur md:flex md:flex-col">
                <div className="mb-5 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-900 px-4 py-3 text-white">
                    <Logo className="h-8 w-8" />
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">Jantra Admin</p>
                        <p className="text-[10px] uppercase tracking-[0.16em] text-slate-300">Management</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-1.5">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-orange-50 text-orange-700 ring-1 ring-orange-200"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                )}
                            >
                                <item.icon className="h-4 w-4 shrink-0" />
                                <span className="truncate">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <button
                    onClick={logout}
                    className="mt-3 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </button>
            </aside>

            <main className="relative z-10 pb-24 md:ml-72 md:pb-6">
                <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/88 px-4 py-3 backdrop-blur-xl md:px-6">
                    <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 md:gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                            <Logo className="h-8 w-8" />
                            <div className="min-w-0">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Jantra</p>
                                <h1 className="truncate text-base font-bold text-slate-900 md:text-lg">Admin Dashboard</h1>
                            </div>
                        </div>
                        <div className="flex min-w-0 items-center gap-2" />
                    </div>
                </header>

                <section className="mx-auto max-w-[1400px] px-4 py-4 md:px-6 md:py-5">{children}</section>
            </main>

            <nav className="fixed bottom-3 left-1/2 z-50 flex w-[calc(100%-1.25rem)] max-w-md -translate-x-1/2 rounded-2xl border border-slate-200 bg-white/95 p-1.5 shadow-lg backdrop-blur md:hidden">
                {mobileMenu.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-1 flex-col items-center justify-center rounded-xl py-2 text-[10px] font-semibold transition-colors",
                                isActive ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-100"
                            )}
                        >
                            <item.icon className="mb-1 h-4 w-4" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
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
