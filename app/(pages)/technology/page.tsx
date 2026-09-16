import type { Metadata } from 'next';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Reveal from '../../components/Reveal';
import RevealText from '../../components/RevealText';
import CountUp from '../../components/CountUp';

export const metadata: Metadata = {
  title: 'PS 26158 Technology | Drone3D Reconstruction Engine',
  description:
    'Sensor-fused single-pass drone video reconstruction using SfM, MVS, 2D Gaussian Splatting, semantic segmentation and confidence heatmaps.',
};

const MONO = "'JetBrains Mono', monospace";

const PHASES = [
  {
    n: '01',
    accent: '#4cd7f6',
    title: 'Preprocess the Flight',
    body: 'OpenCV/FFmpeg decode the native video; blur scoring, CLAHE illumination normalization, adaptive keyframes, telemetry synchronization and lens undistortion prepare a trustworthy frame set.',
  },
  {
    n: '02',
    accent: '#4cd7f6',
    title: 'Mask Dynamic Objects',
    body: 'Dynamic-object detection and optical-flow consistency identify people, vehicles and other movers before they can corrupt feature matching and reconstruction. Dynamic regions are excluded from the permanent scene.',
  },
  {
    n: '03',
    accent: '#4cd7f6',
    title: 'Recover a Metric Camera Path',
    body: 'Visual feature matching and structure-from-motion recover camera poses. GPS and available sensor information provide metric constraints for a consistent camera trajectory.',
  },
  {
    n: '04',
    accent: '#ffb95f',
    title: 'Build Dense Geometry',
    body: 'Dense multi-view reconstruction fuses the selected views into a detailed 3D point representation, providing the geometric backbone for the final scene.',
  },
  {
    n: '05',
    accent: '#ffb95f',
    title: 'Apply Semantic Segmentation',
    body: 'Multi-view semantic labels separate buildings, roads and terrain, vegetation and dynamic objects so that different surface classes can be processed according to their geometry.',
  },
  {
    n: '06',
    accent: '#ffb95f',
    title: 'Regularize the 3D Geometry',
    body: 'Semantic geometry is cleaned and regularized. Building surfaces receive planar fitting and edge cleanup while terrain is smoothed and vegetation remains naturally irregular.',
  },
  {
    n: '07',
    accent: '#7cf7a8',
    title: 'Texture the Scene',
    body: 'Multi-view texture baking projects captured imagery onto the reconstructed mesh, producing a textured OBJ/MTL asset and atlas for photorealistic visualization.',
  },
  {
    n: '08',
    accent: '#7cf7a8',
    title: 'Georeference the Reconstruction',
    body: 'The reconstructed scene is anchored to the available geographic reference frame, with geospatial transformation data and DSM/DEM-compatible outputs generated for GIS workflows.',
  },
  {
    n: '09',
    accent: '#7cf7a8',
    title: 'Generate Confidence Heatmaps & Export',
    body: 'View-density, reprojection, depth, coverage, GSD and semantic confidence layers quantify uncertainty before the final digital-twin assets and GIS-ready outputs are exported.',
  },
];

const TOOLS = [
  ['Video / preprocessing', 'OpenCV · FFmpeg · CLAHE · blur scoring'],
  ['Features / pose', 'SuperPoint · LightGlue · hloc · COLMAP · GLOMAP · FastMap'],
  ['Sensor fusion', 'GTSAM factor graph or EKF · ORB-SLAM3 for GPS gaps'],
  ['Dense reconstruction', 'OpenMVS · 2D Gaussian Splatting · Open3D'],
  ['Semantics', 'SAM 3 · RAFT · SegFormer / Mask2Former'],
  ['Depth priors', 'MoGe-2 · UniDepth v2 · Depth Anything V2 fallback'],
  ['Simulation', 'Colosseum / Unreal Engine 5.2+ · PX4/ArduPilot SITL/HITL'],
  ['Viewer / GIS', 'Three.js · Potree · GDAL/rasterio · PDAL · QGIS'],
];

const DATASETS = [
  'UAVid',
  'ISPRS Potsdam / Vaihingen',
  'Aeroscapes / Semantic Drone Dataset',
  'UrbanScene3D',
  'Mill19 / GauU-Scene',
  'WHU Buildings',
  'Tanks & Temples',
  'VisDrone',
];

const HEATMAPS = [
  ['View-density', 'How many camera views observed each 3D point.'],
  ['Reprojection error', 'Bundle-adjustment residuals and geometric uncertainty.'],
  ['Depth confidence', 'Agreement between MVS / 2DGS and monocular priors.'],
  ['Coverage / occlusion', 'Where no camera ever saw the surface.'],
  ['GSD / resolution', 'Expected texture resolution from altitude, angle and intrinsics.'],
  ['Semantic confidence', 'Per-point class certainty after multi-view label fusion.'],
];

export default function TechnologyPage() {
  return (
    <>
      <Header />

      <main className="w-full pt-16 min-h-screen">
        {/* HERO */}
        <section className="relative overflow-hidden bg-[#060e20] py-20">
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                'linear-gradient(rgba(76,215,246,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(76,215,246,0.25) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />

          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <div className="max-w-4xl">
              <span
                className="text-[#4cd7f6] text-[11px] uppercase tracking-[0.25em]"
                style={{ fontFamily: MONO }}
              >
                PS 26158 / NTRO / SIH 2026
              </span>

              <h1
                className="mt-4 text-4xl md:text-6xl font-bold tracking-tight text-[#dae2fd]"
                style={{ fontFamily: 'Inter' }}
              >
                <RevealText text="A scene the system understands." />
              </h1>

              <p
                className="mt-5 max-w-3xl text-lg leading-relaxed text-[#bcc9cd]"
                style={{ fontFamily: 'Inter' }}
              >
                The pipeline does not stop at a point cloud. It answers four
                questions in order: where was the camera, what surface was
                observed, what kind of surface is it, and how sure are we?
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-12">
              {[
                ['9', 'Core reconstruction stages'],
                ['2', 'Processing tiers'],
                ['6', 'Confidence layers'],
                ['8', 'PS challenges answered'],
              ].map(([n, label], i) => (
                <Reveal key={label} delay={i * 0.08}>
                  <div className="p-5 rounded-xl bg-[#0b1326]/80 border border-[#3d494c]/20">
                    <span
                      className="text-3xl font-bold text-[#4cd7f6]"
                      style={{ fontFamily: 'Inter' }}
                    >
                      <CountUp end={Number(n)} />
                    </span>

                    <p
                      className="mt-1 text-[11px] uppercase tracking-widest text-[#869397]"
                      style={{ fontFamily: MONO }}
                    >
                      {label}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* RECONSTRUCTION PIPELINE */}
        <section className="bg-[#0b1326] py-24">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal>
              <div className="flex items-end justify-between gap-6 mb-12">
                <div>
                  <span
                    className="text-[#4cd7f6] text-[11px] uppercase tracking-widest"
                    style={{ fontFamily: MONO }}
                  >
                    01 → 09
                  </span>

                  <h2
                    className="mt-2 text-3xl font-bold text-[#dae2fd]"
                    style={{ fontFamily: 'Inter' }}
                  >
                    The reconstruction pipeline
                  </h2>
                </div>

                <span
                  className="hidden md:block text-[#869397] text-[10px] uppercase tracking-widest"
                  style={{ fontFamily: MONO }}
                >
                  Metric scale comes from sensor fusion — not monocular depth.
                </span>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PHASES.map((phase, i) => (
                <Reveal
                  key={phase.n}
                  delay={i * 0.07}
                  direction="up"
                >
                  <article className="relative h-full p-7 rounded-xl bg-[#171f33]/65 border border-[#3d494c]/25 hover:border-[#4cd7f6]/35 transition-all hover:-translate-y-1">
                    <span
                      className="text-[11px] tracking-widest"
                      style={{
                        fontFamily: MONO,
                        color: phase.accent,
                      }}
                    >
                      STAGE {phase.n}
                    </span>

                    <h3
                      className="mt-2 text-xl font-semibold text-[#dae2fd]"
                      style={{ fontFamily: 'Inter' }}
                    >
                      {phase.title}
                    </h3>

                    <p
                      className="mt-3 text-[14px] leading-relaxed text-[#bcc9cd]"
                      style={{ fontFamily: 'Inter' }}
                    >
                      {phase.body}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* SEMANTIC REGULARIZATION + UNCERTAINTY */}
        <section className="bg-[#0d1730] py-24">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Reveal direction="left">
              <div className="h-full rounded-xl bg-[#171f33]/55 border border-[#3d494c]/20 p-7">
                <span
                  className="text-[#ffb95f] text-[11px] uppercase tracking-widest"
                  style={{ fontFamily: MONO }}
                >
                  Semantic regularization
                </span>

                <h2
                  className="mt-2 text-3xl font-bold text-[#dae2fd]"
                  style={{ fontFamily: 'Inter' }}
                >
                  Not every surface should look the same.
                </h2>

                <p
                  className="mt-4 text-[#bcc9cd] text-[14px] leading-relaxed"
                  style={{ fontFamily: 'Inter' }}
                >
                  Buildings are snapped to dominant planes and cleaned under
                  a Manhattan-style assumption. Roads and terrain are smoothed
                  into low-order elevation surfaces. Vegetation remains
                  irregular and dense. Vehicles are excluded from the
                  permanent scene or kept as explicitly time-stamped dynamic
                  objects.
                </p>

                <div className="mt-6 space-y-2">
                  {[
                    'Buildings / roofs → planar + crisp',
                    'Roads / terrain → smooth elevation',
                    'Vegetation → organic Gaussian / point detail',
                    'Vehicles → dynamic / timestamped',
                  ].map((x) => (
                    <div
                      key={x}
                      className="px-4 py-3 rounded-lg bg-[#0b1326] border border-[#3d494c]/15 text-[12px] text-[#dae2fd]"
                      style={{ fontFamily: MONO }}
                    >
                      {x}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal direction="right">
              <div className="h-full rounded-xl bg-[#171f33]/55 border border-[#3d494c]/20 p-7">
                <span
                  className="text-[#7cf7a8] text-[11px] uppercase tracking-widest"
                  style={{ fontFamily: MONO }}
                >
                  Honest uncertainty
                </span>

                <h2
                  className="mt-2 text-3xl font-bold text-[#dae2fd]"
                  style={{ fontFamily: 'Inter' }}
                >
                  Unknown is a valid answer.
                </h2>

                <p
                  className="mt-4 text-[#bcc9cd] text-[14px] leading-relaxed"
                  style={{ fontFamily: 'Inter' }}
                >
                  Single-pass imagery cannot see every facade. The system
                  therefore marks unseen surfaces instead of silently
                  inventing plausible geometry. Small gaps may receive
                  constrained texture synthesis; large unseen regions remain
                  visibly low-confidence and can drive a recommended follow-up
                  flight.
                </p>

                <div className="mt-6 rounded-lg border border-[#7cf7a8]/20 bg-[#7cf7a8]/5 p-5">
                  <div
                    className="flex items-center justify-between text-[10px] uppercase tracking-widest"
                    style={{ fontFamily: MONO }}
                  >
                    <span className="text-[#869397]">
                      Coverage / occlusion
                    </span>

                    <span className="text-[#7cf7a8]">
                      EXPLICIT
                    </span>
                  </div>

                  <div className="mt-4 h-2 rounded-full bg-[#202c3a] overflow-hidden">
                    <div className="h-full w-[74%] bg-gradient-to-r from-[#4cd7f6] to-[#7cf7a8]" />
                  </div>

                  <p
                    className="mt-2 text-[11px] text-[#869397]"
                    style={{ fontFamily: MONO }}
                  >
                    Illustrative UI state — final percentages are computed
                    from the captured flight.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ENGINEERING STACK + CONFIDENCE */}
        <section className="bg-[#0b1326] py-24">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Reveal>
              <div className="rounded-xl bg-[#171f33]/45 border border-[#3d494c]/20 p-7 h-full">
                <h2
                  className="text-2xl font-bold text-[#dae2fd]"
                  style={{ fontFamily: 'Inter' }}
                >
                  Engineering stack
                </h2>

                <div className="mt-6 space-y-3">
                  {TOOLS.map(([k, v]) => (
                    <div
                      key={k}
                      className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-2 p-3 rounded-lg bg-[#0b1326] border border-[#3d494c]/15"
                    >
                      <span
                        className="text-[10px] uppercase tracking-widest text-[#4cd7f6]"
                        style={{ fontFamily: MONO }}
                      >
                        {k}
                      </span>

                      <span
                        className="text-[12px] text-[#bcc9cd]"
                        style={{ fontFamily: MONO }}
                      >
                        {v}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="rounded-xl bg-[#171f33]/45 border border-[#3d494c]/20 p-7 h-full">
                <h2
                  className="text-2xl font-bold text-[#dae2fd]"
                  style={{ fontFamily: 'Inter' }}
                >
                  Confidence + exported layers
                </h2>

                <div className="mt-5 grid grid-cols-1 gap-2">
                  {HEATMAPS.map(([k, v]) => (
                    <div
                      key={k}
                      className="p-4 rounded-lg bg-[#0b1326] border border-[#3d494c]/15"
                    >
                      <div
                        className="text-[11px] font-bold text-[#7cf7a8]"
                        style={{ fontFamily: MONO }}
                      >
                        {k}
                      </div>

                      <p
                        className="mt-1 text-[12px] leading-relaxed text-[#869397]"
                        style={{ fontFamily: 'Inter' }}
                      >
                        {v}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {[
                    'OBJ / GLTF',
                    'PLY / .splat',
                    'GeoTIFF DSM / DEM',
                    'QGIS-ready',
                    'Distance + area measurement',
                  ].map((x) => (
                    <span
                      key={x}
                      className="px-3 py-2 rounded-md bg-[#4cd7f6]/5 border border-[#4cd7f6]/15 text-[10px] uppercase tracking-widest text-[#4cd7f6]"
                      style={{ fontFamily: MONO }}
                    >
                      {x}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* DATA + SIMULATION */}
        <section className="bg-[#0d1730] py-24">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal>
              <span
                className="text-[#4cd7f6] text-[11px] uppercase tracking-widest"
                style={{ fontFamily: MONO }}
              >
                Data + simulation
              </span>

              <h2
                className="mt-2 text-3xl font-bold text-[#dae2fd]"
                style={{ fontFamily: 'Inter' }}
              >
                Build against ground truth before the NTRO footage arrives.
              </h2>

              <p
                className="mt-4 max-w-3xl text-[#bcc9cd] text-[14px] leading-relaxed"
                style={{ fontFamily: 'Inter' }}
              >
                UAVid and the aerial reconstruction datasets cover semantics
                and geometry today. Colosseum / Unreal provides a procedural
                town, one continuous flight, perfect pose ground truth and
                controllable blur, GPS noise, lighting and dynamic-object
                stress tests.
              </p>
            </Reveal>

            <div className="mt-8 flex flex-wrap gap-2">
              {DATASETS.map((d) => (
                <span
                  key={d}
                  className="px-3 py-2 rounded-md bg-[#171f33] border border-[#3d494c]/20 text-[11px] text-[#bcc9cd]"
                  style={{ fontFamily: MONO }}
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}