import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
export type CelebrationKind = "certificate" | "job";
const copy: Record<CelebrationKind, [string, string]> = {
  certificate: ["Certified!", "You completed the Salesforce program."],
  job: ["You got the job!", "Your next chapter starts here."],
};
const colors = [
  "#ff3b3b",
  "#ffb020",
  "#ffe14d",
  "#2fd36b",
  "#1fb5ff",
  "#2e62ed",
  "#ff5fae",
  "#a259ff",
];
const DURATION = 2000;
type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  w: number;
  h: number;
  color: string;
  curl: boolean;
};
function Confetti() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth;
    const H = window.innerHeight;
    el.width = W * dpr;
    el.height = H * dpr;
    ctx.scale(dpr, dpr);
    const narrow = W < 600;
    const count = narrow ? 170 : 280;
    const pieces: Piece[] = [];
    const piece = (x: number, y: number, angle: number, speed: number) => ({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.35,
      w: 6 + Math.random() * 7,
      h: 10 + Math.random() * 12,
      color: colors[(Math.random() * colors.length) | 0],
      curl: Math.random() < 0.3,
    });
    const scale = Math.max(0.75, Math.min(1.3, H / 800));
    // Cannons from the bottom corners, a burst from the centre and a paper
    // rain from above, so the whole screen fills on phones and desktops.
    const tilt = narrow ? Math.PI / 2.4 : Math.PI / 3;
    for (let i = 0; i < count; i++) {
      const side = i % 4;
      const spread = (Math.random() - 0.5) * 0.7;
      const speed = (14 + Math.random() * 11) * scale;
      if (side === 0) pieces.push(piece(0, H, -tilt + spread, speed));
      else if (side === 1)
        pieces.push(piece(W, H, -Math.PI + tilt + spread, speed));
      else if (side === 2)
        pieces.push(
          piece(
            Math.random() * W,
            -20 - Math.random() * H * 0.5,
            Math.PI / 2 + spread,
            2 + Math.random() * 4,
          ),
        );
      else
        pieces.push(
          piece(
            W / 2,
            H * 0.45,
            Math.random() * Math.PI * 2,
            (4 + Math.random() * 9) * scale,
          ),
        );
    }
    const start = performance.now();
    let last = start;
    let frame = 0;
    const tick = (now: number) => {
      const t = now - start;
      // Step physics by elapsed time so 120Hz screens play at the same speed.
      const f = Math.min(3, (now - last) / 16.67);
      const drag = Math.pow(0.985, f);
      last = now;
      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha =
        t > DURATION - 450 ? Math.max(0, (DURATION - t) / 450) : 1;
      for (const p of pieces) {
        p.vx *= drag;
        p.vy = p.vy * drag + 0.32 * f;
        p.x += p.vx * f;
        p.y += p.vy * f;
        p.rot += p.vr * f;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.strokeStyle = p.color;
        if (p.curl) {
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, 0, p.h / 1.6, 0, Math.PI * 0.9);
          ctx.stroke();
        } else {
          // Flip the width with rotation so pieces look like tumbling paper.
          ctx.fillRect(
            -p.w / 2,
            -p.h / 2,
            p.w * Math.abs(Math.cos(p.rot * 2)),
            p.h,
          );
        }
        ctx.restore();
      }
      if (t < DURATION) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);
  return <canvas ref={canvas} className="celebration-confetti" />;
}
function CertificateArt() {
  return (
    <svg viewBox="0 0 220 170" aria-hidden="true">
      <rect x="18" y="22" width="150" height="108" rx="8" fill="#5b8cff" />
      <rect x="26" y="30" width="134" height="92" rx="5" fill="#eaf1ff" />
      <path d="M26 104c30-18 58 12 134-10v28H26z" fill="#c6d8ff" />
      <text
        x="93"
        y="56"
        textAnchor="middle"
        fontSize="15"
        fontStyle="italic"
        fontWeight="700"
        fill="#2e62ed"
      >
        Certificate
      </text>
      <rect x="52" y="66" width="82" height="5" rx="2.5" fill="#9db7ef" />
      <rect x="62" y="77" width="62" height="4" rx="2" fill="#c3d3f3" />
      <rect x="58" y="86" width="70" height="4" rx="2" fill="#c3d3f3" />
      <g transform="translate(160 118)">
        <path
          d="M-14 8-22 44l14-7 8 12 6-38zM14 8l8 36-14-7-8 12-6-38z"
          fill="#2e62ed"
        />
        <circle r="24" fill="#ffc247" stroke="#e09a12" strokeWidth="4" />
        <path
          d="m-10 0 7 7 13-14"
          fill="none"
          stroke="#fff"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
function TrophyArt() {
  return (
    <svg viewBox="0 0 220 170" aria-hidden="true">
      <g transform="translate(36 96)">
        <rect x="0" y="12" width="64" height="48" rx="7" fill="#2e62ed" />
        <rect
          x="20"
          y="2"
          width="24"
          height="14"
          rx="4"
          fill="none"
          stroke="#2e62ed"
          strokeWidth="5"
        />
        <rect x="0" y="30" width="64" height="5" fill="#1d47b8" />
        <rect x="27" y="27" width="10" height="11" rx="2" fill="#ffc247" />
      </g>
      <g transform="translate(118 20)">
        <path
          d="M14 18H0c0 22 12 32 26 32M66 18h14c0 22-12 32-26 32"
          fill="none"
          stroke="#ffc247"
          strokeWidth="7"
        />
        <path d="M10 6h60v30c0 22-14 38-30 38S10 58 10 36z" fill="#ffc247" />
        <path
          d="M22 12h10v26c0 12 6 20 12 24-14 0-22-12-22-24z"
          fill="#ffe08a"
        />
        <rect x="34" y="72" width="12" height="22" fill="#e09a12" />
        <rect x="20" y="92" width="40" height="12" rx="3" fill="#e09a12" />
        <rect x="14" y="102" width="52" height="14" rx="4" fill="#b8790a" />
        <text
          x="40"
          y="47"
          textAnchor="middle"
          fontSize="28"
          fontWeight="800"
          fill="#fff"
        >
          1
        </text>
      </g>
    </svg>
  );
}
export default function Celebration({
  kind,
  onDone,
}: {
  kind: CelebrationKind;
  onDone: () => void;
}) {
  const done = useRef(onDone);
  done.current = onDone;
  useEffect(() => {
    const timer = window.setTimeout(() => done.current(), DURATION);
    return () => window.clearTimeout(timer);
  }, []);
  const [title, body] = copy[kind];
  return createPortal(
    <div className="celebration" role="status" aria-live="polite">
      <Confetti />
      <motion.div
        className="celebration-card"
        initial={{ opacity: 0, scale: 0.6, y: 30 }}
        animate={{
          opacity: [0, 1, 1, 0],
          scale: [0.6, 1.06, 1, 0.96],
          y: [30, 0, 0, -10],
        }}
        transition={{ duration: DURATION / 1000, times: [0, 0.18, 0.8, 1] }}
      >
        {kind === "certificate" ? <CertificateArt /> : <TrophyArt />}
        <strong>{title}</strong>
        <span>{body}</span>
      </motion.div>
    </div>,
    document.body,
  );
}
