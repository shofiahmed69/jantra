"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { LayoutDashboard, ShoppingCart, Package, Warehouse, ReceiptText, Wallet, Users, Truck, Barcode, ChartColumn, Settings, Menu, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-provider";
import type { Locale } from "@/lib/i18n/translations";

const navKeys = [
  { key: "nav.dashboard", href: "/dashboard", icon: LayoutDashboard },
  { key: "nav.pos", href: "/pos", icon: ShoppingCart },
  { key: "nav.products", href: "/products", icon: Package },
  { key: "nav.inventory", href: "/inventory", icon: Warehouse },
  { key: "nav.sales", href: "/sales", icon: ReceiptText },
  { key: "nav.expenses", href: "/expenses", icon: Wallet },
  { key: "nav.suppliers", href: "/suppliers", icon: Users },
  { key: "nav.purchases", href: "/purchases", icon: Truck },
  { key: "nav.barcodes", href: "/barcodes", icon: Barcode },
  { key: "nav.reports", href: "/reports", icon: ChartColumn },
  { key: "nav.settings", href: "/settings", icon: Settings },
] as const;

export function AppShell({ children }: { title?: string; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { locale, setLocale, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const onLogout = () => {
    localStorage.removeItem("apex_token");
    router.push("/login");
  };

  const langSelect = (
    <select
      className="lang-select w-full"
      value={locale}
      onChange={(e) => setLocale(e.target.value as Locale)}
      aria-label={t("language")}
    >
      <option value="en">{t("english")}</option>
      <option value="bn">{t("bangla")}</option>
    </select>
  );

  const sidebar = (
    <>
      <div className="px-4 pt-5 pb-4 border-b border-[#f0f2f6] flex items-center justify-between gap-2 lg:block">
        <div className="flex items-center gap-3 min-w-0">
          <Image src="/jantra-logo.png" alt="Jantra" width={48} height={48} className="h-12 w-12 shrink-0 object-contain" priority />
          <h1 className="text-base font-bold tracking-tight text-[#1f3b65] leading-snug">{t("appName")}</h1>
        </div>
        <button type="button" className="lg:hidden icon-btn btn-outline shrink-0" aria-label={t("close")} onClick={() => setMenuOpen(false)}>
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="px-3 py-2 lg:hidden">{langSelect}</div>

      <nav className="px-2 py-3 space-y-1 flex-1 overflow-y-auto">
        {navKeys.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-lg transition ${active ? "bg-[#f8efe2] text-[#d97706] font-semibold" : "text-[#334e73] hover:bg-[#f7f9fc]"}`}
            >
              <Icon className={`h-6 w-6 shrink-0 ${active ? "text-[#f97316]" : "text-[#5f7494]"}`} />
              <span>{t(item.key)}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#edf1f6] bg-[#fafbfc] space-y-3">
        <div className="hidden lg:block">{langSelect}</div>
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-[#f97316] text-white text-base font-bold grid place-items-center shrink-0">A</div>
          <div className="min-w-0">
            <p className="text-base font-bold text-[#1f3b65] truncate">{t("admin")}</p>
            <p className="text-sm text-[#8da1be]">{t("administrator")}</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-[#f2f4f8] text-slate-800">
      {menuOpen ? (
        <button type="button" className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden" aria-label={t("close")} onClick={() => setMenuOpen(false)} />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[min(300px,92vw)] bg-white border-r border-[#ebeef3] flex flex-col transition-transform duration-200 ease-out lg:static lg:z-auto lg:w-[280px] lg:translate-x-0 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebar}
      </aside>

      <div className="flex-1 flex flex-col min-w-0 w-full">
        <header className="sticky top-0 z-30 bg-white border-b border-[#e7ebf1] px-3 sm:px-5 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <button type="button" className="lg:hidden icon-btn btn-outline shrink-0" aria-label="Menu" onClick={() => setMenuOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <p className="text-lg sm:text-2xl font-semibold text-[#1b355b] truncate">{t("appNameShort")}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <select
              className="lang-select hidden sm:block"
              value={locale}
              onChange={(e) => setLocale(e.target.value as Locale)}
              aria-label={t("language")}
            >
              <option value="en">{t("english")}</option>
              <option value="bn">{t("bangla")}</option>
            </select>
            <span className="hidden md:inline px-3 py-1.5 rounded-full text-sm font-semibold bg-[#efe8da] text-[#5e5141]">{t("admin")}</span>
            <button type="button" onClick={onLogout} className="btn btn-outline !rounded-xl !px-3 !text-sm sm:!text-base">
              {t("logout")}
            </button>
          </div>
        </header>
        <main className="p-3 sm:p-5 lg:p-6 pb-8">{children}</main>
      </div>
    </div>
  );
}
