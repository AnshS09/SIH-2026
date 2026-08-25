'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LOGO_URL = 'https://lh3.googleusercontent.com/aida/AEtjO1WCqaXZ6anYUunP3QwHKAHOM8aWpuM5_PzCPN52ZkD7kIv9yJE_p9HakCHcL67OAnUnt4k7li_dLyDPElTDHKXgRvdCiGAKUeRbEztFS2QxSxImKtDLvNLQPY-92HwK2vjsh7FTT5iZuMUbXYcoZga887of_fkYk6byLXqVI5xCo6HYvwbFJOv8iMIfSmHu6ZlJO6VDZrUWmm1S70zpFmoSJh0fgxQ3VI6C5-rZchND_zX9qwFXvSA8vmQ';

const NAV_LINKS = [
  { label: 'Home',         path: '/' },
  { label: 'Technology',   path: '/technology' },
  { label: 'Mission',      path: '/mission' },
  { label: 'GIS Portal',   path: '/gis-portal' },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <header
      className={[
        'fixed top-0 w-full z-50 transition-all duration-300 border-b',
        scrolled
          ? 'bg-[#0b1326]/90 backdrop-blur-md border-[#3d494c]/30 shadow-[0_1px_24px_rgba(0,0,0,0.35)]'
          : 'bg-[#0b1326]/75 backdrop-blur-md border-[#3d494c]/20',
      ].join(' ')}
    >
      <div className="h-16 w-full px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-4 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="AeroMetric Logo" className="h-8 w-auto object-contain transition-transform group-hover:rotate-[15deg]" src={LOGO_URL} />
          <span className="font-semibold text-2xl text-[#dae2fd] tracking-tight" style={{ fontFamily: 'Inter' }}>
            AEROMETRIC
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-3 h-full">
          {NAV_LINKS.map(({ label, path }) => {
            const active = pathname === path;
            return (
              <Link
                key={path}
                href={path}
                className={[
                  'h-full flex items-center px-1 uppercase transition-all tracking-widest text-[10px] font-bold relative',
                  active
                    ? 'text-[#4cd7f6] border-b-2 border-[#4cd7f6]'
                    : 'text-[#bcc9cd] hover:text-[#4cd7f6]',
                ].join(' ')}
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex w-8 h-8 rounded-full bg-[#4cd7f6] items-center justify-center">
            <span className="material-symbols-outlined text-[#003640] text-[18px]">person</span>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg border border-[#3d494c]/30 bg-[#171f33]/60"
          >
            <span className={`block w-4.5 h-[1.5px] bg-[#dae2fd] transition-transform duration-300 ${menuOpen ? 'translate-y-[5.5px] rotate-45' : ''}`} style={{ width: 18 }} />
            <span className={`block h-[1.5px] bg-[#dae2fd] transition-opacity duration-200 ${menuOpen ? 'opacity-0' : 'opacity-100'}`} style={{ width: 18 }} />
            <span className={`block h-[1.5px] bg-[#dae2fd] transition-transform duration-300 ${menuOpen ? '-translate-y-[5.5px] -rotate-45' : ''}`} style={{ width: 18 }} />
          </button>
        </div>
      </div>

      {/* Mobile nav panel */}
      <div
        className={[
          'md:hidden overflow-hidden transition-all duration-300 ease-out bg-[#0b1326]/97 backdrop-blur-xl border-t',
          menuOpen ? 'max-h-96 border-[#3d494c]/20' : 'max-h-0 border-transparent',
        ].join(' ')}
      >
        <nav className="flex flex-col px-6 py-2">
          {NAV_LINKS.map(({ label, path }) => {
            const active = pathname === path;
            return (
              <Link
                key={path}
                href={path}
                onClick={() => setMenuOpen(false)}
                className={[
                  'py-3.5 uppercase tracking-widest text-[12px] font-bold border-b border-[#3d494c]/10 flex items-center justify-between',
                  active ? 'text-[#4cd7f6]' : 'text-[#bcc9cd]',
                ].join(' ')}
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {label}
                {active && <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6]" />}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
