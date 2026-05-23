import { NextRequest, NextResponse } from "next/server";

type CurrencyCode = "USD" | "EUR" | "BDT";

const EU_COUNTRIES = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
  "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK",
  "SI", "ES", "SE",
]);

function toCurrency(country?: string | null): CurrencyCode {
  const code = (country || "").toUpperCase();
  if (code === "BD") return "BDT";
  if (EU_COUNTRIES.has(code)) return "EUR";
  return "USD";
}

export function middleware(req: NextRequest) {
  const country =
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("x-country-code") ||
    null;

  const autoCurrency = toCurrency(country);
  const res = NextResponse.next();
  res.cookies.set("currency_pref_auto", autoCurrency, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}

export const config = {
  matcher: ["/pricing/:path*"],
};
