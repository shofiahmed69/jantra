"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { api } from "@/lib/api";
import { Eye, Search, X } from "lucide-react";

type Product = { id: string; name: string; barcode?: string };
type Generated = { productId: string; productName: string; barcode: string; imageBase64: string; mimeType: string };

export default function BarcodesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [generated, setGenerated] = useState<Generated | null>(null);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    api.get("/api/v1/products?page=1&limit=100").then((res) => setProducts(res.data.data)).catch(() => null);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.name.toLowerCase().includes(q) || (p.barcode || "").toLowerCase().includes(q));
  }, [products, search]);

  const printUrl = useMemo(() => {
    if (!selected.length) return "";
    return `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000"}/api/v1/barcodes/print-sheet?productIds=${selected.join(",")}`;
  }, [selected]);

  const generate = async (productId: string) => {
    const res = await api.get(`/api/v1/barcodes/generate/${productId}`);
    setGenerated(res.data.data);
    setSelected((prev) => (prev.includes(productId) ? prev : [...prev, productId]));
    setOpenModal(true);
  };

  return (
    <AppShell title="Barcodes">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="relative max-w-3xl w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="input pl-9" placeholder="Search products for barcode..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        {printUrl ? <a className="btn btn-outline" href={printUrl} target="_blank" rel="noreferrer">Print Sheet PDF</a> : null}
      </div>

      <div className="table-wrap">
        <table className="w-full text-sm">
          <thead className="table-head"><tr><th className="p-4 text-left">Product</th><th className="p-4 text-left">Barcode</th><th className="p-4 text-right">Actions</th></tr></thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="table-row border-t border-slate-200">
                <td className="p-4 font-medium">{p.name}</td>
                <td className="p-4">{p.barcode || "-"}</td>
                <td className="p-4 text-right"><button type="button" className="icon-btn icon-btn-edit" onClick={() => generate(p.id)}><Eye className="w-4 h-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {openModal && generated ? (
        <div className="modal-overlay">
          <div className="card w-full max-w-lg p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">Barcode Preview</h3>
              <button type="button" className="icon-btn btn-outline" onClick={() => setOpenModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <p className="font-medium mb-2">{generated.productName}</p>
            <img src={`data:${generated.mimeType};base64,${generated.imageBase64}`} alt={generated.barcode} className="w-full bg-white border rounded" />
            <p className="mt-2 text-sm">Barcode: {generated.barcode}</p>
            <div className="mt-4 text-right">
              <button type="button" className="btn btn-outline" onClick={() => setOpenModal(false)}>Close</button>
            </div>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
