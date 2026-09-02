'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      const response = await fetch(
        'http://localhost:5000/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('auth_token', data.token);
      localStorage.setItem(
        'auth_user',
        JSON.stringify(data.user)
      );

      router.push('/gis-portal');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to login'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0b1326] flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        <div className="mb-8 text-center">
          <h1
            className="text-3xl font-bold text-[#dae2fd]"
            style={{ fontFamily: 'Inter' }}
          >
            AEROMETRIC
          </h1>

          <p
            className="mt-2 text-[#4cd7f6] text-[11px] tracking-[0.2em]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            SECURE ACCESS
          </p>
        </div>

        <div className="bg-[#171f33]/90 border border-[#3d494c]/30 rounded-xl p-8 shadow-2xl">

          <h2
            className="text-xl font-bold text-[#dae2fd] mb-6"
            style={{ fontFamily: 'Inter' }}
          >
            Sign In
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">

            <div>
              <label
                className="block text-[#bcc9cd] text-[10px] uppercase tracking-widest mb-2"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#0b1326] border border-[#3d494c]/40 rounded-lg px-4 py-3 text-[#dae2fd] outline-none focus:border-[#4cd7f6]"
                placeholder="operator@example.com"
              />
            </div>

            <div>
              <label
                className="block text-[#bcc9cd] text-[10px] uppercase tracking-widest mb-2"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#0b1326] border border-[#3d494c]/40 rounded-lg px-4 py-3 text-[#dae2fd] outline-none focus:border-[#4cd7f6]"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div
                className="text-[#ffb3ad] text-[11px]"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4cd7f6] text-[#003640] py-3 rounded-lg text-[11px] font-bold uppercase tracking-widest disabled:opacity-50"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {loading ? 'AUTHENTICATING...' : 'LOGIN'}
            </button>

          </form>

          <div className="mt-6 text-center">
            <span
              className="text-[#bcc9cd] text-[11px]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              New operator?{' '}
            </span>

            <Link
              href="/register"
              className="text-[#4cd7f6] text-[11px] hover:underline"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              CREATE ACCOUNT
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}