import type { Metadata } from 'next';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Reveal from '../../components/Reveal';
import RevealText from '../../components/RevealText';
import CountUp from '../../components/CountUp';

export const metadata: Metadata = {
  title: 'PS 26158 Team | Mission & Roles',
  description: 'The PS 26158 team, roles, design principles and execution plan for single-pass drone video to accurate 3D reconstruction.',
};

const MONO = "'JetBrains Mono', monospace";

const TEAM = [
  { name: 'Ansh', role: 'Mech / Hardware / CAD / Embedded', lane: 'Drone rig, telemetry hardware, camera calibration, CAD mounts', icon: 'precision_manufacturing', accent: '#4cd7f6' },
  { name: 'Amatra', role: 'Product / UX / Pitch', lane: 'Judge narrative, viewer UX, PPT and demo video', icon: 'design_services', accent: '#ffb95f' },
  { name: 'Naman', role: 'Backend', lane: 'Orchestration service, APIs, storage, integration and deployment', icon: 'dns', accent: '#7cf7a8' },
  { name: 'Avni', role: 'Junior Python / Embedded', lane: 'Preprocessing, datasets, QA and embedded support', icon: 'code', accent: '#ffb3ad' },
  { name: 'Kinshuk', role: 'CV / ML / Simulation', lane: 'SfM/SLAM, MVS, dynamic-object detection and simulation', icon: 'view_in_ar', accent: '#4cd7f6' },
  { name: 'Rishav', role: 'AI/ML / R&D', lane: '2DGS, depth, semantics, regularization and heatmaps', icon: 'neurology', accent: '#ffb95f' },
];

const PRINCIPLES = [
  { n: '01', title: 'Metric scale from sensors', body: 'GPS/IMU-anchored bundle adjustment is the source of absolute scale. Monocular depth is only a relative-depth gap filler.', icon: 'my_location', accent: '#4cd7f6' },
  { n: '02', title: 'Geometry should respect semantics', body: 'A building needs planar, sharp geometry; a tree should remain irregular. One reconstruction treatment cannot be ideal for both.', icon: 'category', accent: '#ffb95f' },
  { n: '03', title: 'Never hide uncertainty', body: 'Unseen surfaces are flagged in coverage and confidence layers. Trust comes from showing what the system knows and does not know.', icon: 'verified_user', accent: '#7cf7a8' },
];

const ROADMAP = [
  ['Phase 1', 'Architecture + simulation', 'Lock ownership, stand up Colosseum/Blender, build the ingestion skeleton and establish the first end-to-end proof of concept.'],
  ['Phase 2', 'Dense reconstruction + semantics', 'Add 2DGS, MVS, dynamic masking, segmentation, regularization, texturing and the first confidence overlays.'],
  ['Phase 3', 'Viewer + national submission', 'Polish the Three.js viewer, measurement/export UX, benchmark numbers and demo video.'],
  ['Phase 4', 'Grand finale readiness', 'Run the pipeline against the official dataset, harden ingestion, profile compute, preserve a preprocessed fallback and rehearse.'],
];

export default function MissionPage() {
  return (
    <>
      <Header />
      <main className="w-full pt-16 min-h-screen">
        <section className="relative overflow-hidden bg-[#060e20] py-24">
          <div className="absolute inset-0 opacity-25" style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(76,215,246,0.20), transparent 32%), linear-gradient(rgba(76,215,246,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(76,215,246,0.12) 1px, transparent 1px)', backgroundSize: 'auto, 48px 48px, 48px 48px' }} />
          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <span className="text-[#4cd7f6] text-[11px] uppercase tracking-[0.25em]" style={{ fontFamily: MONO }}>PS 26158 / Robotics & Drones / Software</span>
            <h1 className="mt-4 max-w-5xl text-4xl md:text-6xl font-bold text-[#dae2fd] tracking-tight" style={{ fontFamily: 'Inter' }}><RevealText text="Build the pipeline. Prove the model. Explain the uncertainty." /></h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[#bcc9cd]" style={{ fontFamily: 'Inter' }}>
              This project is a deliberate engineering stack: sensor-fused pose, dense reconstruction, semantic reasoning, class-specific regularization, geospatial export and a confidence-first web viewer — all driven by one continuous drone flight.
            </p>
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[['6', 'team members'], ['9', 'pipeline stages'], ['2', 'processing tiers'], ['1', 'simulation-first strategy']].map(([num, label], i) => (
                <Reveal key={label} delay={i * 0.08}><div className="rounded-xl bg-[#0b1326]/75 border border-[#3d494c]/20 p-5"><div className="text-3xl font-bold text-[#4cd7f6]" style={{ fontFamily: 'Inter' }}><CountUp end={Number(num)} /></div><div className="mt-1 text-[10px] uppercase tracking-widest text-[#869397]" style={{ fontFamily: MONO }}>{label}</div></div></Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#0b1326] py-24">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal><div className="max-w-3xl"><span className="text-[#ffb95f] text-[11px] uppercase tracking-widest" style={{ fontFamily: MONO }}>The team</span><h2 className="mt-2 text-3xl md:text-4xl font-bold text-[#dae2fd]" style={{ fontFamily: 'Inter' }}>One pipeline, six clearly separated lanes.</h2><p className="mt-4 text-[#bcc9cd] text-[14px] leading-relaxed" style={{ fontFamily: 'Inter' }}>The blueprint separates geometry/pose work from neural rendering/depth/semantics, while hardware, backend, QA and product keep the system demonstrable rather than turning into six disconnected prototypes.</p></div></Reveal>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {TEAM.map((member, i) => (
                <Reveal key={member.name} delay={i * 0.07} direction="up">
                  <article className="h-full rounded-xl bg-[#171f33]/65 border border-[#3d494c]/20 p-6 hover:-translate-y-1 transition-transform">
                    <div className="flex items-center justify-between"><div className="w-11 h-11 rounded-lg bg-[#0b1326] flex items-center justify-center"><span className="material-symbols-outlined" style={{ color: member.accent }}>{member.icon}</span></div><span className="text-[10px] uppercase tracking-widest" style={{ fontFamily: MONO, color: member.accent }}>{member.name}</span></div>
                    <h3 className="mt-5 text-xl font-semibold text-[#dae2fd]" style={{ fontFamily: 'Inter' }}>{member.role}</h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-[#bcc9cd]" style={{ fontFamily: 'Inter' }}>{member.lane}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#0d1730] py-24">
          <div className="max-w-7xl mx-auto px-6"><Reveal><span className="text-[#4cd7f6] text-[11px] uppercase tracking-widest" style={{ fontFamily: MONO }}>Design doctrine</span><h2 className="mt-2 text-3xl md:text-4xl font-bold text-[#dae2fd]" style={{ fontFamily: 'Inter' }}>What we refuse to fake.</h2></Reveal><div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">{PRINCIPLES.map((p, i) => <Reveal key={p.n} delay={i * 0.08} direction="up"><div className="h-full rounded-xl bg-[#171f33]/55 border-t-2 p-7" style={{ borderColor: p.accent }}><div className="flex items-center justify-between"><span className="material-symbols-outlined text-[34px]" style={{ color: p.accent }}>{p.icon}</span><span className="text-2xl opacity-25 text-[#dae2fd]" style={{ fontFamily: MONO }}>{p.n}</span></div><h3 className="mt-6 text-xl font-semibold text-[#dae2fd]" style={{ fontFamily: 'Inter' }}>{p.title}</h3><p className="mt-3 text-[13px] leading-relaxed text-[#bcc9cd]" style={{ fontFamily: 'Inter' }}>{p.body}</p></div></Reveal>)}</div></div>
        </section>

        <section className="bg-[#0b1326] py-24">
          <div className="max-w-7xl mx-auto px-6"><Reveal><span className="text-[#7cf7a8] text-[11px] uppercase tracking-widest" style={{ fontFamily: MONO }}>Execution</span><h2 className="mt-2 text-3xl font-bold text-[#dae2fd]" style={{ fontFamily: 'Inter' }}>Roadmap to the SIH 2026 demo.</h2></Reveal><div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">{ROADMAP.map(([phase, title, body], i) => <Reveal key={phase} delay={i * 0.08} direction={i % 2 === 0 ? 'left' : 'right'}><div className="p-7 rounded-xl bg-[#171f33]/55 border border-[#3d494c]/20"><div className="text-[10px] uppercase tracking-widest text-[#4cd7f6]" style={{ fontFamily: MONO }}>{phase}</div><h3 className="mt-2 text-2xl font-semibold text-[#dae2fd]" style={{ fontFamily: 'Inter' }}>{title}</h3><p className="mt-3 text-[13px] leading-relaxed text-[#bcc9cd]" style={{ fontFamily: 'Inter' }}>{body}</p></div></Reveal>)}</div><div className="mt-8 rounded-xl border border-[#ffb95f]/20 bg-[#ffb95f]/5 p-5 text-[12px] leading-relaxed text-[#bcc9cd]" style={{ fontFamily: MONO }}>Planning note: the blueprint treats the dates as targets; the specific internal-hackathon and Grand Finale dates are to be confirmed through the college SPOC and official SIH portal.</div></div>
        </section>
      </main>
      <Footer />
    </>
  );
}
