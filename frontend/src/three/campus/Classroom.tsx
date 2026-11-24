import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { worldBySlug } from "../worlds";

const damp = THREE.MathUtils.damp;
const W = 5;
const D = 4;
const H = 1.5;
const T = 0.14;

function Person({
  color,
  seated = false,
  skin = "#f1c7a5",
  phase = 0,
  teacher = false,
  raiseHand = false,
}: {
  color: string;
  seated?: boolean;
  skin?: string;
  phase?: number;
  teacher?: boolean;
  raiseHand?: boolean;
}) {
  const head = useRef<THREE.Mesh>(null);
  const arm = useRef<THREE.Group>(null);
  const body = seated ? 0.2 : 0.42;
  const r = teacher ? 0.15 : 0.12;
  useFrame((state) => {
    const t = state.clock.elapsedTime + phase;
    if (head.current) head.current.rotation.y = Math.sin(t * 0.8) * 0.35;
    if (arm.current)
      arm.current.rotation.z = teacher
        ? -1.1 + Math.sin(t * 1.6) * 0.35
        : raiseHand
          ? Math.sin(t * 0.7) > 0.4
            ? -2.6
            : -0.2
          : -0.2;
  });
  const base = seated ? 0.32 : 0;
  return (
    <group>
      <mesh position={[0, base + body / 2 + r, 0]} castShadow>
        <capsuleGeometry args={[r, body, 4, 10]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      <mesh ref={head} position={[0, base + body + r * 2 + 0.12, 0]} castShadow>
        <sphereGeometry args={[r * 0.85, 16, 12]} />
        <meshStandardMaterial color={skin} roughness={0.7} />
      </mesh>
      <group ref={arm} position={[r * 0.9, base + body + r, 0]}>
        <mesh position={[0, -0.16, 0]}>
          <capsuleGeometry args={[0.04, 0.26, 2, 6]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
    </group>
  );
}

const studentColors = ["#ff7a59", "#2fd36b", "#a259ff", "#ffb020", "#1fb5ff", "#ff5fae"];
const skins = ["#f1c7a5", "#c68863", "#e0ac7e", "#8d5a3b", "#f6d3b8", "#b97a56"];

export default function Classroom({
  slug,
  accent,
  dark,
  hovered,
  selected,
  lite,
}: {
  slug: string;
  accent: string;
  dark: boolean;
  hovered: boolean;
  selected: boolean;
  lite: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const halo = useRef<THREE.Mesh>(null);
  useFrame((state, dt) => {
    const g = group.current;
    if (g) g.position.y = damp(g.position.y, hovered || selected ? 0.25 : 0, 6, dt);
    if (halo.current) {
      const on = hovered || selected ? 1 : 0;
      const m = halo.current.material as THREE.MeshBasicMaterial;
      m.opacity = damp(m.opacity, on * (0.45 + Math.sin(state.clock.elapsedTime * 3) * 0.15), 6, dt);
    }
  });
  const wall = dark ? "#1b3263" : "#f6f8fc";
  const floor = dark ? "#2a3f6b" : "#e8dccb";
  const World = worldBySlug[slug];
  return (
    <group ref={group}>
      {/* Selection halo */}
      <mesh ref={halo} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <ringGeometry args={[3.6, 3.85, 64]} />
        <meshBasicMaterial color={accent} transparent opacity={0} />
      </mesh>
      <mesh position={[0, -0.04, 0]} receiveShadow>
        <boxGeometry args={[W + 1.2, 0.08, D + 1.2]} />
        <meshStandardMaterial color={dark ? "#132a52" : "#ffffff"} />
      </mesh>
      <mesh position={[0, 0.03, 0]} receiveShadow>
        <boxGeometry args={[W, 0.06, D]} />
        <meshStandardMaterial color={floor} roughness={0.8} />
      </mesh>
      {/* Dollhouse cut-away: back and left walls tall, front and right low */}
      <mesh position={[0, H / 2, -D / 2]} castShadow receiveShadow>
        <boxGeometry args={[W, H, T]} />
        <meshStandardMaterial color={wall} />
      </mesh>
      <mesh position={[-W / 2, H / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[T, H, D]} />
        <meshStandardMaterial color={wall} />
      </mesh>
      <mesh position={[0.4, 0.18, D / 2]} castShadow>
        <boxGeometry args={[W - 0.8, 0.36, T]} />
        <meshStandardMaterial color={wall} />
      </mesh>
      <mesh position={[W / 2, 0.18, 0]} castShadow>
        <boxGeometry args={[T, 0.36, D]} />
        <meshStandardMaterial color={wall} />
      </mesh>
      {/* Coloured roof trim */}
      <mesh position={[0, H + 0.06, -D / 2]}>
        <boxGeometry args={[W + 0.1, 0.14, T + 0.1]} />
        <meshStandardMaterial color={accent} metalness={0.2} roughness={0.4} />
      </mesh>
      <mesh position={[-W / 2, H + 0.06, 0]}>
        <boxGeometry args={[T + 0.1, 0.14, D + 0.1]} />
        <meshStandardMaterial color={accent} metalness={0.2} roughness={0.4} />
      </mesh>
      {[-1, 0, 1].map((i) => (
        <mesh key={i} position={[-W / 2 + 0.08, 0.95, i * 1.1]}>
          <boxGeometry args={[0.04, 0.5, 0.7]} />
          <meshStandardMaterial color="#9fd3ff" emissive="#5cb8ff" emissiveIntensity={dark ? 0.6 : 0.15} />
        </mesh>
      ))}
      {/* Whiteboard with course-coloured "notes" */}
      <group position={[0.3, 0.92, -D / 2 + 0.09]}>
        <mesh>
          <boxGeometry args={[2.4, 0.95, 0.04]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        {[accent, "#26324a", accent, "#9aa8c0", "#26324a"].map((c, i) => (
          <mesh key={i} position={[-0.9 + (i % 2) * 0.25 + ((i * 0.37) % 0.6), 0.3 - i * 0.15, 0.03]}>
            <boxGeometry args={[0.7 + (i % 3) * 0.25, 0.05, 0.01]} />
            <meshBasicMaterial color={c} />
          </mesh>
        ))}
      </group>
      <group position={[-1.25, 0.06, -D / 2 + 0.7]} rotation={[0, 0.5, 0]}>
        <Person color={accent} teacher phase={0.3} />
      </group>
      {[0, 1].map((row) =>
        [0, 1, 2].map((col) => {
          const i = row * 3 + col;
          return (
            <group key={i} position={[-1.2 + col * 1.25, 0.06, -0.15 + row * 1.15]}>
              <mesh position={[0, 0.3, -0.18]} castShadow>
                <boxGeometry args={[0.7, 0.06, 0.4]} />
                <meshStandardMaterial color="#c89b6d" />
              </mesh>
              <mesh position={[0, 0.15, -0.18]}>
                <boxGeometry args={[0.06, 0.3, 0.06]} />
                <meshStandardMaterial color="#8d6a48" />
              </mesh>
              <mesh position={[0.08, 0.35, -0.2]}>
                <boxGeometry args={[0.3, 0.02, 0.2]} />
                <meshStandardMaterial color="#26324a" emissive={accent} emissiveIntensity={0.35} />
              </mesh>
              <group position={[0, 0, 0.18]}>
                <Person color={studentColors[i]} skin={skins[i]} seated phase={i * 1.3} raiseHand={i === 4} />
              </group>
            </group>
          );
        }),
      )}
      {/* Course landmark floating above the roof line */}
      {!lite && (
        <Float speed={1.2} floatIntensity={0.4} rotationIntensity={0.2}>
          <group position={[1.4, H + 1.1, -D / 2 + 0.3]} scale={0.33}>
            <World hot={hovered || selected} />
          </group>
        </Float>
      )}
      <mesh position={[-1.9, 0.01, D / 2 + 0.45]} receiveShadow>
        <boxGeometry args={[0.8, 0.02, 0.9]} />
        <meshStandardMaterial color={dark ? "#2a4a85" : "#dfe6f2"} />
      </mesh>
    </group>
  );
}
