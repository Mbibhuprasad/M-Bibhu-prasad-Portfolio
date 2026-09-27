"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

export type HeroLayout = "desktop" | "tablet" | "mobile";

type SceneProps = {
  /** 0 → 1 scroll progress through the hero (camera flies into the core) */
  progress: React.RefObject<number>;
  /** normalised pointer, -1 → 1 on both axes (y up) */
  pointer: React.RefObject<{ x: number; y: number }>;
  layout: HeroLayout;
  reduced: boolean;
};

const PARTICLES: Record<HeroLayout, number> = { desktop: 1800, tablet: 900, mobile: 300 };
const BASE_Z = 8;
const BASE_FOV = 35;

/* ───────── helpers ───────── */

function useGlowTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, "rgba(255,255,255,1)");
    grd.addColorStop(0.18, "rgba(255,255,255,0.55)");
    grd.addColorStop(0.5, "rgba(255,255,255,0.12)");
    grd.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
}

function Glow({ tex, color, scale, opacity = 1 }: { tex: THREE.Texture; color: string; scale: number; opacity?: number }) {
  return (
    <sprite scale={[scale, scale, 1]}>
      <spriteMaterial map={tex} color={color} blending={THREE.AdditiveBlending} depthWrite={false} transparent opacity={opacity} />
    </sprite>
  );
}

/** Where the core sits in world units, so it lines up with the DOM composition. */
function useCoreOffset(layout: HeroLayout): [number, number, number] {
  const { size } = useThree();
  return useMemo(() => {
    const vh = 2 * BASE_Z * Math.tan(THREE.MathUtils.degToRad(BASE_FOV / 2));
    const vw = vh * (size.width / Math.max(1, size.height));
    if (layout === "desktop") return [0.153 * vw, -0.027 * vh, 0];
    return [0, 0.08 * vh, 0];
  }, [size.width, size.height, layout]);
}

/* ───────── pieces ───────── */

function WireSphere({ radius = 1.05 }: { radius?: number }) {
  const geo = useMemo(() => {
    const pts: number[] = [];
    const seg = 72;
    // latitudes
    for (let i = 1; i < 8; i++) {
      const phi = (i / 8) * Math.PI;
      const y = radius * Math.cos(phi);
      const r = radius * Math.sin(phi);
      for (let j = 0; j < seg; j++) {
        const a0 = (j / seg) * Math.PI * 2;
        const a1 = ((j + 1) / seg) * Math.PI * 2;
        pts.push(r * Math.cos(a0), y, r * Math.sin(a0), r * Math.cos(a1), y, r * Math.sin(a1));
      }
    }
    // longitudes (great circles through the poles)
    for (let i = 0; i < 10; i++) {
      const th = (i / 10) * Math.PI;
      for (let j = 0; j < seg; j++) {
        const p0 = (j / seg) * Math.PI * 2;
        const p1 = ((j + 1) / seg) * Math.PI * 2;
        pts.push(
          radius * Math.sin(p0) * Math.cos(th), radius * Math.cos(p0), radius * Math.sin(p0) * Math.sin(th),
          radius * Math.sin(p1) * Math.cos(th), radius * Math.cos(p1), radius * Math.sin(p1) * Math.sin(th)
        );
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, [radius]);

  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color="#F2F4F8" transparent opacity={0.085} depthWrite={false} />
    </lineSegments>
  );
}

function Core({ tex, reduced }: { tex: THREE.Texture; reduced: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (reduced || !ref.current) return;
    ref.current.rotation.y += dt * 0.25;
    ref.current.rotation.x += dt * 0.09;
  });
  return (
    <>
      <Glow tex={tex} color="#3D7BFF" scale={4.2} opacity={0.32} />
      <Glow tex={tex} color="#8B5CF6" scale={2.2} opacity={0.6} />
      <group ref={ref}>
        <mesh>
          <icosahedronGeometry args={[0.46, 0]} />
          <meshStandardMaterial
            color="#121833"
            emissive="#4b2fd0"
            emissiveIntensity={0.55}
            metalness={0.45}
            roughness={0.22}
            flatShading
          />
        </mesh>
        <mesh scale={1.015}>
          <icosahedronGeometry args={[0.46, 0]} />
          <meshBasicMaterial color="#CFE0FF" wireframe transparent opacity={0.5} />
        </mesh>
        <mesh scale={1.55}>
          <icosahedronGeometry args={[0.46, 1]} />
          <meshBasicMaterial color="#3D7BFF" wireframe transparent opacity={0.07} depthWrite={false} />
        </mesh>
      </group>
      <Glow tex={tex} color="#ffffff" scale={0.35} opacity={0.9} />
    </>
  );
}

type OrbitSpec = {
  radius: number;
  tilt: number; // apparent flattening (rotation about X)
  roll: number; // 2D roll (rotation about Z)
  color: string;
  speed: number;
  dashed?: boolean;
  opacity: number;
  nodes: { offset: number; size: number; color: string }[];
};

const ORBITS: OrbitSpec[] = [
  {
    radius: 1.55, tilt: 0.27, roll: -0.31, color: "#3D7BFF", speed: 0.22, opacity: 0.75,
    nodes: [
      { offset: 0.3, size: 0.55, color: "#22D3EE" },
      { offset: 2.4, size: 0.4, color: "#3D7BFF" },
      { offset: 4.3, size: 0.28, color: "#3D7BFF" },
    ],
  },
  {
    radius: 1.36, tilt: 0.46, roll: 0.49, color: "#8B5CF6", speed: -0.16, dashed: true, opacity: 0.6,
    nodes: [
      { offset: 1.0, size: 0.5, color: "#8B5CF6" },
      { offset: 3.5, size: 0.28, color: "#B9A2FF" },
    ],
  },
  {
    radius: 1.45, tilt: 0.15, roll: 1.36, color: "#22D3EE", speed: 0.12, opacity: 0.32,
    nodes: [{ offset: 1.6, size: 0.3, color: "#22D3EE" }],
  },
];

function Orbit({ spec, tex, reduced }: { spec: OrbitSpec; tex: THREE.Texture; reduced: boolean }) {
  const points = useMemo(
    () =>
      Array.from({ length: 161 }, (_, i) => {
        const a = (i / 160) * Math.PI * 2;
        return new THREE.Vector3(spec.radius * Math.cos(a), 0, spec.radius * Math.sin(a));
      }),
    [spec.radius]
  );
  const nodeRefs = useRef<(THREE.Group | null)[]>([]);

  useFrame(({ clock }) => {
    const t = reduced ? 0 : clock.elapsedTime;
    spec.nodes.forEach((n, i) => {
      const g = nodeRefs.current[i];
      if (!g) return;
      const a = n.offset + t * spec.speed;
      g.position.set(spec.radius * Math.cos(a), 0, spec.radius * Math.sin(a));
    });
  });

  return (
    <group rotation={[0, 0, spec.roll]}>
      <group rotation={[spec.tilt, 0, 0]}>
        <Line
          points={points}
          color={spec.color}
          lineWidth={1}
          transparent
          opacity={spec.opacity}
          dashed={spec.dashed}
          dashSize={0.03}
          gapSize={0.07}
          depthWrite={false}
        />
        {spec.nodes.map((n, i) => (
          <group key={i} ref={(el) => { nodeRefs.current[i] = el; }}>
            <mesh>
              <sphereGeometry args={[0.022 * (n.size / 0.3), 12, 12]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <Glow tex={tex} color={n.color} scale={n.size} opacity={0.9} />
          </group>
        ))}
      </group>
    </group>
  );
}

function Particles({ count, pointer, tex, reduced }: { count: number; pointer: SceneProps["pointer"]; tex: THREE.Texture; reduced: boolean }) {
  const { base, pos, seeds } = useMemo(() => {
    const base = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 2 + Math.random() * 6.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      base[i * 3] = r * Math.sin(phi) * Math.cos(theta) * 1.5;
      base[i * 3 + 1] = r * Math.cos(phi) * 0.75;
      base[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta) - 2.5;
      seeds[i] = Math.random() * Math.PI * 2;
    }
    return { base, pos: base.slice(), seeds };
  }, [count]);

  const geoRef = useRef<THREE.BufferGeometry>(null);
  const { viewport } = useThree();

  useFrame(({ clock }) => {
    if (reduced || !geoRef.current) return;
    const t = clock.elapsedTime;
    const px = (pointer.current?.x ?? 0) * (viewport.width / 2);
    const py = (pointer.current?.y ?? 0) * (viewport.height / 2);
    const R = 0.9;
    for (let i = 0; i < count; i++) {
      const s = seeds[i];
      const i3 = i * 3;
      let tx = base[i3] + Math.sin(t * 0.18 + s) * 0.12;
      let ty = base[i3 + 1] + Math.cos(t * 0.15 + s * 1.3) * 0.1;
      const tz = base[i3 + 2];
      const dx = tx - px;
      const dy = ty - py;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < R && d > 0.0001) {
        const push = (1 - d / R) * 0.55;
        tx += (dx / d) * push;
        ty += (dy / d) * push;
      }
      pos[i3] += (tx - pos[i3]) * 0.08;
      pos[i3 + 1] += (ty - pos[i3 + 1]) * 0.08;
      pos[i3 + 2] = tz;
    }
    (geoRef.current.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        sizeAttenuation
        map={tex}
        color="#CFE0FF"
        transparent
        opacity={0.75}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function World({ progress, pointer, layout, reduced }: SceneProps) {
  const tex = useGlowTexture();
  const offset = useCoreOffset(layout);
  const world = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const scale = layout === "desktop" ? 1 : layout === "tablet" ? 0.85 : 0.68;

  useFrame((_, dt) => {
    // idle rotation
    if (spin.current && !reduced) spin.current.rotation.y += dt * 0.08;

    // pointer tilt (±0.14 rad, lerp 0.06)
    if (world.current) {
      const px = reduced ? 0 : pointer.current?.x ?? 0;
      const py = reduced ? 0 : pointer.current?.y ?? 0;
      world.current.rotation.x += (-py * 0.14 - world.current.rotation.x) * 0.06;
      world.current.rotation.y += (px * 0.14 - world.current.rotation.y) * 0.06;
    }

    // scroll → camera flies into the core
    const p = Math.min(1, Math.max(0, progress.current ?? 0));
    const e = p * p * (3 - 2 * p);
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.set(offset[0] * e, offset[1] * e, BASE_Z - 5.5 * e);
    cam.fov = BASE_FOV + 20 * e;
    cam.lookAt(offset[0] * e, offset[1] * e, 0);
    cam.updateProjectionMatrix();
  });

  return (
    <>
      <ambientLight intensity={0.25} />
      <pointLight position={[offset[0] + 2, offset[1] + 2, 3]} color="#3D7BFF" intensity={22} />
      <pointLight position={[offset[0] - 2, offset[1] - 1.2, 2]} color="#8B5CF6" intensity={16} />
      <pointLight position={[offset[0], offset[1], 1.2]} color="#22D3EE" intensity={3} />

      <Particles count={PARTICLES[layout]} pointer={pointer} tex={tex} reduced={reduced} />

      <group position={offset} scale={scale}>
        <group ref={world}>
          <group ref={spin} rotation={[0, 0, -0.24]}>
            <WireSphere />
          </group>
          <Core tex={tex} reduced={reduced} />
          {ORBITS.map((o, i) => (
            <Orbit key={i} spec={o} tex={tex} reduced={reduced} />
          ))}
        </group>
      </group>
    </>
  );
}

export default function HeroScene(props: SceneProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const maxDpr = props.layout === "mobile" ? 1.5 : 1.75;
  const frameloop = props.reduced ? "demand" : visible ? "always" : "never";

  return (
    <div ref={wrap} className="absolute inset-0" aria-hidden="true">
      <Canvas
        frameloop={frameloop}
        dpr={[1, maxDpr]}
        camera={{ position: [0, 0, BASE_Z], fov: BASE_FOV, near: 0.1, far: 60 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <World {...props} />
      </Canvas>
    </div>
  );
}
