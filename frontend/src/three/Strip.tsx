import { useRef } from "react";
import type { ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { Studio } from "./HeroScene";
import { gold } from "./brand";
import { worldBySlug } from "./worlds";
import { isNarrow, prefersReduced } from "./LazyCanvas";

const damp = THREE.MathUtils.damp;
const BLUE = "#2f7bff";
const glass = { color: BLUE, roughness: 0.12, clearcoat: 1, metalness: 0.15, iridescence: 0.3 };

/* ---------- Seven service objects ---------- */
function Cap() {
  return (
    <group rotation={[0.2, 0, 0]}>
      <mesh position={[0, 0.15, 0]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[1.3, 0.08, 1.3]} />
        <meshPhysicalMaterial {...glass} />
      </mesh>
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.42, 0.48, 0.45, 32]} />
        <meshPhysicalMaterial {...glass} />
      </mesh>
      <mesh position={[0.55, -0.1, 0.1]}>
        <cylinderGeometry args={[0.025, 0.025, 0.5, 8]} />
        <meshStandardMaterial {...gold} />
      </mesh>
      <mesh position={[0.55, -0.38, 0.1]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial {...gold} />
      </mesh>
    </group>
  );
}
function CloudPuff() {
  return (
    <group>
      {[[-0.35, -0.05, 0.38], [0.05, 0.15, 0.5], [0.42, -0.05, 0.36], [0.05, -0.18, 0.42]].map(([x, y, r], i) => (
        <mesh key={i} position={[x, y, 0]}>
          <sphereGeometry args={[r, 32, 24]} />
          <meshPhysicalMaterial {...glass} color="#5cb8ff" />
        </mesh>
      ))}
    </group>
  );
}
function Brackets() {
  const bar = (x: number, y: number, rz: number, c = BLUE) => (
    <mesh position={[x, y, 0]} rotation={[0, 0, rz]}>
      <boxGeometry args={[0.14, 0.62, 0.14]} />
      <meshPhysicalMaterial {...glass} color={c} />
    </mesh>
  );
  return (
    <group>
      {bar(-0.55, 0.2, -0.75)}
      {bar(-0.55, -0.2, 0.75)}
      {bar(0.55, 0.2, 0.75)}
      {bar(0.55, -0.2, -0.75)}
      <mesh rotation={[0, 0, -0.35]}>
        <boxGeometry args={[0.12, 0.95, 0.12]} />
        <meshStandardMaterial {...gold} />
      </mesh>
    </group>
  );
}
function Stack() {
  return (
    <group position={[0, -0.3, 0]}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, i * 0.3, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 0.24, 40]} />
          {i === 2 ? <meshStandardMaterial {...gold} /> : <meshPhysicalMaterial {...glass} />}
        </mesh>
      ))}
    </group>
  );
}
function Bag() {
  return (
    <group>
      <RoundedBox args={[0.95, 0.85, 0.5]} radius={0.08} smoothness={4} position={[0, -0.15, 0]}>
        <meshPhysicalMaterial {...glass} />
      </RoundedBox>
      <mesh position={[0, 0.3, 0]}>
        <torusGeometry args={[0.25, 0.04, 12, 32, Math.PI]} />
        <meshStandardMaterial {...gold} />
      </mesh>
    </group>
  );
}
function Rings() {
  return (
    <group>
      <mesh position={[-0.25, 0, 0]} rotation={[0, 0.6, 0]}>
        <torusGeometry args={[0.45, 0.1, 16, 48]} />
        <meshPhysicalMaterial {...glass} />
      </mesh>
      <mesh position={[0.25, 0, 0]} rotation={[Math.PI / 2, 0.6, 0]}>
        <torusGeometry args={[0.45, 0.1, 16, 48]} />
        <meshStandardMaterial {...gold} />
      </mesh>
    </group>
  );
}
function Bulb({ hot }: { hot: boolean }) {
  return (
    <group>
      <mesh position={[0, 0.15, 0]}>
        <sphereGeometry args={[0.5, 32, 24]} />
        <meshPhysicalMaterial color="#fff3cf" transmission={0.4} roughness={0.1} emissive="#ffc247" emissiveIntensity={hot ? 1.2 : 0.35} />
      </mesh>
      <mesh position={[0, -0.45, 0]}>
        <cylinderGeometry args={[0.22, 0.24, 0.35, 24]} />
        <meshStandardMaterial {...gold} />
      </mesh>
      <pointLight position={[0, 0.2, 0.6]} color="#ffc247" intensity={hot ? 4 : 1} distance={3} />
    </group>
  );
}
export const serviceObjects = [
  () => <Cap />,
  () => <CloudPuff />,
  () => <Brackets />,
  () => <Stack />,
  () => <Bag />,
  () => <Rings />,
  (hot: boolean) => <Bulb hot={hot} />,
];

/* ---------- Strip: objects aligned to HTML columns ---------- */
function Slot({
  index,
  count,
  hot,
  scale,
  span,
  children,
}: {
  index: number;
  count: number;
  hot: boolean;
  scale: number;
  span: number;
  children: ReactNode;
}) {
  const g = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  useFrame((_, dt) => {
    const el = g.current;
    if (!el) return;
    // Centre of column `index` in world units, at z = 0.
    el.position.x = ((index + 0.5) / count - 0.5) * viewport.width;
    el.rotation.y += dt * (hot ? 2.2 : 0.35);
    el.position.y = damp(el.position.y, hot ? 0.25 : 0, 6, dt);
    // Fit each object to its column: `span` is the object's width in world units.
    const fit = Math.min(scale, (viewport.width / count / span) * 0.9);
    el.scale.setScalar(damp(el.scale.x, fit * (hot ? 1.2 : 1), 6, dt));
  });
  return (
    <group ref={g} scale={scale}>
      <Float speed={1.5} floatIntensity={0.4} rotationIntensity={0.3}>
        {children}
      </Float>
    </group>
  );
}

export default function Strip({
  kind,
  hovered,
  count,
}: {
  kind: "services" | "courses";
  hovered: number | null;
  count: number;
}) {
  const lite = isNarrow();
  const reduced = prefersReduced();
  const slugs = ["salesforce", "mern-stack", "ui-ux", "python"];
  return (
    <Canvas
      dpr={lite ? 1 : [1, 1.75]}
      camera={{ fov: 30, position: [0, 0, 10] }}
      gl={{ alpha: true, antialias: true }}
      frameloop={reduced ? "demand" : "always"}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
      }}
    >
      <Studio lite />
      {Array.from({ length: count }, (_, i) => {
        const hot = hovered === i;
        if (kind === "services")
          return (
            <Slot key={i} index={i} count={count} hot={hot} scale={0.95} span={1.4}>
              {serviceObjects[i](hot)}
            </Slot>
          );
        const World = worldBySlug[slugs[i]];
        return (
          <Slot key={i} index={i} count={count} hot={hot} scale={1.1} span={3.6}>
            <World hot={hot} />
          </Slot>
        );
      })}
    </Canvas>
  );
}
