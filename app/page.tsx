import Header from './components/Header';
import Footer from './components/Footer';
import HeroScene from './components/HeroScene';
import Reveal from './components/Reveal';
import RevealText from './components/RevealText';
import CountUp from './components/CountUp';

const MONO = "'JetBrains Mono', monospace";

const FEATURES = [
  { icon: 'satellite_alt', accent: '#4cd7f6', title: 'GPS + IMU + Vision', body: 'Sensor-fused pose estimation anchors the reconstruction to a metric coordinate frame without relying on extensive Ground Control Points.', statLabel: 'Pose strategy', statValue: 'Factor-graph BA' },
  { icon: 'domain', accent: '#ffb95f', title: 'Semantic-Aware Geometry', body: 'Buildings, roads, vegetation and dynamic objects are treated differently so the final scene stays crisp where geometry should be rigid and organic where it should be.', statLabel: 'Scene classes', statValue: '6 semantic layers' },
  { icon: 'layers', accent: '#7cf7a8', title: 'Confidence Everywhere', body: 'View-density, reprojection error, depth, coverage, GSD and semantic confidence become interactive overlays and exportable georeferenced rasters.', statLabel: 'QA outputs', statValue: '6 heatmaps' },
];

const PIPELINE_STEPS = [
  { n: '01', icon: 'videocam', title: 'Capture + Clean', body: 'Decode one continuous flight video, score blur, normalize illumination, select adaptive keyframes, sync GPS/IMU and undistort the camera.' },
  { n: '02', icon: 'my_location', title: 'Recover Pose', body: 'SuperPoint + LightGlue feed COLMAP/GLOMAP-style SfM while GPS and IMU become soft constraints inside bundle adjustment.' },
  { n: '03', icon: 'view_in_ar', title: 'Reconstruct', body: 'Fuse OpenMVS with 2D Gaussian Splatting; use monocular depth only to fill genuine single-view gaps, never to establish absolute scale.' },
  { n: '04', icon: 'insights', title: 'Understand + Export', body: 'Segment the scene, regularize structure by class, texture the result, georeference it and expose confidence/coverage layers in the web viewer.' },
];

const STATS = [
  { end: 2, suffix: ' tiers', label: 'Draft + refined processing' },
  { end: 8, suffix: ' challenges', label: 'Explicit PS challenge vectors covered' },
  { end: 6, suffix: ' heatmaps', label: 'Confidence and quality layers' },
  { end: 7, suffix: ' outputs', label: 'Model + GIS export families' },
];

export default function Home() {
  return (
    <>
      <Header />
      <main className="w-full pt-16 min-h-screen">
        <div className="flex flex-col w-full relative min-h-screen">

          {/* Hero Section with 3D drone scene */}
          <div className="relative w-full h-[1024px] flex items-center justify-center -mt-16 pt-16 overflow-hidden">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1326] via-[#0b1326]/40 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-0 scanlines opacity-40 z-10 pointer-events-none" />

            {/* Three.js scene */}
            <HeroScene />

            {/* Hero content */}
            <div className="relative z-20 w-full max-w-7xl mx-auto px-6 flex flex-col items-start gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              {/* Tech accent */}
              <div className="flex items-center gap-1 mb-2">
                <div className="w-12 h-1 bg-[#4cd7f6] rounded-full animate-pulse" />
                <span className="text-[#4cd7f6] text-[12px] uppercase tracking-widest" style={{ fontFamily: MONO }}>
                  Flight / Recon Engine Online
                </span>
              </div>

              <h1 className="font-bold text-[#dae2fd] max-w-4xl tracking-tighter leading-tight drop-shadow-xl" style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', fontFamily: 'Inter' }}>
                Single-Pass Video{' '}
                <br />
                <span className="text-gradient-animated">
                  Into a Metric 3D Scene.
                </span>
              </h1>

              <p className="text-[#bcc9cd] max-w-2xl text-lg leading-relaxed mt-4 mb-4 drop-shadow-md" style={{ fontFamily: 'Inter' }}>
                One continuous drone flight becomes a georeferenced, metrically accurate 3D reconstruction — with semantic geometry, honest occlusion handling and confidence heatmaps built into the result.
              </p>

              <div className="flex flex-wrap gap-4 mt-2">
                <a href="/gis-portal" className="group relative px-6 py-4 bg-[#4cd7f6] text-[#003640] text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center justify-center overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(76,215,246,0.4)]" style={{ fontFamily: MONO }}>
                  <span className="relative z-10 flex items-center gap-1">
                    Launch GIS Viewer{' '}
                    <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-1">rocket_launch</span>
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                </a>
                <a href="/technology" className="px-6 py-4 bg-[#2d3449]/50 backdrop-blur-md border border-[#3d494c]/30 text-[#dae2fd] hover:text-[#4cd7f6] hover:border-[#4cd7f6] text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center justify-center transition-colors" style={{ fontFamily: MONO }}>
                  Explore Technology
                </a>
              </div>

              {/* Floating data tag */}
              <div className="absolute top-1/4 right-[10%] hidden lg:flex flex-col gap-1 p-1 bg-[#0b1326]/40 backdrop-blur-md border-l-2 border-[#4cd7f6] rounded-r-lg animate-fade-in-up animate-float-slow" style={{ animationDelay: '0.6s' }}>
                <span className="text-[#bcc9cd] text-[10px] uppercase" style={{ fontFamily: MONO }}>Reconstruction Mode</span>
                <span className="text-[#4cd7f6] text-[14px] font-bold" style={{ fontFamily: MONO }}>2-TIER GPU PIPELINE</span>
              </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 animate-bounce">
              <span className="text-[#bcc9cd] opacity-70 text-[10px] uppercase tracking-widest" style={{ fontFamily: MONO }}>Scroll Sequence</span>
              <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">keyboard_double_arrow_down</span>
            </div>
          </div>

          {/* Why This Approach Section */}
          <div className="relative w-full bg-[#0b1326] py-24 z-20">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-baseline justify-between mb-16 border-b border-[#2d3449]/50 pb-8">
                <h2 className="font-semibold text-2xl text-[#dae2fd]" style={{ fontFamily: 'Inter' }}>
                  <RevealText text="Why This Approach" />
                </h2>
                <span className="text-[#bcc9cd] text-[12px]" style={{ fontFamily: MONO }}>PS 26158 / SIH 2026</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {FEATURES.map((f, i) => (
                  <Reveal key={f.title} delay={i * 0.12} direction="up">
                    <div className="group p-4 bg-[#171f33]/40 backdrop-blur-sm rounded-xl hover:bg-[#171f33] transition-colors duration-300 relative overflow-hidden flex flex-col h-full hover-lift">
                      <div className="absolute top-0 left-0 w-full h-[2px] opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(to right, ${f.accent}, transparent)` }} />
                      <div className="w-12 h-12 rounded-lg bg-[#2d3449] flex items-center justify-center mb-4 transition-colors" style={{ backgroundColor: undefined }}>
                        <span className="material-symbols-outlined" style={{ color: f.accent }}>{f.icon}</span>
                      </div>
                      <h3 className="font-semibold text-[20px] text-[#dae2fd] mb-1" style={{ fontFamily: 'Inter' }}>{f.title}</h3>
                      <p className="text-[#bcc9cd] text-[14px] mb-4 flex-grow leading-relaxed" style={{ fontFamily: 'Inter' }}>
                        {f.body}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-2 border-t border-[#3d494c]/20">
                        <span className="text-[#bcc9cd] text-[12px]" style={{ fontFamily: MONO }}>{f.statLabel}</span>
                        <span className="text-[14px] font-bold" style={{ fontFamily: MONO, color: f.accent }}>{f.statValue}</span>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="relative w-full bg-[#0d1730] py-24 z-20 overflow-hidden">
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(76,215,246,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(76,215,246,0.4) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <Reveal>
                <div className="max-w-2xl mb-16">
                  <span className="text-[#4cd7f6] text-[12px] uppercase tracking-widest block mb-3" style={{ fontFamily: MONO }}>End-to-end pipeline</span>
                  <h2 className="font-bold text-[#dae2fd]" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontFamily: 'Inter' }}>
                    <RevealText text="From flight telemetry to a scene the system understands." delay={0.05} />
                  </h2>
                </div>
              </Reveal>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {PIPELINE_STEPS.map((s, i) => (
                  <Reveal key={s.n} delay={i * 0.12} direction="up">
                    <div className="relative h-full p-6 bg-[#171f33]/50 rounded-xl border border-[#3d494c]/20 hover:border-[#4cd7f6]/40 transition-colors hover-lift">
                      <span className="absolute top-4 right-5 text-[#bcc9cd] opacity-20 text-3xl font-bold" style={{ fontFamily: MONO }}>{s.n}</span>
                      <div className="w-11 h-11 rounded-lg bg-[#4cd7f6]/10 flex items-center justify-center mb-5">
                        <span className="material-symbols-outlined text-[#4cd7f6] text-[22px]">{s.icon}</span>
                      </div>
                      <h3 className="font-semibold text-lg text-[#dae2fd] mb-2" style={{ fontFamily: 'Inter' }}>{s.title}</h3>
                      <p className="text-[#bcc9cd] text-[13px] leading-relaxed" style={{ fontFamily: 'Inter' }}>{s.body}</p>
                      {i < PIPELINE_STEPS.length - 1 && (
                        <span className="hidden lg:flex material-symbols-outlined text-[#3d494c] absolute top-1/2 -right-3 -translate-y-1/2 z-10 text-[18px]">chevron_right</span>
                      )}
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>

          {/* Stats band */}
          <div className="relative w-full bg-[#0b1326] py-20 z-20 border-y border-[#2d3449]/40">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {STATS.map((s, i) => (
                  <Reveal key={s.label} delay={i * 0.1} direction="up">
                    <div className="flex flex-col gap-1 text-center lg:text-left">
                      <span className="font-bold text-[#4cd7f6]" style={{ fontSize: 'clamp(2rem, 3.4vw, 2.75rem)', fontFamily: 'Inter' }}>
                        <CountUp end={s.end} decimals={s.decimals ?? 0} prefix={s.prefix ?? ''} suffix={s.suffix ?? ''} />
                      </span>
                      <span className="text-[#bcc9cd] text-[12px] uppercase tracking-wide" style={{ fontFamily: MONO }}>{s.label}</span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>

          {/* CTA banner */}
          <div className="relative w-full bg-[#0b1326] py-24 z-20 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#4cd7f6]/10 pointer-events-none" style={{ filter: 'blur(140px)' }} />
            <div className="max-w-4xl mx-auto px-6 relative z-10 text-center flex flex-col items-center gap-6">
              <Reveal>
                <span className="text-[#4cd7f6] text-[12px] uppercase tracking-widest" style={{ fontFamily: MONO }}>Ready when you are</span>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 className="font-bold text-[#dae2fd]" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: 'Inter' }}>
                  <RevealText text="Turn one flight into a measurable digital twin." delay={0.05} />
                </h2>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="text-[#bcc9cd] max-w-xl text-[15px] leading-relaxed" style={{ fontFamily: 'Inter' }}>
                  Open the viewer to inspect the reconstructed city, toggle geometry and confidence layers, measure distances and areas, and export GIS-ready assets.
                </p>
              </Reveal>
              <Reveal delay={0.24}>
                <a href="/gis-portal" className="group relative mt-2 px-8 py-4 bg-[#4cd7f6] text-[#003640] text-[11px] font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 overflow-hidden transition-all hover:shadow-[0_0_25px_rgba(76,215,246,0.5)]" style={{ fontFamily: MONO }}>
                  <span className="relative z-10 flex items-center gap-1">
                    Open GIS Portal
                    <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                </a>
              </Reveal>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
