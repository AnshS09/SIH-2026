'use client';

import { useEffect, useState } from 'react';

const MAP_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB4kPKjaiMvRGYwythAb3e4CjJimUyrCOZeUdZMzRDzDVXyIR2GMgiHwirFt2YDl9ZA8RTan8h_UjwLJVehe2dP4wx8tNGTC2Vqq1KvzyOnBrqFcrXUDxFpDOl3PjqewJRtSsiPMGJ-RZwOL4M_e7h5aTA7_P0LDWIjcy73S3afLiPTwT9P4IfgddS_D4lBuRa5_GQ8o39uWEAv0MHtdPISG7-iFuFPf00k2NeuulL3RvgoB19AEgY';

const NEVADA_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAbdMzeKVZVGKYEPw3UKt0LQtQ49gL-nldKBqwy0xtxPyBfjm6qWNsKEAxD2wmENK67ct7dgHnsJsvM9FaRvmy0NHA68qfXXvt1BXxjVt6ap74RwgiC5imK_DB_u4nnX2VypfxFb7Ya2IDYmziQg6H3VyKw49ZOG7oY6NGkXSjIknhTlg07lX57rk0bJpR2PycguOnDYdPMQ5G311KJnmoin1-8_9lBcQ9x8wei0bbLdiTRa60a9HyY';

type ViewMode = 'wireframe' | 'solid' | 'textured';
type MapView = 'topo' | 'ir' | 'point';

const mono = { fontFamily: "'JetBrains Mono', monospace" };

export default function GISPortalClient() {
  const [viewMode, setViewMode] = useState<ViewMode>('solid');
  const [mapView, setMapView] = useState<MapView>('topo');

  const [missionId, setMissionId] = useState<string | null>(null);
  const [isCreatingMission, setIsCreatingMission] = useState(false);
  const [missionError, setMissionError] = useState('');
  const [notice, setNotice] = useState('');

  const [logs, setLogs] = useState<string[]>([
    'Viewer initialized.',
    'Demo reconstruction layer loaded.',
    'System ready for mission input.',
  ]);

  useEffect(() => {
    const messages = [
      'Checking video + GPS + flight metadata...',
      'Coordinate frame: WGS84 / local ENU.',
      'Metric scale source: GPS + IMU + vision.',
    ];

    let index = 0;

    const timer = setInterval(() => {
      if (index >= messages.length) {
        clearInterval(timer);
        return;
      }

      setLogs((prev) => [...prev.slice(-3), messages[index]]);
      index += 1;
    }, 4200);

    return () => clearInterval(timer);
  }, []);

  const createMission = async () => {
    setIsCreatingMission(true);
    setMissionError('');
    setNotice('');

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
      setNotice('Mission created successfully.');

      setLogs((prev) => [
        ...prev.slice(-3),
        `Mission created: ${data.mission_id}`,
      ]);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to create mission.';

      setMissionError(message);
      setLogs((prev) => [...prev.slice(-3), 'Mission creation failed.']);
    } finally {
      setIsCreatingMission(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0b1326] text-[#dae2fd] relative overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(134,147,151,0.025) 1px, transparent 1px), linear-gradient(to bottom, rgba(134,147,151,0.025) 1px, transparent 1px)',
            backgroundSize: '4px 4px',
          }}
        />
        <div
          className="absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(76,215,246,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(76,215,246,0.045) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div
          className="absolute -top-48 -left-48 w-[600px] h-[600px] rounded-full bg-[#4cd7f6]/8"
          style={{ filter: 'blur(130px)' }}
        />
        <div
          className="absolute -bottom-64 -right-48 w-[560px] h-[560px] rounded-full bg-[#ffb95f]/5"
          style={{ filter: 'blur(140px)' }}
        />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 py-5">
        {/* Page heading */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-5">
          <div>
            <div
              className="flex items-center gap-2 text-[#4cd7f6] text-[10px] uppercase tracking-[0.2em] mb-2"
              style={mono}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] animate-pulse" />
              Mission Console
            </div>

            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Geospatial Reconstruction
            </h1>

            <p className="text-[#869397] text-sm mt-1">
              Upload flight data, inspect the scene, and start a reconstruction
              mission.
            </p>
          </div>

          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/8 bg-[#171f33]/70"
            style={mono}
          >
            <span className="w-2 h-2 rounded-full bg-[#4cd7f6] shadow-[0_0_8px_rgba(76,215,246,.7)]" />
            <span className="text-[10px] text-[#bcc9cd] uppercase tracking-widest">
              System Online
            </span>
          </div>
        </div>

        {/* Main workspace */}
        <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-5">
          {/* Viewer */}
          <div className="min-h-[620px] rounded-2xl border border-white/8 bg-[#060e20]/85 shadow-2xl overflow-hidden relative">
            <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1 p-1 rounded-lg bg-[#171f33]/90 backdrop-blur-md border border-white/10">
                {([
                  ['wireframe', 'grid_4x4'],
                  ['solid', 'deployed_code'],
                  ['textured', 'texture'],
                ] as const).map(([mode, icon]) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-3 py-2 rounded-md text-[10px] uppercase tracking-widest transition ${
                      viewMode === mode
                        ? 'bg-[#4cd7f6]/15 text-[#4cd7f6]'
                        : 'text-[#869397] hover:text-[#dae2fd] hover:bg-white/5'
                    }`}
                    style={mono}
                  >
                    <span className="material-symbols-outlined text-[17px] align-middle mr-1">
                      {icon}
                    </span>
                    {mode}
                  </button>
                ))}
              </div>

              <div
                className="hidden sm:flex items-center gap-3 px-3 py-2 rounded-lg bg-[#171f33]/90 backdrop-blur-md border border-white/10 text-[9px] uppercase tracking-widest"
                style={mono}
              >
                <span className="text-[#869397]">VIEW</span>
                <span className="text-[#4cd7f6]">3D / GEO</span>
                <span className="w-px h-3 bg-white/10" />
                <span className="text-[#869397]">MODE</span>
                <span className="text-[#ffb95f]">{viewMode}</span>
              </div>
            </div>

            {/* Viewer scene */}
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)',
                  backgroundSize: '44px 44px',
                  transform:
                    'perspective(900px) rotateX(58deg) translateY(110px) scale(1.8)',
                  transformOrigin: 'center bottom',
                }}
              />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative text-center">
                  <div
                    className="mx-auto w-28 h-28 rounded-full border border-[#4cd7f6]/25 bg-[#4cd7f6]/5 flex items-center justify-center"
                    style={{ boxShadow: '0 0 80px rgba(76,215,246,.08)' }}
                  >
                    <span className="material-symbols-outlined text-[54px] text-[#4cd7f6]/80">
                      view_in_ar
                    </span>
                  </div>

                  <h2 className="mt-6 text-xl sm:text-2xl font-semibold">
                    Reconstruction Viewer
                  </h2>

                  <p
                    className="mt-2 text-[#4cd7f6] text-[9px] uppercase tracking-[0.25em]"
                    style={mono}
                  >
                    {missionId
                      ? `MISSION ${missionId} READY`
                      : 'Awaiting mission'}
                  </p>

                  <p className="mt-3 max-w-sm text-xs text-[#869397] leading-relaxed">
                    The production 3D model will appear here once the AI
                    reconstruction pipeline is connected.
                  </p>
                </div>
              </div>

              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#4cd7f6]/10 to-transparent pointer-events-none" />

              <div
                className="absolute bottom-4 left-4 px-3 py-2 rounded-lg bg-[#0b1326]/80 border border-white/8 backdrop-blur-md"
                style={mono}
              >
                <div className="text-[9px] text-[#869397] uppercase tracking-widest">
                  Scene
                </div>
                <div className="text-[11px] text-[#dae2fd] mt-1">
                  {viewMode === 'wireframe'
                    ? 'Wireframe preview'
                    : viewMode === 'textured'
                      ? 'Texture preview'
                      : 'Solid geometry'}
                </div>
              </div>
            </div>
          </div>

          {/* Right rail */}
          <aside className="flex flex-col gap-5">
            {/* Mission card */}
            <div className="rounded-2xl border border-white/8 bg-[#171f33]/75 backdrop-blur-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/6 flex items-center justify-between">
                <div>
                  <div
                    className="text-[9px] text-[#4cd7f6] uppercase tracking-[0.18em]"
                    style={mono}
                  >
                    Current Mission
                  </div>
                  <div className="text-sm font-medium mt-1">
                    {missionId || 'No mission created'}
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#869397]">
                  flight_takeoff
                </span>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#869397]">Status</span>
                  <span className="text-[#4cd7f6]" style={mono}>
                    {missionId ? 'READY' : 'IDLE'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#869397]">Processing</span>
                  <span className="text-[#bcc9cd]" style={mono}>
                    AI PIPELINE
                  </span>
                </div>

                <button
                  onClick={createMission}
                  disabled={isCreatingMission}
                  className="w-full mt-2 py-3 rounded-lg bg-[#4cd7f6] text-[#003640] text-[10px] font-bold uppercase tracking-[0.16em] hover:shadow-[0_0_22px_rgba(76,215,246,.28)] transition disabled:opacity-50"
                  style={mono}
                >
                  {isCreatingMission ? 'Creating Mission...' : 'Start Mission'}
                </button>

                {notice && (
                  <p className="text-[10px] text-[#4cd7f6]" style={mono}>
                    {notice}
                  </p>
                )}

                {missionError && (
                  <p className="text-[10px] text-[#ffb3ad]" style={mono}>
                    {missionError}
                  </p>
                )}
              </div>
            </div>

            {/* Map */}
            <div className="rounded-2xl border border-white/8 bg-[#171f33]/75 backdrop-blur-xl overflow-hidden">
              <div className="px-4 py-3 flex items-center justify-between">
                <span
                  className="text-[9px] text-[#bcc9cd] uppercase tracking-[0.18em]"
                  style={mono}
                >
                  Map Preview
                </span>
                <span className="text-[9px] text-[#4cd7f6]" style={mono}>
                  NADIR
                </span>
              </div>

              <div className="h-44 relative bg-[#060e20]">
                <img
                  src={MAP_IMG}
                  alt="2D map preview"
                  className="absolute inset-0 w-full h-full object-cover opacity-65 mix-blend-luminosity"
                />

                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(76,215,246,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(76,215,246,.12) 1px, transparent 1px)',
                    backgroundSize: '10% 10%',
                  }}
                />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border border-[#4cd7f6]/50 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6]" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 border-t border-white/6">
                {([
                  ['topo', 'Topo'],
                  ['ir', 'IR'],
                  ['point', 'Point Cloud'],
                ] as const).map(([view, label]) => (
                  <button
                    key={view}
                    onClick={() => setMapView(view)}
                    className={`py-2 text-[9px] uppercase tracking-wider border-r last:border-r-0 border-white/6 transition ${
                      mapView === view
                        ? 'text-[#4cd7f6] bg-[#4cd7f6]/8'
                        : 'text-[#869397] hover:text-[#dae2fd]'
                    }`}
                    style={mono}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Telemetry */}
            <div className="rounded-2xl border border-white/8 bg-[#171f33]/75 backdrop-blur-xl">
              <div className="px-4 py-3 border-b border-white/6 flex items-center justify-between">
                <span
                  className="text-[9px] text-[#bcc9cd] uppercase tracking-[0.18em]"
                  style={mono}
                >
                  Telemetry
                </span>
                <span
                  className="text-[9px] text-[#ffb95f]"
                  style={mono}
                >
                  DEMO
                </span>
              </div>

              <div className="grid grid-cols-2 gap-px bg-white/5">
                {[
                  ['ALTITUDE', '124.6 m'],
                  ['SPEED', '8.4 m/s'],
                  ['YAW', '142.05°'],
                  ['DATALINK', '98%'],
                ].map(([label, value]) => (
                  <div key={label} className="bg-[#171f33] p-3">
                    <div
                      className="text-[8px] text-[#869397] uppercase tracking-wider"
                      style={mono}
                    >
                      {label}
                    </div>
                    <div
                      className="text-sm text-[#dae2fd] mt-1"
                      style={mono}
                    >
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>

        {/* Compact mission configuration */}
        <section className="mt-5 rounded-2xl border border-white/8 bg-[#171f33]/70 backdrop-blur-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/6 flex items-center justify-between">
            <div>
              <div
                className="text-[9px] text-[#4cd7f6] uppercase tracking-[0.18em]"
                style={mono}
              >
                Mission Configuration
              </div>
              <div className="text-xs text-[#869397] mt-1">
                Keep the input surface compact; detailed controls can expand
                when needed.
              </div>
            </div>
            <span className="material-symbols-outlined text-[#869397]">
              tune
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['AREA', '37.135, -116.050 → 37.120, -116.035'],
              ['GSD', '2.5 cm / px'],
              ['SENSOR', 'RGB + GPS + flight metadata'],
              ['OUTPUT', '.PLY / .GLTF'],
            ].map(([label, value]) => (
              <div
                key={label}
                className="p-4 border-b sm:border-r lg:border-b-0 last:border-r-0 border-white/6"
              >
                <div
                  className="text-[8px] text-[#869397] uppercase tracking-widest"
                  style={mono}
                >
                  {label}
                </div>
                <div className="text-xs text-[#dae2fd] mt-2 leading-relaxed">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Minimal system log */}
        <section className="mt-5 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div className="flex-1 min-w-0">
            <div
              className="text-[8px] text-[#869397] uppercase tracking-widest mb-2"
              style={mono}
            >
              System Log
            </div>
            <div className="flex gap-4 overflow-hidden">
              {logs.slice(-2).map((log, index) => (
                <div
                  key={`${log}-${index}`}
                  className="text-[9px] text-[#869397] truncate"
                  style={mono}
                >
                  <span className="text-[#4cd7f6]">›</span> {log}
                </div>
              ))}
            </div>
          </div>

          <div
            className="text-[8px] text-[#3d494c] uppercase tracking-widest shrink-0"
            style={mono}
          >
            MACH-X // MISSION CONSOLE
          </div>
        </section>
      </div>
    </main>
  );
}
