"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { Lock, Mail, Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await api.post("/auth/login", { email, password });
            login(response.data.token, response.data.user);
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || err.response?.data?.message || "Invalid credentials. Please try again.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-50">
            {/* Background Orbs are handled by global layout, but we can add subtle accents if needed */}

            <div className="w-full max-w-md z-10">
                <div className="glass-panel p-8 md:p-12 rounded-[2.5rem] border-white/60 shadow-2xl spatial-hover">
                    <header className="mb-8 text-center">
                        <div className="w-12 h-12 bg-gradient-to-tr from-orange-500 to-orange-400 rounded-2xl mx-auto mb-6 shadow-lg shadow-orange-200" />
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin <span className="text-orange-600">Portal</span></h1>
                        <p className="text-slate-500 text-sm mt-3">Enter your professional signals to proceed.</p>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-slate-400 mb-2 ml-4">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/40 border-0 rounded-2xl pl-12 pr-5 py-4 focus:ring-2 focus:ring-orange-300 placeholder:text-slate-400 text-sm transition-all"
                                    placeholder="admin@jantra.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-slate-400 mb-2 ml-4">Security Key</label>
                            <div className="relative">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/40 border-0 rounded-2xl pl-12 pr-5 py-4 focus:ring-2 focus:ring-orange-300 placeholder:text-slate-400 text-sm transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="text-red-500 text-xs text-center font-medium bg-red-50 py-2 rounded-lg border border-red-100 animate-pulse">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={cn(
                                "w-full bg-slate-900 text-white py-4 rounded-2xl font-bold tracking-wide transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-2",
                                loading ? "opacity-70 cursor-not-allowed" : "hover:bg-orange-600 hover:shadow-orange-200/50"
                            )}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    Secure Access
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <footer className="mt-8 text-center">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">JANTRA Management Systems — v1.0.0</p>
                    </footer>
                </div>
            </div>
        </div>
    );
}
