import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Instance, Instances } from "@react-three/drei";
import * as THREE from "three";

export const ROADS_X = [-12, 0, 12];
export const ROADS_Z = [-11, 0.5, 11];
const SIZE = 44;

/** Seeded random so the tree layout is identical on every visit. */
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

export function Grounds({
  dark,
  blocked,
  lite,
}: {
  dark: boolean;
  blocked: [number, number, number][];
  lite: boolean;
}) {
  const trees = useMemo(() => {
    const r = rng(7);
    const out: [number, number, number][] = [];
    let tries = 0;
    while (out.length < (lite ? 45 : 90) && tries++ < 3000) {
      const x = (r() - 0.5) * (SIZE - 4);
      const z = (r() - 0.5) * (SIZE - 6);
      const nearRoad =
        ROADS_X.some((rx) => Math.abs(x - rx) < 1.6) || ROADS_Z.some((rz) => Math.abs(z - rz) < 1.6);
      const nearBlock = blocked.some(([bx, bz, br]) => Math.hypot(x - bx, z - bz) < br);
      if (!nearRoad && !nearBlock) out.push([x, z, 0.7 + r() * 0.6]);
    }
    return out;
  }, [blocked, lite]);
  const ground = dark ? "#0a1a38" : "#eef2f9";
  const road = dark ? "#122a55" : "#dde5f2";
  const line = dark ? "#3e86ff" : "#ffffff";
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[SIZE, SIZE]} />
        <meshStandardMaterial color={ground} roughness={1} />
      </mesh>
      {ROADS_X.map((x) => (
        <group key={`x${x}`}>
          <mesh position={[x, -0.07, 0]} receiveShadow>
            <boxGeometry args={[2, 0.04, SIZE]} />
            <meshStandardMaterial color={road} />
          </mesh>
          {Array.from({ length: 18 }, (_, i) => (
            <mesh key={i} position={[x, -0.045, -SIZE / 2 + 1.2 + i * 2.4]}>
              <boxGeometry args={[0.08, 0.01, 1]} />
              <meshBasicMaterial color={line} transparent opacity={dark ? 0.5 : 0.9} />
            </mesh>
          ))}
        </group>
      ))}
      {ROADS_Z.map((z) => (
        <mesh key={`z${z}`} position={[0, -0.069, z]} receiveShadow>
          <boxGeometry args={[SIZE, 0.04, 2]} />
          <meshStandardMaterial color={road} />
        </mesh>
      ))}
      <Instances limit={trees.length}>
        <cylinderGeometry args={[0.07, 0.09, 0.5, 6]} />
        <meshStandardMaterial color="#8a5a3b" />
        {trees.map(([x, z, s], i) => (
          <Instance key={i} position={[x, 0.15, z]} scale={s} />
        ))}
      </Instances>
      <Instances limit={trees.length} castShadow>
        <sphereGeometry args={[0.38, 10, 8]} />
        <meshStandardMaterial color={dark ? "#2fbf71" : "#6cd47e"} roughness={0.8} />
        {trees.map(([x, z, s], i) => (
          <Instance key={i} position={[x, 0.55 * s + 0.25, z]} scale={s} />
        ))}
      </Instances>
      <Shuttles dark={dark} />
    </group>
  );
}

function Shuttles({ dark }: { dark: boolean }) {
  const refs = useRef<(THREE.Group | null)[]>([]);
  const routes = useMemo(
    () => [
      { axis: "z" as const, at: 12.5, speed: 2.2, offset: 0, color: "#2e62ed" },
      { axis: "z" as const, at: -0.5, speed: -1.8, offset: 9, color: "#ffffff" },
      { axis: "x" as const, at: 1, speed: 2, offset: 4, color: "#ffb020" },
      { axis: "x" as const, at: -11.5, speed: -2.4, offset: 14, color: "#2e62ed" },
    ],
    [],
  );
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    routes.forEach((r, i) => {
      const g = refs.current[i];
      if (!g) return;
      const span = SIZE - 2;
      const p = ((((t * r.speed + r.offset) % span) + span) % span) - span / 2;
      if (r.axis === "z") {
        g.position.set(r.at - 0.5, 0.12, p);
        g.rotation.y = r.speed > 0 ? 0 : Math.PI;
      } else {
        g.position.set(p, 0.12, r.at);
        g.rotation.y = r.speed > 0 ? Math.PI / 2 : -Math.PI / 2;
      }
    });
  });
  return (
    <>
      {routes.map((r, i) => (
        <group key={i} ref={(el) => { refs.current[i] = el; }}>
          <mesh castShadow>
            <boxGeometry args={[0.45, 0.32, 1]} />
            <meshStandardMaterial color={r.color} />
          </mesh>
          <mesh position={[0, 0.04, 0.42]}>
            <boxGeometry args={[0.42, 0.18, 0.16]} />
            <meshStandardMaterial color="#9fd3ff" emissive="#5cb8ff" emissiveIntensity={dark ? 0.8 : 0.2} />
          </mesh>
        </group>
      ))}
    </>
  );
}
