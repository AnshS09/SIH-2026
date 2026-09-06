'use client';

import { useState } from 'react';

type ViewMode = 'TEXTURED' | 'WIREFRAME' | 'POINT CLOUD';

export default function Viewer3DPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('TEXTURED');

  return (
    <main className="min-h-screen bg-[#050b14] pt-[76px] text-white">
      <div className="mx-auto max-w-[1600px] px-5 py-6 sm:px-7 lg:px-10">

        {/* HEADER */}
        <div className="mb-5 flex items-end justify-between">
          <div>
            <div className="mb-1 font-mono text-[9px] tracking-[0.25em] text-cyan-300/60">
              MACH-X / RECONSTRUCTION OUTPUT
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-white">
              3D Model Viewer
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Inspect and analyze reconstructed geospatial models.
            </p>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(76,215,246,.7)]" />
            <span className="font-mono text-[9px] tracking-[0.16em] text-slate-500">
              VIEWER READY
            </span>
          </div>
        </div>

        {/* MAIN */}
        <div className="grid gap-4 lg:grid-cols-[1fr_300px]">

          {/* 3D VIEWER */}
          <section className="relative min-h-[620px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#08111d]">

            {/* GRID */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(76,215,246,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(76,215,246,0.08) 1px, transparent 1px)',
                backgroundSize: '45px 45px',
              }}
            />

            {/* VIEWER PLACEHOLDER */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">

              {/* Ground plane */}
              <div
                className="absolute bottom-[7%] left-1/2 h-[58%] w-[75%] -translate-x-1/2 rotate-[0deg] border border-cyan-300/[0.10]"
                style={{
                  transform: 'translateX(-50%) perspective(700px) rotateX(58deg)',
                }}
              />

              {/* Reconstructed terrain/model */}
              <div className="relative h-[300px] w-[620px]">

                {/* Terrain blocks */}
                <div className="absolute bottom-[40px] left-[55px] h-[90px] w-[130px] border border-cyan-300/20 bg-cyan-300/[0.035]" />
                <div className="absolute bottom-[40px] left-[205px] h-[150px] w-[100px] border border-cyan-300/20 bg-cyan-300/[0.035]" />
                <div className="absolute bottom-[40px] left-[325px] h-[115px] w-[125px] border border-cyan-300/20 bg-cyan-300/[0.035]" />
                <div className="absolute bottom-[40px] right-[15px] h-[75px] w-[90px] border border-cyan-300/20 bg-cyan-300/[0.035]" />

                {/* Building wireframe lines */}
                <div className="absolute bottom-[40px] left-[205px] h-[150px] w-[100px]">
                  <div className="absolute left-1/2 top-0 h-full border-l border-cyan-300/10" />
                  <div className="absolute left-0 top-1/3 w-full border-t border-cyan-300/10" />
                  <div className="absolute left-0 top-2/3 w-full border-t border-cyan-300/10" />
                </div>

                {/* Terrain connection lines */}
                <div className="absolute bottom-[39px] left-[55px] h-px w-[395px] bg-cyan-300/20" />

                {/* Center model marker */}
                <div className="absolute left-1/2 top-[30%] -translate-x-1/2">
                  <div className="h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(76,215,246,.9)]" />

                  <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/20" />
                </div>

                {/* Axis */}
                <div className="absolute bottom-0 left-1/2 h-[55px] w-px bg-cyan-300/20" />
                <div className="absolute bottom-0 left-1/2 h-px w-[90px] bg-cyan-300/20" />

                <span className="absolute bottom-[-15px] left-[calc(50%+48px)] font-mono text-[7px] text-cyan-300/50">
                  X
                </span>

                <span className="absolute bottom-[58px] left-[calc(50%+5px)] font-mono text-[7px] text-cyan-300/50">
                  Z
                </span>
              </div>
            </div>

            {/* TOP LEFT INFO */}
            <div className="absolute left-4 top-4 rounded-lg border border-white/[0.07] bg-[#07101c]/85 px-3 py-2 backdrop-blur">
              <div className="font-mono text-[8px] tracking-[0.16em] text-slate-600">
                MODEL
              </div>

              <div className="mt-1 text-[11px] text-slate-300">
                Reconstruction Output
              </div>
            </div>

            {/* TOP RIGHT */}
            <div className="absolute right-4 top-4 rounded-lg border border-white/[0.07] bg-[#07101c]/85 px-3 py-2 text-right backdrop-blur">
              <div className="font-mono text-[8px] tracking-[0.16em] text-slate-600">
                VIEW MODE
              </div>

              <div className="mt-1 font-mono text-[10px] text-cyan-300">
                {viewMode}
              </div>
            </div>

            {/* CONTROLS */}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-xl border border-white/[0.08] bg-[#07101c]/90 p-1.5 backdrop-blur-xl">

              {(['TEXTURED', 'WIREFRAME', 'POINT CLOUD'] as ViewMode[]).map(
                (mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`rounded-lg px-4 py-2.5 font-mono text-[8px] tracking-[0.12em] transition ${
                      viewMode === mode
                        ? 'bg-cyan-300 text-[#003640]'
                        : 'text-slate-500 hover:bg-white/[0.05] hover:text-slate-300'
                    }`}
                  >
                    {mode}
                  </button>
                )
              )}
            </div>

            {/* VIEW HINT */}
            <div className="absolute bottom-5 left-5 hidden font-mono text-[7px] tracking-[0.12em] text-slate-700 sm:block">
              DRAG TO ROTATE · SCROLL TO ZOOM · SHIFT + DRAG TO PAN
            </div>
          </section>

          {/* RIGHT PANEL */}
          <aside className="space-y-4">

            {/* MODEL STATUS */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#08111d] p-4">
              <div className="mb-4 font-mono text-[9px] tracking-[0.18em] text-slate-600">
                MODEL STATUS
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Pipeline</span>
                <span className="font-mono text-[9px] text-amber-300">
                  STANDBY
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-slate-400">Model</span>
                <span className="font-mono text-[9px] text-cyan-300">
                  PREVIEW
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-slate-400">Source</span>
                <span className="font-mono text-[9px] text-slate-500">
                  PENDING
                </span>
              </div>
            </div>

            {/* MODEL INFO */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#08111d] p-4">
              <div className="mb-4 font-mono text-[9px] tracking-[0.18em] text-slate-600">
                MODEL INFORMATION
              </div>

              <div className="space-y-3">
                {[
                  ['FORMAT', 'GLB / GLTF'],
                  ['VERTICES', '—'],
                  ['FACES', '—'],
                  ['TEXTURES', '—'],
                  ['COORDINATE', 'WGS84'],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between border-b border-white/[0.04] pb-2 last:border-0 last:pb-0"
                  >
                    <span className="font-mono text-[8px] tracking-[0.1em] text-slate-600">
                      {label}
                    </span>

                    <span className="font-mono text-[9px] text-slate-400">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* PIPELINE */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#08111d] p-4">
              <div className="mb-4 font-mono text-[9px] tracking-[0.18em] text-slate-600">
                RECONSTRUCTION PIPELINE
              </div>

              <div className="space-y-2">
                {[
                  ['01', 'Drone Video', 'WAITING'],
                  ['02', 'Semantic Masking', 'WAITING'],
                  ['03', '3D Reconstruction', 'WAITING'],
                  ['04', 'Model Output', 'WAITING'],
                ].map(([num, label, status]) => (
                  <div
                    key={num}
                    className="rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2.5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[8px] text-cyan-300/60">
                        {num}
                      </span>

                      <span className="text-[10px] text-slate-400">
                        {label}
                      </span>

                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-slate-700" />
                    </div>

                    <div className="mt-1 pl-5 font-mono text-[7px] tracking-[0.12em] text-slate-700">
                      {status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </aside>
        </div>

        {/* FOOTER */}
        <div className="mt-4 flex items-center gap-2 font-mono text-[8px] tracking-[0.12em] text-slate-700">
          <span className="h-1 w-1 rounded-full bg-slate-700" />
          3D VIEWER / RECONSTRUCTION OUTPUT INTEGRATION PENDING
        </div>

      </div>
    </main>
  );
}