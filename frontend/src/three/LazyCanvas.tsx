import { Component, Suspense, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

let webgl: boolean | null = null;
export function hasWebGL() {
  if (webgl !== null) return webgl;
  try {
    const c = document.createElement("canvas");
    webgl = !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    webgl = false;
  }
  return webgl;
}
export const isNarrow = () =>
  typeof window !== "undefined" && window.innerWidth < 768;
export const prefersReduced = () =>
  typeof window !== "undefined" &&
  matchMedia("(prefers-reduced-motion: reduce)").matches;

class Boundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/**
 * Mounts a (lazy) WebGL scene only while its box is near the viewport and
 * unmounts it when far away, so only a couple of contexts ever exist. Shows
 * `fallback` without WebGL or if the scene throws.
 */
export default function LazyCanvas({
  children,
  className = "",
  fallback = null,
  margin = "250px 0px",
  eager = false,
}: {
  children: ReactNode;
  className?: string;
  fallback?: ReactNode;
  margin?: string;
  eager?: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(eager);
  const [supported] = useState(hasWebGL);
  useEffect(() => {
    const el = host.current;
    if (!el || !supported) return;
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), {
      rootMargin: margin,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [margin, supported]);
  return (
    <div ref={host} className={`lazy-canvas ${className}`} aria-hidden="true">
      {!supported ? (
        fallback
      ) : near ? (
        <Boundary fallback={fallback}>
          <Suspense fallback={fallback}>{children}</Suspense>
        </Boundary>
      ) : null}
    </div>
  );
}
