import { useEffect, useMemo, useRef } from "react";
import type { RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, RoundedBox, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { Studio } from "./HeroScene";
import { sectionProgress } from "./WorldScene";
import { isNarrow, prefersReduced } from "./LazyCanvas";

export type Variant =
  | "about"
  | "career"
  | "mentor"
  | "journey"
  | "projects"
  | "difference"
  | "faq"
  | "legal"
  | "footer"
  | "manifesto";

type Kind = "torus" | "ico" | "box" | "capsule" | "sphere" | "cone" | "knot" | "ring";
type Shape = { kind: Kind; color: string; pos: [number, number, number]; scale: number; glass?: boolean };

const blue = "#2f7bff";
const cyan = "#3fd0ff";
const gold = "#ffb627";
const cloud = "#8fc6ff";

/** Shapes sit toward the edges so the text in the middle stays readable. */
const presets: Record<Variant, Shape[]> = {
  about: [
    { kind: "knot", color: blue, pos: [4.8, 0.4, -1], scale: 0.75, glass: true },
    { kind: "sphere", color: gold, pos: [2.8, 1.8, -2], scale: 0.3 },
    { kind: "ring", color: cyan, pos: [6.2, -1.4, -2], scale: 0.6 },
  ],
  career: [
    { kind: "cone", color: gold, pos: [4.6, 0.6, -1], scale: 0.7 },
    { kind: "torus", color: blue, pos: [6.2, -1, -1.5], scale: 0.6, glass: true },
    { kind: "box", color: cyan, pos: [3, -1.4, -2], scale: 0.4 },
  ],
  mentor: [
    { kind: "sphere", color: blue, pos: [4.6, 0.4, -0.5], scale: 0.85, glass: true },
    { kind: "cone", color: blue, pos: [4, -0.5, -0.5], scale: 0.35, glass: true },
    { kind: "sphere", color: gold, pos: [6.2, 1.1, -1], scale: 0.45 },
    { kind: "torus", color: cyan, pos: [3, 1.5, -1.5], scale: 0.35 },
  ],
  journey: [
    { kind: "cone", color: gold, pos: [5, 1.4, -1.5], scale: 0.5 },
    { kind: "ring", color: cyan, pos: [4.6, -1.2, -1.5], scale: 0.7 },
    { kind: "ico", color: blue, pos: [6.4, 0.2, -2], scale: 0.45, glass: true },
  ],
  projects: [
    { kind: "box", color: blue, pos: [-6.2, 1.4, -1], scale: 0.7, glass: true },
    { kind: "knot", color: gold, pos: [6.2, 1.2, -1.5], scale: 0.42 },
    { kind: "capsule", color: cyan, pos: [-5.8, -1.8, -1], scale: 0.42 },
    { kind: "box", color: cloud, pos: [6, -1.7, -1], scale: 0.42 },
  ],
  difference: [
    { kind: "ico", color: blue, pos: [-6.4, 1.2, -1], scale: 0.55, glass: true },
    { kind: "torus", color: gold, pos: [6.4, -1.2, -1], scale: 0.5 },
    { kind: "sphere", color: cyan, pos: [6.2, 1.8, -2], scale: 0.3 },
  ],
  faq: [
    { kind: "sphere", color: blue, pos: [5, 0.6, -1], scale: 0.7, glass: true },
    { kind: "ring", color: gold, pos: [6.4, -1.2, -1.5], scale: 0.55 },
  ],
  legal: [{ kind: "box", color: blue, pos: [5.6, 0.2, -1.5], scale: 0.6, glass: true }],
  footer: [
    { kind: "sphere", color: cloud, pos: [-6.4, 0.8, -2], scale: 0.55, glass: true },
    { kind: "sphere", color: cloud, pos: [-5.6, 0.6, -2], scale: 0.7, glass: true },
    { kind: "torus", color: gold, pos: [6.2, 0.4, -2], scale: 0.4 },
  ],
  manifesto: [
    { kind: "sphere", color: cloud, pos: [-4.6, 1.6, -3], scale: 0.9, glass: true },
    { kind: "torus", color: gold, pos: [4.8, -1.4, -2], scale: 0.7 },
    { kind: "ico", color: blue, pos: [5.2, 1.8, -4], scale: 0.6, glass: true },
    { kind: "ring", color: cyan, pos: [-5, -1.6, -2], scale: 0.9 },
  ],
};

function Geometry({ kind }: { kind: Kind }) {
  switch (kind) {
    case "torus":
      return <torusGeometry args={[1, 0.36, 24, 64]} />;
    case "ico":
      return <icosahedronGeometry args={[1, 0]} />;
    case "capsule":
      return <capsuleGeometry args={[0.55, 1.1, 8, 24]} />;
    case "sphere":
      return <sphereGeometry args={[1, 32, 24]} />;
    case "cone":
      return <coneGeometry args={[0.9, 1.6, 32]} />;
    case "knot":
      return <torusKnotGeometry args={[1, 0.3, 128, 20]} />;
    case "ring":
      return <torusGeometry args={[1, 0.08, 16, 80]} />;
    default:
      return <boxGeometry />;
  }
}

function Piece({ shape, i }: { shape: Shape; i: number }) {
  const material = shape.glass ? (
    <meshPhysicalMaterial color={shape.color} metalness={0.1} roughness={0.08} clearcoat={1} iridescence={0.35} transparent opacity={0.92} envMapIntensity={1.6} />
  ) : (
    <meshStandardMaterial color={shape.color} metalness={shape.color === gold ? 0.85 : 0.35} roughness={0.2} envMapIntensity={1.3} />
  );
  return (
    <Float speed={1 + (i % 3) * 0.4} rotationIntensity={0.8} floatIntensity={0.9}>
      <group position={shape.pos} scale={shape.scale}>
        {shape.kind === "box" ? (
          <RoundedBox args={[1.4, 1.4, 1.4]} radius={0.22} smoothness={4}>
            {material}
          </RoundedBox>
        ) : (
          <mesh>
            <Geometry kind={shape.kind} />
            {material}
          </mesh>
        )}
      </group>
    </Float>
  );
}

function Rig({ shapes, host }: { shapes: Shape[]; host: RefObject<HTMLElement | null> }) {
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const reduced = prefersReduced();
  useEffect(() => {
    const move = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);
  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    const p = sectionProgress(host.current);
    const px = reduced ? 0 : pointer.current.x;
    const py = reduced ? 0 : pointer.current.y;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, px * 0.25 + p * 0.5, 3, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, py * 0.15 - p * 0.15, 3, dt);
    g.position.y = THREE.MathUtils.damp(g.position.y, p * 1.2, 3, dt);
  });
  return (
    <group ref={group}>
      {shapes.map((s, i) => (
        <Piece key={i} shape={s} i={i} />
      ))}
    </group>
  );
}

export default function ShapesScene({
  variant,
  host,
}: {
  variant: Variant;
  host: RefObject<HTMLElement | null>;
}) {
  const narrow = isNarrow();
  const shapes = useMemo(() => {
    const list = presets[variant];
    // Phones: fewer pieces, pulled inward so they stay on screen.
    return narrow
      ? list.slice(0, 3).map((s) => ({
          ...s,
          pos: [s.pos[0] * 0.4, s.pos[1] * 1.1, s.pos[2]] as [number, number, number],
          scale: s.scale * 0.65,
        }))
      : list;
  }, [variant, narrow]);
  return (
    <Canvas
      dpr={narrow ? 1 : [1, 1.75]}
      camera={{ fov: 35, position: [0, 0, 10] }}
      gl={{ alpha: true, antialias: !narrow, powerPreference: "low-power" }}
      frameloop={prefersReduced() ? "demand" : "always"}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
      }}
    >
      <Studio lite />
      <Rig shapes={shapes} host={host} />
      {variant === "manifesto" && (
        <Sparkles count={narrow ? 60 : 200} scale={[16, 8, 8]} size={3} speed={0.35} opacity={0.8} color="#ffc247" />
      )}
    </Canvas>
  );
}
