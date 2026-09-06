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

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <circle
        cx="12"
        cy="8"
        r="3.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M5 20c.7-3.3 3.1-5 7-5s6.3 1.7 7 5"
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
    <div className="relative mx-auto h-[350px] w-full max-w-[620px] overflow-hidden">
      {/* Radar rings */}
      <div className="absolute left-1/2 top-[53%] h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/[0.09]" />

      <div className="absolute left-1/2 top-[53%] h-[230px] w-[230px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/[0.12]" />

      <div className="absolute left-1/2 top-[53%] h-[155px] w-[155px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/[0.15]" />

      {/* Crosshair */}
      <div className="absolute left-1/2 top-[53%] h-[310px] w-px -translate-x-1/2 bg-cyan-400/[0.06]" />

      <div className="absolute left-1/2 top-[53%] h-px w-[400px] -translate-x-1/2 bg-cyan-400/[0.06]" />

      {/* Glow */}
      <div className="absolute left-1/2 top-[53%] h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-[45px]" />

      <div className="absolute left-[53%] top-[39%] h-24 w-24 rounded-full bg-amber-300/10 blur-[40px]" />

      <svg
        viewBox="0 0 600 350"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="registerTerrain" x1="0" x2="1">
            <stop offset="0%" stopColor="#28d7f5" stopOpacity=".25" />
            <stop offset="55%" stopColor="#4cd7f6" stopOpacity=".9" />
            <stop offset="100%" stopColor="#ffb95f" stopOpacity=".8" />
          </linearGradient>

          <linearGradient
            id="registerFill"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0%" stopColor="#4cd7f6" stopOpacity=".11" />
            <stop offset="100%" stopColor="#ffb95f" stopOpacity=".06" />
          </linearGradient>
        </defs>

        {/* Outer terrain */}
        <path
          d="M125 195 L235 115 L385 100 L480 175 L430 260 L285 295 L150 255 Z"
          fill="url(#registerFill)"
          stroke="url(#registerTerrain)"
          strokeWidth="1.5"
        />

        {/* Terrain contours */}
        <path
          d="M155 200 L245 140 L365 127 L445 180 L405 238 L285 268 L175 240 Z"
          fill="none"
          stroke="#4cd7f6"
          strokeOpacity=".36"
        />

        <path
          d="M188 205 L260 162 L350 154 L415 185 L380 218 L290 243 L205 230 Z"
          fill="none"
          stroke="#4cd7f6"
          strokeOpacity=".4"
        />

        <path
          d="M222 206 L278 180 L338 174 L382 189 L356 206 L295 223 L238 220 Z"
          fill="none"
          stroke="#ffb95f"
          strokeOpacity=".42"
        />

        {/* Height lines */}
        <path
          d="M235 115 L260 162 L278 180"
          fill="none"
          stroke="#4cd7f6"
          strokeOpacity=".32"
        />

        <path
          d="M385 100 L365 127 L350 154 L338 174"
          fill="none"
          stroke="#4cd7f6"
          strokeOpacity=".38"
        />

        <path
          d="M480 175 L445 180 L415 185 L382 189"
          fill="none"
          stroke="#4cd7f6"
          strokeOpacity=".3"
        />

        <path
          d="M430 260 L405 238 L380 218 L356 206"
          fill="none"
          stroke="#ffb95f"
          strokeOpacity=".3"
        />

        <path
          d="M285 295 L285 268 L290 243 L295 223"
          fill="none"
          stroke="#4cd7f6"
          strokeOpacity=".3"
        />

        <path
          d="M150 255 L175 240 L205 230 L238 220"
          fill="none"
          stroke="#4cd7f6"
          strokeOpacity=".28"
        />

        {/* Vertical reconstruction beams */}
        <path
          d="M285 268 L285 335"
          stroke="#4cd7f6"
          strokeOpacity=".2"
          strokeDasharray="3 6"
        />

        <path
          d="M150 255 L120 315"
          stroke="#4cd7f6"
          strokeOpacity=".15"
          strokeDasharray="3 7"
        />

        <path
          d="M430 260 L470 310"
          stroke="#ffb95f"
          strokeOpacity=".16"
          strokeDasharray="3 7"
        />

        {/* Central node */}
        <circle
          cx="295"
          cy="206"
          r="13"
          fill="none"
          stroke="#ffb95f"
          strokeOpacity=".3"
        />

        <circle
          cx="295"
          cy="206"
          r="7"
          fill="#ffb95f"
          fillOpacity=".18"
        />

        <circle
          cx="295"
          cy="206"
          r="3"
          fill="#ffb95f"
        />

        {/* Point cloud */}
        <g fill="#4cd7f6">
          <circle cx="205" cy="170" r="1.5" />
          <circle cx="220" cy="150" r="1.3" />
          <circle cx="238" cy="135" r="1.2" />
          <circle cx="260" cy="120" r="1.3" />
          <circle cx="410" cy="145" r="1.4" />
          <circle cx="430" cy="165" r="1.2" />
          <circle cx="450" cy="200" r="1.5" />
          <circle cx="425" cy="230" r="1.3" />
          <circle cx="395" cy="255" r="1.1" />
          <circle cx="225" cy="255" r="1.3" />
          <circle cx="195" cy="240" r="1.1" />
          <circle cx="170" cy="220" r="1.4" />
        </g>
      </svg>

      {/* HUD labels */}
      <div className="absolute left-[7%] top-[23%] font-mono text-[9px] tracking-[0.18em] text-cyan-300/50">
        POINT CLOUD
      </div>

      <div className="absolute right-[8%] top-[28%] font-mono text-[9px] tracking-[0.16em] text-cyan-300/45">
        MESH / 3D
      </div>

      <div className="absolute bottom-[8%] left-[17%] font-mono text-[9px] tracking-[0.15em] text-slate-600">
        X: 2304.22
      </div>

      <div className="absolute bottom-[8%] left-[35%] font-mono text-[9px] tracking-[0.15em] text-slate-600">
        Y: 1846.42
      </div>

      <div className="absolute bottom-[8%] right-[18%] font-mono text-[9px] tracking-[0.15em] text-slate-600">
        Z: 0865.12
      </div>

      {/* Center label */}
      <div className="absolute left-1/2 top-[53%] -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="font-mono text-[9px] tracking-[0.35em] text-cyan-300/50">
          NEW OPERATOR
        </div>

        <div className="mt-2 text-[11px] font-medium tracking-[0.25em] text-white/55">
          MISSION ACCESS
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();

    setError('');

    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        'http://localhost:5000/api/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || 'Registration failed'
        );
      }

      setSuccess(true);

      setTimeout(() => {
        router.push('/login');
      }, 1600);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to create account'
      );

      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#050b14] text-[#e7eefb]">
      {/* ================= BACKGROUND ================= */}

      <div className="pointer-events-none fixed inset-0">
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

        {/* Cyan glow */}
        <div className="absolute -left-[15%] -top-[20%] h-[65%] w-[55%] rounded-full bg-cyan-400/[0.045] blur-[130px]" />

        {/* Bottom glow */}
        <div className="absolute -bottom-[30%] left-[25%] h-[50%] w-[45%] rounded-full bg-cyan-500/[0.025] blur-[120px]" />

        {/* Amber glow */}
        <div className="absolute -right-[15%] -top-[15%] h-[55%] w-[40%] rounded-full bg-amber-300/[0.025] blur-[130px]" />

        {/* Center divider */}
        <div className="absolute right-[47%] top-0 h-full w-px bg-cyan-300/[0.025]" />
      </div>

      {/* ================= PAGE FRAME ================= */}

      <div className="relative mx-auto min-h-screen max-w-[1800px] px-6 py-6 sm:px-8 lg:px-10">
        {/* outer border */}
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
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.04]">
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
              <div className="mb-5 flex items-center gap-3 font-mono text-[10px] tracking-[0.32em] text-cyan-300/65">
                <span className="h-px w-8 bg-cyan-300/50" />
                AERIAL INTELLIGENCE PLATFORM
              </div>

              <h1 className="text-[clamp(3rem,5.4vw,5.8rem)] font-semibold leading-[0.92] tracking-[-0.055em]">
                Capture.
                <br />
                <span className="text-cyan-300">
                  Reconstruct.
                </span>
                <br />
                <span className="text-amber-200">
                  Understand.
                </span>
              </h1>

              <p className="mt-7 max-w-[500px] text-[15px] leading-7 text-slate-400 sm:text-[16px]">
                Create your secure operator account and access
                the MACH-X mission console for aerial
                reconstruction and geospatial intelligence.
              </p>

              {/* Terrain visual */}
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
              {/* label */}
              <div className="mb-5 flex items-center gap-3 pl-1 font-mono text-[10px] tracking-[0.3em] text-cyan-300/75">
                <UserIcon />
                <span>OPERATOR REGISTRATION</span>
              </div>

              {/* Card */}
              <div className="relative overflow-hidden rounded-[22px] border border-white/[0.10] bg-[#0c1421]/90 shadow-[0_30px_100px_rgba(0,0,0,.45)] backdrop-blur-2xl">
                {/* top cyan line */}
                <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />

                {/* glow */}
                <div className="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-cyan-400/[0.035] blur-[70px]" />

                <div className="relative p-7 sm:p-9">
                  {/* Heading */}
                  <div className="mb-7">
                    <div className="flex items-center justify-between">
                      <h2 className="text-[30px] font-semibold tracking-[-0.035em] text-white sm:text-[34px]">
                        Create account.
                      </h2>

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.05] text-cyan-300">
                        <UserIcon />
                      </div>
                    </div>

                    <p className="mt-2 text-[13px] leading-6 text-slate-500">
                      Register as an operator to enter the
                      MACH-X mission console.
                    </p>
                  </div>

                  {/* Form */}
                  <form
                    onSubmit={handleRegister}
                    className="space-y-4"
                  >
                    {/* Name */}
                    <div>
                      <label className="mb-2 block font-mono text-[9px] font-medium tracking-[0.22em] text-slate-400">
                        OPERATOR NAME
                      </label>

                      <div className="group relative">
                        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-cyan-300/70">
                          <UserIcon />
                        </div>

                        <input
                          type="text"
                          value={name}
                          onChange={(e) =>
                            setName(e.target.value)
                          }
                          placeholder="Enter your name"
                          required
                          autoComplete="name"
                          className="h-[55px] w-full rounded-xl border border-white/[0.09] bg-[#060d17]/80 pl-12 pr-4 text-[14px] text-white outline-none transition-all placeholder:text-slate-700 hover:border-white/[0.14] focus:border-cyan-300/45 focus:bg-[#07111d] focus:shadow-[0_0_0_3px_rgba(76,215,246,.045)]"
                        />
                      </div>
                    </div>

                    {/* Email */}
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
                          onChange={(e) =>
                            setEmail(e.target.value)
                          }
                          placeholder="operator@example.com"
                          required
                          autoComplete="email"
                          className="h-[55px] w-full rounded-xl border border-white/[0.09] bg-[#060d17]/80 pl-12 pr-4 text-[14px] text-white outline-none transition-all placeholder:text-slate-700 hover:border-white/[0.14] focus:border-cyan-300/45 focus:bg-[#07111d] focus:shadow-[0_0_0_3px_rgba(76,215,246,.045)]"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="mb-2 block font-mono text-[9px] font-medium tracking-[0.22em] text-slate-400">
                        PASSWORD
                      </label>

                      <div className="group relative">
                        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-cyan-300/70">
                          <LockIcon />
                        </div>

                        <input
                          type="password"
                          value={password}
                          onChange={(e) =>
                            setPassword(e.target.value)
                          }
                          placeholder="Create a password"
                          required
                          autoComplete="new-password"
                          className="h-[55px] w-full rounded-xl border border-white/[0.09] bg-[#060d17]/80 pl-12 pr-4 text-[14px] text-white outline-none transition-all placeholder:text-slate-700 hover:border-white/[0.14] focus:border-cyan-300/45 focus:bg-[#07111d] focus:shadow-[0_0_0_3px_rgba(76,215,246,.045)]"
                        />
                      </div>
                    </div>

                    {/* Confirm password */}
                    <div>
                      <label className="mb-2 block font-mono text-[9px] font-medium tracking-[0.22em] text-slate-400">
                        CONFIRM PASSWORD
                      </label>

                      <div className="group relative">
                        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-cyan-300/70">
                          <LockIcon />
                        </div>

                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) =>
                            setConfirmPassword(
                              e.target.value
                            )
                          }
                          placeholder="Repeat your password"
                          required
                          autoComplete="new-password"
                          className="h-[55px] w-full rounded-xl border border-white/[0.09] bg-[#060d17]/80 pl-12 pr-4 text-[14px] text-white outline-none transition-all placeholder:text-slate-700 hover:border-white/[0.14] focus:border-cyan-300/45 focus:bg-[#07111d] focus:shadow-[0_0_0_3px_rgba(76,215,246,.045)]"
                        />
                      </div>
                    </div>

                    {/* Error */}
                    {error && (
                      <div className="rounded-xl border border-red-400/15 bg-red-400/[0.05] px-4 py-3 text-[12px] leading-5 text-red-300">
                        {error}
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading || success}
                      className="group relative mt-1 flex h-[57px] w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-cyan-300 font-mono text-[11px] font-bold tracking-[0.22em] text-[#03131a] transition-all duration-200 hover:-translate-y-[1px] hover:bg-cyan-200 hover:shadow-[0_12px_35px_rgba(76,215,246,.16)] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {!loading && !success && (
                        <>
                          <span>CREATE ACCOUNT</span>
                          <ArrowIcon />
                        </>
                      )}

                      {loading && !success && (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#03131a]/30 border-t-[#03131a]" />
                          <span>CREATING ACCOUNT</span>
                        </>
                      )}

                      {success && (
                        <>
                          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#03131a]/50">
                            <CheckIcon />
                          </span>

                          <span>ACCOUNT CREATED</span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="my-6 flex items-center gap-4">
                    <div className="h-px flex-1 bg-white/[0.07]" />

                    <span className="font-mono text-[8px] tracking-[0.16em] text-slate-600">
                      SECURE REGISTRATION
                    </span>

                    <div className="h-px flex-1 bg-white/[0.07]" />
                  </div>

                  {/* Security info */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-white/[0.055] bg-white/[0.018] px-4 py-3">
                      <div className="font-mono text-[8px] tracking-[0.16em] text-slate-600">
                        PASSWORD
                      </div>

                      <div className="mt-1 text-[11px] text-slate-400">
                        BCRYPT SECURED
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

                {/* Login footer */}
                <div className="border-t border-white/[0.07] bg-black/[0.10] px-7 py-5 sm:px-9">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[12px] text-slate-500">
                      Already an operator?
                    </span>

                    <Link
                      href="/login"
                      className="group flex items-center gap-2 font-mono text-[10px] font-bold tracking-[0.15em] text-cyan-300 transition-colors hover:text-cyan-200"
                    >
                      SIGN IN
                      <ArrowIcon />
                    </Link>
                  </div>
                </div>
              </div>

              {/* bottom label */}
              <div className="mt-5 flex items-center justify-between px-1 font-mono text-[8px] tracking-[0.18em] text-slate-700">
                <span>SECURE ACCESS NODE // 02</span>
                <span>LOCAL CONSOLE</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ================= SUCCESS OVERLAY ================= */}

      {success && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#030811]/75 px-6 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-2xl border border-cyan-300/20 bg-[#0a1420]/95 p-8 text-center shadow-[0_30px_100px_rgba(0,0,0,.6)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-300/10 text-cyan-300">
              <CheckIcon />
            </div>

            <div className="mt-6 font-mono text-[10px] tracking-[0.3em] text-cyan-300">
              OPERATOR REGISTERED
            </div>

            <h3 className="mt-3 text-2xl font-semibold text-white">
              Account created.
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Your operator profile has been added to the
              secure database.
            </p>

            <div className="mt-7 h-1 overflow-hidden rounded-full bg-white/[0.06]">
              <div className="h-full w-full origin-left animate-[registerProgress_1.6s_linear] bg-cyan-300" />
            </div>

            <div className="mt-3 font-mono text-[8px] tracking-[0.18em] text-slate-600">
              REDIRECTING TO LOGIN
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes registerProgress {
          from {
            transform: scaleX(0);
          }

          to {
            transform: scaleX(1);
          }
        }

        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-text-fill-color: #ffffff !important;
          -webkit-box-shadow: 0 0 0px 1000px #060d17 inset !important;
          box-shadow: 0 0 0px 1000px #060d17 inset !important;
          caret-color: #ffffff;
          transition: background-color 9999s ease-in-out 0s;
        }
      `}</style>
    </main>
  );
}