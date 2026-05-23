"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { api } from "@/lib/api";
import { io } from "socket.io-client";
import { formatBDT } from "@/lib/currency";
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler } from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

type Summary = { todaySalesAmount: number; todayProfit: number; totalTransactions: number; totalProducts: number };
type Product = { id: string; name: string; stockQuantity: number; minStockAlert: number };
type Sale = { id: string; invoiceNumber: string; saleDate: string; totalAmount: string; paymentMethod: string };

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary>({ todaySalesAmount: 0, todayProfit: 0, totalTransactions: 0, totalProducts: 0 });
  const [lowStock, setLowStock] = useState<Product[]>([]);
  const [outStock, setOutStock] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchAll = async () => {
    const [s, low, out, tx] = await Promise.all([
      api.get("/api/v1/dashboard/summary"),
      api.get("/api/v1/inventory/low-stock"),
      api.get("/api/v1/inventory/out-of-stock"),
      api.get("/api/v1/sales?page=1&limit=40"),
    ]);
    setSummary(s.data.data);
    setLowStock(low.data.data);
    setOutStock(out.data.data);
    setSales(tx.data.data);
    setLastUpdated(new Date().toLocaleTimeString());
  };

  useEffect(() => {
    fetchAll().catch(() => null);
    const socketBase =
      process.env.NEXT_PUBLIC_WS_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      (typeof window !== "undefined" ? window.location.origin : "http://localhost:4000");
    const socket = io(socketBase);
    socket.on("dashboard:update", () => fetchAll().catch(() => null));
    const timer = setInterval(() => { fetchAll().catch(() => null); }, 15000);
    return () => {
      socket.disconnect();
      clearInterval(timer);
    };
  }, []);

  const weekly = useMemo(() => {
    const m = new Map<string, number>();
    for (let i = 6; i >= 0; i -= 1) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      m.set(d.toISOString().slice(0, 10), 0);
    }
    sales.forEach((s) => {
      const k = s.saleDate.slice(0, 10);
      if (m.has(k)) m.set(k, (m.get(k) || 0) + Number(s.totalAmount));
    });
    return Array.from(m.entries());
  }, [sales]);

  const lineData = {
    labels: weekly.map(([d]) => d.slice(5)),
    datasets: [
      {
        label: "Sales (BDT)",
        data: weekly.map(([, v]) => v),
        borderColor: "#f97316",
        backgroundColor: "rgba(249,115,22,.17)",
        fill: true,
        tension: 0.35,
      },
    ],
  };

  const pieData = {
    labels: ["Healthy", "Low", "Out"],
    datasets: [
      {
        data: [Math.max(0, summary.totalProducts - lowStock.length - outStock.length), lowStock.length, outStock.length],
        backgroundColor: ["#22c55e", "#f59e0b", "#ef4444"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <AppShell title="Dashboard">
      <div className="card p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-bold tracking-wide text-[#5f77a0] uppercase">Sales Overview</p>
            <p className="text-xs text-[#8da1be]">Live analytics with auto refresh</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="status-pill status-ok">Live</span>
            <span className="text-xs text-[#7d90ac]">Updated: {lastUpdated || "-"}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="kpi-card"><p className="kpi-label">Total Sales</p><p className="kpi-value">{formatBDT(summary.todaySalesAmount)}</p></div>
          <div className="kpi-card"><p className="kpi-label">Transactions</p><p className="kpi-value">{summary.totalTransactions}</p></div>
          <div className="kpi-card"><p className="kpi-label">Avg. Sale</p><p className="kpi-value">{formatBDT(summary.totalTransactions ? summary.todaySalesAmount / summary.totalTransactions : 0)}</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
        <div className="lg:col-span-9 card p-4">
          <p className="font-semibold mb-2 text-[#3f577d]">Daily Sales</p>
          <div className="h-72"><Line data={lineData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} /></div>
        </div>
        <div className="lg:col-span-3 space-y-4">
          <div className="card p-4"><p className="text-sm text-[#627a9f]">Today Orders</p><p className="text-4xl font-bold">{summary.totalTransactions}</p><p className="text-sm text-emerald-600 font-semibold">Live</p></div>
          <div className="card p-4"><p className="text-sm text-[#627a9f]">Low Stock Alerts</p><p className="text-4xl font-bold">{lowStock.length}</p><p className="text-sm text-orange-600 font-semibold">Live</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-4 card p-4">
          <p className="font-semibold mb-3 text-[#3f577d]">Stock Distribution</p>
          <div className="h-64"><Doughnut data={pieData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
        </div>
        <div className="lg:col-span-8 table-wrap">
          <table className="w-full text-sm">
            <thead className="table-head"><tr><th className="p-4 text-left">Invoice</th><th className="p-4 text-left">Date</th><th className="p-4 text-left">Payment</th><th className="p-4 text-left">Total</th></tr></thead>
            <tbody>
              {sales.slice(0, 8).map((x) => (
                <tr key={x.id} className="table-row border-t border-slate-200">
                  <td className="p-4">{x.invoiceNumber}</td>
                  <td className="p-4">{new Date(x.saleDate).toLocaleString()}</td>
                  <td className="p-4">{x.paymentMethod}</td>
                  <td className="p-4">{formatBDT(Number(x.totalAmount))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
