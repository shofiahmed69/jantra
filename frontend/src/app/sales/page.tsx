"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { api } from "@/lib/api";
import { formatBDT } from "@/lib/currency";
import { ResponsiveTable } from "@/components/ui/responsive-table";
import { useLanguage } from "@/lib/i18n/language-provider";

type Sale = { id: string; invoiceNumber: string; saleDate: string; totalAmount: string; status: string; paymentMethod: string };
type Report = { transactionCount: number; totalSales: number };

export default function SalesPage() {
  const { t } = useLanguage();
  const [sales, setSales] = useState<Sale[]>([]);
  const [daily, setDaily] = useState<Report | null>(null);
  const [monthly, setMonthly] = useState<Report | null>(null);

  const load = async () => {
    const [s, d, m] = await Promise.all([
      api.get("/api/v1/sales"),
      api.get("/api/v1/sales/reports/daily"),
      api.get("/api/v1/sales/reports/monthly"),
    ]);
    setSales(s.data.data);
    setDaily(d.data.data);
    setMonthly(m.data.data);
  };

  useEffect(() => { load(); }, []);

  const cancel = async (id: string) => { await api.post(`/api/v1/sales/${id}/cancel`); await load(); };

  return (
    <AppShell title={t("sales.title")}>
      <div className="kpi-grid kpi-grid-2 mb-4">
        <div className="kpi-card"><p className="kpi-label">{t("sales.todaySales")}</p><p className="kpi-value">{formatBDT(daily?.totalSales || 0)}</p><p className="text-base text-slate-500">{t("sales.txns")}: {daily?.transactionCount || 0}</p></div>
        <div className="kpi-card"><p className="kpi-label">{t("sales.monthlySales")}</p><p className="kpi-value">{formatBDT(monthly?.totalSales || 0)}</p><p className="text-base text-slate-500">{t("sales.txns")}: {monthly?.transactionCount || 0}</p></div>
      </div>
      <ResponsiveTable
        rows={sales}
        rowKey={(s) => s.id}
        columns={[
          { key: "invoice", header: t("invoice"), cell: (s) => <span className="font-medium break-all">{s.invoiceNumber}</span> },
          { key: "date", header: t("date"), cell: (s) => new Date(s.saleDate).toLocaleString() },
          { key: "payment", header: t("payment"), cell: (s) => s.paymentMethod },
          { key: "total", header: t("total"), cell: (s) => formatBDT(Number(s.totalAmount)) },
          {
            key: "status",
            header: t("status"),
            cell: (s) => <span className={`status-pill ${s.status === "completed" ? "status-ok" : "status-bad"}`}>{s.status === "completed" ? t("sales.completed") : s.status}</span>,
          },
          {
            key: "action",
            header: t("actions"),
            align: "right",
            cell: (s) =>
              s.status === "completed" ? (
                <button type="button" className="btn btn-outline !min-h-10 text-sm sm:text-base" onClick={() => cancel(s.id)}>
                  {t("sales.cancelSale")}
                </button>
              ) : (
                "-"
              ),
          },
        ]}
      />
    </AppShell>
  );
}
