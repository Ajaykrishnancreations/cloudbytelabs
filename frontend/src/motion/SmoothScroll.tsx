import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
let lenis: Lenis | null = null;
/** Smooth wheel scrolling driven by GSAP's ticker so ScrollTrigger stays in sync. */
export default function SmoothScroll() {
  const { pathname } = useLocation();
  useEffect(() => {
    // Always start a visit at the top so the hero intro plays.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    if (!location.hash) window.scrollTo(0, 0);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    lenis = new Lenis({ lerp: 0.11, anchors: { offset: -90 } });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    // The mobile menu and chat panel lock the page with overflow:hidden.
    const lock = new MutationObserver(() => {
      if (document.body.style.overflow === "hidden") lenis?.stop();
      else lenis?.start();
    });
    lock.observe(document.body, { attributes: true, attributeFilter: ["style"] });
    return () => {
      lock.disconnect();
      gsap.ticker.remove(raf);
      lenis?.destroy();
      lenis = null;
    };
  }, []);
  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true, force: true });
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 350);
    return () => window.clearTimeout(id);
  }, [pathname]);
  return null;
}
