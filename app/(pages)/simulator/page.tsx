'use client';

import { useState } from 'react';

export default function SimulatorPage() {
  const [running, setRunning] = useState(false);

  return (
    <main className="min-h-screen bg-[#050b14] pt-[76px] text-white">
      <div className="mx-auto max-w-[1600px] px-5 py-6 sm:px-7 lg:px-10">

        {/* HEADER */}
        <div className="mb-5 flex items-end justify-between">
          <div>
            <div className="mb-1 font-mono text-[9px] tracking-[0.25em] text-cyan-300/60">
              MACH-X / SIMULATION ENVIRONMENT
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Drone Simulator
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Synthetic environment for flight and reconstruction pipeline testing.
            </p>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <span
              className={`h-2 w-2 rounded-full ${
                running
                  ? 'bg-cyan-300 shadow-[0_0_10px_rgba(76,215,246,.8)]'
                  : 'bg-slate-600'
              }`}
            />
            <span className="font-mono text-[9px] tracking-[0.16em] text-slate-500">
              {running ? 'SIMULATION RUNNING' : 'SIMULATION READY'}
            </span>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid gap-4 lg:grid-cols-[1fr_300px]">

          {/* SIMULATOR VIEW */}
          <section className="relative min-h-[620px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#08111d]">

            {/* GRID BACKGROUND */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(76,215,246,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(76,215,246,0.08) 1px, transparent 1px)',
                backgroundSize: '45px 45px',
              }}
            />

            {/* FAKE ENVIRONMENT PLACEHOLDER */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative h-[330px] w-[80%] max-w-[900px]">

                {/* Horizon */}
                <div className="absolute left-0 right-0 top-[38%] border-t border-cyan-300/10" />

                {/* Ground */}
                <div className="absolute bottom-0 left-1/2 h-[55%] w-[90%] -translate-x-1/2 rotate-x-[55deg] border border-cyan-300/10 bg-cyan-300/[0.015]" />

                {/* Buildings */}
                <div className="absolute bottom-[18%] left-[15%] h-24 w-16 border border-cyan-300/15 bg-cyan-300/[0.025]" />
                <div className="absolute bottom-[18%] left-[25%] h-36 w-20 border border-cyan-300/15 bg-cyan-300/[0.025]" />
                <div className="absolute bottom-[18%] left-[39%] h-28 w-14 border border-cyan-300/15 bg-cyan-300/[0.025]" />
                <div className="absolute bottom-[18%] right-[28%] h-40 w-20 border border-cyan-300/15 bg-cyan-300/[0.025]" />
                <div className="absolute bottom-[18%] right-[16%] h-24 w-16 border border-cyan-300/15 bg-cyan-300/[0.025]" />

                {/* Drone marker */}
                <div className="absolute left-1/2 top-[28%] -translate-x-1/2">
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-cyan-300/50 bg-cyan-300/[0.06] shadow-[0_0_35px_rgba(76,215,246,.12)]">
                    <div className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(76,215,246,.9)]" />

                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[8px] tracking-[0.14em] text-cyan-300/70">
                      UAV-01
                    </span>
                  </div>
                </div>

                {/* Center reticle */}
                <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 opacity-40">
                  <div className="absolute left-1/2 top-0 h-3 w-px bg-cyan-300" />
                  <div className="absolute bottom-0 left-1/2 h-3 w-px bg-cyan-300" />
                  <div className="absolute left-0 top-1/2 h-px w-3 bg-cyan-300" />
                  <div className="absolute right-0 top-1/2 h-px w-3 bg-cyan-300" />
                </div>
              </div>
            </div>

            {/* VIEW LABEL */}
            <div className="absolute left-4 top-4 rounded-lg border border-white/[0.07] bg-[#07101c]/80 px-3 py-2 backdrop-blur">
              <div className="font-mono text-[8px] tracking-[0.16em] text-slate-600">
                ENVIRONMENT
              </div>
              <div className="mt-1 text-[11px] text-slate-300">
                Synthetic City
              </div>
            </div>

            {/* TOP RIGHT */}
            <div className="absolute right-4 top-4 rounded-lg border border-white/[0.07] bg-[#07101c]/80 px-3 py-2 text-right backdrop-blur">
              <div className="font-mono text-[8px] tracking-[0.16em] text-slate-600">
                CAMERA
              </div>
              <div className="mt-1 font-mono text-[10px] text-cyan-300">
                FPV / 60 FPS
              </div>
            </div>

            {/* BOTTOM CONTROLS */}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-xl border border-white/[0.08] bg-[#07101c]/90 p-2 backdrop-blur-xl">

              <button
                onClick={() => setRunning(true)}
                className={`rounded-lg px-5 py-2.5 font-mono text-[9px] font-bold tracking-[0.14em] transition ${
                  running
                    ? 'bg-cyan-300 text-[#003640]'
                    : 'border border-cyan-300/20 bg-cyan-300/[0.06] text-cyan-300 hover:bg-cyan-300/[0.12]'
                }`}
              >
                START
              </button>

              <button
                onClick={() => setRunning(false)}
                className="rounded-lg border border-white/[0.07] bg-white/[0.025] px-5 py-2.5 font-mono text-[9px] tracking-[0.14em] text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
              >
                PAUSE
              </button>

              <button
                onClick={() => setRunning(false)}
                className="rounded-lg border border-white/[0.07] bg-white/[0.025] px-5 py-2.5 font-mono text-[9px] tracking-[0.14em] text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
              >
                RESET
              </button>
            </div>
          </section>

          {/* RIGHT PANEL */}
          <aside className="space-y-4">

            {/* STATUS */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#08111d] p-4">
              <div className="mb-4 font-mono text-[9px] tracking-[0.18em] text-slate-600">
                SIMULATOR STATUS
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Environment</span>
                <span className="font-mono text-[9px] text-cyan-300">
                  READY
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-slate-400">Pipeline</span>
                <span className="font-mono text-[9px] text-amber-300">
                  STANDBY
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-slate-400">UAV Link</span>
                <span className="font-mono text-[9px] text-cyan-300">
                  CONNECTED
                </span>
              </div>
            </div>

            {/* TELEMETRY */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#08111d] p-4">
              <div className="mb-4 font-mono text-[9px] tracking-[0.18em] text-slate-600">
                TELEMETRY
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  ['ALTITUDE', '120 m'],
                  ['SPEED', '8.4 m/s'],
                  ['HEADING', '084°'],
                  ['BATTERY', '92%'],
                  ['LATITUDE', '28.61°'],
                  ['LONGITUDE', '77.20°'],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-3"
                  >
                    <div className="font-mono text-[7px] tracking-[0.12em] text-slate-600">
                      {label}
                    </div>
                    <div className="mt-1 font-mono text-[10px] text-slate-300">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PIPELINE */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#08111d] p-4">
              <div className="mb-4 font-mono text-[9px] tracking-[0.18em] text-slate-600">
                AI PIPELINE
              </div>

              <div className="space-y-2">
                {[
                  ['01', 'Video Input'],
                  ['02', 'Semantic Masking'],
                  ['03', '3D Reconstruction'],
                  ['04', 'Model Output'],
                ].map(([num, label]) => (
                  <div
                    key={num}
                    className="flex items-center gap-3 rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2.5"
                  >
                    <span className="font-mono text-[8px] text-cyan-300/60">
                      {num}
                    </span>

                    <span className="text-[10px] text-slate-400">
                      {label}
                    </span>

                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-slate-700" />
                  </div>
                ))}
              </div>
            </div>

          </aside>
        </div>

        {/* FOOTER NOTE */}
        <div className="mt-4 flex items-center gap-2 font-mono text-[8px] tracking-[0.12em] text-slate-700">
          <span className="h-1 w-1 rounded-full bg-slate-700" />
          SIMULATION ENVIRONMENT / AI INTEGRATION PENDING
        </div>

      </div>
    </main>
  );
}