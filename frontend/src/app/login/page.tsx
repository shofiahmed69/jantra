"use client";

import Image from "next/image";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@jantra.local');
  const [password, setPassword] = useState('admin12345');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/api/v1/auth/login', { email, password });
      localStorage.setItem('apex_token', res.data.data.token);
      router.push('/dashboard');
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <form onSubmit={onSubmit} className="card w-full max-w-md p-6 space-y-3">
        <div className="flex flex-col items-center gap-3 pb-2">
          <Image src="/jantra-logo.png" alt="Jantra" width={72} height={72} className="h-[72px] w-[72px] object-contain" priority />
          <h1 className="text-xl font-bold text-center">Jantra Pharmacy Management</h1>
        </div>
        <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button className="btn btn-primary w-full" disabled={loading} type="submit">{loading ? 'Signing in...' : 'Sign in'}</button>
      </form>
    </div>
  );
}
