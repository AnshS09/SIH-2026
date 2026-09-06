'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Technology', path: '/technology' },
  { label: 'Mission', path: '/mission' },
  { label: 'Simulator', path: '/simulator' },
  { label: '3D Viewer', path: '/3d-viewer' },
];

type User = {
  name?: string;
  email?: string;
};

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <circle
        cx="12"
        cy="8"
        r="3.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M5 20c.7-3.3 3.1-5 7-5s6.3 1.7 7 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path
        d="M10 5H5v14h5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 8l4 4-4 4M17 12H9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
      <path
        d="m7 9 5 5 5-5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  /* ================= AUTH ================= */

  useEffect(() => {
    setMounted(true);

    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('auth_user');

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };

    loadUser();

    window.addEventListener('storage', loadUser);

    return () => {
      window.removeEventListener('storage', loadUser);
    };
  }, []);

  /* ================= SCROLL ================= */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  /* ================= CLOSE DROPDOWN ================= */

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (!target.closest('[data-profile-menu]')) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };
  }, []);

  /* ================= LOGOUT ================= */

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');

    setUser(null);
    setProfileOpen(false);

    router.push('/login');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0b1326]/90 backdrop-blur-xl border-b border-white/[0.06]'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-[1600px] px-5 sm:px-7 lg:px-10">
        <div className="h-[76px] flex items-center justify-between">

          {/* ================= BRAND ================= */}

          <Link
            href="/"
            className="flex items-center gap-3 shrink-0 group"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.035] transition group-hover:border-cyan-300/40 group-hover:bg-cyan-300/[0.06]">
              <img
                src="/mach-x-logo-white.png"
                alt="MACH-X"
                className="h-8 w-8 object-contain"
              />
            </div>

            <div className="hidden sm:block">
              <div className="font-mono text-[15px] font-bold tracking-[0.25em] text-white">
                MACH-X
              </div>

              <div className="mt-0.5 font-mono text-[7px] tracking-[0.3em] text-cyan-300/55">
                GEOSPATIAL INTELLIGENCE
              </div>
            </div>
          </Link>

          {/* ================= NAVIGATION ================= */}

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.path ||
                (link.path !== '/' &&
                  pathname.startsWith(link.path));

              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`relative px-4 py-2 text-[11px] font-medium tracking-[0.08em] transition-colors ${
                    isActive
                      ? 'text-[#4cd7f6]'
                      : 'text-[#869397] hover:text-[#dae2fd]'
                  }`}
                >
                  {link.label.toUpperCase()}

                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-px bg-[#4cd7f6]/70" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ================= RIGHT ================= */}

          <div className="flex items-center gap-3">

            {/* System status */}

            <div className="hidden lg:flex items-center gap-2 mr-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4cd7f6] shadow-[0_0_8px_rgba(76,215,246,.65)]" />

              <span className="font-mono text-[8px] tracking-[0.18em] text-[#69797d]">
                SYSTEM ONLINE
              </span>
            </div>

            {/* ================= PROFILE ================= */}

            {mounted && (
              <div
                className="relative"
                data-profile-menu
              >
                <button
                  type="button"
                  onClick={() =>
                    setProfileOpen((prev) => !prev)
                  }
                  className={`flex items-center gap-2 rounded-xl border px-2 py-2 transition-all ${
                    profileOpen
                      ? 'border-cyan-300/30 bg-cyan-300/[0.07]'
                      : 'border-white/[0.08] bg-white/[0.025] hover:border-white/[0.14] hover:bg-white/[0.045]'
                  }`}
                  aria-label="Profile menu"
                >
                  {/* Avatar */}

                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                      user
                        ? 'bg-[#4cd7f6] text-[#003640]'
                        : 'bg-[#4cd7f6]/10 text-[#4cd7f6]'
                    }`}
                  >
                    <PersonIcon />
                  </div>

                  {/* User label */}

                  <div className="hidden sm:block text-left">
                    <div className="max-w-[110px] truncate text-[10px] font-medium text-[#dae2fd]">
                      {user?.name || 'Operator'}
                    </div>

                    <div className="font-mono text-[7px] tracking-[0.12em] text-[#69797d]">
                      {user
                        ? 'AUTHENTICATED'
                        : 'SIGN IN'}
                    </div>
                  </div>

                  <ChevronIcon />
                </button>

                {/* ================= DROPDOWN ================= */}

                {profileOpen && (
                  <div className="absolute right-0 top-[calc(100%+10px)] w-[290px] overflow-hidden rounded-2xl border border-white/[0.10] bg-[#0b1422]/95 shadow-[0_25px_70px_rgba(0,0,0,.55)] backdrop-blur-2xl">

                    {/* top accent */}

                    <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />

                    {user ? (
                      <>
                        {/* User */}

                        <div className="p-4">
                          <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#4cd7f6] text-[#003640]">
                              <PersonIcon />
                            </div>

                            <div className="min-w-0">
                              <div className="truncate text-sm font-semibold text-white">
                                {user.name || 'Operator'}
                              </div>

                              <div className="mt-0.5 truncate text-[11px] text-slate-500">
                                {user.email || 'No email'}
                              </div>
                            </div>

                          </div>
                        </div>

                        {/* Session */}

                        <div className="border-y border-white/[0.06] px-4 py-3">

                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[8px] tracking-[0.16em] text-slate-600">
                              SESSION STATUS
                            </span>

                            <span className="flex items-center gap-1.5 font-mono text-[8px] tracking-[0.12em] text-cyan-300">
                              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_6px_rgba(76,215,246,.7)]" />
                              ACTIVE
                            </span>
                          </div>

                          <div className="mt-3 grid grid-cols-2 gap-2">

                            <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-2.5">
                              <div className="font-mono text-[7px] tracking-[0.12em] text-slate-600">
                                ACCESS
                              </div>

                              <div className="mt-1 text-[10px] text-slate-400">
                                Mission Console
                              </div>
                            </div>

                            <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-2.5">
                              <div className="font-mono text-[7px] tracking-[0.12em] text-slate-600">
                                AUTH
                              </div>

                              <div className="mt-1 text-[10px] text-slate-400">
                                JWT Session
                              </div>
                            </div>

                          </div>
                        </div>

                        {/* Logout */}

                        <div className="p-2">
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[11px] text-slate-400 transition hover:bg-red-400/[0.06] hover:text-red-300"
                          >
                            <LogoutIcon />

                            <span className="font-mono text-[9px] tracking-[0.14em]">
                              LOG OUT
                            </span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Logged out */}

                        <div className="p-5">

                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.05] text-cyan-300">
                              <PersonIcon />
                            </div>

                            <div>
                              <div className="text-sm font-semibold text-white">
                                Operator Access
                              </div>

                              <div className="mt-1 text-[10px] text-slate-500">
                                Sign in to access missions.
                              </div>
                            </div>
                          </div>

                          <Link
                            href="/login"
                            onClick={() =>
                              setProfileOpen(false)
                            }
                            className="mt-4 flex h-11 items-center justify-center rounded-xl bg-[#4cd7f6] font-mono text-[9px] font-bold tracking-[0.18em] text-[#003640] transition hover:bg-cyan-200"
                          >
                            SIGN IN
                          </Link>

                          <div className="mt-3 text-center">
                            <span className="text-[10px] text-slate-600">
                              New operator?
                            </span>

                            <Link
                              href="/register"
                              onClick={() =>
                                setProfileOpen(false)
                              }
                              className="ml-1 font-mono text-[9px] tracking-[0.12em] text-cyan-300 hover:text-cyan-200"
                            >
                              CREATE ACCOUNT
                            </Link>
                          </div>

                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
