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
  // Handle CORS preflight for /api routes
  if (req.nextUrl.pathname.startsWith('/api')) {
    if (req.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, X-CSRF-Token, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version',
          'Access-Control-Allow-Credentials': 'true',
        },
      });
    }
  }

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

  if (req.nextUrl.pathname.startsWith('/api')) {
    res.headers.set('Access-Control-Allow-Origin', '*');
    res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-CSRF-Token, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version');
    res.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  return res;
}

export const config = {
  matcher: ["/pricing/:path*", "/api/:path*"],
};
