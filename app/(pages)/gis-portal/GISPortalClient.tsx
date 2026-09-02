'use client';

import { useEffect, useRef, useState } from 'react';
import Reveal from '../../components/Reveal';
import RevealText from '../../components/RevealText';
import CountUp from '../../components/CountUp';

const MAP_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB4kPKjaiMvRGYwythAb3e4CjJimUyrCOZeUdZMzRDzDVXyIR2GMgiHwirFt2YDl9ZA8RTan8h_UjwLJVehe2d6P4wx8tNGTC2Vqq1KvzyOnBrqFcrXUDxFpDOl3PjqewJRtSsiPMGJ-RZwOL4M_e7h5aTA7_P0LDWIjcy73S3afLiPTwT9P4IfgddS_D4lBuRa5_GQ8o39uWEAv0MHtdPISG7-iFuFPf00k2NeuulL3RvgoB19AEgY';

const NEVADA_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAbdMzeKVZVGKYEPw3UKt0LQtQ49gL-nldKBqwy0xtxPyBfjm6qWNsKEAxD2wmENK67ct7dgHnsJsvM9FaRvmy0NHA68qfXXvt1BXxjVt6ap74RwgiC5imK_DB_u4nnX2VypfxFb7Ya2IDYmziQg6H3VyKw49ZOG7oY6NGkXSjIknhTlg07lX57rk0bJpR2PycguOnDYdPMQ5G311KJnmoin1-8_9lBcQ9x8wei0bbLdiTRa60a9HyY';

const INITIAL_LOGS = [
  {
    time: '[14:02:44]',
    msg: 'Viewer initialized. Demo reconstruction loaded.',
    color: '#ffb95f',
  },
  {
    time: '[14:02:45]',
    msg: 'Loading georeferenced model + confidence layers...',
    color: '#bcc9cd',
  },
  {
    time: '[14:02:48]',
    msg: 'Ready for inspection and measurement.',
    color: '#4cd7f6',
  },
];

const DYNAMIC_LOGS = [
  'Validating WGS84 / local ENU transform...',
  'Coordinate frame accepted. Metric scale source: GPS + IMU + vision.',
  'Checking video + GPS + flight metadata...',
  'Optional IMU / RTK / PPK metadata detected when available.',
  'Ready to export model, raster layers and measurements.',
];

export default function GISPortalClient() {
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const logIdx = useRef(0);

  const [viewMode, setViewMode] = useState<
    'wireframe' | 'solid' | 'textured'
  >('solid');

  const [mapView, setMapView] = useState<'ir' | 'topo' | 'point'>('topo');

  // Backend / mission state
  const [missionId, setMissionId] = useState<string | null>(null);
  const [isCreatingMission, setIsCreatingMission] = useState(false);
  const [missionError, setMissionError] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
const [isUploadingVideo, setIsUploadingVideo] = useState(false);
const [videoUploadMessage, setVideoUploadMessage] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (logIdx.current < DYNAMIC_LOGS.length) {
        const time = new Date().toISOString().substring(11, 19);

        const newLog = {
          time: `[${time}]`,
          msg: DYNAMIC_LOGS[logIdx.current],
          color: '#dae2fd',
        };

        setLogs((prev) => [...prev.slice(-3), newLog]);
        logIdx.current++;
      }
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // Create a new mission through Express backend
  const createMission = async () => {
    setIsCreatingMission(true);
    setMissionError(null);

    try {
      const token = localStorage.getItem('auth_token');

if (!token) {
  throw new Error('Authentication required. Please login again.');
}

const response = await fetch('http://localhost:5000/api/missions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
});

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create mission');
      }

      setMissionId(data.mission_id);

      // Add backend event to the existing log
      const time = new Date().toISOString().substring(11, 19);

      setLogs((prev) => [
        ...prev.slice(-3),
        {
          time: `[${time}]`,
          msg: `Mission created: ${data.mission_id}`,
          color: '#4cd7f6',
        },
      ]);
    } catch (error) {
      console.error('Mission creation failed:', error);

      setMissionError('Unable to create mission.');

      const time = new Date().toISOString().substring(11, 19);

      setLogs((prev) => [
        ...prev.slice(-3),
        {
          time: `[${time}]`,
          msg: 'Mission creation failed. Check backend connection.',
          color: '#ffb3ad',
        },
      ]);
    } finally {
      setIsCreatingMission(false);
    }
  };

  return (
    <div className="flex flex-col w-full relative">
      {/* Background grid & glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(134,147,151,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(134,147,151,0.03) 1px, transparent 1px)',
            backgroundSize: '4px 4px',
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(76,215,246,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(76,215,246,0.05) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div
          className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#4cd7f6]/10"
          style={{ filter: 'blur(120px)' }}
        />

        <div
          className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[60%] rounded-full bg-[#ffb95f]/5"
          style={{ filter: 'blur(150px)' }}
        />
      </div>

      {/* 3D Viewer Section */}
      <div className="w-full min-h-[calc(100vh-64px)] xl:h-[calc(100vh-64px)] px-6 py-6 flex flex-col relative z-10 border-b border-[#3d494c]/10">
        <div className="flex-1 flex flex-col xl:flex-row gap-6 h-full relative z-10">

          {/* LEFT PANEL: Contextual Analysis */}
          <Reveal
            direction="left"
            className="w-full xl:w-[320px] shrink-0 flex flex-col gap-4 bg-[#222a3d]/60 backdrop-blur-xl rounded-xl border border-white/5 shadow-2xl overflow-hidden relative group"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#4cd7f6]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <h3
                className="text-[#bcc9cd] text-[10px] flex items-center gap-2"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                <span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">
                  data_exploration
                </span>
                CONTEXTUAL ANALYSIS
              </h3>

              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffb95f] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ffb95f]" />
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {/* Structural Integrity */}
              <div className="space-y-2 p-4 bg-[#060e20]/50 rounded-lg border-l-2 border-[#4cd7f6] hover:bg-[#060e20] transition-colors">
                <div className="flex justify-between items-center">
                  <span
                    className="text-[#dae2fd] text-[12px]"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    GEOMETRY CONFIDENCE
                  </span>

                  <span
                    className="text-[#4cd7f6] text-[12px]"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    <CountUp end={94.2} decimals={1} suffix="%" />
                  </span>
                </div>

                <div className="h-1 bg-[#2d3449] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#4cd7f6] w-[94.2%]"
                    style={{ boxShadow: '0 0 8px rgba(76,215,246,0.6)' }}
                  />
                </div>

                <p
                  className="text-[#bcc9cd] text-[12px] mt-2 leading-relaxed"
                  style={{ fontFamily: 'Inter' }}
                >
                  Illustrative confidence score for the demo scene; production
                  values come from reprojection, depth and coverage analysis.
                </p>
              </div>

              {/* Thermal Delta */}
              <div className="space-y-2 p-4 bg-[#060e20]/50 rounded-lg border-l-2 border-[#ffb95f] hover:bg-[#060e20] transition-colors">
                <div className="flex justify-between items-center">
                  <span
                    className="text-[#dae2fd] text-[12px]"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    COVERAGE / OCCLUSION
                  </span>

                  <span
                    className="text-[#ffb95f] text-[12px]"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    74%
                  </span>
                </div>

                <div className="flex items-end gap-1 h-8 mt-2">
                  {[30, 45, 60, 80, 100, 85].map((h, i) => (
                    <div
                      key={i}
                      className="w-1/6 rounded-t-sm"
                      style={{
                        height: `${h}%`,
                        backgroundColor: `rgba(255,185,95,${0.2 + i * 0.15})`,
                        boxShadow:
                          i === 4
                            ? '0 0 8px rgba(255,185,95,0.6)'
                            : 'none',
                      }}
                    />
                  ))}
                </div>

                <p
                  className="text-[#bcc9cd] text-[12px] mt-2 leading-relaxed"
                  style={{ fontFamily: 'Inter' }}
                >
                  Unseen or weakly observed surfaces remain flagged so an
                  operator can plan a follow-up pass.
                </p>
              </div>

              {/* Volumetric Stats */}
              <div className="mt-8 space-y-4">
                <h4
                  className="text-[#bcc9cd] text-[10px] border-b border-white/5 pb-2"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  RECONSTRUCTION OUTPUT
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      label: 'POINT / SPLAT LAYER',
                      end: 2.4,
                      decimals: 1,
                      suffix: 'M+',
                    },
                    {
                      label: 'CONFIDENCE LAYERS',
                      end: 6,
                      decimals: 0,
                      suffix: '',
                    },
                    {
                      label: 'SEMANTIC CLASSES',
                      end: 6,
                      decimals: 0,
                      suffix: '',
                    },
                    {
                      label: 'PROCESSING TIERS',
                      end: 2,
                      decimals: 0,
                      suffix: '',
                    },
                  ].map(({ label, end, decimals, suffix }) => (
                    <div key={label}>
                      <span
                        className="block text-[#869397] text-[10px] mb-1"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {label}
                      </span>

                      <span
                        className="font-bold text-[20px] text-[#dae2fd]"
                        style={{ fontFamily: 'Inter' }}
                      >
                        <CountUp
                          end={end}
                          decimals={decimals}
                          suffix={suffix}
                        />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
          

          {/* CENTER: 3D Viewer Canvas */}
          <Reveal
            delay={0.1}
            className="flex-1 min-h-[520px] flex flex-col bg-[#060e20] rounded-xl border border-white/10 shadow-2xl overflow-hidden relative group"
          >
            {/* Toolbar */}
            <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center pointer-events-none">
              <div className="flex gap-2 pointer-events-auto bg-[#171f33]/80 backdrop-blur-md p-1 rounded-lg border border-white/10 shadow-lg">
                {(['wireframe', 'solid', 'textured'] as const).map(
                  (mode, i) => {
                    const icons = ['grid_4x4', 'deployed_code', 'texture'];
                    const active = viewMode === mode;

                    return (
                      <button
                        key={mode}
                        onClick={() => setViewMode(mode)}
                        className={`p-2 rounded transition-colors ${
                          active
                            ? 'bg-white/10 text-[#dae2fd]'
                            : 'hover:bg-white/10 text-[#4cd7f6]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {icons[i]}
                        </span>
                      </button>
                    );
                  }
                )}
              </div>

              <div className="pointer-events-auto bg-[#171f33]/80 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 shadow-lg flex items-center gap-3">
                <span
                  className="text-[#bcc9cd] text-[11px]"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  VIEW: <span className="text-[#4cd7f6]">3D / GEO</span>
                </span>

                <div className="w-[1px] h-4 bg-white/20" />

                <span
                  className="text-[#bcc9cd] text-[11px]"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  MODE: <span className="text-[#ffb95f]">PROGRESSIVE</span>
                </span>
              </div>
            </div>

            {/* Viewport */}
            <div className="flex-1 relative w-full h-full bg-[#0b1326]">
              <div
                className="absolute inset-0 opacity-30 origin-top"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                  transform:
                    'perspective(1000px) rotateX(60deg) translateY(-100px) scale(2)',
                }}
              />

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center space-y-4 relative z-10">
                  <div
                    className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#4cd7f6]/10 border border-[#4cd7f6]/30 mb-4"
                    style={{ boxShadow: '0 0 40px rgba(76,215,246,0.15)' }}
                  >
                    <span className="material-symbols-outlined text-[48px] text-[#4cd7f6]">
                      view_in_ar
                    </span>
                  </div>

                  <h2
                    className="font-bold text-[32px] text-[#dae2fd] tracking-tight"
                    style={{ fontFamily: 'Inter' }}
                  >
                    <RevealText
                      text="PHOTOGRAMMETRY ENGINE"
                      threshold={0.1}
                    />
                  </h2>

                  <p
                    className="text-[#4cd7f6] text-[12px] tracking-[0.2em]"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    AWAITING MESH GENERATION PROTOCOL
                  </p>
                </div>
              </div>

              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#4cd7f6]/20 to-transparent opacity-30 mix-blend-screen pointer-events-none animate-scan" />
            </div>

            {/* Control bar */}
            <div className="h-16 bg-[#222a3d]/90 backdrop-blur-xl border-t border-white/5 flex items-center justify-between px-6 z-20">
              <div className="flex items-center gap-4">
                <button
                  onClick={createMission}
                  disabled={isCreatingMission}
                  className="bg-[#4cd7f6] text-[#003640] px-6 py-2 rounded text-[10px] font-bold uppercase tracking-widest hover:shadow-[0_0_15px_rgba(76,215,246,0.4)] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    play_arrow
                  </span>

                  {isCreatingMission
                    ? 'CREATING MISSION...'
                    : 'INITIATE RECONSTRUCTION'}
                </button>

                <button
                  className="px-4 py-2 border border-[#3d494c] rounded text-[#dae2fd] text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-colors"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  ABORT
                </button>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                  <span
                    className="text-[#bcc9cd] text-[10px]"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    PROCESSING NODE
                  </span>

                  <span
                    className="text-[#4cd7f6] text-[12px]"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    CLUSTER-ALPHA-9
                  </span>
                </div>

                <div className="w-8 h-8 rounded-full border border-[#4cd7f6]/30 flex items-center justify-center bg-[#4cd7f6]/10">
                  <span className="material-symbols-outlined text-[#4cd7f6] text-[16px] animate-spin-slow">
                    settings
                  </span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* RIGHT PANEL STACK */}
          <Reveal
            direction="right"
            delay={0.15}
            className="w-full xl:w-[380px] shrink-0 flex flex-col gap-6 xl:h-full relative z-10"
          >
            {/* 2D Satellite Map */}
            <div className="h-[40%] bg-[#222a3d]/60 backdrop-blur-xl rounded-xl border border-white/5 shadow-2xl overflow-hidden flex flex-col relative group">
              <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <span
                  className="bg-[#0b1326]/80 backdrop-blur-md px-2 py-1 rounded border border-white/10 text-[10px] text-[#dae2fd]"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  2D NADIR VIEW
                </span>
              </div>

              <div className="flex-1 relative bg-[#060e20]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={MAP_IMG}
                  alt="2D Nadir map view"
                  className="w-full h-full object-cover opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700 absolute inset-0"
                />

                <div
                  className="absolute inset-0 pointer-events-none mix-blend-screen opacity-50"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(76,215,246,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(76,215,246,0.1) 1px, transparent 1px)',
                    backgroundSize: '10% 10%',
                  }}
                />

                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-16 h-16 border border-[#4cd7f6]/50 rounded-full flex items-center justify-center relative">
                    <div className="w-1 h-1 bg-[#4cd7f6] rounded-full" />
                    <div className="absolute inset-0 border border-[#4cd7f6]/20 rounded-full animate-ping" />
                  </div>
                </div>

                <div className="absolute top-4 left-4 z-10 bg-[#0b1326]/80 backdrop-blur-sm px-2 py-1 border-l border-[#4cd7f6]/50 flex flex-col">
                  <span
                    className="text-[#4cd7f6] text-[9px]"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    LAT: 37°07&apos;48&quot;N
                  </span>

                  <span
                    className="text-[#4cd7f6] text-[9px]"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    LON: 116°02&apos;24&quot;W
                  </span>
                </div>

                <div className="absolute top-4 right-4 z-10 flex gap-1 items-center">
                  <div className="w-2 h-2 rounded-full bg-[#ffb4ab] animate-ping" />

                  <span
                    className="text-[#ffb4ab] text-[10px]"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    RESTRICTED AIRSPACE
                  </span>
                </div>
              </div>

              {/* Map view tabs */}
              <div className="flex gap-0 w-full shrink-0">
                {(['ir', 'topo', 'point'] as const).map((view) => {
                  const labels = {
                    ir: 'IR View',
                    topo: 'Topographic',
                    point: 'Point Cloud',
                  };

                  const active = mapView === view;

                  return (
                    <button
                      key={view}
                      onClick={() => setMapView(view)}
                      className={`flex-1 text-[10px] font-bold uppercase tracking-widest py-1 border transition-all text-center ${
                        active
                          ? 'bg-[#4cd7f6]/20 text-[#4cd7f6] border-[#4cd7f6]/50 shadow-[0_0_8px_rgba(76,215,246,0.3)]'
                          : 'bg-[#0b1326]/80 text-[#dae2fd] border-[#3d494c]/30 hover:bg-[#4cd7f6]/10 hover:border-[#4cd7f6]/30'
                      }`}
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {labels[view]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Telemetry */}
            <div className="h-[60%] bg-[#222a3d]/60 backdrop-blur-xl rounded-xl border border-white/5 shadow-2xl overflow-hidden flex flex-col">
              <div className="p-4 border-b border-white/5">
                <h3
                  className="text-[#dae2fd] text-[10px] flex items-center gap-2"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  <span className="material-symbols-outlined text-[16px] text-[#ffb95f]">
                    memory
                  </span>
                  LIVE TELEMETRY STREAM
                </h3>
              </div>

              <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden">
                {/* Chart */}
                <div className="flex-1 min-h-[120px] relative border border-white/5 rounded-lg bg-[#060e20]/50 p-3 flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <span
                      className="text-[#bcc9cd] text-[10px]"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      ALTITUDE DEVIATION (m)
                    </span>

                    <span
                      className="text-[#ffb95f] text-[10px]"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      MAX: +1.2m
                    </span>
                  </div>

                  <div className="flex-1 w-full relative flex items-end">
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="border-t border-white border-dashed w-full"
                        />
                      ))}
                    </div>

                    <svg
                      className="w-full h-full text-[#ffb95f]"
                      style={{
                        filter:
                          'drop-shadow(0 0 4px rgba(255,185,95,0.5))',
                      }}
                      preserveAspectRatio="none"
                      viewBox="0 0 100 100"
                    >
                      <path
                        d="M0,80 Q10,70 20,85 T40,60 T60,75 T80,40 T100,50 L100,100 L0,100 Z"
                        fill="currentColor"
                        fillOpacity="0.1"
                      />

                      <path
                        d="M0,80 Q10,70 20,85 T40,60 T60,75 T80,40 T100,50"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                </div>

                {/* Data grid */}
                <div className="grid grid-cols-2 gap-2 shrink-0">
                  {[
                    { label: 'YAW (DEG)', val: '142.05°' },
                    { label: 'PITCH (DEG)', val: '-4.20°' },
                    { label: 'ROLL (DEG)', val: '1.12°' },
                  ].map(({ label, val }) => (
                    <div
                      key={label}
                      className="p-3 bg-[#171f33]/50 border border-white/5 rounded-lg hover:border-[#4cd7f6]/30 transition-colors cursor-default group"
                    >
                      <span
                        className="block text-[#bcc9cd] text-[10px] mb-1 group-hover:text-[#4cd7f6] transition-colors"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {label}
                      </span>

                      <span
                        className="text-[#dae2fd] text-[16px]"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {val}
                      </span>
                    </div>
                  ))}

                  <div className="p-3 bg-[#171f33]/50 border border-white/5 rounded-lg hover:border-[#4cd7f6]/30 transition-colors cursor-default group">
                    <span
                      className="block text-[#bcc9cd] text-[10px] mb-1 group-hover:text-[#4cd7f6] transition-colors"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      DATALINK
                    </span>

                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex gap-1 h-3">
                        {[0.4, 0.6, 0.8, 1].map((o, i) => (
                          <div
                            key={i}
                            className="w-1.5 bg-[#4cd7f6] rounded-sm"
                            style={{
                              opacity: o,
                              boxShadow:
                                i === 3
                                  ? '0 0 5px rgba(76,215,246,0.5)'
                                  : 'none',
                            }}
                          />
                        ))}
                      </div>

                      <span
                        className="text-[#4cd7f6] text-[10px]"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        98%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Log terminal */}
                <div
                  className="h-24 bg-[#060e20] border border-white/5 rounded-lg p-2 overflow-hidden"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {logs.map((log, i) => (
                    <div
                      key={i}
                      className="flex gap-2 text-[10px] leading-tight"
                      style={{ opacity: 0.5 + (i / logs.length) * 0.5 }}
                    >
                      <span className="text-[#bcc9cd]">{log.time}</span>
                      <span style={{ color: log.color }}>{log.msg}</span>
                    </div>
                  ))}

                  <div className="text-[10px] text-[#ffb95f] animate-pulse">
                    _
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Survey Request Form Section */}
      <div className="w-full max-w-[1600px] mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[calc(100vh-64px)] relative z-10">

        {/* Left: Map & Status */}
        <div className="lg:col-span-5 flex flex-col gap-4 h-full relative">
          {/* Header card */}
          <Reveal
            direction="left"
            className="bg-[#171f33]/60 backdrop-blur-md p-4 shadow-lg relative overflow-hidden group"
          >
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#4cd7f6] group-hover:shadow-[0_0_12px_rgba(76,215,246,0.8)] transition-shadow duration-300" />

            <div className="flex items-center gap-1 mb-2">
              <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">
                satellite_alt
              </span>

              <span
                className="text-[#4cd7f6] text-[10px] tracking-widest uppercase"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Target Acquisition
              </span>
            </div>

            <h1
              className="font-bold text-[#dae2fd] mb-1"
              style={{ fontSize: '36px', fontFamily: 'Inter' }}
            >
              <RevealText text="Survey Request Protocol" />
            </h1>

            <p
              className="text-[#bcc9cd] max-w-md text-[14px] leading-relaxed"
              style={{ fontFamily: 'Inter' }}
            >
              Initialize geospatial reconstruction parameters or request
              clearance for custom drone telemetry gathering in restricted
              zones.
            </p>
          </Reveal>

          {/* Map widget */}
          <Reveal
            direction="left"
            delay={0.1}
            className="flex-grow min-h-[400px] relative bg-[#131b2e] shadow-xl rounded-lg overflow-hidden group"
          >
            {[
              'top-0 left-0 border-t-2 border-l-2',
              'top-0 right-0 border-t-2 border-r-2',
              'bottom-0 left-0 border-b-2 border-l-2',
              'bottom-0 right-0 border-b-2 border-r-2',
            ].map((c, i) => (
              <div
                key={i}
                className={`absolute w-8 h-8 border-[#3d494c]/50 z-20 pointer-events-none group-hover:border-[#4cd7f6] transition-colors duration-500 ${c}`}
              />
            ))}

            <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#060e20]/80 to-transparent pointer-events-none" />

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={NEVADA_IMG}
              alt="Nevada Test Site map"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-105"
            />

            <div
              className="absolute inset-0 z-20 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(76,215,246,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(76,215,246,0.1) 1px, transparent 1px)',
                backgroundSize: '10% 10%',
                mixBlendMode: 'screen',
                opacity: 0.5,
              }}
            />

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 flex items-center justify-center z-20 pointer-events-none">
              <svg
                className="w-full h-full text-[#4cd7f6] opacity-60"
                style={{ animation: 'spin 20s linear infinite' }}
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  fill="none"
                  r="48"
                  stroke="currentColor"
                  strokeDasharray="2 4"
                  strokeWidth="0.5"
                />
                <circle
                  cx="50"
                  cy="50"
                  fill="none"
                  r="40"
                  stroke="currentColor"
                  strokeDasharray="10 10"
                  strokeWidth="1"
                />
                <path
                  d="M50 0 V20 M50 80 V100 M0 50 H20 M80 50 H100"
                  stroke="currentColor"
                  strokeWidth="1"
                />
                <circle
                  cx="50"
                  cy="50"
                  fill="currentColor"
                  r="2"
                  className="animate-pulse"
                />
              </svg>
            </div>
          </Reveal>

          {/* Status log */}
          <Reveal
            direction="left"
            delay={0.2}
            className="bg-[#171f33]/40 p-4 h-32 overflow-hidden flex flex-col relative shadow-inner"
          >
            <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-[#171f33] to-transparent z-10" />
            <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-[#171f33] to-transparent z-10" />

            <div className="flex flex-col gap-1">
              {logs.map((log, i) => (
                <div
                  key={i}
                  className="flex gap-4 text-[12px]"
                  style={{
                    opacity: 0.5 + (i / logs.length) * 0.5,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  <span className="text-[#bcc9cd]">{log.time}</span>
                  <span style={{ color: log.color }}>{log.msg}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Right: Form */}
        <Reveal
          direction="right"
          delay={0.1}
          className="lg:col-span-7 flex flex-col relative h-full"
        >
          <div className="bg-[#171f33]/80 backdrop-blur-lg shadow-xl h-full flex flex-col relative border border-[#3d494c]/10">

            <div className="h-[2px] w-full bg-gradient-to-r from-[#4cd7f6] via-[#ffb95f] to-transparent absolute top-0 left-0" />

            <div className="p-6 md:p-6 flex-grow flex flex-col gap-6 overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#3d494c]/20 pb-2">
                <h2
                  className="font-semibold text-2xl text-[#dae2fd]"
                  style={{ fontFamily: 'Inter' }}
                >
                  <RevealText
                    text="Parameter Specification"
                    threshold={0.2}
                  />
                </h2>

                <span
                  className="text-[#4cd7f6] text-[12px] animate-pulse flex items-center gap-1"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  <div className="w-1.5 h-1.5 bg-[#4cd7f6] rounded-full" />
                  DEMO DATA PIPELINE
                </span>
              </div>

              <form
                className="flex flex-col gap-4 relative z-10"
                onSubmit={(event) => event.preventDefault()}
              >
                {/* Bounding Box */}
                <div className="flex flex-col gap-2 bg-[#131b2e]/50 p-4 relative group">
                  <div className="absolute left-0 top-0 w-1 h-full bg-[#3d494c]/30 group-hover:bg-[#4cd7f6]/50 transition-colors duration-300" />

                  <label
                    className="text-[#bcc9cd] text-[10px] flex items-center gap-1"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      my_location
                    </span>
                    Bounding Box Coordinates
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { val: '37.135, -116.050', ph: 'NW Lat, Lon' },
                      { val: '37.120, -116.035', ph: 'SE Lat, Lon' },
                    ].map(({ val, ph }) => (
                      <div key={ph} className="flex flex-col relative">
                        <input
                          defaultValue={val}
                          placeholder={ph}
                          type="text"
                          className="bg-[#0b1326]/50 border-b border-[#3d494c]/50 px-1 py-2 text-[#dae2fd] text-[12px] focus:outline-none focus:border-[#4cd7f6] focus:bg-[#0b1326] transition-all peer"
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                          }}
                        />

                        <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#4cd7f6] peer-focus:w-full transition-all duration-300" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* GSD + Sensor */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2 bg-[#131b2e]/50 p-4 relative group">
                    <div className="absolute left-0 top-0 w-1 h-full bg-[#3d494c]/30 group-hover:bg-[#ffb95f]/50 transition-colors duration-300" />

                    <div className="flex justify-between items-center">
                      <label
                        className="text-[#bcc9cd] text-[10px]"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        GSD Resolution (cm/px)
                      </label>

                      <span
                        className="text-[#ffb95f] text-[12px]"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        2.5 cm
                      </span>
                    </div>

                    <div className="relative w-full h-8 flex items-center mt-2 cursor-crosshair">
                      <div className="absolute w-full h-1 bg-[#2d3449] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#ffb95f] w-1/3"
                          style={{
                            boxShadow: '0 0 8px rgba(255,185,95,0.5)',
                          }}
                        />
                      </div>

                      <div className="absolute left-1/3 w-3 h-5 bg-[#dae2fd] shadow-md -translate-x-1/2 flex items-center justify-center">
                        <div className="w-[1px] h-3 bg-[#171f33]" />
                      </div>
                    </div>

                    <div
                      className="flex justify-between text-[10px] text-[#3d494c] mt-1"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      <span>1.0</span>
                      <span>5.0</span>
                      <span>10.0+</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 bg-[#131b2e]/50 p-4 relative group">
                    <div className="absolute left-0 top-0 w-1 h-full bg-[#3d494c]/30 group-hover:bg-[#4cd7f6]/50 transition-colors duration-300" />

                    <label
                      className="text-[#bcc9cd] text-[10px]"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      Sensor Payload
                    </label>

                    <div className="relative mt-2">
                      <select
                        className="w-full bg-[#0b1326]/50 border-b border-[#3d494c]/50 px-1 py-2 text-[#dae2fd] text-[12px] focus:outline-none focus:border-[#4cd7f6] appearance-none cursor-pointer"
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        <option className="bg-[#0b1326] text-[#dae2fd]">
                          RGB video + GPS + flight metadata
                        </option>
                        <option className="bg-[#0b1326] text-[#dae2fd]">
                          RGB + IMU metadata
                        </option>
                        <option className="bg-[#0b1326] text-[#dae2fd]">
                          RGB + RTK / PPK metadata
                        </option>
                        <option className="bg-[#0b1326] text-[#dae2fd]">
                          Calibrated RGB / camera intrinsics
                        </option>
                      </select>

                      <span className="material-symbols-outlined absolute right-1 top-1/2 -translate-y-1/2 text-[#869397] pointer-events-none">
                        arrow_drop_down
                      </span>
                    </div>
                  </div>
                </div>

                {/* Output formats */}
                <div className="flex flex-col gap-2 bg-[#131b2e]/50 p-4 relative group">
                  <div className="absolute left-0 top-0 w-1 h-full bg-[#3d494c]/30 group-hover:bg-[#ffb3ad]/50 transition-colors duration-300" />

                  <label
                    className="text-[#bcc9cd] text-[10px] mb-1"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    Output Extraction Formats
                  </label>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
                    {[
                      { label: '.PLY / .splat', active: true },
                      { label: '.OBJ / .GLTF', active: false },
                      { label: 'GeoTIFF DSM/DEM', active: false },
                      { label: 'JSON / transform', active: false },
                    ].map(({ label, active }) => (
                      <label key={label} className="cursor-pointer relative">
                        <input
                          defaultChecked={active}
                          name="format"
                          type="radio"
                          className="peer sr-only"
                        />

                        <div
                          className={`w-full text-center py-2 text-[12px] border transition-all ${
                            active
                              ? 'bg-[#4cd7f6]/10 border-[#4cd7f6]/50 text-[#4cd7f6] shadow-[inset_0_0_8px_rgba(76,215,246,0.2)]'
                              : 'bg-[#0b1326]/50 border-[#3d494c]/30 text-[#bcc9cd] hover:border-[#4cd7f6]/30'
                          }`}
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                          }}
                        >
                          {label}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <textarea
                  className="w-full bg-[#0b1326]/30 border-l-2 border-[#3d494c]/30 p-4 text-[#dae2fd] text-[14px] focus:outline-none focus:border-[#4cd7f6] focus:bg-[#0b1326]/60 transition-all resize-none min-h-[100px]"
                  placeholder="Additional operational directives or priority codes..."
                  style={{ fontFamily: 'Inter' }}
                />
              </form>
            </div>

            {/* Action footer */}
            <div className="p-4 border-t border-[#3d494c]/20 bg-[#2d3449]/50 flex justify-between items-center backdrop-blur-md">

              <div className="flex flex-col gap-1">
                {missionId && (
                  <div
                    className="text-[#4cd7f6] text-[10px]"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    MISSION: {missionId}
                  </div>
                )}

                {missionError && (
                  <div
                    className="text-[#ffb3ad] text-[10px]"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {missionError}
                  </div>
                )}

                {!missionId && !missionError && (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-[#0b1326] border border-[#3d494c]/30 flex items-center justify-center hover:border-[#4cd7f6]/50 transition-colors group cursor-help">
                      <span className="material-symbols-outlined text-[#bcc9cd] group-hover:text-[#4cd7f6] text-[18px]">
                        lock
                      </span>
                    </div>

                    <span
                      className="text-[#bcc9cd] text-[10px] uppercase tracking-widest hidden sm:block"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      End-to-End Encrypted
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  className="px-6 py-2 text-[#dae2fd] hover:text-[#4cd7f6] transition-colors uppercase tracking-widest text-[10px] font-bold"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  Abort
                </button>

                <button
                  type="button"
                  onClick={createMission}
                  disabled={isCreatingMission}
                  className="relative group overflow-hidden px-6 py-2 bg-[#4cd7f6] text-[#003640] text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 shadow-[0_0_15px_rgba(76,215,246,0.4)] hover:shadow-[0_0_25px_rgba(76,215,246,0.6)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />

                  <span className="relative z-10 material-symbols-outlined text-[18px]">
                    {isCreatingMission ? 'sync' : 'send'}
                  </span>

                  <span className="relative z-10">
                    {isCreatingMission
                      ? 'Creating Mission'
                      : 'Start Reconstruction'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}