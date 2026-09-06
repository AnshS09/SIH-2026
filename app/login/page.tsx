'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const LOGO_URL = '/mach-x-logo-white.png';
function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M3 6.5h18v11H3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="m3.5 7 8.5 6 8.5-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <rect
        x="5"
        y="10"
        width="14"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M8 10V7a4 4 0 0 1 8 0v3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M5 12h13M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="m5 12 4 4L19 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TerrainGraphic() {
  return (
    <div className="relative mx-auto h-[390px] w-full max-w-[620px] overflow-hidden">
      {/* radar rings */}
      <div className="absolute left-1/2 top-[55%] h-[330px] w-[330px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/[0.10]" />
      <div className="absolute left-1/2 top-[55%] h-[255px] w-[255px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/[0.13]" />
      <div className="absolute left-1/2 top-[55%] h-[175px] w-[175px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/[0.16]" />

      {/* radar crosshair */}
      <div className="absolute left-1/2 top-[55%] h-[350px] w-px -translate-x-1/2 bg-cyan-400/[0.07]" />
      <div className="absolute left-1/2 top-[55%] h-px w-[430px] -translate-x-1/2 bg-cyan-400/[0.07]" />

      {/* glow */}
      <div className="absolute left-1/2 top-[55%] h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-[45px]" />
      <div className="absolute left-[54%] top-[40%] h-24 w-24 rounded-full bg-amber-300/10 blur-[40px]" />

      {/* terrain mesh */}
      <svg
        viewBox="0 0 600 390"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="terrainStroke" x1="0" x2="1">
            <stop offset="0%" stopColor="#28d7f5" stopOpacity=".25" />
            <stop offset="55%" stopColor="#4cd7f6" stopOpacity=".9" />
            <stop offset="100%" stopColor="#ffb95f" stopOpacity=".8" />
          </linearGradient>

          <linearGradient id="terrainFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4cd7f6" stopOpacity=".12" />
            <stop offset="100%" stopColor="#ffb95f" stopOpacity=".07" />
          </linearGradient>
        </defs>

        {/* outer terrain */}
        <path
          d="M125 205 L235 125 L385 110 L480 185 L430 275 L285 315 L150 270 Z"
          fill="url(#terrainFill)"
          stroke="url(#terrainStroke)"
          strokeWidth="1.5"
        />

        {/* terrain contours */}
        <path
          d="M155 210 L245 150 L365 137 L445 190 L405 250 L285 282 L175 250 Z"
          fill="none"
          stroke="#4cd7f6"
          strokeOpacity=".38"
        />

        <path
          d="M188 215 L260 172 L350 164 L415 195 L380 230 L290 255 L205 240 Z"
          fill="none"
          stroke="#4cd7f6"
          strokeOpacity=".42"
        />

        <path
          d="M222 216 L278 190 L338 184 L382 199 L356 216 L295 235 L238 230 Z"
          fill="none"
          stroke="#ffb95f"
          strokeOpacity=".45"
        />

        {/* terrain height lines */}
        <path d="M235 125 L260 172 L278 190" fill="none" stroke="#4cd7f6" strokeOpacity=".35" />
        <path d="M385 110 L365 137 L350 164 L338 184" fill="none" stroke="#4cd7f6" strokeOpacity=".4" />
        <path d="M480 185 L445 190 L415 195 L382 199" fill="none" stroke="#4cd7f6" strokeOpacity=".32" />
        <path d="M430 275 L405 250 L380 230 L356 216" fill="none" stroke="#ffb95f" strokeOpacity=".32" />
        <path d="M285 315 L285 282 L290 255 L295 235" fill="none" stroke="#4cd7f6" strokeOpacity=".32" />
        <path d="M150 270 L175 250 L205 240 L238 230" fill="none" stroke="#4cd7f6" strokeOpacity=".3" />

        {/* vertical reconstruction beams */}
        <path d="M285 282 L285 350" stroke="#4cd7f6" strokeOpacity=".25" strokeDasharray="3 6" />
        <path d="M150 270 L120 330" stroke="#4cd7f6" strokeOpacity=".18" strokeDasharray="3 7" />
        <path d="M430 275 L470 325" stroke="#ffb95f" strokeOpacity=".18" strokeDasharray="3 7" />

        {/* center node */}
        <circle cx="295" cy="216" r="7" fill="#ffb95f" fillOpacity=".2" />
        <circle cx="295" cy="216" r="3" fill="#ffb95f" />
        <circle cx="295" cy="216" r="12" fill="none" stroke="#ffb95f" strokeOpacity=".35" />

        {/* point cloud */}
        <g fill="#4cd7f6">
          <circle cx="205" cy="180" r="1.5" />
          <circle cx="220" cy="160" r="1.3" />
          <circle cx="238" cy="145" r="1.2" />
          <circle cx="260" cy="130" r="1.3" />
          <circle cx="410" cy="155" r="1.4" />
          <circle cx="430" cy="175" r="1.2" />
          <circle cx="450" cy="210" r="1.5" />
          <circle cx="425" cy="240" r="1.3" />
          <circle cx="395" cy="265" r="1.1" />
          <circle cx="225" cy="270" r="1.3" />
          <circle cx="195" cy="255" r="1.1" />
          <circle cx="170" cy="235" r="1.4" />
        </g>
      </svg>

      {/* floating data labels */}
      <div className="absolute left-[7%] top-[25%] font-mono text-[9px] tracking-[0.18em] text-cyan-300/50">
        POINT CLOUD
      </div>

      <div className="absolute right-[8%] top-[30%] font-mono text-[9px] tracking-[0.16em] text-cyan-300/45">
        MESH / 3D
      </div>

      <div className="absolute bottom-[13%] left-[18%] font-mono text-[9px] tracking-[0.15em] text-slate-500">
        X: 2304.22
      </div>

      <div className="absolute bottom-[13%] left-[35%] font-mono text-[9px] tracking-[0.15em] text-slate-500">
        Y: 1846.42
      </div>

      <div className="absolute bottom-[13%] right-[18%] font-mono text-[9px] tracking-[0.15em] text-slate-500">
        Z: 0865.12
      </div>

      {/* center text */}
      <div className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="font-mono text-[9px] tracking-[0.35em] text-cyan-300/55">
          RECONSTRUCTION
        </div>
        <div className="mt-2 text-[11px] font-medium tracking-[0.25em] text-white/60">
          ACTIVE NODE
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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

      setSuccess(true);

     setTimeout(() => {
  window.location.href = '/';
}, 1500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to login'
      );
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050b14] text-[#e7eefb] overflow-hidden">
      {/* ================= BACKGROUND ================= */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Main grid */}
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(76,215,246,.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(76,215,246,.045) 1px, transparent 1px)',
            backgroundSize: '42px 42px',
          }}
        />

        {/* Fine grid */}
        <div
          className="absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,.018) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.018) 1px, transparent 1px)',
            backgroundSize: '8px 8px',
          }}
        />

        <div
          className="absolute -left-[15%] -top-[20%] h-[65%] w-[55%] rounded-full bg-cyan-400/[0.045] blur-[130px]"
        />

        <div
          className="absolute -bottom-[30%] left-[25%] h-[50%] w-[45%] rounded-full bg-cyan-500/[0.025] blur-[120px]"
        />

        <div
          className="absolute -right-[15%] -top-[15%] h-[55%] w-[40%] rounded-full bg-amber-300/[0.025] blur-[130px]"
        />

        {/* vertical divider glow */}
        <div className="absolute right-[47%] top-0 h-full w-px bg-cyan-300/[0.025]" />
      </div>

      {/* ================= PAGE FRAME ================= */}
      <div className="relative mx-auto min-h-screen max-w-[1800px] px-6 py-6 sm:px-8 lg:px-10">
        <div className="pointer-events-none absolute inset-6 rounded-[24px] border border-white/[0.045] sm:inset-8 lg:inset-10" />

        {/* corner accents */}
        <div className="absolute left-8 top-8 h-8 w-8 border-l border-t border-cyan-400/40 sm:left-10 sm:top-10" />
        <div className="absolute right-8 top-8 h-8 w-8 border-r border-t border-cyan-400/20 sm:right-10 sm:top-10" />
        <div className="absolute bottom-8 left-8 h-8 w-8 border-b border-l border-cyan-400/20 sm:bottom-10 sm:left-10" />
        <div className="absolute bottom-8 right-8 h-8 w-8 border-b border-r border-cyan-400/20 sm:bottom-10 sm:right-10" />

        <div className="relative z-10 grid min-h-[calc(100vh-48px)] items-center gap-10 py-10 lg:min-h-[calc(100vh-80px)] lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-14">
          {/* ================= LEFT ================= */}
          <section className="flex min-h-full flex-col justify-between px-2 py-4 lg:px-8">
            {/* Brand */}
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-3"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.04] shadow-[0_0_30px_rgba(76,215,246,.06)]">
                  <img
                    src={LOGO_URL}
                    alt="MACH-X"
                    className="h-8 w-8 object-contain"
                  />
                </div>

                <div>
                  <div className="font-mono text-[17px] font-bold tracking-[0.27em] text-white">
                    MACH-X
                  </div>
                  <div className="mt-1 font-mono text-[8px] tracking-[0.32em] text-cyan-300/65">
                    GEOSPATIAL INTELLIGENCE
                  </div>
                </div>
              </Link>
            </div>

            {/* Hero */}
            <div className="mt-12 lg:mt-0">
              <div className="max-w-[560px]">
                <div className="mb-5 flex items-center gap-3 font-mono text-[10px] tracking-[0.32em] text-cyan-300/65">
                  <span className="h-px w-8 bg-cyan-300/50" />
                  AERIAL INTELLIGENCE PLATFORM
                </div>

                <h1 className="text-[clamp(3rem,5.4vw,5.8rem)] font-semibold leading-[0.92] tracking-[-0.055em]">
                  Reconstruct.
                  <br />
                  <span className="text-cyan-300">Analyze.</span>
                  <br />
                  <span className="text-amber-200">Decide.</span>
                </h1>

                <p className="mt-7 max-w-[500px] text-[15px] leading-7 text-slate-400 sm:text-[16px]">
                  Transform aerial drone footage into accurate 3D
                  geospatial intelligence — from raw imagery to a
                  mission-ready digital scene.
                </p>
              </div>

              {/* visual */}
              <div className="mt-5">
                <TerrainGraphic />
              </div>

              {/* Feature strip */}
              <div className="grid max-w-[650px] grid-cols-2 gap-x-8 gap-y-5 border-t border-white/[0.06] pt-6 sm:grid-cols-4">
                <div>
                  <div className="font-mono text-[9px] tracking-[0.18em] text-cyan-300/70">
                    01
                  </div>
                  <div className="mt-1 text-[11px] font-medium text-slate-300">
                    3D RECONSTRUCTION
                  </div>
                </div>

                <div>
                  <div className="font-mono text-[9px] tracking-[0.18em] text-cyan-300/70">
                    02
                  </div>
                  <div className="mt-1 text-[11px] font-medium text-slate-300">
                    GIS ANALYTICS
                  </div>
                </div>

                <div>
                  <div className="font-mono text-[9px] tracking-[0.18em] text-cyan-300/70">
                    03
                  </div>
                  <div className="mt-1 text-[11px] font-medium text-slate-300">
                    TELEMETRY
                  </div>
                </div>

                <div>
                  <div className="font-mono text-[9px] tracking-[0.18em] text-cyan-300/70">
                    04
                  </div>
                  <div className="mt-1 text-[11px] font-medium text-slate-300">
                    MISSION CONTROL
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-10 flex items-center justify-between gap-4 font-mono text-[8px] tracking-[0.2em] text-slate-600">
              <span>
                MACH-X // GEOSPATIAL RECONSTRUCTION SYSTEM
              </span>

              <span className="hidden items-center gap-2 sm:flex">
                <i className="h-1.5 w-1.5 rounded-full bg-cyan-400/70" />
                SYSTEM ONLINE
              </span>
            </div>
          </section>

          {/* ================= RIGHT ================= */}
          <section className="flex items-center justify-center lg:justify-end lg:pr-10">
            <div className="w-full max-w-[500px]">
              {/* authentication label */}
              <div className="mb-5 flex items-center gap-3 pl-1 font-mono text-[10px] tracking-[0.3em] text-cyan-300/75">
                <LockIcon />
                <span>OPERATOR AUTHENTICATION</span>
              </div>

              {/* CARD */}
              <div className="relative overflow-hidden rounded-[22px] border border-white/[0.10] bg-[#0c1421]/90 shadow-[0_30px_100px_rgba(0,0,0,.45)] backdrop-blur-2xl">
                {/* top cyan line */}
                <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />

                {/* subtle glow */}
                <div className="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-cyan-400/[0.035] blur-[70px]" />

                <div className="relative p-7 sm:p-9">
                  {/* heading */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between">
                      <h2 className="text-[30px] font-semibold tracking-[-0.035em] text-white sm:text-[34px]">
                        Welcome back.
                      </h2>

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.05] text-cyan-300">
                        <LockIcon />
                      </div>
                    </div>

                    <p className="mt-2 text-[13px] leading-6 text-slate-500">
                      Sign in to access the MACH-X mission console.
                    </p>
                  </div>

                  {/* form */}
                  <form onSubmit={handleLogin} className="space-y-5">
                    {/* email */}
                    <div>
                      <label className="mb-2 block font-mono text-[9px] font-medium tracking-[0.22em] text-slate-400">
                        EMAIL ADDRESS
                      </label>

                      <div className="group relative">
                        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-cyan-300/70">
                          <MailIcon />
                        </div>

                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="operator@example.com"
                          required
                          autoComplete="email"
                          className="h-[58px] w-full rounded-xl border border-white/[0.09] bg-[#060d17]/80 pl-12 pr-4 text-[14px] text-white outline-none transition-all placeholder:text-slate-700 hover:border-white/[0.14] focus:border-cyan-300/45 focus:bg-[#07111d] focus:shadow-[0_0_0_3px_rgba(76,215,246,.045)]"
                        />
                      </div>
                    </div>

                    {/* password */}
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <label className="font-mono text-[9px] font-medium tracking-[0.22em] text-slate-400">
                          PASSWORD
                        </label>

                        <button
                          type="button"
                          className="font-mono text-[9px] tracking-[0.16em] text-cyan-300/60 transition-colors hover:text-cyan-300"
                          onClick={() => {
                            setError('Password recovery is not configured yet.');
                          }}
                        >
                          FORGOT?
                        </button>
                      </div>

                      <div className="group relative">
                        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-cyan-300/70">
                          <LockIcon />
                        </div>

                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          required
                          autoComplete="current-password"
                          className="h-[58px] w-full rounded-xl border border-white/[0.09] bg-[#060d17]/80 pl-12 pr-4 text-[14px] text-white outline-none transition-all placeholder:text-slate-700 hover:border-white/[0.14] focus:border-cyan-300/45 focus:bg-[#07111d] focus:shadow-[0_0_0_3px_rgba(76,215,246,.045)]"
                        />
                      </div>
                    </div>

                    {/* keep signed in */}
                    <label className="flex cursor-pointer items-center gap-3 pt-1 text-[12px] text-slate-400">
                      <span className="flex h-[18px] w-[18px] items-center justify-center rounded border border-cyan-300/30 bg-cyan-300/10 text-cyan-300">
                        <CheckIcon />
                      </span>

                      <span>Keep me signed in</span>
                    </label>

                    {/* error */}
                    {error && (
                      <div className="rounded-xl border border-red-400/15 bg-red-400/[0.05] px-4 py-3 text-[12px] leading-5 text-red-300">
                        {error}
                      </div>
                    )}

                    {/* submit */}
                    <button
                      type="submit"
                      disabled={loading || success}
                      className="group relative mt-1 flex h-[58px] w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-cyan-300 font-mono text-[11px] font-bold tracking-[0.22em] text-[#03131a] transition-all duration-200 hover:-translate-y-[1px] hover:bg-cyan-200 hover:shadow-[0_12px_35px_rgba(76,215,246,.16)] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {!loading && !success && (
                        <>
                          <span>SIGN IN</span>
                          <ArrowIcon />
                        </>
                      )}

                      {loading && !success && (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#03131a]/30 border-t-[#03131a]" />
                          <span>AUTHENTICATING</span>
                        </>
                      )}

                      {success && (
                        <>
                          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#03131a]/50">
                            <CheckIcon />
                          </span>
                          <span>ACCESS GRANTED</span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* divider */}
                  <div className="my-7 flex items-center gap-4">
                    <div className="h-px flex-1 bg-white/[0.07]" />
                    <span className="font-mono text-[8px] tracking-[0.16em] text-slate-600">
                      SECURE SESSION
                    </span>
                    <div className="h-px flex-1 bg-white/[0.07]" />
                  </div>

                  {/* security info */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-white/[0.055] bg-white/[0.018] px-4 py-3">
                      <div className="font-mono text-[8px] tracking-[0.16em] text-slate-600">
                        AUTH
                      </div>
                      <div className="mt-1 text-[11px] text-slate-400">
                        JWT SECURED
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/[0.055] bg-white/[0.018] px-4 py-3">
                      <div className="font-mono text-[8px] tracking-[0.16em] text-slate-600">
                        DATABASE
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                        ONLINE
                      </div>
                    </div>
                  </div>
                </div>

                {/* bottom register section */}
                <div className="border-t border-white/[0.07] bg-black/[0.10] px-7 py-5 sm:px-9">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[12px] text-slate-500">
                      New operator?
                    </span>

                    <Link
                      href="/register"
                      className="group flex items-center gap-2 font-mono text-[10px] font-bold tracking-[0.15em] text-cyan-300 transition-colors hover:text-cyan-200"
                    >
                      CREATE ACCOUNT
                      <ArrowIcon />
                    </Link>
                  </div>
                </div>
              </div>

              {/* bottom system label */}
              <div className="mt-5 flex items-center justify-between px-1 font-mono text-[8px] tracking-[0.18em] text-slate-700">
                <span>SECURE ACCESS NODE // 01</span>
                <span>LOCAL CONSOLE</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* success overlay */}
      {success && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#030811]/75 px-6 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-2xl border border-cyan-300/20 bg-[#0a1420]/95 p-8 text-center shadow-[0_30px_100px_rgba(0,0,0,.6)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-300/10 text-cyan-300">
              <CheckIcon />
            </div>

            <div className="mt-6 font-mono text-[10px] tracking-[0.3em] text-cyan-300">
              AUTHENTICATION SUCCESSFUL
            </div>

            <h3 className="mt-3 text-2xl font-semibold text-white">
              Access granted.
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Opening simulation environment...
            </p>

            <div className="mt-7 h-1 overflow-hidden rounded-full bg-white/[0.06]">
              <div className="h-full w-full origin-left animate-[loginProgress_1.5s_linear] bg-cyan-300" />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes loginProgress {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        @media (max-width: 1023px) {
          .lg\\:grid-cols-\\[1\\.05fr_0\\.95fr\\] {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}