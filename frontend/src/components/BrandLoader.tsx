import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
/** Short brand intro on first load; tied to the page's real load, never over ~1.4s. */
export default function BrandLoader() {
  const [show, setShow] = useState(() => !matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [progress, setProgress] = useState(0.15);
  useEffect(() => {
    if (!show) return;
    const started = performance.now();
    const finish = () => {
      setProgress(1);
      const wait = Math.max(0, 700 - (performance.now() - started));
      window.setTimeout(() => setShow(false), wait + 200);
    };
    const tick = window.setInterval(() => setProgress((p) => Math.min(0.9, p + 0.12)), 120);
    const cap = window.setTimeout(() => setShow(false), 1400);
    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });
    return () => {
      window.clearInterval(tick);
      window.clearTimeout(cap);
      window.removeEventListener("load", finish);
    };
  }, [show]);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="brand-loader"
          aria-hidden="true"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeOut" } }}
        >
          <motion.div
            className="brand-loader-mark"
            initial={{ scale: 0.7, opacity: 0, rotate: -8 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 1.25, opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <img src="/brand/cloudlight-mark-128.webp" alt="" />
          </motion.div>
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
            Cloud<span>Light</span>
            <small>Solutions</small>
          </motion.p>
          <span className="brand-loader-bar">
            <span style={{ transform: `scaleX(${progress})` }} />
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
