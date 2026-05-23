"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { api } from "@/lib/api";
import { formatBDT } from "@/lib/currency";
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type SalesItem = { id: string; invoiceNumber: string; saleDate: string; totalAmount: string; paymentMethod: string };

export default function ReportsPage() {
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
      alert("Export failed. Please sign in again and retry.");
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

  const barData = {
    labels: ['Sales', 'Inventory', 'Expenses', 'Net Profit'],
    datasets: [{ data: [summary.sales, summary.inventory, summary.expenses, Math.abs(summary.netProfit)], backgroundColor: ['#F59E0B', '#3B82F6', '#EF4444', '#10B981'] }],
  };

  const pieData = {
    labels: ['Sales', 'Expenses', 'Net'],
    datasets: [{ data: [summary.sales || 1, summary.expenses || 1, Math.max(1, summary.netProfit || 1)], backgroundColor: ['#F59E0B', '#EF4444', '#10B981'] }],
  };

  return (
    <AppShell title="Reports">
      <div className="grid md:grid-cols-5 gap-4 mb-5">
        <div className="kpi-card"><p className="kpi-label">Sales Total</p><p className="kpi-value">{formatBDT(summary.sales)}</p></div>
        <div className="kpi-card"><p className="kpi-label">Inventory Value</p><p className="kpi-value">{formatBDT(summary.inventory)}</p></div>
        <div className="kpi-card"><p className="kpi-label">Net Profit</p><p className="kpi-value">{formatBDT(summary.netProfit)}</p></div>
        <div className="kpi-card"><p className="kpi-label">Expense Total</p><p className="kpi-value">{formatBDT(summary.expenses)}</p></div>
        <div className="kpi-card"><p className="kpi-label">Expiring in 30d</p><p className="kpi-value">{summary.expiry}</p></div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <div className="card p-4"><p className="font-semibold mb-2">Financial Comparison</p><div className="h-64"><Bar data={barData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} /></div></div>
        <div className="card p-4"><p className="font-semibold mb-2">Share Distribution</p><div className="h-64"><Doughnut data={pieData} options={{ responsive: true, maintainAspectRatio: false }} /></div></div>
      </div>

      <div className="card p-4 mb-4 flex gap-2">
        <button type="button" className="btn btn-outline" disabled={!!exporting} onClick={() => downloadExport("pdf")}>{exporting === "pdf" ? "Exporting..." : "Export PDF"}</button>
        <button type="button" className="btn btn-outline" disabled={!!exporting} onClick={() => downloadExport("excel")}>{exporting === "excel" ? "Exporting..." : "Export Excel"}</button>
        <button type="button" className="btn btn-outline" disabled={!!exporting} onClick={() => downloadExport("csv")}>{exporting === "csv" ? "Exporting..." : "Export CSV"}</button>
      </div>

      <div className="table-wrap">
        <table className="w-full text-sm">
          <thead className="table-head"><tr><th>Invoice</th><th>Date</th><th>Payment</th><th>Total (BDT)</th></tr></thead>
          <tbody>{salesItems.map((x) => <tr key={x.id} className="table-row border-t border-slate-200"><td className="py-2">{x.invoiceNumber}</td><td>{new Date(x.saleDate).toLocaleString()}</td><td>{x.paymentMethod}</td><td>{formatBDT(Number(x.totalAmount))}</td></tr>)}</tbody>
        </table>
      </div>
    </AppShell>
  );
}
