"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import {
    ArrowRight,
    Bell,
    Briefcase,
    Clock3,
    FileText,
    Mail,
    MessageSquare,
    ShieldAlert,
    Users,
    X
} from "lucide-react";

interface DashboardStats {
    counts: {
        leads: number;
        blogs: number;
        projects: number;
        applications: number;
        reports: number;
    };
    recentLeads: LeadRecord[];
    recentReports: ReportSummary[];
    reportAnalytics: {
        summary: {
            pendingReports: number;
            criticalBlockers: number;
        };
        organizationHealth: {
            complianceRate: number;
            averageApprovalHours: number;
        };
    };
}

interface LeadRecord {
    id: string;
    name: string;
    email: string;
    service: string;
    status: string;
    company?: string | null;
    country?: string | null;
    budget?: string | null;
    description: string;
    referral?: string | null;
    createdAt: string;
}

interface ReportSummary {
    id: string;
    title: string;
    status: string;
    createdAt: string;
}

const statusLabel = (status: string) => status.replaceAll("_", " ");

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedLead, setSelectedLead] = useState<LeadRecord | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get("/admin/dashboard-stats");
                setStats(response.data);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex h-56 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
            </div>
        );
    }

    const statCards = [
        { label: "Leads", value: stats?.counts.leads || 0, icon: Bell, tone: "bg-orange-50 text-orange-700" },
        { label: "Applicants", value: stats?.counts.applications || 0, icon: Users, tone: "bg-sky-50 text-sky-700" },
        { label: "Blogs", value: stats?.counts.blogs || 0, icon: FileText, tone: "bg-amber-50 text-amber-700" },
        { label: "Projects", value: stats?.counts.projects || 0, icon: Briefcase, tone: "bg-violet-50 text-violet-700" },
        { label: "Reports", value: stats?.counts.reports || 0, icon: ShieldAlert, tone: "bg-slate-100 text-slate-700" }
    ];

    return (
        <div className="space-y-4">
            <section className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm md:px-5">
                <h2 className="text-xl font-bold text-slate-900 md:text-2xl">Dashboard</h2>
                <p className="mt-1 text-sm text-slate-500">Overview of leads, projects, hiring, and report activity.</p>
            </section>

            <section className="grid grid-cols-2 gap-3 lg:grid-cols-5">
                {statCards.map((stat) => (
                    <article key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className={`rounded-xl p-2 ${stat.tone}`}>
                                <stat.icon className="h-4 w-4" />
                            </div>
                            <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400">Total</span>
                        </div>
                        <p className="mt-4 text-2xl font-bold text-slate-900">{stat.value}</p>
                        <p className="text-xs font-medium text-slate-500">{stat.label}</p>
                    </article>
                ))}
            </section>

            <section className="grid gap-4 lg:grid-cols-3">
                <article className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-semibold text-slate-900">Recent Leads</h3>
                            <p className="text-xs text-slate-500">Click any row to inspect full details.</p>
                        </div>
                        <Link href="/admin/leads" className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                            All Leads
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    <div className="space-y-2">
                        {stats?.recentLeads.length ? (
                            stats.recentLeads.map((lead) => (
                                <button
                                    key={lead.id}
                                    onClick={() => setSelectedLead(lead)}
                                    className="flex w-full flex-col gap-2 rounded-xl border border-slate-200 p-3 text-left transition hover:border-orange-300 hover:bg-orange-50/40 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-slate-900">{lead.name}</p>
                                        <p className="truncate text-xs text-slate-500">{lead.service || "General"}</p>
                                    </div>
                                    <div className="flex items-center gap-2 sm:justify-end">
                                        <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-700">
                                            {statusLabel(lead.status)}
                                        </span>
                                        <span className="text-xs text-slate-400">{new Date(lead.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                                No leads yet.
                            </div>
                        )}
                    </div>
                </article>

                <article className="rounded-2xl border border-slate-200 bg-slate-900 p-4 text-slate-100 shadow-sm">
                    <h3 className="text-base font-semibold">Operational Health</h3>
                    <p className="mt-1 text-xs text-slate-300">Current reporting and approval performance.</p>
                    <div className="mt-4 space-y-2.5">
                        <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2.5">
                            <span className="text-xs text-slate-300">Pending Reports</span>
                            <span className="text-sm font-semibold">{stats?.reportAnalytics?.summary.pendingReports || 0}</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2.5">
                            <span className="text-xs text-slate-300">Critical Blockers</span>
                            <span className="text-sm font-semibold">{stats?.reportAnalytics?.summary.criticalBlockers || 0}</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2.5">
                            <span className="text-xs text-slate-300">Compliance</span>
                            <span className="text-sm font-semibold">{stats?.reportAnalytics?.organizationHealth.complianceRate || 0}%</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2.5">
                            <span className="text-xs text-slate-300">Avg Approval</span>
                            <span className="text-sm font-semibold">{stats?.reportAnalytics?.organizationHealth.averageApprovalHours || 0}h</span>
                        </div>
                    </div>
                    <Link href="/admin/report" className="mt-4 inline-flex items-center gap-1 rounded-lg bg-orange-500 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-600">
                        Open Reports
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </article>
            </section>

            {selectedLead && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-3 backdrop-blur-sm">
                    <div className="relative max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl md:p-6">
                        <button
                            onClick={() => setSelectedLead(null)}
                            className="absolute right-3 top-3 rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <div className="mb-5">
                            <h3 className="text-xl font-bold text-slate-900">{selectedLead.name}</h3>
                            <p className="mt-1 inline-flex items-center gap-1 text-sm text-slate-600">
                                <Mail className="h-4 w-4 text-orange-500" />
                                {selectedLead.email}
                            </p>
                        </div>
                        <div className="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                                <p className="text-[10px] uppercase tracking-wide text-slate-500">Company</p>
                                <p className="mt-1 text-sm font-medium text-slate-800">{selectedLead.company || "N/A"}</p>
                            </div>
                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                                <p className="text-[10px] uppercase tracking-wide text-slate-500">Country</p>
                                <p className="mt-1 text-sm font-medium text-slate-800">{selectedLead.country || "N/A"}</p>
                            </div>
                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                                <p className="text-[10px] uppercase tracking-wide text-slate-500">Budget</p>
                                <p className="mt-1 text-sm font-medium text-slate-800">{selectedLead.budget || "N/A"}</p>
                            </div>
                        </div>
                        <div className="rounded-xl border border-slate-200 p-4">
                            <p className="mb-2 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                                <MessageSquare className="h-3.5 w-3.5 text-orange-500" />
                                Description
                            </p>
                            <p className="whitespace-pre-wrap text-sm text-slate-700">{selectedLead.description}</p>
                        </div>
                        <div className="mt-5 flex flex-col justify-between gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center">
                            <p className="inline-flex items-center gap-1 text-xs text-slate-500">
                                <Clock3 className="h-3.5 w-3.5" />
                                {new Date(selectedLead.createdAt).toLocaleString()}
                            </p>
                            <div className="flex gap-2">
                                <a
                                    href={`mailto:${selectedLead.email}`}
                                    className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700"
                                >
                                    Email
                                </a>
                                <Link
                                    href="/admin/leads"
                                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    Manage
                                </Link>
                            </div>
                        </div>
                    </div>
                    <button
                        aria-label="Close modal"
                        onClick={() => setSelectedLead(null)}
                        className="absolute inset-0 -z-10 cursor-default"
                    />
                </div>
            )}
        </div>
    );
}
