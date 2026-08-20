"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { api } from "@/lib/api";
import { useLanguage } from "@/lib/i18n/language-provider";

export default function SettingsPage() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", phone: "", shopName: "", shopAddress: "" });

  useEffect(() => {
    api.get("/api/v1/auth/profile").then((res) => {
      const d = res.data.data;
      setForm({ name: d?.name || "", phone: d?.phone || "", shopName: d?.shopName || "", shopAddress: d?.shopAddress || "" });
    }).catch(() => null);
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.patch("/api/v1/auth/profile", form);
  };

  return (
    <AppShell title={t("settings.title")}>
      <form onSubmit={save} className="card p-5 sm:p-6 w-full max-w-3xl space-y-4">
        <p className="text-2xl sm:text-3xl font-semibold">{t("settings.profile")}</p>
        <input className="input" placeholder={t("settings.ownerName")} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input" placeholder={t("settings.phone")} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input className="input" placeholder={t("settings.shopName")} value={form.shopName} onChange={(e) => setForm({ ...form, shopName: e.target.value })} />
        <textarea className="input" placeholder={t("settings.shopAddress")} value={form.shopAddress} onChange={(e) => setForm({ ...form, shopAddress: e.target.value })} />
        <button className="btn btn-primary text-lg" type="submit">{t("settings.saveSettings")}</button>
      </form>
    </AppShell>
  );
}
