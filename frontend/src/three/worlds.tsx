import { useMemo, useRef } from "react";
import type { ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { gold } from "./brand";

export type WorldProps = { hot?: boolean };
const damp = THREE.MathUtils.damp;

/** Shared hover behaviour: lift, spin up and brighten when `hot`. */
function HoverGroup({ hot, children, spin = 0.25 }: { hot?: boolean; children: ReactNode; spin?: number }) {
  const g = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    if (!g.current) return;
    const t = state.clock.elapsedTime;
    g.current.rotation.y += dt * (hot ? spin * 3 : spin);
    g.current.position.y = damp(g.current.position.y, hot ? 0.25 : 0, 5, dt) + Math.sin(t * 1.2) * 0.002;
    g.current.scale.setScalar(damp(g.current.scale.x, hot ? 1.12 : 1, 6, dt));
  });
  return <group ref={g}>{children}</group>;
}

function Panel({
  position,
  rotation = [0, 0, 0],
  size = [1.2, 0.8],
  color = "#ffffff",
  accent,
  lines = 3,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  size?: [number, number];
  color?: string;
  accent: string;
  lines?: number;
}) {
  const [w, h] = size;
  return (
    <group position={position} rotation={rotation}>
      <RoundedBox args={[w, h, 0.05]} radius={0.04} smoothness={3}>
        <meshPhysicalMaterial color={color} roughness={0.15} clearcoat={1} transparent opacity={0.92} />
      </RoundedBox>
      <mesh position={[-w / 2 + 0.18, h / 2 - 0.14, 0.04]}>
        <boxGeometry args={[0.18, 0.08, 0.01]} />
        <meshBasicMaterial color={accent} />
      </mesh>
      {Array.from({ length: lines }, (_, i) => (
        <mesh key={i} position={[-w / 2 + 0.12 + (w * (0.5 - i * 0.08)) / 2, h / 2 - 0.32 - i * 0.14, 0.04]}>
          <boxGeometry args={[w * (0.55 - i * 0.08), 0.045, 0.01]} />
          <meshBasicMaterial color={i === 0 ? accent : "#9aa8c0"} />
        </mesh>
      ))}
    </group>
  );
}

/** Small glowing dots that travel along a curve, like data packets. */
function Packets({ curve, color, count = 4, speed = 0.25 }: { curve: THREE.Curve<THREE.Vector3>; color: string; count?: number; speed?: number }) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  useFrame((state) => {
    refs.current.forEach((m, i) => {
      if (!m) return;
      const p = (state.clock.elapsedTime * speed + i / count) % 1;
      m.position.copy(curve.getPoint(p));
    });
  });
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <mesh key={i} ref={(m) => { refs.current[i] = m; }}>
          <sphereGeometry args={[0.045, 10, 10]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
      ))}
    </>
  );
}

function Link3D({ from, to, color, bend = 0.4 }: { from: [number, number, number]; to: [number, number, number]; color: string; bend?: number }) {
  const { curve, geo } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const mid = a.clone().lerp(b, 0.5).add(new THREE.Vector3(0, bend, 0));
    const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
    return { curve, geo: new THREE.TubeGeometry(curve, 32, 0.012, 6, false) };
  }, [from, to, bend]);
  return (
    <>
      <mesh geometry={geo}>
        <meshBasicMaterial color={color} transparent opacity={0.55} />
      </mesh>
      <Packets curve={curve} color={color} count={3} />
    </>
  );
}

const SF = "#00a1e0";
export function SalesforceWorld({ hot }: WorldProps) {
  const records: [number, number, number][] = [
    [-1.3, 0.5, 0.2],
    [1.35, 0.35, -0.1],
    [-0.9, -0.75, 0.4],
    [1.0, -0.8, 0.3],
  ];
  return (
    <HoverGroup hot={hot}>
      {/* Central cloud hub */}
      {[[-0.32, 0, 0.42], [0.08, 0.18, 0.55], [0.45, -0.02, 0.4], [0.05, -0.12, 0.45]].map(([x, y, r], i) => (
        <mesh key={i} position={[x, y, 0]}>
          <sphereGeometry args={[r, 32, 24]} />
          <meshPhysicalMaterial color={SF} roughness={0.15} clearcoat={1} emissive={SF} emissiveIntensity={hot ? 0.35 : 0.12} />
        </mesh>
      ))}
      {records.map((p, i) => (
        <group key={i}>
          <Panel position={p} rotation={[0, -p[0] * 0.35, 0]} size={[0.95, 0.6]} accent={i % 2 ? "#ffb627" : SF} />
          <Link3D from={[0, 0, 0]} to={p} color={i % 2 ? "#ffc247" : "#5cc8ff"} bend={0.2} />
        </group>
      ))}
      {/* Automation flow ring */}
      <mesh rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[1.9, 0.015, 8, 120]} />
        <meshBasicMaterial color="#5cc8ff" transparent opacity={0.6} />
      </mesh>
    </HoverGroup>
  );
}

const MERN = "#2fbf71";
export function MernWorld({ hot }: WorldProps) {
  return (
    <HoverGroup hot={hot} spin={0.2}>
      {/* Frontend: a browser window */}
      <group position={[-1.2, 0.55, 0]} rotation={[0, 0.35, 0]}>
        <Panel position={[0, 0, 0]} size={[1.4, 0.95]} accent="#61dafb" lines={4} />
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[-0.6 + i * 0.09, 0.4, 0.04]}>
            <circleGeometry args={[0.025, 12]} />
            <meshBasicMaterial color={["#ff5f57", "#febc2e", "#28c840"][i]} />
          </mesh>
        ))}
      </group>
      {/* Backend: API cube */}
      <group position={[1.2, 0.5, 0]}>
        <RoundedBox args={[0.75, 0.75, 0.75]} radius={0.12} smoothness={4}>
          <meshPhysicalMaterial color="#1f2b3d" metalness={0.5} roughness={0.25} clearcoat={1} emissive={MERN} emissiveIntensity={hot ? 0.3 : 0.08} />
        </RoundedBox>
        <mesh position={[0, 0, 0.39]}>
          <ringGeometry args={[0.14, 0.2, 6]} />
          <meshBasicMaterial color={MERN} />
        </mesh>
      </group>
      {/* Database cylinders */}
      <group position={[0.1, -0.95, 0]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0, i * 0.24, 0]}>
            <cylinderGeometry args={[0.45, 0.45, 0.2, 40]} />
            <meshPhysicalMaterial color={MERN} roughness={0.25} clearcoat={1} emissive={MERN} emissiveIntensity={hot ? 0.25 : 0.06} />
          </mesh>
        ))}
      </group>
      <Link3D from={[-0.6, 0.3, 0.1]} to={[0.85, 0.45, 0.1]} color="#61dafb" bend={0.45} />
      <Link3D from={[1.15, 0.1, 0.1]} to={[0.35, -0.5, 0.1]} color={MERN} bend={-0.2} />
    </HoverGroup>
  );
}

const UX = "#a259ff";
export function UiuxWorld({ hot }: WorldProps) {
  return (
    <HoverGroup hot={hot} spin={0.18}>
      {/* Phone */}
      <group position={[0, 0, 0.3]}>
        <RoundedBox args={[0.95, 1.85, 0.08]} radius={0.12} smoothness={4}>
          <meshPhysicalMaterial color="#141c2e" metalness={0.6} roughness={0.2} clearcoat={1} />
        </RoundedBox>
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[0.82, 1.68]} />
          <meshBasicMaterial color="#f4f1ff" />
        </mesh>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[0, 0.55 - i * 0.36, 0.05]}>
            <planeGeometry args={[0.68, i === 0 ? 0.3 : 0.22]} />
            <meshBasicMaterial color={i === 0 ? UX : i % 2 ? "#d9cffc" : "#ffd7a3"} />
          </mesh>
        ))}
      </group>
      {/* Floating interface frames and components */}
      <Panel position={[-1.3, 0.45, -0.2]} rotation={[0, 0.5, -0.06]} size={[1.0, 0.7]} accent={UX} />
      <Panel position={[1.3, -0.35, -0.1]} rotation={[0, -0.5, 0.05]} size={[0.9, 0.65]} accent="#ffb020" />
      <mesh position={[1.15, 0.8, 0]}>
        <torusGeometry args={[0.22, 0.07, 16, 40]} />
        <meshPhysicalMaterial color={UX} clearcoat={1} roughness={0.15} emissive={UX} emissiveIntensity={hot ? 0.4 : 0.1} />
      </mesh>
      <mesh position={[-1.15, -0.75, 0.2]} rotation={[0.4, 0.4, 0]}>
        <boxGeometry args={[0.35, 0.35, 0.35]} />
        <meshStandardMaterial {...gold} />
      </mesh>
    </HoverGroup>
  );
}

const PY = "#ffb020";
export function PythonWorld({ hot }: WorldProps) {
  const nodes = useMemo<[number, number, number][]>(
    () => [
      [0, 0, 0],
      [-1.2, 0.6, 0.2],
      [1.2, 0.7, -0.1],
      [-1.0, -0.8, 0.1],
      [1.1, -0.7, 0.3],
      [0, 1.1, -0.3],
    ],
    [],
  );
  return (
    <HoverGroup hot={hot} spin={0.3}>
      {nodes.map((p, i) => (
        <mesh key={i} position={p}>
          <icosahedronGeometry args={[i === 0 ? 0.42 : 0.2, i === 0 ? 1 : 0]} />
          <meshPhysicalMaterial
            color={i === 0 ? "#3776ab" : i % 2 ? PY : "#3776ab"}
            roughness={0.2}
            clearcoat={1}
            emissive={i === 0 ? "#3776ab" : PY}
            emissiveIntensity={hot ? 0.4 : 0.1}
          />
        </mesh>
      ))}
      {nodes.slice(1).map((p, i) => (
        <Link3D key={i} from={[0, 0, 0]} to={p} color={i % 2 ? "#5cc8ff" : "#ffd36b"} bend={0.15} />
      ))}
      {/* Code panels */}
      <Panel position={[-1.5, -0.05, -0.5]} rotation={[0, 0.6, 0]} size={[0.8, 0.55]} color="#16213a" accent={PY} />
      <Panel position={[1.55, 0.05, -0.5]} rotation={[0, -0.6, 0]} size={[0.8, 0.55]} color="#16213a" accent="#5cc8ff" />
    </HoverGroup>
  );
}

export const worldBySlug: Record<string, (p: WorldProps) => ReactNode> = {
  salesforce: SalesforceWorld,
  "mern-stack": MernWorld,
  "ui-ux": UiuxWorld,
  python: PythonWorld,
};
