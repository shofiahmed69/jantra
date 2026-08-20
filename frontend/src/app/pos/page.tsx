"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { api } from "@/lib/api";
import { formatBDT } from "@/lib/currency";
import { ProductThumb } from "@/components/ui/product-thumb";
import { useLanguage } from "@/lib/i18n/language-provider";
import {
  availableSellUnits,
  formatStockPieces,
  isBottleProduct,
  sellUnitOptionsForPos,
  toPieces,
  unitLabel,
  type UnitLevel,
  type UnitProduct,
} from "@/lib/units";

type Product = UnitProduct & {
  id: string;
  name: string;
  sellingPrice: string;
  stockQuantity: number;
  barcode?: string;
  imageUrl?: string;
  unitType?: string;
};

type CartItem = {
  productId: string;
  name: string;
  unit: UnitLevel;
  qty: number;
  pricePerPiece: number;
  piecesPerStrip: number;
  stripsPerBox: number | null;
  unitType?: string;
};

function cartKey(productId: string, unit: UnitLevel) {
  return `${productId}:${unit}`;
}

export default function PosPage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [barcodeInput, setBarcodeInput] = useState("");
  const [search, setSearch] = useState("");
  const [sellUnit, setSellUnit] = useState<UnitLevel>("piece");
  const [loadError, setLoadError] = useState("");

  const loadProducts = () =>
    api
      .get("/api/v1/products?page=1&limit=100")
      .then((res) => {
        setProducts(Array.isArray(res.data.data) ? res.data.data : []);
        setLoadError("");
      })
      .catch(() => {
        setProducts([]);
        setLoadError(t("pos.loadFail"));
      });

  useEffect(() => {
    loadProducts();
  }, []);

  const add = (p: Product, unit: UnitLevel = sellUnit) => {
    const pieces = toPieces(1, unit, p);
    if (p.stockQuantity < pieces) return;
    const key = cartKey(p.id, unit);
    setCart((c) => {
      const idx = c.findIndex((x) => cartKey(x.productId, x.unit) === key);
      if (idx >= 0) {
        const next = c.map((x, i) => (i === idx ? { ...x, qty: x.qty + 1 } : x));
        const need = toPieces(next[idx].qty, unit, p);
        if (need > p.stockQuantity) return c;
        return next;
      }
      return [
        ...c,
        {
          productId: p.id,
          name: p.name,
          unit,
          qty: 1,
          pricePerPiece: Number(p.sellingPrice),
          piecesPerStrip: p.piecesPerStrip ?? 1,
          stripsPerBox: p.stripsPerBox ?? null,
          unitType: p.unitType,
        },
      ];
    });
  };

  const updateQty = (item: CartItem, delta: number) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return;
    const key = cartKey(item.productId, item.unit);
    setCart((c) => {
      const idx = c.findIndex((x) => cartKey(x.productId, x.unit) === key);
      if (idx < 0) return c;
      const nextQty = c[idx].qty + delta;
      if (nextQty <= 0) return c.filter((_, i) => i !== idx);
      if (toPieces(nextQty, item.unit, product) > product.stockQuantity) return c;
      return c.map((x, i) => (i === idx ? { ...x, qty: nextQty } : x));
    });
  };

  const handleBarcodeEnter = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const code = barcodeInput.trim();
    if (!code) return;
    const res = await api.get(`/api/v1/products/barcode/${encodeURIComponent(code)}`);
    if (res.data.data) add(res.data.data, sellUnit);
    setBarcodeInput("");
  };

  const visibleProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.name.toLowerCase().includes(q) || (p.barcode || "").toLowerCase().includes(q));
  }, [products, search]);

  const linePieces = (item: CartItem) =>
    toPieces(item.qty, item.unit, {
      unitType: item.unitType,
      piecesPerStrip: item.piecesPerStrip,
      stripsPerBox: item.stripsPerBox,
    });

  const lineTotal = (item: CartItem) => linePieces(item) * item.pricePerPiece;

  const total = useMemo(() => cart.reduce((s, i) => s + lineTotal(i), 0), [cart]);

  const checkout = async () => {
    if (!cart.length) return;
    await api.post("/api/v1/pos/sale", {
      items: cart.map((c) => ({
        product_id: c.productId,
        quantity: c.qty,
        unit: c.unit,
        discount_percent: 0,
      })),
      discount_amount: 0,
      tax_amount: 0,
      payment_method: paymentMethod,
    });
    setCart([]);
    await loadProducts();
  };

  const sellUnitOptions = sellUnitOptionsForPos();

  return (
    <AppShell title={t("pos.title")}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7 card p-4 sm:p-5">
          <p className="text-2xl sm:text-3xl font-semibold mb-3">{t("pos.products")}</p>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-sm font-semibold text-slate-600">{t("units.sellAs")}:</span>
            {sellUnitOptions.map((u) => (
              <button
                key={u}
                type="button"
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${sellUnit === u ? "bg-amber-500 text-white border-amber-500" : "bg-white border-slate-300 text-slate-700"}`}
                onClick={() => setSellUnit(u)}
              >
                {unitLabel(u, t)}
              </button>
            ))}
          </div>
          <input className="input mb-2" placeholder={t("pos.search")} value={search} onChange={(e) => setSearch(e.target.value)} />
          <input className="input mb-4" placeholder={t("pos.scan")} value={barcodeInput} onChange={(e) => setBarcodeInput(e.target.value)} onKeyDown={handleBarcodeEnter} />
          <div className="space-y-3 max-h-[45vh] sm:max-h-[56vh] overflow-auto">
            {loadError ? <p className="text-red-600 font-medium p-3">{loadError}</p> : null}
            {!loadError && visibleProducts.length === 0 ? (
              <p className="text-slate-500 p-3">{t("pos.noProducts")}</p>
            ) : null}
            {visibleProducts.map((p) => {
              const units = availableSellUnits(p);
              const canSell = units.includes(sellUnit) && p.stockQuantity >= toPieces(1, sellUnit, p);
              return (
                <button
                  key={p.id}
                  type="button"
                  disabled={!canSell}
                  onClick={() => add(p, sellUnit)}
                  className={`w-full text-left p-4 border rounded-xl flex items-center gap-4 ${canSell ? "border-slate-300 hover:bg-amber-50" : "border-slate-200 opacity-50 cursor-not-allowed"}`}
                >
                  <ProductThumb src={p.imageUrl} alt={p.name} size="lg" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-lg">{p.name}</p>
                    <p className="text-base text-slate-600">
                      {formatBDT(Number(p.sellingPrice))}/{isBottleProduct(p) ? t("units.perBottle") : t("units.perPiece")} · {formatStockPieces(p.stockQuantity, p)}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-5 card p-4 sm:p-5 lg:sticky lg:top-20 lg:self-start">
          <p className="text-2xl sm:text-3xl font-semibold mb-4">{t("pos.cart")}</p>
          <div className="space-y-3 max-h-[30vh] sm:max-h-[40vh] overflow-auto mb-4">
            {cart.map((c) => (
              <div key={cartKey(c.productId, c.unit)} className="border-b border-slate-100 pb-3">
                <div className="flex justify-between gap-2 text-lg">
                  <span className="font-medium min-w-0">
                    {c.name} · {c.qty} {unitLabel(c.unit, t)}
                    {c.unitType !== "bottle" ? ` (${linePieces(c)} ${t("units.pcs")})` : ""}
                  </span>
                  <span className="font-medium shrink-0">{formatBDT(lineTotal(c))}</span>
                </div>
                <div className="flex gap-2 mt-2">
                  <button type="button" className="btn btn-outline !min-h-9 !py-1 !px-3" onClick={() => updateQty(c, -1)}>−</button>
                  <button type="button" className="btn btn-outline !min-h-9 !py-1 !px-3" onClick={() => updateQty(c, 1)}>+</button>
                </div>
              </div>
            ))}
          </div>
          <select className="input mb-4" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <option value="cash">{t("pos.cash")}</option>
            <option value="card">{t("pos.card")}</option>
            <option value="mobile_banking">{t("pos.mobile")}</option>
          </select>
          <p className="text-2xl sm:text-3xl font-bold mb-4">{t("total")}: {formatBDT(total)}</p>
          <button className="btn btn-primary w-full text-lg" onClick={checkout} disabled={!cart.length}>
            {t("pos.checkout")}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
