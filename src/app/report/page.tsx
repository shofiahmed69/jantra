"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
    ArrowRight,
    CheckCircle2,
    Clock3,
    Loader2,
    Lock,
    LogOut,
    Mail,
    Send,
    ShieldCheck,
    Sparkles,
    Target,
    AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";

type ReportStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "NEEDS_REVISION";
type ReportPeriod = "DAILY" | "WEEKLY" | "MONTHLY";
type BlockerSeverity = "NONE" | "LOW" | "MEDIUM" | "CRITICAL";

interface EmployeeUser {
    id: string;
    email: string;
    name: string;
    role: string;
    department: string;
    teamId?: string | null;
}

interface ReportRecord {
    id: string;
    title: string;
    periodType: ReportPeriod;
    status: ReportStatus;
    accomplishments: string;
    nextSteps: string;
    blockers?: string | null;
    blockerSeverity: BlockerSeverity;
    feedback?: string | null;
    submittedAt?: string | null;
    createdAt: string;
}

const EMPLOYEE_TOKEN_KEY = "jantra_employee_token";
const EMPLOYEE_USER_KEY = "jantra_employee_user";

const getEmployeeApiBaseUrl = () => {
    let url = process.env.NEXT_PUBLIC_API_URL;

    if (!url) {
        if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
            url = "https://jontro-backend.onrender.com";
        } else {
            url = "http://localhost:4000";
        }
    }

    return url.endsWith("/api") ? url : `${url}/api`;
};

const statusTone: Record<ReportStatus, string> = {
    APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-100",
    SUBMITTED: "bg-amber-50 text-amber-700 border-amber-100",
    NEEDS_REVISION: "bg-rose-50 text-rose-700 border-rose-100",
    DRAFT: "bg-slate-100 text-slate-600 border-slate-200"
};

const blockerTone: Record<BlockerSeverity, string> = {
    NONE: "bg-slate-100 text-slate-600",
    LOW: "bg-sky-50 text-sky-700",
    MEDIUM: "bg-amber-50 text-amber-700",
    CRITICAL: "bg-rose-50 text-rose-700"
};

export default function EmployeeReportPage() {
    const [token, setToken] = useState<string | null>(null);
    const [employee, setEmployee] = useState<EmployeeUser | null>(null);
    const [reports, setReports] = useState<ReportRecord[]>([]);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [loggingIn, setLoggingIn] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        periodType: "DAILY" as ReportPeriod,
        title: "",
        accomplishments: "",
        nextSteps: "",
        blockers: "",
        blockerSeverity: "NONE" as BlockerSeverity,
        status: "SUBMITTED" as "DRAFT" | "SUBMITTED"
    });

    const apiBaseUrl = useMemo(() => getEmployeeApiBaseUrl(), []);
    const requestConfig = useMemo(
        () => ({ headers: token ? { Authorization: `Bearer ${token}` } : undefined }),
        [token]
    );

    const approvedCount = reports.filter((report) => report.status === "APPROVED").length;
    const revisionCount = reports.filter((report) => report.status === "NEEDS_REVISION").length;
    const currentStreak = reports.filter((report) => report.status !== "DRAFT").length;

    const loadWorkspace = useCallback(async (sessionToken: string) => {
        const authHeaders = { headers: { Authorization: `Bearer ${sessionToken}` } };
        const [meRes, reportsRes] = await Promise.all([
            axios.get(`${apiBaseUrl}/auth/employee/me`, { ...authHeaders, timeout: 8000 }),
            axios.get(`${apiBaseUrl}/reports/employee/my`, { ...authHeaders, timeout: 8000 })
        ]);

        setEmployee(meRes.data);
        setReports(reportsRes.data.reports || []);
        localStorage.setItem(EMPLOYEE_USER_KEY, JSON.stringify(meRes.data));
    }, [apiBaseUrl]);

    useEffect(() => {
        const storedToken = localStorage.getItem(EMPLOYEE_TOKEN_KEY);
        const storedUser = localStorage.getItem(EMPLOYEE_USER_KEY);

        if (!storedToken) {
            return;
        }

        setLoading(true);
        setToken(storedToken);
        if (storedUser) {
            setEmployee(JSON.parse(storedUser));
        }

        loadWorkspace(storedToken)
            .catch(() => {
                localStorage.removeItem(EMPLOYEE_TOKEN_KEY);
                localStorage.removeItem(EMPLOYEE_USER_KEY);
                setToken(null);
                setEmployee(null);
            })
            .finally(() => setLoading(false));
    }, [loadWorkspace]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoggingIn(true);
        setError("");

        try {
            const response = await axios.post(`${apiBaseUrl}/auth/employee/login`, { email, password }, { timeout: 8000 });
            const nextToken = response.data.token;
            setToken(nextToken);
            localStorage.setItem(EMPLOYEE_TOKEN_KEY, nextToken);
            await loadWorkspace(nextToken);
            setPassword("");
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError((err.response?.data as { error?: string } | undefined)?.error || "Login failed");
            } else {
                setError("Login failed");
            }
        } finally {
            setLoggingIn(false);
            setLoading(false);
        }
    };

    const handleLogout = () => {
        setToken(null);
        setEmployee(null);
        setReports([]);
        localStorage.removeItem(EMPLOYEE_TOKEN_KEY);
        localStorage.removeItem(EMPLOYEE_USER_KEY);
    };

    const handleSubmitReport = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        setSubmitting(true);
        setError("");

        try {
            await axios.post(`${apiBaseUrl}/reports/employee/submit`, formData, { ...requestConfig, timeout: 8000 });
            setFormData({
                periodType: "DAILY",
                title: "",
                accomplishments: "",
                nextSteps: "",
                blockers: "",
                blockerSeverity: "NONE",
                status: "SUBMITTED"
            });
            await loadWorkspace(token);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError((err.response?.data as { error?: string } | undefined)?.error || "Failed to submit report");
            } else {
                setError("Failed to submit report");
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f5f1e8]">
                <Loader2 className="h-10 w-10 animate-spin text-[#b85c38]" />
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="min-h-screen overflow-hidden bg-[#f5f1e8] text-slate-900">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(184,92,56,0.16),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(23,37,84,0.12),_transparent_32%)]" />
                <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-6 py-10">
                    <div className="grid w-full gap-10 lg:grid-cols-[1.15fr_0.85fr]">
                        <section className="flex flex-col justify-between rounded-[2.75rem] border border-[#e7d8bf] bg-[#1d2433] p-8 text-white shadow-[0_30px_80px_-40px_rgba(15,23,42,0.8)] sm:p-10">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.35em] text-[#f0c88c]">
                                    <Sparkles className="h-4 w-4" />
                                    Workstream
                                </div>
                                <h1 className="mt-6 max-w-xl font-[var(--font-heading)] text-5xl font-black leading-[0.92] tracking-tight text-[#fff8ef] sm:text-6xl">
                                    Daily reporting, without the corporate sludge.
                                </h1>
                                <p className="mt-6 max-w-lg text-base leading-relaxed text-slate-300">
                                    Sign in with the employee account created by admin, ship your update, and let leadership handle review inside the admin console.
                                </p>
                            </div>

                            <div className="mt-10 grid gap-4 sm:grid-cols-3">
                                {[
                                    { label: "Flow", value: "Daily / Weekly / Monthly" },
                                    { label: "Status", value: "Draft or Submit" },
                                    { label: "Review", value: "Admin governed" }
                                ].map((item) => (
                                    <div key={item.label} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{item.label}</p>
                                        <p className="mt-3 text-sm font-bold text-white">{item.value}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="rounded-[2.75rem] border border-[#eadcc5] bg-[linear-gradient(180deg,rgba(255,252,245,0.92),rgba(253,248,239,0.98))] p-8 shadow-[0_35px_90px_-50px_rgba(100,60,35,0.45)] backdrop-blur-xl sm:p-10">
                            <div className="mb-8">
                                <div className="flex h-14 w-14 items-center justify-center rounded-[1.5rem] bg-[#b85c38] text-white shadow-lg shadow-[#b85c38]/25">
                                    <ShieldCheck className="h-6 w-6" />
                                </div>
                                <h2 className="mt-6 font-[var(--font-heading)] text-3xl font-black tracking-tight text-slate-900">Employee access</h2>
                                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                                    Use the employee work email and password configured by admin in Team Management.
                                </p>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-5">
                                <label className="block space-y-2">
                                    <span className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Work Email</span>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full rounded-[1.4rem] border border-[#e8dcc6] bg-white/80 py-4 pl-12 pr-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#b85c38] focus:ring-2 focus:ring-[#b85c38]/15"
                                            placeholder="employee@jantra.com"
                                        />
                                    </div>
                                </label>

                                <label className="block space-y-2">
                                    <span className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Password</span>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full rounded-[1.4rem] border border-[#e8dcc6] bg-white/80 py-4 pl-12 pr-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#b85c38] focus:ring-2 focus:ring-[#b85c38]/15"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </label>

                                {error && (
                                    <div className="rounded-[1.4rem] border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loggingIn}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-[1.4rem] bg-[#1d2433] px-5 py-4 text-sm font-bold text-white transition hover:bg-[#b85c38] disabled:opacity-60"
                                >
                                    {loggingIn ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                                    Enter Portal
                                </button>
                            </form>
                        </section>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f5f1e8] text-slate-900">
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(184,92,56,0.12),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(29,36,51,0.08),_transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.2),transparent_60%)]" />
            <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
                <section className="overflow-hidden rounded-[2.9rem] border border-[#e5d8c4] bg-[linear-gradient(135deg,#1d2433_0%,#283246_46%,#b85c38_160%)] px-6 py-7 text-white shadow-[0_30px_90px_-45px_rgba(15,23,42,0.9)] sm:px-8 sm:py-9">
                    <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-[10px] font-black uppercase tracking-[0.34em] text-[#f0c88c]">
                                <Sparkles className="h-4 w-4" />
                                Employee Reporting Deck
                            </div>
                            <h1 className="mt-5 max-w-3xl font-[var(--font-heading)] text-4xl font-black leading-[0.95] tracking-tight text-[#fff8ef] sm:text-5xl">
                                {employee.name}, deliver the signal. Admin governs the outcome.
                            </h1>
                            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
                                This page is isolated to employee reporting only. Submit progress, blockers, and next steps here. Reviews and revisions stay inside the admin dashboard.
                            </p>
                        </div>

                        <div className="grid gap-3 self-start">
                            <div className="rounded-[1.7rem] border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
                                <p className="text-[10px] font-black uppercase tracking-[0.26em] text-slate-400">Identity</p>
                                <p className="mt-2 text-lg font-black text-white">{employee.role}</p>
                                <p className="mt-1 text-sm text-slate-300">{employee.department}{employee.teamId ? ` · ${employee.teamId}` : ""}</p>
                                <p className="mt-2 text-xs text-slate-400">{employee.email}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center justify-center gap-2 rounded-[1.4rem] border border-white/10 bg-white/8 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/14"
                            >
                                <LogOut className="h-4 w-4" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </section>

                <section className="mt-6 grid gap-4 md:grid-cols-3">
                    {[
                        { label: "Approved", value: approvedCount, icon: CheckCircle2, tone: "from-emerald-100 to-white text-emerald-700" },
                        { label: "Needs Revision", value: revisionCount, icon: AlertTriangle, tone: "from-rose-100 to-white text-rose-700" },
                        { label: "Submission Volume", value: currentStreak, icon: Target, tone: "from-amber-100 to-white text-amber-700" }
                    ].map((card) => (
                        <div key={card.label} className={cn("rounded-[2rem] border border-[#eadcc6] bg-gradient-to-br p-5 shadow-[0_24px_60px_-40px_rgba(120,80,40,0.35)]", card.tone)}>
                            <div className="flex items-center justify-between">
                                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">{card.label}</p>
                                <card.icon className="h-5 w-5" />
                            </div>
                            <p className="mt-6 font-[var(--font-heading)] text-4xl font-black tracking-tight text-slate-900">{card.value}</p>
                        </div>
                    ))}
                </section>

                <section className="mt-6 grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
                    <section className="rounded-[2.7rem] border border-[#eadcc6] bg-[linear-gradient(180deg,rgba(255,253,248,0.92),rgba(253,248,239,0.98))] p-6 shadow-[0_28px_80px_-50px_rgba(120,80,40,0.4)] sm:p-8">
                        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.32em] text-slate-400">Submission Engine</p>
                                <h2 className="mt-3 font-[var(--font-heading)] text-3xl font-black tracking-tight text-slate-900">Craft today’s work report</h2>
                            </div>
                            <div className="rounded-full border border-[#e8dbc5] bg-white/80 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-[#b85c38]">
                                Employee-only workspace
                            </div>
                        </div>

                        <form onSubmit={handleSubmitReport} className="space-y-5">
                            <div className="grid gap-4 md:grid-cols-3">
                                <label className="space-y-2">
                                    <span className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Cycle</span>
                                    <select
                                        value={formData.periodType}
                                        onChange={(e) => setFormData((current) => ({ ...current, periodType: e.target.value as ReportPeriod }))}
                                        className="w-full rounded-[1.35rem] border border-[#e8dcc6] bg-white/85 px-4 py-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#b85c38] focus:ring-2 focus:ring-[#b85c38]/15"
                                    >
                                        <option value="DAILY">Daily</option>
                                        <option value="WEEKLY">Weekly</option>
                                        <option value="MONTHLY">Monthly</option>
                                    </select>
                                </label>
                                <label className="space-y-2">
                                    <span className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Delivery</span>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData((current) => ({ ...current, status: e.target.value as "DRAFT" | "SUBMITTED" }))}
                                        className="w-full rounded-[1.35rem] border border-[#e8dcc6] bg-white/85 px-4 py-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#b85c38] focus:ring-2 focus:ring-[#b85c38]/15"
                                    >
                                        <option value="SUBMITTED">Submit For Review</option>
                                        <option value="DRAFT">Save As Draft</option>
                                    </select>
                                </label>
                                <label className="space-y-2">
                                    <span className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Blocker Level</span>
                                    <select
                                        value={formData.blockerSeverity}
                                        onChange={(e) => setFormData((current) => ({ ...current, blockerSeverity: e.target.value as BlockerSeverity }))}
                                        className="w-full rounded-[1.35rem] border border-[#e8dcc6] bg-white/85 px-4 py-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#b85c38] focus:ring-2 focus:ring-[#b85c38]/15"
                                    >
                                        <option value="NONE">None</option>
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="CRITICAL">Critical</option>
                                    </select>
                                </label>
                            </div>

                            <label className="block space-y-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Report Title</span>
                                <input
                                    value={formData.title}
                                    onChange={(e) => setFormData((current) => ({ ...current, title: e.target.value }))}
                                    className="w-full rounded-[1.45rem] border border-[#e8dcc6] bg-white/85 px-4 py-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#b85c38] focus:ring-2 focus:ring-[#b85c38]/15"
                                    placeholder="Weekly Report · API stabilization"
                                />
                            </label>

                            <div className="grid gap-4">
                                <label className="block space-y-2">
                                    <span className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Accomplishments</span>
                                    <textarea
                                        rows={5}
                                        value={formData.accomplishments}
                                        onChange={(e) => setFormData((current) => ({ ...current, accomplishments: e.target.value }))}
                                        className="w-full resize-none rounded-[1.7rem] border border-[#e8dcc6] bg-white/85 px-4 py-4 text-sm font-medium text-slate-900 outline-none transition focus:border-[#b85c38] focus:ring-2 focus:ring-[#b85c38]/15"
                                        placeholder="What shipped, what moved, what got closed."
                                    />
                                </label>

                                <label className="block space-y-2">
                                    <span className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Next Steps</span>
                                    <textarea
                                        rows={4}
                                        value={formData.nextSteps}
                                        onChange={(e) => setFormData((current) => ({ ...current, nextSteps: e.target.value }))}
                                        className="w-full resize-none rounded-[1.7rem] border border-[#e8dcc6] bg-white/85 px-4 py-4 text-sm font-medium text-slate-900 outline-none transition focus:border-[#b85c38] focus:ring-2 focus:ring-[#b85c38]/15"
                                        placeholder="What you will do next, in direct terms."
                                    />
                                </label>

                                <label className="block space-y-2">
                                    <span className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Blockers</span>
                                    <textarea
                                        rows={4}
                                        value={formData.blockers}
                                        onChange={(e) => setFormData((current) => ({ ...current, blockers: e.target.value }))}
                                        className="w-full resize-none rounded-[1.7rem] border border-[#e8dcc6] bg-white/85 px-4 py-4 text-sm font-medium text-slate-900 outline-none transition focus:border-[#b85c38] focus:ring-2 focus:ring-[#b85c38]/15"
                                        placeholder="Dependencies, missing access, external delays, production risks."
                                    />
                                </label>
                            </div>

                            {error && (
                                <div className="rounded-[1.5rem] border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="inline-flex items-center justify-center gap-2 rounded-[1.45rem] bg-[#1d2433] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#b85c38] disabled:opacity-60"
                            >
                                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                {formData.status === "DRAFT" ? "Save Draft" : "Submit Report"}
                            </button>
                        </form>
                    </section>

                    <section className="space-y-6">
                        <section className="rounded-[2.7rem] border border-[#eadcc6] bg-white/85 p-6 shadow-[0_28px_80px_-55px_rgba(120,80,40,0.38)] backdrop-blur-xl sm:p-8">
                            <p className="text-[10px] font-black uppercase tracking-[0.32em] text-slate-400">Recent Activity</p>
                            <h2 className="mt-3 font-[var(--font-heading)] text-3xl font-black tracking-tight text-slate-900">Report history</h2>

                            <div className="mt-6 space-y-4">
                                {reports.length === 0 ? (
                                    <div className="rounded-[1.8rem] border border-dashed border-[#e5d8c4] bg-[#fcfaf5] px-5 py-10 text-center text-sm font-medium text-slate-500">
                                        No reports submitted yet.
                                    </div>
                                ) : (
                                    reports.map((report) => (
                                        <article key={report.id} className="rounded-[1.9rem] border border-[#ece1cf] bg-[#fcfaf6] p-5">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="rounded-full bg-[#1d2433] px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-white">
                                                    {report.periodType}
                                                </span>
                                                <span className={cn("rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em]", statusTone[report.status])}>
                                                    {report.status.replace("_", " ")}
                                                </span>
                                                <span className={cn("rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em]", blockerTone[report.blockerSeverity])}>
                                                    {report.blockerSeverity}
                                                </span>
                                            </div>
                                            <h3 className="mt-4 text-lg font-black text-slate-900">{report.title}</h3>
                                            <div className="mt-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                                                <Clock3 className="h-3.5 w-3.5" />
                                                {new Date(report.submittedAt || report.createdAt).toLocaleString()}
                                            </div>
                                            {report.feedback && (
                                                <div className="mt-4 rounded-[1.3rem] border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                                                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-700">Manager Feedback</p>
                                                    <p className="mt-2 whitespace-pre-wrap leading-relaxed">{report.feedback}</p>
                                                </div>
                                            )}
                                        </article>
                                    ))
                                )}
                            </div>
                        </section>
                    </section>
                </section>
            </div>
        </div>
    );
}
