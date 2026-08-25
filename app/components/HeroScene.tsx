'use client';
import { useEffect, useRef } from 'react';

export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hudPhaseRef = useRef<HTMLSpanElement>(null);
  const hudProgressRef = useRef<HTMLSpanElement>(null);
  const hudPoseRef = useRef<HTMLSpanElement>(null);
  const hudModelsRef = useRef<HTMLSpanElement>(null);
  const hudConfidenceRef = useRef<HTMLSpanElement>(null);
  const hudDotRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/three@0.125.0/build/three.min.js';
    script.crossOrigin = 'anonymous';
    let cleanupFn: (() => void) | undefined;

    script.onload = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const THREE = (window as any).THREE;
      if (!THREE) return;

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x07101d, 0.026);

      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;
      const camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 1200);
      camera.position.set(17, 15, 23);

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.outputEncoding = THREE.sRGBEncoding;
      container.appendChild(renderer.domElement);

      // ---------- Lighting ----------
      scene.add(new THREE.HemisphereLight(0x8eb7d2, 0x07101a, 1.2));
      const sun = new THREE.DirectionalLight(0xfff5dc, 2.0);
      sun.position.set(-12, 28, 14);
      sun.castShadow = true;
      sun.shadow.mapSize.width = 1024;
      sun.shadow.mapSize.height = 1024;
      sun.shadow.camera.near = 1;
      sun.shadow.camera.far = 90;
      sun.shadow.camera.left = -32;
      sun.shadow.camera.right = 32;
      sun.shadow.camera.top = 32;
      sun.shadow.camera.bottom = -32;
      scene.add(sun);
      const cyanFill = new THREE.PointLight(0x4cd7f6, 1.6, 55);
      cyanFill.position.set(8, 15, 10);
      scene.add(cyanFill);
      const warmFill = new THREE.PointLight(0xffb95f, 1.0, 46);
      warmFill.position.set(-16, 10, -12);
      scene.add(warmFill);

      // ---------- City ----------
      const city = new THREE.Group();
      scene.add(city);

      const cityWidth = 28;
      const cityDepth = 24;
      const roadGap = 3.4;
      const blockW = 4.7;
      const blockD = 3.8;
      const blocksX = 5;
      const blocksZ = 5;
      const buildings: Array<{ root: any; outline: any; windows: any[]; roof: any; ghost: any; targetY: number; score: number; semantic: 'building' | 'road' }> = [];
      const trees: any[] = [];
      const scanPoints: Array<{ mesh: any; base: any; age: number; speed: number }> = [];

      const groundGeo = new THREE.PlaneGeometry(54, 48, 1, 1);
      const groundMat = new THREE.MeshStandardMaterial({ color: 0x0b1520, roughness: 0.96, metalness: 0.04 });
      const ground = new THREE.Mesh(groundGeo, groundMat);
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      city.add(ground);

      // road slabs + sidewalks
      const roadMat = new THREE.MeshStandardMaterial({ color: 0x101a24, roughness: 0.9 });
      const laneMat = new THREE.MeshBasicMaterial({ color: 0x263846, transparent: true, opacity: 0.5 });
      for (let z = -cityDepth / 2 + 2.0; z <= cityDepth / 2 - 2.0; z += blockD + roadGap) {
        const road = new THREE.Mesh(new THREE.BoxGeometry(cityWidth, 0.05, roadGap), roadMat);
        road.position.set(0, 0.03, z);
        road.receiveShadow = true;
        city.add(road);
        for (let x = -cityWidth / 2 + 1.5; x <= cityWidth / 2 - 1.5; x += 1.65) {
          const line = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.012, 0.055), laneMat);
          line.position.set(x, 0.065, z);
          city.add(line);
        }
      }
      for (let x = -cityWidth / 2 + 2.2; x <= cityWidth / 2 - 2.2; x += blockW + roadGap) {
        const road = new THREE.Mesh(new THREE.BoxGeometry(roadGap, 0.05, cityDepth), roadMat);
        road.position.set(x, 0.035, 0);
        road.receiveShadow = true;
        city.add(road);
        for (let z = -cityDepth / 2 + 1.5; z <= cityDepth / 2 - 1.5; z += 1.65) {
          const line = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.012, 0.8), laneMat);
          line.position.set(x, 0.065, z);
          city.add(line);
        }
      }

      const buildingColors = [0x233447, 0x2b3c50, 0x1e2f41, 0x31455a, 0x263b4d];
      const windowMats = [
        new THREE.MeshBasicMaterial({ color: 0xffd27d, transparent: true, opacity: 0.9 }),
        new THREE.MeshBasicMaterial({ color: 0x7bdcf2, transparent: true, opacity: 0.9 }),
        new THREE.MeshBasicMaterial({ color: 0xa6b9c7, transparent: true, opacity: 0.28 }),
      ];

      let index = 0;
      for (let iz = 0; iz < blocksZ; iz++) {
        for (let ix = 0; ix < blocksX; ix++) {
          const baseX = -cityWidth / 2 + 3.1 + ix * (blockW + roadGap);
          const baseZ = -cityDepth / 2 + 2.9 + iz * (blockD + roadGap);
          const count = 1 + ((ix + iz) % 3);
          for (let b = 0; b < count; b++) {
            const w = 1.25 + ((b + ix * 2) % 3) * 0.6 + Math.random() * 0.35;
            const d = 1.15 + ((b + iz) % 2) * 0.6 + Math.random() * 0.35;
            const h = 2.0 + ((ix * 3 + iz * 5 + b) % 5) * 0.85 + Math.random() * 1.4;
            const x = baseX + (b - (count - 1) / 2) * 1.35 + (Math.random() - 0.5) * 0.35;
            const z = baseZ + (Math.random() - 0.5) * 1.0;
            const geo = new THREE.BoxGeometry(w, h, d);
            geo.translate(0, h / 2, 0);
            const material = new THREE.MeshStandardMaterial({ color: buildingColors[index % buildingColors.length], roughness: 0.7, metalness: 0.1, transparent: true, opacity: 0.15 });
            const mesh = new THREE.Mesh(geo, material);
            mesh.position.set(x, 0, z);
            mesh.scale.y = 0.01;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            city.add(mesh);

            const edges = new THREE.LineSegments(
              new THREE.EdgesGeometry(geo),
              new THREE.LineBasicMaterial({ color: 0x4cd7f6, transparent: true, opacity: 0.08 })
            );
            edges.position.copy(mesh.position);
            edges.scale.y = 0.01;
            city.add(edges);

            const windows: any[] = [];
            const roof = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.92, d * 0.92), new THREE.MeshStandardMaterial({ color: 0x4b5f72, roughness: 0.88, metalness: 0.08, transparent: true, opacity: 0.08 }));
            roof.rotation.x = -Math.PI / 2;
            roof.position.set(0, h - 0.01, 0);
            mesh.add(roof);

            const ghost = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: 0xffb95f, transparent: true, opacity: 0.0 }));
            ghost.position.copy(mesh.position);
            ghost.scale.y = 0.01;
            city.add(ghost);
            const rows = Math.max(2, Math.floor(h / 0.65));
            const cols = Math.max(2, Math.floor(w / 0.5));
            for (let r = 0; r < Math.min(rows, 7); r++) {
              for (let c = 0; c < Math.min(cols, 4); c++) {
                if ((r + c + b + ix + iz) % 4 === 0) continue;
                const plane = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.18), windowMats[(r + c + ix) % windowMats.length]);
                plane.position.set(-w / 2 + 0.3 + c * 0.42, 0.42 + r * 0.57, d / 2 + 0.006);
                mesh.add(plane);
                windows.push(plane);
              }
            }

            const score = ((index * 37) % 97) / 97;
            buildings.push({ root: mesh, outline: edges, windows, roof, ghost, targetY: h, score, semantic: 'building' });
            index++;
          }
        }
      }

      // Tree clusters: deliberately organic, kept separate from planar building reconstruction.
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x443729, roughness: 1 });
      const crownMat = new THREE.MeshStandardMaterial({ color: 0x244638, roughness: 1, transparent: true, opacity: 0.25 });
      for (let i = 0; i < 42; i++) {
        const x = -cityWidth / 2 + 1.5 + Math.random() * (cityWidth - 3);
        const z = -cityDepth / 2 + 1.5 + Math.random() * (cityDepth - 3);
        if (Math.abs(x) < 3 || Math.abs(z) < 3) continue;
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.35, 6), trunkMat);
        const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(0.38 + Math.random() * 0.24, 1), crownMat);
        trunk.position.set(x, 0.18, z);
        crown.position.set(x, 0.58, z);
        crown.scale.y = 1.25;
        city.add(trunk, crown);
        trees.push(crown);
      }

      // ---------- Survey path + coverage ----------
      const routeGroup = new THREE.Group();
      scene.add(routeGroup);
      const routePoints: any[] = [];
      for (let row = 0; row < 6; row++) {
        const z = -10.5 + row * 4.2;
        const dir = row % 2 === 0 ? 1 : -1;
        routePoints.push(new THREE.Vector3(dir === 1 ? -12 : 12, 7.5, z));
        routePoints.push(new THREE.Vector3(dir === 1 ? 12 : -12, 7.5, z));
      }
      const routeCurve = new THREE.CatmullRomCurve3(routePoints);
      const routeTube = new THREE.TubeGeometry(routeCurve, 180, 0.025, 6, false);
      const routeMat = new THREE.MeshBasicMaterial({ color: 0x4cd7f6, transparent: true, opacity: 0.16 });
      routeGroup.add(new THREE.Mesh(routeTube, routeMat));

      // ground coverage swaths
      const swathMat = new THREE.MeshBasicMaterial({ color: 0x4cd7f6, transparent: true, opacity: 0.025, side: THREE.DoubleSide, depthWrite: false });
      const swaths: any[] = [];
      for (let row = 0; row < 6; row++) {
        const z = -10.5 + row * 4.2;
        const swath = new THREE.Mesh(new THREE.PlaneGeometry(24, 3.3), swathMat.clone());
        swath.rotation.x = -Math.PI / 2;
        swath.position.set(0, 0.075, z);
        routeGroup.add(swath);
        swaths.push(swath);
      }

      // ---------- Drone: custom quad + gimbal + propellers ----------
      const drone = new THREE.Group();
      scene.add(drone);

      const dark = new THREE.MeshStandardMaterial({ color: 0x121a22, roughness: 0.42, metalness: 0.5 });
      const carbon = new THREE.MeshStandardMaterial({ color: 0x27313b, roughness: 0.52, metalness: 0.6 });
      const glass = new THREE.MeshStandardMaterial({ color: 0x0c3541, roughness: 0.15, metalness: 0.7, transparent: true, opacity: 0.86 });
      const navCyan = new THREE.MeshBasicMaterial({ color: 0x4cd7f6 });
      const navWarm = new THREE.MeshBasicMaterial({ color: 0xffb95f });

      const core = new THREE.Mesh(new THREE.SphereGeometry(0.55, 20, 12), dark);
      core.scale.set(1.45, 0.62, 1.12);
      core.castShadow = true;
      drone.add(core);

      const topDeck = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.13, 0.8), carbon);
      topDeck.position.y = 0.28;
      topDeck.castShadow = true;
      drone.add(topDeck);

      const cameraHousing = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.34, 0.42), glass);
      cameraHousing.position.set(0, -0.32, 0.06);
      drone.add(cameraHousing);
      const gimbalRing = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.025, 8, 18), carbon);
      gimbalRing.rotation.x = Math.PI / 2;
      gimbalRing.position.set(0, -0.37, 0.06);
      drone.add(gimbalRing);

      const armPositions: Array<[number, number, number]> = [[1.0, 0.02, 0.72], [-1.0, 0.02, 0.72], [1.0, 0.02, -0.72], [-1.0, 0.02, -0.72]];
      const rotors: any[] = [];
      armPositions.forEach((pos, i) => {
        const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 1.18, 8), carbon);
        arm.rotation.z = Math.PI / 2;
        arm.rotation.y = i < 2 ? 0.18 : -0.18;
        arm.position.set(pos[0] * 0.52, 0.08, pos[2] * 0.52);
        drone.add(arm);

        const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.16, 14), dark);
        motor.position.set(...pos);
        drone.add(motor);

        const prop = new THREE.Group();
        prop.position.set(pos[0], 0.18, pos[2]);
        const bladeGeo = new THREE.BoxGeometry(1.05, 0.025, 0.075);
        const bladeMat = new THREE.MeshBasicMaterial({ color: 0x9db8c4, transparent: true, opacity: 0.32, side: THREE.DoubleSide });
        const bladeA = new THREE.Mesh(bladeGeo, bladeMat);
        const bladeB = new THREE.Mesh(bladeGeo, bladeMat);
        bladeB.rotation.y = Math.PI / 2;
        prop.add(bladeA, bladeB);
        drone.add(prop);
        rotors.push(prop);
      });

      // landing legs
      const legGeo = new THREE.CylinderGeometry(0.045, 0.05, 0.45, 6);
      [[0.52, -0.1, 0.45], [-0.52, -0.1, 0.45], [0.52, -0.1, -0.45], [-0.52, -0.1, -0.45]].forEach((p) => {
        const leg = new THREE.Mesh(legGeo, carbon);
        leg.position.set(...p);
        leg.rotation.z = p[0] > 0 ? -0.24 : 0.24;
        drone.add(leg);
      });

      // Nav lights
      const navLights = [
        { pos: [1.2, 0.02, 0.88], mat: navCyan },
        { pos: [-1.2, 0.02, 0.88], mat: navCyan },
        { pos: [1.2, 0.02, -0.88], mat: navWarm },
        { pos: [-1.2, 0.02, -0.88], mat: navWarm },
      ];
      navLights.forEach(({ pos, mat }) => {
        const light = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), mat);
        light.position.set(...(pos as [number, number, number]));
        drone.add(light);
      });

      // scan cone and ray lines
      const beamMat = new THREE.MeshBasicMaterial({ color: 0x4cd7f6, transparent: true, opacity: 0.065, side: THREE.DoubleSide, depthWrite: false });
      const beam = new THREE.Mesh(new THREE.ConeGeometry(0.95, 6.8, 32, 1, true), beamMat);
      beam.rotation.x = Math.PI;
      beam.position.y = -3.2;
      drone.add(beam);
      const rayMat = new THREE.LineBasicMaterial({ color: 0x8ef1ff, transparent: true, opacity: 0.24 });
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2;
        const pts = [new THREE.Vector3(0, -0.45, 0), new THREE.Vector3(Math.cos(a) * 4.5, -6.2, Math.sin(a) * 4.5)];
        const geom = new THREE.BufferGeometry().setFromPoints(pts);
        drone.add(new THREE.Line(geom, rayMat));
      }

      // ---------- Reconstruction particles ----------
      const PARTICLES = 1100;
      const particleGeo = new THREE.BufferGeometry();
      const particlePos = new Float32Array(PARTICLES * 3);
      const particleCol = new Float32Array(PARTICLES * 3);
      const particleMeta = new Float32Array(PARTICLES * 2);
      const cyan = new THREE.Color(0x4cd7f6);
      const amber = new THREE.Color(0xffb95f);
      const green = new THREE.Color(0x7cf7a8);
      for (let i = 0; i < PARTICLES; i++) {
        const idx = i * 3;
        particlePos[idx] = 0;
        particlePos[idx + 1] = -8;
        particlePos[idx + 2] = 0;
        const c = i % 5 === 0 ? amber : i % 7 === 0 ? green : cyan;
        particleCol[idx] = c.r;
        particleCol[idx + 1] = c.g;
        particleCol[idx + 2] = c.b;
        particleMeta[i * 2] = Math.random();
        particleMeta[i * 2 + 1] = 0.65 + Math.random() * 0.8;
      }
      particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
      particleGeo.setAttribute('color', new THREE.BufferAttribute(particleCol, 3));
      const particleMat = new THREE.PointsMaterial({ size: 0.055, vertexColors: true, transparent: true, opacity: 0.88, blending: THREE.AdditiveBlending, depthWrite: false });
      const pointCloud = new THREE.Points(particleGeo, particleMat);
      scene.add(pointCloud);

      // small airborne particles for depth / atmosphere
      const airGeo = new THREE.BufferGeometry();
      const airPos = new Float32Array(500 * 3);
      for (let i = 0; i < 500; i++) {
        airPos[i * 3] = (Math.random() - 0.5) * 50;
        airPos[i * 3 + 1] = 2 + Math.random() * 16;
        airPos[i * 3 + 2] = (Math.random() - 0.5) * 42;
      }
      airGeo.setAttribute('position', new THREE.BufferAttribute(airPos, 3));
      const air = new THREE.Points(airGeo, new THREE.PointsMaterial({ color: 0x5e7e8d, size: 0.035, transparent: true, opacity: 0.25, depthWrite: false }));
      scene.add(air);

      // city data strips / confidence footprint
      const confidence = new THREE.Mesh(
        new THREE.RingGeometry(0.85, 1.0, 36),
        new THREE.MeshBasicMaterial({ color: 0x4cd7f6, transparent: true, opacity: 0.7, side: THREE.DoubleSide })
      );
      confidence.rotation.x = -Math.PI / 2;
      confidence.position.y = 0.09;
      scene.add(confidence);

      const scanCircle = new THREE.Mesh(
        new THREE.CircleGeometry(1.55, 32),
        new THREE.MeshBasicMaterial({ color: 0x4cd7f6, transparent: true, opacity: 0.035, side: THREE.DoubleSide, depthWrite: false })
      );
      scanCircle.rotation.x = -Math.PI / 2;
      scanCircle.position.y = 0.085;
      scene.add(scanCircle);

      // ---------- Flight / reveal ----------
      const SCAN = 22;
      const HOLD = 4;
      const RESET = 2.2;
      const CYCLE = SCAN + HOLD + RESET;
      const clockStart = performance.now();
      let raf = 0;
      let prevX = 0;
      let prevZ = 0;
      let revealed = 0;

      const smoothstep = (a: number, b: number, x: number) => {
        const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
        return t * t * (3 - 2 * t);
      };
      const pathAt = (t: number) => routeCurve.getPointAt(Math.min(0.9999, Math.max(0, t)));

      // Smoothly interpolate angles while correctly handling the -PI/PI wrap.
      const dampAngle = (current: number, target: number, smoothing: number) => {
        let delta = target - current;
        while (delta > Math.PI) delta -= Math.PI * 2;
        while (delta < -Math.PI) delta += Math.PI * 2;
        return current + delta * smoothing;
      };

      function animate(now: number) {
        raf = requestAnimationFrame(animate);
        const elapsed = (now - clockStart) / 1000;
        const cycle = elapsed % CYCLE;
        const scanT = Math.min(1, cycle / SCAN);
        let phase: 'scan' | 'hold' | 'reset' = 'scan';
        let t = scanT;
        if (cycle > SCAN && cycle <= SCAN + HOLD) {
          phase = 'hold';
          t = 1;
        } else if (cycle > SCAN + HOLD) {
          phase = 'reset';
          const rt = (cycle - SCAN - HOLD) / RESET;
          const s = smoothstep(0, 1, rt);
          t = 1 - s;
        }

        const p = pathAt(t);
        const bob = Math.sin(elapsed * 2.3) * 0.12 + Math.sin(elapsed * 0.71) * 0.08;
        const px = p.x;
        const pz = p.z;
        const py = p.y + bob + (phase === 'reset' ? Math.sin((1 - t) * Math.PI) * 4 : 0);
        drone.position.set(px, py, pz);

        const lookAhead = pathAt(Math.min(0.9999, t + 0.012));
        const dx = lookAhead.x - px;
        const dz = lookAhead.z - pz;
        const heading = Math.atan2(dx, dz);
        drone.rotation.y = dampAngle(drone.rotation.y, heading, 0.12);
        const targetRoll = Math.max(-0.20, Math.min(0.20, -dx * 0.23));
        const targetPitch = Math.max(-0.09, Math.min(0.09, dz * 0.09));
        drone.rotation.z += (targetRoll - drone.rotation.z) * 0.14;
        drone.rotation.x += (targetPitch - drone.rotation.x) * 0.11;
        prevX = px;
        prevZ = pz;
        void prevX; void prevZ;

        rotors.forEach((r, i) => { r.rotation.y += (i % 2 === 0 ? 0.95 : -0.92); });
        beamMat.opacity = phase === 'scan' ? 0.045 + Math.abs(Math.sin(elapsed * 3.2)) * 0.035 : 0.022;
        confidence.position.set(px, 0.09, pz);
        confidence.scale.setScalar(0.9 + Math.abs(Math.sin(elapsed * 2.4)) * 0.22);
        confidence.material.opacity = phase === 'hold' ? 0.92 : 0.48;
        scanCircle.position.set(px, 0.085, pz);
        scanCircle.scale.setScalar(1.0 + Math.abs(Math.sin(elapsed * 1.8)) * 0.35);

        // Progressive building reconstruction: scanned blocks grow from sparse wireframe to regularized solids.
        revealed = 0;
        buildings.forEach((b, i) => {
          const threshold = (i / buildings.length) * 0.93;
          const v = phase === 'reset' ? smoothstep(threshold - 0.06, threshold + 0.04, t) : smoothstep(threshold - 0.04, threshold + 0.04, t);
          const build = smoothstep(threshold - 0.03, threshold + 0.06, t);
          const reveal = smoothstep(threshold + 0.02, threshold + 0.11, t);
          const y = 0.04 + build * 0.96;
          b.root.scale.y = y;
          b.outline.scale.y = y;
          b.ghost.scale.y = 0.04 + build * 0.96;
          b.root.material.opacity = 0.07 + reveal * 0.78;
          b.outline.material.opacity = 0.10 + (1 - reveal) * 0.40;
          b.ghost.material.opacity = Math.max(0, 0.48 * (1 - reveal));
          b.roof.material.opacity = 0.04 + reveal * 0.52;
          b.windows.forEach((w: any) => { w.visible = reveal > 0.48; w.material.opacity = 0.10 + reveal * 0.82; });
          if (reveal > 0.56) revealed++;
        });
        trees.forEach((tree, i) => {
          const v = smoothstep(0.42 + (i % 12) * 0.015, 0.65 + (i % 12) * 0.015, t);
          tree.material.opacity = 0.08 + v * 0.24;
          tree.scale.setScalar(0.65 + v * 0.35);
        });

        // Particle field is a live preview of geometry coming off the reconstruction engine.
        const parr = particleGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < PARTICLES; i++) {
          const meta = particleMeta[i * 2];
          const speed = particleMeta[i * 2 + 1];
          const localT = (t + meta * 0.35) % 1;
          const pp = pathAt(localT);
          const spread = 1.8 + (i % 7) * 0.23;
          const angle = i * 2.399963 + elapsed * 0.25;
          const lifted = Math.max(0, (t - localT) * 12);
          const idx = i * 3;
          parr[idx] = pp.x + Math.cos(angle) * spread;
          parr[idx + 1] = 0.4 + ((i * 17) % 31) * 0.12 + Math.min(4, lifted * speed);
          parr[idx + 2] = pp.z + Math.sin(angle) * spread;
        }
        particleGeo.attributes.position.needsUpdate = true;
        particleMat.opacity = phase === 'hold' ? 0.65 : 0.9;

        // Cinematic camera follows the drone with a slow lateral orbit, keeping the hero text clean on the left.
        const camTarget = new THREE.Vector3(px * 0.35, 2.8, pz * 0.35);
        const camBase = new THREE.Vector3(16.5 + Math.sin(elapsed * 0.1) * 2.2, 13.5 + Math.sin(elapsed * 0.21) * 0.6, 20.5 + Math.cos(elapsed * 0.09) * 1.9);
        if (phase === 'scan') {
          camBase.x += px * 0.12;
          camBase.z += pz * 0.08;
        }
        const droneCamBias = phase === 'scan' ? 0.8 : 0.35;
        camTarget.x += (lookAhead.x - px) * droneCamBias;
        camTarget.z += (lookAhead.z - pz) * droneCamBias;
        camera.position.lerp(camBase, 0.032);
        camera.lookAt(camTarget);

        air.rotation.y += 0.00025;
        renderer.render(scene, camera);

        if (hudPhaseRef.current) hudPhaseRef.current.textContent = phase === 'scan' ? 'LIVE RECONSTRUCTION' : phase === 'hold' ? 'MODEL / REVIEW' : 'RESETTING FLIGHT';
        if (hudProgressRef.current) hudProgressRef.current.textContent = `${Math.round(t * 100)}%`;
        if (hudPoseRef.current) hudPoseRef.current.textContent = `${px.toFixed(1)} / ${py.toFixed(1)} / ${pz.toFixed(1)}`;
        if (hudModelsRef.current) hudModelsRef.current.textContent = `${revealed} / ${buildings.length}`;
        if (hudConfidenceRef.current) hudConfidenceRef.current.textContent = phase === 'hold' ? 'HIGH' : t > 0.65 ? 'MEDIUM+' : 'BUILDING';
        if (hudDotRef.current) hudDotRef.current.style.backgroundColor = phase === 'hold' ? '#7cf7a8' : '#4cd7f6';
      }
      raf = requestAnimationFrame(animate);

      const onResize = () => {
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', onResize);

      cleanupFn = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', onResize);
        renderer.dispose();
        if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      };
    };

    script.onerror = () => {
      console.error('HeroScene: failed to load Three.js from CDN.');
    };

    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
      if (cleanupFn) cleanupFn();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full z-0" style={{ display: 'block' }}>
      <div
        className="hidden sm:flex absolute bottom-24 right-6 md:right-10 z-10 flex-col gap-1.5 p-3 bg-[#07101d]/65 backdrop-blur-md border border-[#3d494c]/30 rounded-lg min-w-[245px] pointer-events-none"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        <div className="flex items-center gap-2 pb-1.5 mb-0.5 border-b border-[#3d494c]/30">
          <span ref={hudDotRef} className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] animate-soft-pulse" />
          <span ref={hudPhaseRef} className="text-[10px] text-[#dae2fd] uppercase tracking-widest">LIVE RECONSTRUCTION</span>
        </div>
        <div className="flex items-center justify-between"><span className="text-[10px] text-[#869397] uppercase">Flight coverage</span><span ref={hudProgressRef} className="text-[11px] text-[#4cd7f6]">0%</span></div>
        <div className="flex items-center justify-between"><span className="text-[10px] text-[#869397] uppercase">Pose / ENU</span><span ref={hudPoseRef} className="text-[11px] text-[#dae2fd]">0.0 / 0.0 / 0.0</span></div>
        <div className="flex items-center justify-between"><span className="text-[10px] text-[#869397] uppercase">Models reconstructed</span><span ref={hudModelsRef} className="text-[11px] text-[#ffb95f]">0 / 0</span></div>
        <div className="flex items-center justify-between"><span className="text-[10px] text-[#869397] uppercase">Geometry confidence</span><span ref={hudConfidenceRef} className="text-[11px] text-[#7cf7a8]">BUILDING</span></div>
      </div>
    </div>
  );
}
