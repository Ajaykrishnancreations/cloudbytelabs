import { lazy, useRef } from "react";
import type { MutableRefObject } from "react";
import LazyCanvas from "./LazyCanvas";
import type { Variant } from "./ShapesScene";

const HeroSceneLazy = lazy(() => import("./HeroScene"));
const WorldSceneLazy = lazy(() => import("./WorldScene"));
const FinalSceneLazy = lazy(() =>
  import("./WorldScene").then((m) => ({ default: m.FinalScene })),
);
const ShapesSceneLazy = lazy(() => import("./ShapesScene"));
const StripLazy = lazy(() => import("./Strip"));

const brandFallback = (
  <div className="scene-fallback">
    <img src="/brand/cloudlight-mark-128.webp" alt="" width="128" height="87" />
  </div>
);

/** Decorative hero 3D with the brand mark as fallback. */
export function Hero3D({
  progress,
  onReady,
}: {
  progress: MutableRefObject<number>;
  onReady: () => void;
}) {
  return (
    <LazyCanvas className="hero3d" fallback={brandFallback} margin="0px" eager>
      <HeroSceneLazy progress={progress} active onReady={onReady} />
    </LazyCanvas>
  );
}

/** Floating shapes behind a section; mounts only near the viewport. */
export function Backdrop3D({ variant, className = "" }: { variant: Variant; className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  return (
    <div ref={host} className={`backdrop3d ${className}`} aria-hidden="true">
      <LazyCanvas>
        <ShapesSceneLazy variant={variant} host={host} />
      </LazyCanvas>
    </div>
  );
}

/** A large course world (Salesforce, MERN, UI/UX or Python). */
export function World3D({ slug, className = "" }: { slug: string; className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  return (
    <div ref={host} className={`world3d ${className}`} aria-hidden="true">
      <LazyCanvas fallback={brandFallback}>
        <WorldSceneLazy slug={slug} host={host} />
      </LazyCanvas>
    </div>
  );
}

export function Final3D() {
  const host = useRef<HTMLDivElement>(null);
  return (
    <div ref={host} className="final3d" aria-hidden="true">
      <LazyCanvas margin="0px">
        <FinalSceneLazy host={host} />
      </LazyCanvas>
    </div>
  );
}

/** A row of 3D objects aligned to an HTML grid's columns. */
export function Strip3D({
  kind,
  hovered,
  count,
  className = "",
}: {
  kind: "services" | "courses";
  hovered: number | null;
  count: number;
  className?: string;
}) {
  return (
    <div className={`strip3d ${className}`} aria-hidden="true">
      <LazyCanvas>
        <StripLazy kind={kind} hovered={hovered} count={count} />
      </LazyCanvas>
    </div>
  );
}
