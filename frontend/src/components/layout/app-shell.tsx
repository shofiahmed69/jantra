"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { LayoutDashboard, ShoppingCart, Package, Warehouse, ReceiptText, Wallet, Users, Truck, Barcode, ChartColumn, Settings } from "lucide-react";

const nav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "POS Billing", href: "/pos", icon: ShoppingCart },
  { label: "Products", href: "/products", icon: Package },
  { label: "Inventory", href: "/inventory", icon: Warehouse },
  { label: "Sales", href: "/sales", icon: ReceiptText },
  { label: "Expenses", href: "/expenses", icon: Wallet },
  { label: "Suppliers", href: "/suppliers", icon: Users },
  { label: "Purchases", href: "/purchases", icon: Truck },
  { label: "Barcodes", href: "/barcodes", icon: Barcode },
  { label: "Reports", href: "/reports", icon: ChartColumn },
  { label: "Settings", href: "/settings", icon: Settings },
] as const;

export function AppShell({ children }: { title?: string; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const onLogout = () => {
    localStorage.removeItem("apex_token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex bg-[#f2f4f8] text-slate-800">
      <aside className="w-[290px] bg-white border-r border-[#ebeef3] flex flex-col">
        <div className="px-6 pt-7 pb-4 border-b border-[#f0f2f6]">
          <div className="flex items-center gap-3">
            <Image src="/jantra-logo.png" alt="Jantra" width={48} height={48} className="h-12 w-12 object-contain" priority />
            <h1 className="text-lg font-bold tracking-tight text-[#1f3b65] leading-tight">Jantra Pharmacy Management</h1>
          </div>
        </div>

        <nav className="px-3 py-4 space-y-1.5 flex-1 overflow-auto">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[28px] md:text-[18px] leading-none transition ${active ? "bg-[#f8efe2] text-[#d97706] font-semibold" : "text-[#334e73] hover:bg-[#f7f9fc]"}`}
              >
                <Icon className={`h-5 w-5 ${active ? "text-[#f97316]" : "text-[#5f7494]"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-5 border-t border-[#edf1f6] bg-[#fafbfc]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#f97316] text-white font-bold grid place-items-center">SA</div>
            <div>
              <p className="text-sm font-bold text-[#1f3b65]">Super Admin</p>
              <p className="text-[11px] text-[#8da1be]">SUPER ADMIN</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-[#e7ebf1] px-6 flex items-center justify-between">
          <div className="text-2xl font-semibold text-[#1b355b]">Jantra Pharmacy Management</div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-sm bg-[#efe8da] text-[#5e5141]">Admin</span>
            <button type="button" onClick={onLogout} className="btn btn-outline !rounded-xl">Log out</button>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
