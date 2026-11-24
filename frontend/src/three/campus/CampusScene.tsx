import { useEffect, useMemo, useRef, useState } from "react";
import type { MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { CameraControls, CameraControlsImpl, Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import Classroom from "./Classroom";
import { Grounds } from "./Grounds";
import { LogoMark } from "../brand";

const { ACTION } = CameraControlsImpl;
export type CampusApi = {
  zoom: (d: number) => void;
  rotate: (d: number) => void;
  home: () => void;
};
export type School = {
  slug: string;
  title: string;
  accent: string;
  position: [number, number];
};
const HQ: [number, number] = [0, 0.5];
const ARCH_Z = 16.5;
type View = readonly [number, number, number, number, number, number];
const lookAt = (c: CameraControlsImpl, v: View) =>
  void c.setLookAt(v[0], v[1], v[2], v[3], v[4], v[5], true);

function Arch({ dark }: { dark: boolean }) {
  const pillar = dark ? "#1b3263" : "#ffffff";
  return (
    <group position={[0, 0, ARCH_Z]}>
      {[-1.7, 1.7].map((x) => (
        <mesh key={x} position={[x, 1.25, 0]} castShadow>
          <boxGeometry args={[0.5, 2.5, 0.6]} />
          <meshStandardMaterial color={pillar} />
        </mesh>
      ))}
      <mesh position={[0, 2.65, 0]} castShadow>
        <boxGeometry args={[4.4, 0.55, 0.7]} />
        <meshStandardMaterial color="#2e62ed" metalness={0.3} roughness={0.3} />
      </mesh>
      <mesh position={[0, 2.95, 0]}>
        <boxGeometry args={[4.5, 0.08, 0.75]} />
        <meshStandardMaterial color="#ffb627" metalness={0.8} roughness={0.25} emissive="#ff9a00" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

/** Anchor points for the DOM labels: HQ, gate, then each school. */
export function labelAnchors(schools: School[]): [number, number, number][] {
  return [
    [HQ[0], 3.5, HQ[1]],
    [0, 3.6, ARCH_Z],
    ...schools.map((s) => [s.position[0], 2.6, s.position[1] - 1] as [number, number, number]),
  ];
}

/** Projects the anchors to screen space each frame and moves the DOM labels. */
function LabelTracker({
  anchors,
  labels,
}: {
  anchors: [number, number, number][];
  labels: MutableRefObject<(HTMLElement | null)[]>;
}) {
  const v = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ camera, size }) => {
    anchors.forEach((a, i) => {
      const el = labels.current[i];
      if (!el) return;
      v.set(a[0], a[1], a[2]).project(camera);
      el.style.transform = `translate(${((v.x + 1) / 2) * size.width}px, ${((1 - v.y) / 2) * size.height}px) translate(-50%, -50%)`;
      el.style.visibility = v.z > 1 ? "hidden" : "visible";
    });
  });
  return null;
}

export default function CampusScene({
  schools,
  selected,
  onSelect,
  api,
  dark,
  onReady,
  labels,
}: {
  schools: School[];
  selected: number | null;
  onSelect: (i: number | null) => void;
  api: MutableRefObject<CampusApi | null>;
  dark: boolean;
  onReady: () => void;
  labels: MutableRefObject<(HTMLElement | null)[]>;
}) {
  const controls = useRef<CameraControlsImpl>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const anchors = useMemo(() => labelAnchors(schools), [schools]);
  const blocked = useMemo<[number, number, number][]>(
    () => [
      ...schools.map((s) => [s.position[0], s.position[1], 4.4] as [number, number, number]),
      [HQ[0], HQ[1], 2.6],
      [0, ARCH_Z, 2.8],
    ],
    [schools],
  );
  const lite = typeof window !== "undefined" && window.innerWidth < 768;
  const homeView: View = lite ? [27, 31, 36, 0, 0, 1] : [19, 21, 25, 0, 0, 1.5];
  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    api.current = {
      zoom: (d) => void c.dolly(d, true),
      rotate: (d) => void c.rotate(d, 0, true),
      home: () => lookAt(c, homeView),
    };
    return () => {
      api.current = null;
    };
  });
  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    if (selected === null) lookAt(c, homeView);
    else {
      const [x, z] = schools[selected].position;
      // Phones get a wider shot: the step panel sits below the stage.
      if (lite) lookAt(c, [x + 8, 10.5, z + 11.5, x, 0.4, z]);
      else lookAt(c, [x + 5.2, 6.2, z + 7.4, x - 0.2, 0.5, z - 0.3]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);
  useEffect(() => {
    document.body.style.cursor = hovered !== null ? "pointer" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hovered]);
  return (
    <Canvas
      shadows={!lite}
      dpr={lite ? [1, 1.5] : [1, 2]}
      camera={{ fov: 30, position: [homeView[0], homeView[1], homeView[2]] }}
      gl={{ alpha: true, antialias: true }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        onReady();
      }}
      onPointerMissed={() => onSelect(null)}
    >
      <hemisphereLight args={[dark ? "#5c7cff" : "#ffffff", dark ? "#061230" : "#cfd9ee", dark ? 0.7 : 1.1]} />
      <directionalLight
        position={[14, 22, 10]}
        intensity={dark ? 1.2 : 1.6}
        castShadow={!lite}
        shadow-mapSize={[1536, 1536]}
        shadow-camera-left={-24}
        shadow-camera-right={24}
        shadow-camera-top={24}
        shadow-camera-bottom={-24}
      />
      <CameraControls
        ref={controls}
        minDistance={7}
        maxDistance={60}
        minPolarAngle={0.35}
        maxPolarAngle={1.2}
        smoothTime={0.6}
        mouseButtons={{ left: ACTION.ROTATE, middle: ACTION.DOLLY, right: ACTION.TRUCK, wheel: ACTION.NONE }}
        touches={{ one: ACTION.NONE, two: ACTION.TOUCH_DOLLY_ROTATE, three: ACTION.TOUCH_TRUCK }}
      />
      <LabelTracker anchors={anchors} labels={labels} />
      <Grounds dark={dark} lite={lite} blocked={blocked} />
      <group position={[HQ[0], 0, HQ[1]]}>
        <mesh position={[0, -0.02, 0]} receiveShadow>
          <cylinderGeometry args={[2, 2.1, 0.12, 48]} />
          <meshStandardMaterial color={dark ? "#132a52" : "#ffffff"} />
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <torusGeometry args={[1.75, 0.04, 8, 64]} />
          <meshBasicMaterial color="#3e86ff" />
        </mesh>
        <Float speed={1.4} floatIntensity={0.6} rotationIntensity={0.2}>
          <group position={[0, 1.7, 0]} scale={0.55} rotation={[0, -0.6, 0]}>
            <LogoMark lite={lite} />
          </group>
        </Float>
        <pointLight position={[0, 2, 0]} color="#3e86ff" intensity={4} distance={6} />
        {!lite && <Sparkles position={[0, 1.8, 0]} count={30} scale={[4, 3, 4]} size={3} speed={0.4} color="#ffc247" />}
      </group>
      <Arch dark={dark} />
      {schools.map((s, i) => (
        <group
          key={s.slug}
          position={[s.position[0], 0, s.position[1]]}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(i);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(i);
          }}
          onPointerOut={() => setHovered(null)}
        >
          <Classroom
            slug={s.slug}
            accent={s.accent}
            dark={dark}
            hovered={hovered === i}
            selected={selected === i}
            lite={lite}
          />
        </group>
      ))}
    </Canvas>
  );
}
