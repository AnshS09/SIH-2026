'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const LOGO_URL = 'https://lh3.googleusercontent.com/aida/AEtjO1WCqaXZ6anYUunP3QwHKAHOM8aWpuM5_PzCPN52ZkD7kIv9yJE_p9HakCHcL67OAnUnt4k7li_dLyDPElTDHKXgRvdCiGAKUeRbEztFS2QxSxImKtDLvNLQPY-92HwK2vjsh7FTT5iZuMUbXYcoZga887of_fkYk6byLXqVI5xCo6HYvwbFJOv8iMIfSmHu6ZlJO6VDZrUWmm1S70zpFmoSJh0fgxQ3VI6C5-rZchND_zX9qwFXvSA8vmQ';

const FOOTER_LINKS = [
  { label: 'Home',       path: '/' },
  { label: 'Technology', path: '/technology' },
  { label: 'Mission',    path: '/mission' },
  { label: 'GIS Portal', path: '/gis-portal' },
];

export default function Footer() {
  const [utc, setUtc] = useState('--:--:--');

  useEffect(() => {
    const tick = () => setUtc(new Date().toISOString().substring(11, 19) + ' UTC');
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="w-full bg-[#060e20] border-t border-[#3d494c]/10">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-10">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-3 max-w-sm">
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="Logo" className="h-6 w-auto" src={LOGO_URL} />
              <span className="text-[#dae2fd] text-[13px] font-bold uppercase tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                AeroMetric
              </span>
            </div>
            <p className="text-[#bcc9cd] text-[13px] leading-relaxed opacity-70" style={{ fontFamily: 'Inter' }}>
              Transforming single-pass drone video into high-fidelity 3D reconstructions, in real-time.
            </p>
          </div>

          {/* Nav */}
          <div className="flex flex-col gap-3">
            <span className="text-[#869397] text-[10px] uppercase tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Navigate</span>
            <div className="flex flex-col gap-2">
              {FOOTER_LINKS.map(({ label, path }) => (
                <Link key={path} href={path} className="text-[#bcc9cd] hover:text-[#4cd7f6] text-[13px] transition-colors" style={{ fontFamily: 'Inter' }}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* System status */}
          <div className="flex flex-col gap-3">
            <span className="text-[#869397] text-[10px] uppercase tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace" }}>System Status</span>
            <div className="flex flex-col gap-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              <div className="flex items-center gap-2">
                <span className="flex h-1.5 w-1.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4cd7f6] opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#4cd7f6]" />
                </span>
                <span className="text-[#bcc9cd] text-[12px]">All systems operational</span>
              </div>
              <span className="text-[#4cd7f6] text-[12px] tabular-nums">{utc}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-[#3d494c]/10">
          <div className="flex items-center gap-1">
            <span
              className="text-[#bcc9cd] opacity-50 text-[10px] font-bold uppercase tracking-widest"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              AeroMetric Tactical Ops
            </span>
          </div>
          <div
            className="text-[#bcc9cd] text-[12px] opacity-40 uppercase tracking-wider"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Secure Geospatial Reconstruction Protocol © 2024–2026
          </div>
        </div>
      </div>
    </footer>
  );
}
