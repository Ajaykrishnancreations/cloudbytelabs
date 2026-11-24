import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import type { ReactNode, PointerEvent } from "react";
/** Perspective tilt with a moving glare; mouse/pen only, off for reduced motion. */
export default function Tilt({
  children,
  className = "",
  max = 9,
  onHover,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  onHover?: (on: boolean) => void;
}) {
  const reduced = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 220, damping: 22, mass: 0.6 };
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const glareX = useTransform(px, (v) => `${v * 100}%`);
  const glareY = useTransform(py, (v) => `${v * 100}%`);
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const leave = () => {
    px.set(0.5);
    py.set(0.5);
    onHover?.(false);
  };
  return (
    <motion.div
      className={`tilt ${className}`}
      onPointerMove={move}
      onPointerEnter={() => onHover?.(true)}
      onPointerLeave={leave}
      onFocus={() => onHover?.(true)}
      onBlur={() => onHover?.(false)}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
    >
      {children}
      <motion.span
        className="tilt-glare"
        aria-hidden="true"
        style={{ "--gx": glareX, "--gy": glareY } as never}
      />
    </motion.div>
  );
}
