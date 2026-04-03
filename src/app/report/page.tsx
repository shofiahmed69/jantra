"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useCallback } from "react";
import axios from "axios";
import { ArrowRight, Loader2, Lock, LogOut, Mail, Send, ShieldCheck } from "lucide-react";
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

export default function EmployeeReportPage() {
    const [token, setToken] = useState<string | null>(null);
    const [employee, setEmployee] = useState<EmployeeUser | null>(null);
    const [reports, setReports] = useState<ReportRecord[]>([]);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
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

    const requestConfig = useMemo(() => ({
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
    }), [token]);

    const loadWorkspace = useCallback(async (sessionToken: string) => {
        const authHeaders = { headers: { Authorization: `Bearer ${sessionToken}` } };
        const [meRes, reportsRes] = await Promise.all([
            axios.get(`${apiBaseUrl}/auth/employee/me`, authHeaders),
            axios.get(`${apiBaseUrl}/reports/employee/my`, authHeaders)
        ]);

        setEmployee(meRes.data);
        setReports(reportsRes.data.reports || []);
        localStorage.setItem(EMPLOYEE_USER_KEY, JSON.stringify(meRes.data));
    }, [apiBaseUrl]);

    useEffect(() => {
        const storedToken = localStorage.getItem(EMPLOYEE_TOKEN_KEY);
        const storedUser = localStorage.getItem(EMPLOYEE_USER_KEY);

        if (!storedToken) {
            setLoading(false);
            return;
        }

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
            const response = await axios.post(`${apiBaseUrl}/auth/employee/login`, {
                email,
                password
            });

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
            await axios.post(`${apiBaseUrl}/reports/employee/submit`, formData, requestConfig);
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
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="min-h-screen bg-slate-50 px-6 py-12">
                <div className="mx-auto max-w-md rounded-[2.5rem] border border-white bg-white/80 p-8 shadow-2xl shadow-slate-200/60 backdrop-blur-xl">
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900">Employee Report Portal</h1>
                        <p className="mt-3 text-sm text-slate-500">Sign in with the employee email and password created by admin.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="mb-2 ml-4 block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Employee Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-2xl bg-slate-50 py-4 pl-11 pr-4 text-sm font-semibold text-slate-900 outline-none ring-2 ring-transparent transition focus:ring-orange-300"
                                    placeholder="employee@jantra.com"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="mb-2 ml-4 block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-2xl bg-slate-50 py-4 pl-11 pr-4 text-sm font-semibold text-slate-900 outline-none ring-2 ring-transparent transition focus:ring-orange-300"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loggingIn}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-4 text-sm font-bold text-white transition hover:bg-orange-500 disabled:opacity-60"
                        >
                            {loggingIn ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                            Continue
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 sm:py-10">
            <div className="mx-auto max-w-6xl space-y-6">
                <section className="rounded-[2.5rem] border border-white/70 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.14),_transparent_30%),linear-gradient(135deg,_rgba(15,23,42,0.98),_rgba(30,41,59,0.95))] p-6 text-white shadow-2xl shadow-slate-300/30 sm:p-8">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-orange-200">WorkStream Employee</p>
                            <h1 className="mt-3 text-3xl font-black tracking-tight">{employee.name}</h1>
                            <p className="mt-2 text-sm text-slate-300">
                                {employee.role} · {employee.department}
                                {employee.teamId ? ` · ${employee.teamId}` : ""}
                            </p>
                            <p className="mt-1 text-sm text-slate-400">{employee.email}</p>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/15"
                        >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </button>
                    </div>
                </section>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                    <section className="rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/50 sm:p-8">
                        <div className="mb-6">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Submission Engine</p>
                            <h2 className="mt-2 text-2xl font-black text-slate-900">Create Work Report</h2>
                        </div>

                        <form onSubmit={handleSubmitReport} className="space-y-5">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <label className="space-y-2">
                                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Period</span>
                                    <select
                                        value={formData.periodType}
                                        onChange={(e) => setFormData((current) => ({ ...current, periodType: e.target.value as ReportPeriod }))}
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-900"
                                    >
                                        <option value="DAILY">Daily</option>
                                        <option value="WEEKLY">Weekly</option>
                                        <option value="MONTHLY">Monthly</option>
                                    </select>
                                </label>
                                <label className="space-y-2">
                                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Status</span>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData((current) => ({ ...current, status: e.target.value as "DRAFT" | "SUBMITTED" }))}
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-900"
                                    >
                                        <option value="SUBMITTED">Submit For Review</option>
                                        <option value="DRAFT">Save As Draft</option>
                                    </select>
                                </label>
                            </div>

                            <label className="space-y-2 block">
                                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Report Title</span>
                                <input
                                    value={formData.title}
                                    onChange={(e) => setFormData((current) => ({ ...current, title: e.target.value }))}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-900"
                                    placeholder="Daily Report · Shipping Team"
                                />
                            </label>

                            <label className="space-y-2 block">
                                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Accomplishments</span>
                                <textarea
                                    rows={5}
                                    value={formData.accomplishments}
                                    onChange={(e) => setFormData((current) => ({ ...current, accomplishments: e.target.value }))}
                                    className="w-full resize-none rounded-[1.75rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-900"
                                />
                            </label>

                            <label className="space-y-2 block">
                                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Next Steps</span>
                                <textarea
                                    rows={4}
                                    value={formData.nextSteps}
                                    onChange={(e) => setFormData((current) => ({ ...current, nextSteps: e.target.value }))}
                                    className="w-full resize-none rounded-[1.75rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-900"
                                />
                            </label>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_220px]">
                                <label className="space-y-2 block">
                                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Blockers</span>
                                    <textarea
                                        rows={4}
                                        value={formData.blockers}
                                        onChange={(e) => setFormData((current) => ({ ...current, blockers: e.target.value }))}
                                        className="w-full resize-none rounded-[1.75rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-900"
                                    />
                                </label>
                                <label className="space-y-2 block">
                                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Severity</span>
                                    <select
                                        value={formData.blockerSeverity}
                                        onChange={(e) => setFormData((current) => ({ ...current, blockerSeverity: e.target.value as BlockerSeverity }))}
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-900"
                                    >
                                        <option value="NONE">None</option>
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="CRITICAL">Critical</option>
                                    </select>
                                </label>
                            </div>

                            {error && (
                                <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-4 text-sm font-bold text-white transition hover:bg-orange-500 disabled:opacity-60"
                            >
                                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                {formData.status === "DRAFT" ? "Save Draft" : "Submit Report"}
                            </button>
                        </form>
                    </section>

                    <section className="rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/50 sm:p-8">
                        <div className="mb-6">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">History</p>
                            <h2 className="mt-2 text-2xl font-black text-slate-900">My Reports</h2>
                        </div>

                        <div className="space-y-4">
                            {reports.length === 0 ? (
                                <div className="rounded-[1.75rem] border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm font-medium text-slate-500">
                                    No reports submitted yet.
                                </div>
                            ) : (
                                reports.map((report) => (
                                    <div key={report.id} className="rounded-[1.75rem] border border-slate-200 bg-slate-50/70 p-4">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-white">
                                                {report.periodType}
                                            </span>
                                            <span className={cn(
                                                "rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em]",
                                                report.status === "APPROVED" && "bg-emerald-50 text-emerald-700",
                                                report.status === "SUBMITTED" && "bg-orange-50 text-orange-700",
                                                report.status === "NEEDS_REVISION" && "bg-red-50 text-red-700",
                                                report.status === "DRAFT" && "bg-slate-200 text-slate-700"
                                            )}>
                                                {report.status.replace("_", " ")}
                                            </span>
                                        </div>
                                        <h3 className="mt-3 text-lg font-black text-slate-900">{report.title}</h3>
                                        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                                            {new Date(report.submittedAt || report.createdAt).toLocaleString()}
                                        </p>
                                        {report.feedback && (
                                            <div className="mt-4 rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm text-orange-700">
                                                <span className="font-black uppercase tracking-[0.18em] text-[10px]">Manager Feedback</span>
                                                <p className="mt-2 whitespace-pre-wrap">{report.feedback}</p>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
