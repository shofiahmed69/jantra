"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { api } from "@/lib/api";
import { formatBDT } from "@/lib/currency";
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { ResponsiveTable } from "@/components/ui/responsive-table";
import { useLanguage } from "@/lib/i18n/language-provider";

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type SalesItem = { id: string; invoiceNumber: string; saleDate: string; totalAmount: string; paymentMethod: string };

export default function ReportsPage() {
  const { t } = useLanguage();
  const [salesItems, setSalesItems] = useState<SalesItem[]>([]);
  const [summary, setSummary] = useState({ sales: 0, inventory: 0, netProfit: 0, expenses: 0, expiry: 0 });
  const [exporting, setExporting] = useState<string | null>(null);

  const downloadExport = async (format: "pdf" | "excel" | "csv") => {
    setExporting(format);
    try {
      const res = await api.get(`/api/v1/reports/sales/export/${format}`, { responseType: "blob" });
      const ext = format === "excel" ? "xlsx" : format;
      const mime =
        format === "pdf"
          ? "application/pdf"
          : format === "excel"
            ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            : "text/csv";
      const blob = new Blob([res.data], { type: mime });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sales-report.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert(t("reports.exportFail"));
    } finally {
      setExporting(null);
    }
  };

  useEffect(() => {
    (async () => {
      const [sales, inventory, pl, expenses, expiry] = await Promise.all([
        api.get('/api/v1/reports/sales'),
        api.get('/api/v1/reports/inventory'),
        api.get('/api/v1/reports/profit-loss'),
        api.get('/api/v1/reports/expenses'),
        api.get('/api/v1/reports/expiry?days=30'),
      ]);
      setSalesItems((sales.data.data.items || []).slice(0, 20));
      setSummary({
        sales: Number(sales.data.data.total || 0),
        inventory: Number(inventory.data.data.totalStockValue || 0),
        netProfit: Number(pl.data.data.netProfit || 0),
        expenses: Number(expenses.data.data.total || 0),
        expiry: Number(expiry.data.data.count || 0),
      });
    })().catch(() => null);
  }, []);

  const barData = useMemo(
    () => ({
      labels: [t("reports.chartSales"), t("reports.inventoryValue"), t("reports.chartExpenses"), t("reports.netProfit")],
      datasets: [{
        data: [summary.sales, summary.inventory, summary.expenses, Math.abs(summary.netProfit)],
        backgroundColor: ["#F59E0B", "#3B82F6", "#EF4444", summary.netProfit >= 0 ? "#10B981" : "#DC2626"],
      }],
    }),
    [summary, t],
  );

  const pieData = useMemo(() => {
    const netSlice = Math.abs(summary.netProfit);
    const isLoss = summary.netProfit < 0;
    const sales = Math.max(0, summary.sales);
    const expenses = Math.max(0, summary.expenses);
    const netLabel = isLoss ? t("reports.netLoss") : t("reports.netProfit");

    return {
      labels: [t("reports.chartSales"), t("reports.chartExpenses"), netLabel],
      datasets: [{
        data: [sales, expenses, netSlice],
        backgroundColor: ["#F59E0B", "#EF4444", isLoss ? "#DC2626" : "#10B981"],
        borderWidth: 2,
        borderColor: "#fff",
      }],
    };
  }, [summary, t]);

  const pieOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom" as const },
        tooltip: {
          callbacks: {
            label: (ctx: { label?: string; parsed: number; dataIndex: number }) => {
              const amount = ctx.dataIndex === 2 ? summary.netProfit : ctx.parsed;
              return `${ctx.label}: ${formatBDT(amount)}`;
            },
          },
        },
      },
    }),
    [summary.netProfit],
  );

  return (
    <AppShell title={t("reports.title")}>
      <div className="kpi-grid kpi-grid-5 mb-5">
        <div className="kpi-card"><p className="kpi-label">{t("reports.salesTotal")}</p><p className="kpi-value">{formatBDT(summary.sales)}</p></div>
        <div className="kpi-card"><p className="kpi-label">{t("reports.inventoryValue")}</p><p className="kpi-value">{formatBDT(summary.inventory)}</p></div>
        <div className="kpi-card"><p className="kpi-label">{summary.netProfit < 0 ? t("reports.netLoss") : t("reports.netProfit")}</p><p className={`kpi-value ${summary.netProfit < 0 ? "text-red-600" : ""}`}>{formatBDT(summary.netProfit)}</p></div>
        <div className="kpi-card"><p className="kpi-label">{t("reports.expenseTotal")}</p><p className="kpi-value">{formatBDT(summary.expenses)}</p></div>
        <div className="kpi-card"><p className="kpi-label">{t("reports.expiring30")}</p><p className="kpi-value">{summary.expiry}</p></div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <div className="card p-4 sm:p-5"><p className="section-title mb-3">{t("reports.financial")}</p><div className="h-52 sm:h-64"><Bar data={barData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} /></div></div>
        <div className="card p-4 sm:p-5"><p className="section-title mb-3">{t("reports.share")}</p><div className="h-52 sm:h-64"><Doughnut data={pieData} options={pieOptions} /></div></div>
      </div>

      <div className="card p-3 sm:p-4 mb-4 flex flex-col sm:flex-row flex-wrap gap-2">
        <button type="button" className="btn btn-outline w-full sm:w-auto" disabled={!!exporting} onClick={() => downloadExport("pdf")}>{exporting === "pdf" ? t("reports.exporting") : t("reports.exportPdf")}</button>
        <button type="button" className="btn btn-outline w-full sm:w-auto" disabled={!!exporting} onClick={() => downloadExport("excel")}>{exporting === "excel" ? t("reports.exporting") : t("reports.exportExcel")}</button>
        <button type="button" className="btn btn-outline w-full sm:w-auto" disabled={!!exporting} onClick={() => downloadExport("csv")}>{exporting === "csv" ? t("reports.exporting") : t("reports.exportCsv")}</button>
      </div>

      <ResponsiveTable
        rows={salesItems}
        rowKey={(x) => x.id}
        columns={[
          { key: "invoice", header: t("invoice"), cell: (x) => <span className="break-all">{x.invoiceNumber}</span> },
          { key: "date", header: t("date"), cell: (x) => new Date(x.saleDate).toLocaleString() },
          { key: "payment", header: t("payment"), cell: (x) => x.paymentMethod },
          { key: "total", header: t("reports.totalBdt"), cell: (x) => formatBDT(Number(x.totalAmount)) },
        ]}
      />
    </AppShell>
  );
}
