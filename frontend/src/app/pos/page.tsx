"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { api } from "@/lib/api";
import { formatBDT } from "@/lib/currency";

type Product = { id: string; name: string; sellingPrice: string; stockQuantity: number; barcode?: string; imageUrl?: string };
type CartItem = { productId: string; name: string; price: number; qty: number };

export default function PosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [barcodeInput, setBarcodeInput] = useState("");
  const [search, setSearch] = useState("");

  const loadProducts = () => api.get("/api/v1/products").then((res) => setProducts(res.data.data));
  useEffect(() => { loadProducts(); }, []);

  const add = (p: Product) => {
    if (p.stockQuantity <= 0) return;
    setCart((c) => {
      const idx = c.findIndex((x) => x.productId === p.id);
      if (idx >= 0) return c.map((x, i) => (i === idx ? { ...x, qty: x.qty + 1 } : x));
      return [...c, { productId: p.id, name: p.name, price: Number(p.sellingPrice), qty: 1 }];
    });
  };

  const handleBarcodeEnter = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const code = barcodeInput.trim();
    if (!code) return;
    const res = await api.get(`/api/v1/products/barcode/${encodeURIComponent(code)}`);
    if (res.data.data) add(res.data.data);
    setBarcodeInput("");
  };

  const visibleProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.name.toLowerCase().includes(q) || (p.barcode || "").toLowerCase().includes(q));
  }, [products, search]);

  const total = useMemo(() => cart.reduce((s, i) => s + i.qty * i.price, 0), [cart]);

  const checkout = async () => {
    if (!cart.length) return;
    await api.post("/api/v1/pos/sale", {
      items: cart.map((c) => ({ product_id: c.productId, quantity: c.qty, discount_percent: 0 })),
      discount_amount: 0,
      tax_amount: 0,
      payment_method: paymentMethod,
    });
    setCart([]);
    await loadProducts();
  };

  return (
    <AppShell title="POS Billing">
      <div className="grid lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7 card p-4">
          <p className="text-2xl font-semibold mb-3">Products</p>
          <input className="input mb-2" placeholder="Search name or barcode..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <input className="input mb-3" placeholder="Scan barcode then press Enter" value={barcodeInput} onChange={(e) => setBarcodeInput(e.target.value)} onKeyDown={handleBarcodeEnter} />
          <div className="space-y-2 max-h-[56vh] overflow-auto">
            {visibleProducts.map((p) => (
              <button key={p.id} onClick={() => add(p)} className="w-full text-left p-3 border border-slate-300 rounded-xl hover:bg-amber-50 flex items-center gap-3">
                {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="h-11 w-11 rounded object-cover" /> : <span className="text-xl">💊</span>}
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-slate-500">{formatBDT(Number(p.sellingPrice))} | Stock: {p.stockQuantity} | {p.barcode || "-"}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 card p-4">
          <p className="text-2xl font-semibold mb-3">Cart</p>
          <div className="space-y-2 max-h-[40vh] overflow-auto mb-3">
            {cart.map((c) => (
              <div key={c.productId} className="flex justify-between border-b border-slate-100 pb-1">
                <span>{c.name} x{c.qty}</span>
                <span>{formatBDT(c.qty * c.price)}</span>
              </div>
            ))}
          </div>
          <select className="input mb-3" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <option value="cash">cash</option>
            <option value="card">card</option>
            <option value="mobile_banking">mobile_banking</option>
          </select>
          <p className="text-3xl font-bold mb-3">Total: {formatBDT(total)}</p>
          <button className="btn btn-primary w-full" onClick={checkout}>Checkout</button>
        </div>
      </div>
    </AppShell>
  );
}
