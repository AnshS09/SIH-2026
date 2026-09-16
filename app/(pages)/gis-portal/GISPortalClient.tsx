'use client';

import { useEffect, useRef, useState } from 'react';

const API = 'http://localhost:5000';
type Status = 'idle' | 'processing' | 'completed' | 'failed';

const mono = { fontFamily: "'JetBrains Mono', monospace" };

export default function GISPortalClient() {
  const [video, setVideo] = useState<File | null>(null);
  const [csv, setCsv] = useState<File | null>(null);
  const [camera, setCamera] = useState<File | null>(null);
  const [missionId, setMissionId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [logs, setLogs] = useState<string[]>(['System ready. Waiting for flight input.']);
  const poll = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (poll.current) clearInterval(poll.current); }, []);

  const log = (text: string) => setLogs(p => [...p.slice(-3), text]);

  const auth = () => localStorage.getItem('auth_token');

  async function createMission() {
    const token = auth();
    if (!token) throw new Error('Authentication required. Please login again.');

    const r = await fetch(`${API}/api/missions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error || 'Could not create mission');
    return d.mission_id as string;
  }

  async function run() {
    setError('');
    setMessage('');

    if (!video || !csv || !camera) {
      setError('Select the video, telemetry CSV, and camera JSON first.');
      return;
    }

    const token = auth();
    if (!token) {
      setError('Authentication required. Please login again.');
      return;
    }

    try {
      setStatus('processing');
      setProgress(5);
      log('Creating reconstruction mission...');

      const id = await createMission();
      setMissionId(id);
      log(`Mission created: ${id}`);

      const body = new FormData();
      body.append('video', video);
      body.append('telemetry', csv);
      body.append('camera', camera);

      const r = await fetch(`${API}/api/missions/${id}/reconstruct`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body,
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || d.details || 'Could not start reconstruction');

      setMessage('Reconstruction started.');
      log('AI pipeline running...');

      poll.current = setInterval(async () => {
        try {
          const sr = await fetch(`${API}/api/missions/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const s = await sr.json();
          if (!sr.ok) throw new Error(s.error || 'Status request failed');

          setStatus(s.status || 'processing');
          setProgress(s.progress || 0);

          if (s.status === 'completed') {
            if (poll.current) clearInterval(poll.current);
            setProgress(100);
            setMessage('3D reconstruction complete.');
            log('3D model ready. Opening viewer...');
            setTimeout(() => {
              window.open(`${API}/api/missions/${id}/viewer`, '_blank', 'noopener,noreferrer');
            }, 500);
          }

          if (s.status === 'failed') {
            if (poll.current) clearInterval(poll.current);
            setError(s.error || 'Reconstruction failed.');
            log('Pipeline failed. Check the backend terminal.');
          }
        } catch (e) {
          if (poll.current) clearInterval(poll.current);
          setStatus('failed');
          setError(e instanceof Error ? e.message : 'Status polling failed');
        }
      }, 2000);
    } catch (e) {
      setStatus('failed');
      setProgress(0);
      setError(e instanceof Error ? e.message : 'Could not start reconstruction');
      log('Mission start failed.');
    }
  }

  function reset() {
    if (poll.current) clearInterval(poll.current);
    setVideo(null); setCsv(null); setCamera(null);
    setMissionId(null); setStatus('idle'); setProgress(0);
    setMessage(''); setError('');
    setLogs(['System ready. Waiting for flight input.']);
  }

  const processing = status === 'processing';

  return (
    <main className="min-h-screen bg-[#0b1326] text-[#dae2fd]">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 py-6">
        <header className="mb-6">
          <div className="flex items-center gap-2 text-[#4cd7f6] text-[10px] uppercase tracking-[0.2em]" style={mono}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] animate-pulse" />
            Mission Console
          </div>
          <h1 className="text-3xl font-semibold mt-2">Geospatial Reconstruction</h1>
          <p className="text-[#869397] text-sm mt-1">
            Upload flight data and generate a production 3D reconstruction.
          </p>
        </header>

        <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px] gap-5">
          <div className="min-h-[610px] rounded-2xl border border-white/8 bg-[#060e20] overflow-hidden relative">
            {processing ? (
              <div className="absolute inset-0 flex items-center justify-center text-center">
                <div>
                  <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border border-[#4cd7f6]/20 animate-ping" />
                    <div className="absolute inset-3 rounded-full border border-[#4cd7f6]/30 animate-pulse" />
                    <span className="material-symbols-outlined text-6xl text-[#4cd7f6] animate-bounce">flight</span>
                  </div>
                  <h2 className="mt-7 text-2xl font-semibold">Reconstruction in progress</h2>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-[#4cd7f6]" style={mono}>
                    AI PIPELINE // {progress}%
                  </p>
                  <div className="mt-5 w-80 max-w-full h-1.5 rounded-full bg-white/10 overflow-hidden mx-auto">
                    <div className="h-full bg-[#4cd7f6] transition-all duration-700" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="mt-4 text-xs text-[#869397]">
                    Video → keyframes → reconstruction → mesh → texture → export
                  </p>
                </div>
              </div>
            ) : status === 'completed' ? (
              <div className="absolute inset-0 flex items-center justify-center text-center">
                <div>
                  <span className="material-symbols-outlined text-6xl text-[#4cd7f6]">check_circle</span>
                  <h2 className="mt-5 text-2xl font-semibold">3D Model Ready</h2>
                  <p className="mt-2 text-sm text-[#869397]">The Drone3D viewer has been opened.</p>
                  <button
                    onClick={() => missionId && window.open(`${API}/api/missions/${missionId}/viewer?missionId=${missionId}`, '_blank', 'noopener,noreferrer')}
                    className="mt-5 px-6 py-3 rounded-lg bg-[#4cd7f6] text-[#003640] text-[10px] font-bold uppercase tracking-widest"
                    style={mono}
                  >
                    Open 3D Viewer
                  </button>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-center">
                <div>
                  <div className="mx-auto w-28 h-28 rounded-full border border-[#4cd7f6]/20 bg-[#4cd7f6]/5 flex items-center justify-center">
                    <span className="material-symbols-outlined text-5xl text-[#4cd7f6]/70">view_in_ar</span>
                  </div>
                  <h2 className="mt-6 text-2xl font-semibold">Reconstruction Viewer</h2>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-[#4cd7f6]" style={mono}>
                    Awaiting reconstruction
                  </p>
                  <p className="mt-3 text-xs text-[#869397]">Upload your flight data and run the pipeline.</p>
                </div>
              </div>
            )}

            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none">
              <div className="px-3 py-2 rounded-lg bg-[#0b1326]/80 border border-white/8" style={mono}>
                <div className="text-[9px] text-[#869397] uppercase tracking-widest">Mission</div>
                <div className="text-[11px] mt-1">{missionId || 'NOT CREATED'}</div>
              </div>
              <div className="text-[9px] text-[#869397] uppercase tracking-widest" style={mono}>MACH-X // RECON ENGINE</div>
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-2xl border border-white/8 bg-[#171f33]/80 p-5">
              <div className="text-[9px] text-[#4cd7f6] uppercase tracking-[0.18em]" style={mono}>Flight Input</div>

              <div className="mt-4 space-y-3">
                <Input label="Flight Video" accept="video/*,.mp4,.mov,.avi" file={video} setFile={setVideo} disabled={processing} />
                <Input label="Telemetry CSV" accept=".csv,text/csv" file={csv} setFile={setCsv} disabled={processing} />
                <Input label="Camera Calibration" accept=".json,application/json" file={camera} setFile={setCamera} disabled={processing} />
              </div>

              <button
                onClick={run}
                disabled={processing}
                className="w-full mt-5 py-3.5 rounded-lg bg-[#4cd7f6] text-[#003640] text-[10px] font-bold uppercase tracking-[0.16em] disabled:opacity-40"
                style={mono}
              >
                {processing ? 'Pipeline Running...' : 'Run Reconstruction'}
              </button>

              <button
                onClick={reset}
                disabled={processing}
                className="w-full mt-2 py-2.5 rounded-lg border border-white/10 text-[#869397] text-[9px] uppercase tracking-widest disabled:opacity-30"
                style={mono}
              >
                Reset
              </button>

              {message && <p className="mt-3 text-[10px] text-[#4cd7f6]" style={mono}>{message}</p>}
              {error && <p className="mt-3 text-[10px] text-[#ffb3ad] leading-relaxed" style={mono}>{error}</p>}
            </div>

            <div className="rounded-2xl border border-white/8 bg-[#171f33]/80 p-5">
              <div className="flex justify-between items-center">
                <span className="text-[9px] text-[#bcc9cd] uppercase tracking-[0.18em]" style={mono}>Pipeline Status</span>
                <span className="text-[9px] text-[#4cd7f6] uppercase tracking-widest" style={mono}>{status}</span>
              </div>
              <div className="mt-4 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-[#4cd7f6] transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              <div className="mt-4 space-y-2">
                {logs.slice(-3).map((x, i) => (
                  <div key={`${x}-${i}`} className="text-[9px] text-[#869397]" style={mono}>› {x}</div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/8 bg-[#171f33]/80 p-5">
              <div className="text-[9px] text-[#bcc9cd] uppercase tracking-[0.18em]" style={mono}>Required Inputs</div>
              <div className="mt-3 space-y-2 text-xs text-[#869397]">
                <div>• Continuous flight video</div>
                <div>• Matching telemetry CSV</div>
                <div>• Camera calibration JSON</div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

function Input({
  label, accept, file, setFile, disabled,
}: {
  label: string; accept: string; file: File | null;
  setFile: (f: File | null) => void; disabled: boolean;
}) {
  return (
    <label className={`block rounded-xl border border-white/10 bg-[#0b1326]/80 p-3 ${disabled ? 'opacity-50' : 'cursor-pointer hover:border-[#4cd7f6]/40'}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[9px] text-[#869397] uppercase tracking-widest" style={mono}>{label}</div>
          <div className="mt-1 text-xs text-[#dae2fd] truncate max-w-[250px]">{file ? file.name : 'Choose file'}</div>
        </div>
        <span className="material-symbols-outlined text-[#4cd7f6] text-xl">upload_file</span>
      </div>
      <input type="file" accept={accept} disabled={disabled} className="hidden"
        onChange={(e) => setFile(e.target.files?.[0] || null)} />
    </label>
  );
}
