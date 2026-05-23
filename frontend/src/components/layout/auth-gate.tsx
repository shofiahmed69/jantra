"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname.startsWith('/login')) return;
    const token = localStorage.getItem('apex_token');
    if (!token) router.replace('/login');
  }, [pathname, router]);

  return <>{children}</>;
}
