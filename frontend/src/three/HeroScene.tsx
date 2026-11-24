import { useEffect, useRef } from "react";
import type { MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Lightformer, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { LogoMark } from "./brand";
import { isNarrow, prefersReduced } from "./LazyCanvas";

const damp = THREE.MathUtils.damp;

export function Studio({ lite = false }: { lite?: boolean }) {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 5, 5]} intensity={1.3} color="#dbe9ff" />
      <directionalLight position={[-5, -2, 2]} intensity={0.7} color="#6f9dff" />
      <Environment resolution={lite ? 128 : 256} frames={1}>
        <Lightformer form="rect" intensity={3} color="#6fb7ff" position={[0, 4, -5]} scale={[10, 2, 1]} />
        <Lightformer form="ring" intensity={2} color="#9fc2ff" position={[-5, 1, -1]} scale={3} />
        <Lightformer form="rect" intensity={2} color="#ffd38a" position={[5, -1, 2]} scale={[3, 3, 1]} />
        <Lightformer form="rect" intensity={1.4} color="#3fd0ff" position={[0, -4, 3]} scale={[8, 1, 1]} />
      </Environment>
    </>
  );
}

/** Light trails: thin glowing curves orbiting the logo. */
function Trails({ count }: { count: number }) {
  const group = useRef<THREE.Group>(null);
  const curves = useRef(
    Array.from({ length: count }, (_, i) => {
      const r = 2.2 + i * 0.35;
      const pts = Array.from({ length: 80 }, (_, k) => {
        const a = (k / 79) * Math.PI * 1.3;
        return new THREE.Vector3(Math.cos(a) * r, Math.sin(a * 2) * 0.25 + (i - count / 2) * 0.3, Math.sin(a) * r * 0.5);
      });
      return new THREE.BufferGeometry().setFromPoints(pts);
    }),
  );
  useEffect(() => () => curves.current.forEach((g) => g.dispose()), []);
  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.08;
  });
  return (
    <group ref={group} rotation={[0.3, 0, 0.15]}>
      {curves.current.map((g, i) => (
        <line key={i}>
          <primitive object={g} attach="geometry" />
          <lineBasicMaterial color={i % 2 ? "#ffc247" : "#5cc8ff"} transparent opacity={0.35} />
        </line>
      ))}
    </group>
  );
}

function Rig({
  progress,
  reduced,
}: {
  progress: MutableRefObject<number>;
  reduced: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const glow = useRef<THREE.Mesh>(null);
  const intro = useRef(reduced ? 99 : 0);
  const pointer = useRef({ x: 0, y: 0 });
  const { size, camera } = useThree();
  const narrow = size.width < size.height * 1.05;
  useEffect(() => {
    const move = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);
  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    intro.current += dt;
    const t = intro.current;
    const p = progress.current;
    const px = reduced ? 0 : pointer.current.x;
    const py = reduced ? 0 : pointer.current.y;
    // Opening: a point of light swells, then fades as the logo assembles.
    if (glow.current) {
      const s = THREE.MathUtils.clamp(t / 0.5, 0, 1) * (1 - THREE.MathUtils.clamp((t - 1.2) / 0.8, 0, 1));
      glow.current.scale.setScalar(0.05 + s * 0.6);
      (glow.current.material as THREE.MeshBasicMaterial).opacity = s;
    }
    // Camera approaches during the intro, then follows the pointer and scroll.
    const approach = 1 - Math.pow(1 - THREE.MathUtils.clamp(t / 2.6, 0, 1), 3);
    const baseZ = (narrow ? 8.4 : 6.6) + (1 - approach) * 3;
    camera.position.x = damp(camera.position.x, px * 0.5, 2.5, dt);
    camera.position.y = damp(camera.position.y, -py * 0.3 + p * 0.6, 2.5, dt);
    camera.position.z = damp(camera.position.z, baseZ - p * 1.4, 3, dt);
    camera.lookAt(0, p * 0.4, 0);
    const fit = Math.min(1, (size.height / 820) * 1.05, size.width / 1100);
    // Keep the object inside the right half on any window shape.
    const aspect = size.width / size.height;
    const baseX = narrow ? 0 : 1.75 * Math.min(1, aspect / 1.7);
    const baseY = narrow ? 1.75 : -0.1;
    g.rotation.y = damp(g.rotation.y, px * 0.4 - 0.35 + p * Math.PI * 0.85, 4, dt);
    g.rotation.x = damp(g.rotation.x, -py * 0.2 + 0.08 + p * 0.35, 4, dt);
    g.position.x = damp(g.position.x, baseX - p * (narrow ? 0 : 1.2), 3, dt);
    g.position.y = damp(g.position.y, baseY + p * 1.4, 3, dt);
    g.scale.setScalar(damp(g.scale.x, (narrow ? 0.5 : 0.72 * Math.max(0.62, fit) * Math.min(1, aspect / 1.5)) * (1 - p * 0.3), 4, dt));
    state.scene.fog && ((state.scene.fog as THREE.Fog).far = 18 - p * 4);
  });
  return (
    <group ref={group}>
      <mesh ref={glow}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial color="#cfe4ff" transparent opacity={0} toneMapped={false} />
      </mesh>
      <Float speed={reduced ? 0 : 1.3} rotationIntensity={0.22} floatIntensity={0.5}>
        <LogoMark lite={narrow} intro={intro} />
      </Float>
    </group>
  );
}

export default function HeroScene({
  progress,
  active,
  onReady,
}: {
  progress: MutableRefObject<number>;
  active: boolean;
  onReady: () => void;
}) {
  const lite = isNarrow();
  const reduced = prefersReduced();
  return (
    <Canvas
      dpr={lite ? [1, 1.5] : [1, 2]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: 38, position: [0, 0, 9.5] }}
      frameloop={!active ? "never" : reduced ? "demand" : "always"}
      onCreated={({ gl, scene }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        // Depth fog only suits the dark theme; on light pages it would look muddy.
        if (document.documentElement.dataset.theme === "dark") scene.fog = new THREE.Fog("#06132e", 6, 18);
        onReady();
      }}
    >
      <Studio lite={lite} />
      <Rig progress={progress} reduced={reduced} />
      {!lite && <Trails count={3} />}
      <Sparkles count={lite ? 55 : 160} scale={[14, 8, 6]} size={2.2} speed={reduced ? 0 : 0.3} opacity={0.7} color="#7cc8ff" />
      <Sparkles count={lite ? 20 : 50} scale={[12, 7, 5]} size={3.2} speed={reduced ? 0 : 0.25} opacity={0.65} color="#ffc247" />
    </Canvas>
  );
}
