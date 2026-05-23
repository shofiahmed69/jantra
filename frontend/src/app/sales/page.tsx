"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { api } from "@/lib/api";
import { formatBDT } from "@/lib/currency";

type Sale = { id: string; invoiceNumber: string; saleDate: string; totalAmount: string; status: string; paymentMethod: string };
type Report = { transactionCount: number; totalSales: number };

export default function SalesPage() {
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
    <AppShell title="Sales">
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="kpi-card"><p className="kpi-label">Today Sales</p><p className="kpi-value">{formatBDT(daily?.totalSales || 0)}</p><p className="text-sm text-slate-500">Txns: {daily?.transactionCount || 0}</p></div>
        <div className="kpi-card"><p className="kpi-label">Monthly Sales</p><p className="kpi-value">{formatBDT(monthly?.totalSales || 0)}</p><p className="text-sm text-slate-500">Txns: {monthly?.transactionCount || 0}</p></div>
      </div>
      <div className="table-wrap">
        <table className="w-full text-sm">
          <thead className="table-head"><tr><th className="p-4 text-left">Invoice</th><th className="p-4 text-left">Date</th><th className="p-4 text-left">Payment</th><th className="p-4 text-left">Total</th><th className="p-4 text-left">Status</th><th className="p-4 text-right">Action</th></tr></thead>
          <tbody>
            {sales.map((s) => (
              <tr key={s.id} className="table-row border-t border-slate-200">
                <td className="p-4 font-medium">{s.invoiceNumber}</td>
                <td className="p-4">{new Date(s.saleDate).toLocaleString()}</td>
                <td className="p-4">{s.paymentMethod}</td>
                <td className="p-4">{formatBDT(Number(s.totalAmount))}</td>
                <td className="p-4"><span className={`status-pill ${s.status === "completed" ? "status-ok" : "status-bad"}`}>{s.status}</span></td>
                <td className="p-4 text-right">{s.status === "completed" ? <button className="btn btn-outline" onClick={() => cancel(s.id)}>Cancel</button> : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
