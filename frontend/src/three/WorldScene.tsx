import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { Studio } from "./HeroScene";
import { LogoMark } from "./brand";
import { worldBySlug } from "./worlds";
import { isNarrow, prefersReduced } from "./LazyCanvas";

const damp = THREE.MathUtils.damp;

/** -1 entering from below … +1 leaving at the top, for any element. */
export function sectionProgress(el: HTMLElement | null) {
  if (!el) return 0;
  const r = el.getBoundingClientRect();
  return THREE.MathUtils.clamp(
    (innerHeight / 2 - (r.top + r.height / 2)) / (innerHeight / 2 + r.height / 2),
    -1,
    1,
  );
}

function usePointer() {
  const p = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const move = (e: PointerEvent) => {
      p.current.x = (e.clientX / innerWidth) * 2 - 1;
      p.current.y = (e.clientY / innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);
  return p;
}

function Rig({
  slug,
  host,
  offsetX,
}: {
  slug: string;
  host: RefObject<HTMLElement | null>;
  offsetX: number;
}) {
  const g = useRef<THREE.Group>(null);
  const pointer = usePointer();
  const reduced = prefersReduced();
  const World = worldBySlug[slug];
  useFrame((_, dt) => {
    if (!g.current) return;
    const p = sectionProgress(host.current);
    const px = reduced ? 0 : pointer.current.x;
    const py = reduced ? 0 : pointer.current.y;
    g.current.rotation.y = damp(g.current.rotation.y, px * 0.35 + p * 0.9, 3, dt);
    g.current.rotation.x = damp(g.current.rotation.x, py * 0.15 + 0.1, 3, dt);
    g.current.position.y = damp(g.current.position.y, p * 0.8, 3, dt);
  });
  return (
    <group position={[offsetX, 0, 0]}>
      <group ref={g}>
        <World />
      </group>
    </group>
  );
}

/** A large course world, e.g. the hero of a course page. */
export default function WorldScene({
  slug,
  host,
}: {
  slug: string;
  host: RefObject<HTMLElement | null>;
}) {
  const lite = isNarrow();
  return (
    <Canvas
      dpr={lite ? [1, 1.5] : [1, 2]}
      camera={{ fov: 36, position: [0, 0.3, 7] }}
      gl={{ alpha: true, antialias: true }}
      frameloop={prefersReduced() ? "demand" : "always"}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
      }}
    >
      <Studio lite={lite} />
      <Rig slug={slug} host={host} offsetX={lite ? 0 : 2.3} />
      <Sparkles count={lite ? 40 : 110} scale={[14, 7, 5]} size={2.2} speed={0.3} opacity={0.6} color="#7cc8ff" />
      <Sparkles count={lite ? 12 : 35} scale={[12, 6, 4]} size={3} speed={0.25} opacity={0.6} color="#ffc247" />
    </Canvas>
  );
}

/** Final CTA: the logo re-assembles with gold particles when scrolled into view. */
function FinalRig({ host }: { host: RefObject<HTMLElement | null> }) {
  const g = useRef<THREE.Group>(null);
  const intro = useRef(prefersReduced() ? 99 : 0);
  const pointer = usePointer();
  useFrame((_, dt) => {
    intro.current += dt;
    if (!g.current) return;
    const p = sectionProgress(host.current);
    g.current.rotation.y = damp(g.current.rotation.y, -0.5 + pointer.current.x * 0.3 + p * 0.6, 3, dt);
  });
  return (
    <group ref={g} scale={0.9}>
      <Float speed={1.3} floatIntensity={0.5} rotationIntensity={0.2}>
        <LogoMark lite={isNarrow()} intro={intro} />
      </Float>
    </group>
  );
}
export function FinalScene({ host }: { host: RefObject<HTMLElement | null> }) {
  const lite = isNarrow();
  return (
    <Canvas
      dpr={lite ? [1, 1.5] : [1, 2]}
      camera={{ fov: 36, position: [0, 0, 6] }}
      gl={{ alpha: true, antialias: true }}
      frameloop={prefersReduced() ? "demand" : "always"}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
      }}
    >
      <Studio lite={lite} />
      <FinalRig host={host} />
      <Sparkles count={lite ? 40 : 120} scale={[7, 5, 4]} size={3.5} speed={0.5} opacity={0.85} color="#ffc247" />
      <Sparkles count={lite ? 25 : 70} scale={[9, 6, 5]} size={2.2} speed={0.3} opacity={0.6} color="#7cc8ff" />
    </Canvas>
  );
}
