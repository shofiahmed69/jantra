"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import {
    Users,
    Briefcase,
    FileText,
    Bell,
    TrendingUp,
    Clock,
    ArrowRight,
    Mail,
    MessageSquare,
    X
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface DashboardStats {
    counts: {
        leads: number;
        blogs: number;
        projects: number;
        applications: number;
    };
    recentLeads: any[];
}

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedLead, setSelectedLead] = useState<any | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get("/admin/dashboard-stats");
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const statCards = [
        { label: "New Leads", value: stats?.counts.leads || 0, icon: Bell, color: "text-orange-600", bg: "bg-orange-100" },
        { label: "Applicants", value: stats?.counts.applications || 0, icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
        { label: "Blog Posts", value: stats?.counts.blogs || 0, icon: FileText, color: "text-emerald-600", bg: "bg-emerald-100" },
        { label: "Projects", value: stats?.counts.projects || 0, icon: Briefcase, color: "text-purple-600", bg: "bg-purple-100" },
    ];

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <div key={i} className="glass-panel p-6 rounded-[2rem] border-white/60 shadow-lg hover:translate-y-[-4px] transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shadow-sm`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <TrendingUp className="w-4 h-4 text-slate-300" />
                        </div>
                        <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Leads */}
                <div className="lg:col-span-2 glass-panel p-8 rounded-[2.5rem] border-white/60 shadow-xl">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-slate-800">Recent Signals</h3>
                        <Link href="/admin/leads" className="text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 group">
                            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {stats?.recentLeads.length === 0 ? (
                            <p className="text-slate-400 text-sm text-center py-10">No recent leads found.</p>
                        ) : (
                            stats?.recentLeads.map((lead: any, i: number) => (
                                <div
                                    key={i}
                                    onClick={() => setSelectedLead(lead)}
                                    className="flex items-center justify-between p-4 rounded-3xl bg-white/40 border border-white/60 hover:bg-white/60 transition-colors cursor-pointer group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold uppercase text-xs">
                                            {lead.name[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 text-sm group-hover:text-orange-600 transition-colors">{lead.name}</p>
                                            <p className="text-xs text-slate-500">{lead.service}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">{lead.status}</p>
                                        <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                                            <Clock className="w-3 h-3" />
                                            {new Date(lead.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* System Status / Quick Info */}
                <div className="glass-panel p-8 rounded-[2.5rem] border-white/60 shadow-xl flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 mb-6">System Status</h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500">API Latency</span>
                                <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Stable
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500">Database</span>
                                <span className="text-xs font-bold text-emerald-500">Connected</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500">Email Service</span>
                                <span className="text-xs font-bold text-orange-500">Active</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 p-5 rounded-[1.5rem] bg-slate-900 text-white shadow-xl shadow-slate-200">
                        <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-2">Build Version</p>
                        <h4 className="font-bold text-lg leading-tight">JANTRA <br /> Dashboard v1.0</h4>
                        <p className="text-xs text-slate-400 mt-4 leading-relaxed">Enterprise management interface for real-time operations.</p>
                    </div>
                </div>
            </div>

            {/* Lead Detail Modal */}
            {selectedLead && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div
                        className="glass-panel w-full max-w-2xl rounded-[3rem] p-8 md:p-12 shadow-2xl relative animate-in zoom-in-95 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedLead(null)}
                            className="absolute right-8 top-8 p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="flex flex-col md:flex-row gap-8 mb-10">
                            <div className="w-20 h-20 rounded-3xl bg-orange-100 flex items-center justify-center text-3xl font-bold text-orange-600 shadow-inner">
                                {selectedLead.name[0]}
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h2 className="text-3xl font-bold text-slate-800 tracking-tight">{selectedLead.name}</h2>
                                    <span className="text-[10px] font-bold px-3 py-1 bg-orange-500 text-white rounded-full uppercase tracking-widest">
                                        {selectedLead.status}
                                    </span>
                                </div>
                                <p className="text-slate-500 flex items-center gap-2 font-medium">
                                    <Mail className="w-4 h-4 text-orange-500" /> {selectedLead.email}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                            <div className="p-4 rounded-3xl bg-white/40 border border-white/60">
                                <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">Company</p>
                                <p className="text-sm font-bold text-slate-800">{selectedLead.company || 'N/A'}</p>
                            </div>
                            <div className="p-4 rounded-3xl bg-white/40 border border-white/60">
                                <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">Country</p>
                                <p className="text-sm font-bold text-slate-800">{selectedLead.country || 'N/A'}</p>
                            </div>
                            <div className="p-4 rounded-3xl bg-white/40 border border-white/60">
                                <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">Budget</p>
                                <p className="text-sm font-bold text-orange-600">{selectedLead.budget || 'N/A'}</p>
                            </div>
                        </div>

                        <div className="mb-10">
                            <div className="flex items-center gap-2 mb-4">
                                <MessageSquare className="w-4 h-4 text-orange-500" />
                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Project Description</h3>
                            </div>
                            <div className="p-6 rounded-[2rem] bg-white/60 border border-white shadow-inner min-h-[120px]">
                                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                                    {selectedLead.description}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-white/30">
                            <p className="text-xs text-slate-400 font-medium italic">
                                Signal received on {new Date(selectedLead.createdAt).toLocaleString()}
                                {selectedLead.referral && ` via ${selectedLead.referral}`}
                            </p>
                            <div className="flex gap-3">
                                <a
                                    href={`mailto:${selectedLead.email}`}
                                    className="px-6 py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-orange-600 transition-all shadow-lg active:scale-95 flex items-center justify-center"
                                >
                                    Send Email
                                </a>
                                <Link
                                    href="/admin/leads"
                                    className="px-6 py-3 rounded-2xl bg-white border border-slate-200 text-slate-800 font-bold text-sm hover:bg-orange-50 transition-all shadow-sm active:scale-95 flex items-center justify-center text-center"
                                >
                                    Manage
                                </Link>
                            </div>
                        </div>
                    </div>
                    {/* Backgrop Close Area */}
                    <div className="absolute inset-0 z-[-1]" onClick={() => setSelectedLead(null)} />
                </div>
            )}
        </div>
    );
}
