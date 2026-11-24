import { useEffect, useMemo, useRef } from "react";
import type { MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";

/** Cloud outline sampled as the boundary of three circles and a flat base. */
function cloudOutline(samples: number) {
  const c0 = new THREE.Vector2(0.05, -0.3);
  const circles: [number, number, number][] = [
    [-1.05, -0.15, 0.85],
    [0.15, 0.4, 1.05],
    [1.15, -0.25, 0.75],
  ];
  const box = { x0: -1.05, x1: 1.15, y0: -1.0, y1: -0.4 };
  const points: THREE.Vector2[] = [];
  for (let i = 0; i < samples; i++) {
    const a = (i / samples) * Math.PI * 2;
    const d = new THREE.Vector2(Math.cos(a), Math.sin(a));
    let best = 0;
    for (const [px, py, r] of circles) {
      const fx = c0.x - px;
      const fy = c0.y - py;
      const b = fx * d.x + fy * d.y;
      const disc = b * b - (fx * fx + fy * fy - r * r);
      if (disc >= 0) best = Math.max(best, -b + Math.sqrt(disc));
    }
    const tx = [(box.x0 - c0.x) / d.x, (box.x1 - c0.x) / d.x];
    const ty = [(box.y0 - c0.y) / d.y, (box.y1 - c0.y) / d.y];
    const tmin = Math.max(Math.min(...tx), Math.min(...ty));
    const tmax = Math.min(Math.max(...tx), Math.max(...ty));
    if (tmax > Math.max(tmin, 0)) best = Math.max(best, tmax);
    points.push(new THREE.Vector2(c0.x + d.x * best, c0.y + d.y * best));
  }
  return { points, c0 };
}

export const gold = {
  color: "#ffb627",
  metalness: 0.85,
  roughness: 0.22,
  emissive: "#ff9a00",
  emissiveIntensity: 0.28,
};

export function CloudRing({ lite = false }: { lite?: boolean }) {
  const geometry = useMemo(() => {
    const { points, c0 } = cloudOutline(lite ? 110 : 180);
    const shape = new THREE.Shape(points);
    shape.holes.push(
      new THREE.Path(
        points.map((p) => p.clone().sub(c0).multiplyScalar(0.72).add(c0)).reverse(),
      ),
    );
    const g = new THREE.ExtrudeGeometry(shape, {
      depth: 0.36,
      bevelEnabled: true,
      bevelThickness: 0.12,
      bevelSize: 0.08,
      bevelSegments: lite ? 3 : 6,
      curveSegments: 1,
    });
    g.center();
    return g;
  }, [lite]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh geometry={geometry}>
      <meshPhysicalMaterial
        color="#2f7bff"
        metalness={0.25}
        roughness={0.12}
        clearcoat={1}
        clearcoatRoughness={0.06}
        iridescence={0.35}
        envMapIntensity={1.5}
      />
    </mesh>
  );
}

const ease = (t: number) => 1 - Math.pow(1 - THREE.MathUtils.clamp(t, 0, 1), 3);

/**
 * The CloudLight logo in 3D. `intro` (seconds since start, or null for no
 * intro) drives the assembly: cloud grows, bars rise in turn, arrow draws.
 */
export function LogoMark({
  lite = false,
  intro = null,
}: {
  lite?: boolean;
  intro?: MutableRefObject<number> | null;
}) {
  const cloud = useRef<THREE.Group>(null);
  const bars = useRef<(THREE.Mesh | null)[]>([]);
  const tip = useRef<THREE.Group>(null);
  const { tube, tipPos, quat } = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.95, -0.82, 0.32),
      new THREE.Vector3(0.15, -0.55, 0.38),
      new THREE.Vector3(0.95, 0.15, 0.42),
      new THREE.Vector3(1.45, 1.0, 0.46),
    ]);
    const tube = new THREE.TubeGeometry(curve, 96, 0.07, 12, false);
    const quat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      curve.getTangent(1).normalize(),
    );
    return { tube, tipPos: curve.getPoint(1), quat };
  }, []);
  useEffect(() => () => tube.dispose(), [tube]);
  const heights = [0.42, 0.72, 1.02];
  useFrame(() => {
    const t = intro ? intro.current : 99;
    const c = ease((t - 0.35) / 1.1);
    if (cloud.current) {
      cloud.current.scale.setScalar(0.001 + c * 0.999);
      cloud.current.rotation.y = (1 - c) * -1.2;
    }
    bars.current.forEach((m, i) => {
      if (!m) return;
      const k = ease((t - 1.0 - i * 0.18) / 0.6);
      m.scale.y = 0.001 + k * 0.999;
      m.position.y = -0.72 + (heights[i] * m.scale.y) / 2;
    });
    // Draw the arrow along its path, then pop the head.
    const a = ease((t - 1.5) / 0.9);
    const total = tube.index ? tube.index.count : 0;
    tube.setDrawRange(0, Math.floor((total * a) / 6) * 6);
    if (tip.current) tip.current.scale.setScalar(ease((t - 2.25) / 0.35) + 0.001);
  });
  return (
    <group>
      <group ref={cloud}>
        <CloudRing lite={lite} />
      </group>
      <group position={[0, 0, 0.1]}>
        {heights.map((h, i) => (
          <mesh key={i} ref={(m) => {
              bars.current[i] = m;
            }} position={[-0.55 + i * 0.4, -0.72 + h / 2, 0]} scale={[1, 1, 1]}>
            <boxGeometry args={[0.27, h, 0.24]} />
            <meshStandardMaterial {...gold} />
          </mesh>
        ))}
      </group>
      <mesh geometry={tube}>
        <meshStandardMaterial {...gold} />
      </mesh>
      <group ref={tip} position={tipPos}>
        <mesh quaternion={quat}>
          <coneGeometry args={[0.19, 0.4, 28]} />
          <meshStandardMaterial {...gold} />
        </mesh>
        <mesh position={[0.08, 0.18, 0]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshBasicMaterial color="#fff6d8" toneMapped={false} />
        </mesh>
        <pointLight position={[0, 0.2, 0.3]} color="#ffc247" intensity={6} distance={4} />
        <Sparkles position={[0, 0.15, 0]} count={lite ? 10 : 18} scale={0.9} size={4} speed={0.6} color="#ffd36b" />
      </group>
    </group>
  );
}

/** Studio lighting generated in code (no HDR downloads). */
export { Environment, Lightformer } from "@react-three/drei";
