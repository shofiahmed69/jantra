"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useLanguage } from "@/lib/i18n/language-provider";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/api/v1/auth/login", { email, password });
      localStorage.setItem("apex_token", res.data.data.token);
      router.push("/dashboard");
    } catch {
      setError(t("invalidLogin"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 safe-area-pb">
      <form onSubmit={onSubmit} className="card w-full max-w-md p-6 sm:p-8 space-y-4">
        <div className="flex flex-col items-center gap-4 pb-2">
          <Image src="/jantra-logo.png" alt="Jantra" width={88} height={88} className="h-[88px] w-[88px] object-contain" priority />
          <h1 className="text-2xl font-bold text-center leading-snug">{t("appName")}</h1>
        </div>
        <div>
          <label className="form-label">{t("email")}</label>
          <input className="input" type="email" name="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="form-label">{t("password")}</label>
          <input className="input" type="password" name="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error ? <p className="text-base text-red-600 font-medium">{error}</p> : null}
        <button className="btn btn-primary w-full text-lg" disabled={loading} type="submit">
          {loading ? t("signingIn") : t("signIn")}
        </button>
      </form>
    </div>
  );
}
