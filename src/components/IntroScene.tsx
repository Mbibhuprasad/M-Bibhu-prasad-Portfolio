"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import type { Theme } from "@/lib/theme";
import type { HeroLayout } from "@/components/hero/HeroScene";

type SceneProps = {
  /** 0 → 1 scroll progress through the introduction */
  progress: React.RefObject<number>;
  layout: HeroLayout;
  reduced: boolean;
  theme: Theme;
};

/* same colour logic as the hero scene: additive glows on dark, normal blending on light */
const PALETTE = {
  dark: { line: "#CFE0FF", lineOpacity: 0.55, fill: 0.05, glowBlend: THREE.AdditiveBlending, glowScale: 1 },
  light: { line: "#3D7BFF", lineOpacity: 0.7, fill: 0.06, glowBlend: THREE.NormalBlending, glowScale: 0.6 },
} as const;
type Palette = (typeof PALETTE)[Theme];

/** stacked system layers — interface / API / data */
const LAYERS = [
  { y: 1, size: 2.1, turn: 0, color: "#8B5CF6" },
  { y: 0, size: 1.6, turn: Math.PI / 4, color: "#22D3EE" },
  { y: -1, size: 2.1, turn: 0, color: "#3D7BFF" },
];
const PACKETS: Record<HeroLayout, number> = { desktop: 7, tablet: 4, mobile: 2 };
const CONNECTORS: [number, number][] = [
  [0.62, 0.62],
  [-0.62, 0.62],
  [0.62, -0.62],
  [-0.62, -0.62],
];
const BASE_Z = 7.6;

function useGlowTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const g = c.getContext("2d")!;
    const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, "rgba(255,255,255,1)");
    grd.addColorStop(0.2, "rgba(255,255,255,0.5)");
    grd.addColorStop(0.55, "rgba(255,255,255,0.1)");
    grd.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 64, 64);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
}

function Layer({ spec, spread, tex, pal }: { spec: (typeof LAYERS)[number]; spread: React.RefObject<number>; tex: THREE.Texture; pal: Palette }) {
  const ref = useRef<THREE.Group>(null);
  const h = spec.size / 2;
  const outline = useMemo(
    () => [new THREE.Vector3(-h, 0, -h), new THREE.Vector3(h, 0, -h), new THREE.Vector3(h, 0, h), new THREE.Vector3(-h, 0, h), new THREE.Vector3(-h, 0, -h)],
    [h]
  );
  const nodes = useMemo(() => {
    const p: number[] = [];
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) p.push(((i / 3) * 2 - 1) * h * 0.72, 0, ((j / 3) * 2 - 1) * h * 0.72);
    return new Float32Array(p);
  }, [h]);

  // layers drift apart a little as the section is scrolled (exploded view)
  useFrame(() => {
    if (ref.current) ref.current.position.y = spec.y * (spread.current ?? 1);
  });

  return (
    <group ref={ref} rotation={[0, spec.turn, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[spec.size, spec.size]} />
        <meshBasicMaterial color={spec.color} transparent opacity={pal.fill} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <Line points={outline} color={pal.line} lineWidth={1} transparent opacity={pal.lineOpacity} depthWrite={false} />
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodes, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.12} map={tex} color={spec.color} transparent depthWrite={false} blending={pal.glowBlend} opacity={0.9 * pal.glowScale + 0.1} />
      </points>
    </group>
  );
}

function Connectors({ spread, pal }: { spread: React.RefObject<number>; pal: Palette }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (ref.current) ref.current.scale.y = spread.current ?? 1;
  });
  return (
    <group ref={ref}>
      {CONNECTORS.map(([x, z]) => (
        <Line
          key={`${x}${z}`}
          points={[new THREE.Vector3(x, -1, z), new THREE.Vector3(x, 1, z)]}
          color={pal.line}
          lineWidth={1}
          transparent
          opacity={pal.lineOpacity * 0.45}
          dashed
          dashSize={0.05}
          gapSize={0.07}
          depthWrite={false}
        />
      ))}
      <Line points={[new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, 1, 0)]} color="#3D7BFF" lineWidth={1} transparent opacity={0.5} depthWrite={false} />
    </group>
  );
}

/** small glowing packets travelling between layers along the connectors */
function Packets({ count, spread, tex, reduced, pal }: { count: number; spread: React.RefObject<number>; tex: THREE.Texture; reduced: boolean; pal: Palette }) {
  const refs = useRef<(THREE.Sprite | null)[]>([]);
  const specs = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        at: i % 2 === 0 ? CONNECTORS[i % 4] : ([0, 0] as [number, number]),
        phase: i / count,
        speed: 0.12 + (i % 3) * 0.035,
        up: i % 2 === 0,
        color: i === 1 ? "#FF7A1A" : i % 3 === 0 ? "#22D3EE" : "#CFE0FF",
      })),
    [count]
  );
  useFrame(({ clock }) => {
    const t = reduced ? 0 : clock.elapsedTime;
    const s = spread.current ?? 1;
    specs.forEach((p, i) => {
      const sp = refs.current[i];
      if (!sp) return;
      const f = (p.phase + t * p.speed) % 1;
      sp.position.set(p.at[0], (p.up ? f * 2 - 1 : 1 - f * 2) * s, p.at[1]);
      (sp.material as THREE.SpriteMaterial).opacity = Math.sin(f * Math.PI) * pal.glowScale;
    });
  });
  return (
    <>
      {specs.map((p, i) => (
        <sprite key={i} ref={(el) => { refs.current[i] = el; }} scale={[0.22, 0.22, 1]}>
          <spriteMaterial map={tex} color={p.color} blending={pal.glowBlend} transparent depthWrite={false} />
        </sprite>
      ))}
    </>
  );
}

function Core({ tex, reduced, pal, light }: { tex: THREE.Texture; reduced: boolean; pal: Palette; light: React.RefObject<number> }) {
  const ref = useRef<THREE.Group>(null);
  const glow = useRef<THREE.SpriteMaterial>(null);
  useFrame((_, dt) => {
    if (ref.current && !reduced) {
      ref.current.rotation.y += dt * 0.3;
      ref.current.rotation.x += dt * 0.12;
    }
    if (glow.current) glow.current.opacity = (0.45 + 0.3 * (light.current ?? 0)) * pal.glowScale;
  });
  return (
    <>
      <sprite scale={[1.9, 1.9, 1]}>
        <spriteMaterial ref={glow} map={tex} color="#3D7BFF" blending={pal.glowBlend} transparent depthWrite={false} />
      </sprite>
      <group ref={ref}>
        <mesh>
          <octahedronGeometry args={[0.3, 0]} />
          <meshStandardMaterial color="#121833" emissive="#4b2fd0" emissiveIntensity={0.6} metalness={0.45} roughness={0.25} flatShading />
        </mesh>
        <mesh scale={1.02}>
          <octahedronGeometry args={[0.3, 0]} />
          <meshBasicMaterial color="#CFE0FF" wireframe transparent opacity={0.55} />
        </mesh>
        <mesh scale={1.7}>
          <icosahedronGeometry args={[0.3, 1]} />
          <meshBasicMaterial color="#3D7BFF" wireframe transparent opacity={0.12} depthWrite={false} />
        </mesh>
      </group>
    </>
  );
}

function World({ progress, layout, reduced, theme }: SceneProps) {
  const tex = useGlowTexture();
  const pal = PALETTE[theme];
  const { camera } = useThree();
  const rig = useRef<THREE.Group>(null);
  const keyLight = useRef<THREE.PointLight>(null);
  const p = useRef(0);
  const spread = useRef(1);
  const idle = useRef(0);
  const scale = layout === "desktop" ? 1 : layout === "tablet" ? 0.9 : 0.8;

  useFrame((_, dt) => {
    // eased scroll progress — cinematic, never snappy
    const target = Math.min(1, Math.max(0, progress.current ?? 0));
    p.current += (target - p.current) * Math.min(1, dt * 4);
    const e = reduced ? 0.5 : p.current;
    if (!reduced) idle.current += dt * 0.06;

    spread.current = 0.92 + e * 0.22;
    if (rig.current) {
      rig.current.rotation.y = Math.PI / 4 + idle.current + (e - 0.5) * 0.8;
      rig.current.rotation.x = 0.5 - (e - 0.5) * 0.16;
      rig.current.position.y = (0.5 - e) * 0.3;
    }
    if (keyLight.current) keyLight.current.intensity = 10 + e * 10;

    const cam = camera as THREE.PerspectiveCamera;
    cam.position.set(0, 0.2 - e * 0.2, BASE_Z - e * 1.3);
    cam.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight ref={keyLight} position={[2, 2.5, 3]} color="#3D7BFF" intensity={14} />
      <pointLight position={[-2, -1.5, 2]} color="#8B5CF6" intensity={10} />
      <group scale={scale}>
        <group ref={rig}>
          {LAYERS.map((l) => (
            <Layer key={l.y} spec={l} spread={spread} tex={tex} pal={pal} />
          ))}
          <Connectors spread={spread} pal={pal} />
          <Core tex={tex} reduced={reduced} pal={pal} light={p} />
          {PACKETS[layout] > 0 && <Packets count={PACKETS[layout]} spread={spread} tex={tex} reduced={reduced} pal={pal} />}
        </group>
      </group>
    </>
  );
}

/** Right-side visual for the introduction: an abstract full-stack "system core". */
export default function IntroScene(props: SceneProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "200px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const maxDpr = props.layout === "mobile" ? 1.25 : props.layout === "tablet" ? 1.5 : 1.75;
  const frameloop = props.reduced ? "demand" : visible ? "always" : "never";

  return (
    <div ref={wrap} className="absolute inset-0" aria-hidden="true">
      <Canvas
        frameloop={frameloop}
        dpr={[1, maxDpr]}
        camera={{ position: [0, 0.2, BASE_Z], fov: 35, near: 0.1, far: 40 }}
        gl={{ alpha: true, antialias: props.layout !== "mobile", powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <World {...props} />
      </Canvas>
    </div>
  );
}
