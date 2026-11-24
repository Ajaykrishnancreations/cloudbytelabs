import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, BookOpen, X } from "lucide-react";
import { courses, track } from "../data/site";

type Course = (typeof courses)[number];
/** Visual identity of each course "book". */
const looks: Record<string, { cover: string; ink: string; accent: string; art: string }> = {
  salesforce: { cover: "#0b3d7a", ink: "#e9f4ff", accent: "#5cc8ff", art: "clouds" },
  "mern-stack": { cover: "#123a2a", ink: "#e8fff3", accent: "#2fd36b", art: "blocks" },
  "ui-ux": { cover: "#3a1f6b", ink: "#f4edff", accent: "#ffb020", art: "grid" },
  python: { cover: "#1f2f4f", ink: "#fff7e0", accent: "#ffc247", art: "rings" },
};

function CoverArt({ kind, accent }: { kind: string; accent: string }) {
  if (kind === "clouds")
    return (
      <svg viewBox="0 0 200 200" aria-hidden="true">
        {[[60, 120, 34], [100, 100, 46], [142, 122, 30], [100, 132, 36]].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill="none" stroke={accent} strokeWidth="2" opacity={0.9 - i * 0.12} />
        ))}
        <path d="M60 160 L95 130 L120 145 L150 105" fill="none" stroke="#ffc247" strokeWidth="4" strokeLinecap="round" />
      </svg>
    );
  if (kind === "blocks")
    return (
      <svg viewBox="0 0 200 200" aria-hidden="true">
        {Array.from({ length: 9 }, (_, i) => (
          <rect key={i} x={30 + (i % 3) * 50} y={40 + Math.floor(i / 3) * 45} width="40" height="32" rx="6" fill={i % 4 === 0 ? accent : "none"} stroke={accent} strokeWidth="2" opacity={0.95 - (i % 3) * 0.2} />
        ))}
      </svg>
    );
  if (kind === "grid")
    return (
      <svg viewBox="0 0 200 200" aria-hidden="true">
        <rect x="55" y="30" width="90" height="150" rx="14" fill="none" stroke={accent} strokeWidth="2.5" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x="68" y={50 + i * 30} width={i === 0 ? 64 : 50} height="16" rx="5" fill={i === 0 ? accent : "#ffffff33"} />
        ))}
        <circle cx="160" cy="60" r="18" fill="none" stroke="#c5a3ff" strokeWidth="2" />
      </svg>
    );
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx={80 + (i % 2) * 40} cy={80 + Math.floor(i / 2) * 40} r="34" fill="none" stroke={i % 2 ? "#5c9cff" : accent} strokeWidth="2.5" />
      ))}
    </svg>
  );
}

function Book({
  course,
  index,
  active,
  onActive,
  onOpen,
}: {
  course: Course;
  index: number;
  active: boolean;
  onActive: () => void;
  onOpen: () => void;
}) {
  const look = looks[course.slug] ?? looks.salesforce;
  return (
    <button
      type="button"
      className={`book-slot ${active ? "is-active" : ""}`}
      style={{ "--cover": look.cover, "--ink": look.ink, "--accent": look.accent } as never}
      onPointerEnter={onActive}
      onFocus={onActive}
      onClick={onOpen}
      aria-label={`Open the ${course.title} book`}
    >
      <span className="book">
        <span className="book-face book-cover">
          <span className="book-art">
            <CoverArt kind={look.art} accent={look.accent} />
          </span>
          <span className="book-cover-top">
            <small>{course.category}</small>
            <strong>{course.title}</strong>
          </span>
          <span className="book-cover-foot">
            <img src="/brand/cloudlight-mark-128.webp" alt="" />
            CloudLight · 0{index + 1}
          </span>
        </span>
        <span className="book-face book-spine">
          <span className="book-spine-title">{course.title}</span>
          <img src="/brand/cloudlight-mark-128.webp" alt="" />
        </span>
        <span className="book-face book-pages" />
        <span className="book-face book-back" />
      </span>
    </button>
  );
}

/** Full-screen reader: the book opens to reveal the full curriculum. */
function Reader({ course, index, onClose }: { course: Course; index: number; onClose: () => void }) {
  const look = looks[course.slug] ?? looks.salesforce;
  const close = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const prior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const opener = document.activeElement as HTMLElement | null;
    close.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    track("course_book_open", { course: course.slug });
    return () => {
      document.body.style.overflow = prior;
      window.removeEventListener("keydown", esc);
      opener?.focus();
    };
  }, [course.slug, onClose]);
  return createPortal(
    <motion.div
      className="reader"
      role="dialog"
      aria-modal="true"
      aria-label={`${course.title} curriculum`}
      style={{ "--cover": look.cover, "--ink": look.ink, "--accent": look.accent } as never}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <button ref={close} type="button" className="reader-close" onClick={onClose} aria-label="Close book">
        <X size={20} />
      </button>
      <motion.div
        className="reader-book"
        initial={{ scale: 0.6, rotateY: 30, y: 60 }}
        animate={{ scale: 1, rotateY: 0, y: 0 }}
        exit={{ scale: 0.7, opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      >
        {/* The cover swings open to the left */}
        <motion.div
          className="reader-cover"
          initial={{ rotateY: 0 }}
          animate={{ rotateY: -165 }}
          transition={{ delay: 0.35, duration: 1.1, ease: [0.6, 0, 0.2, 1] }}
        >
          <div className="reader-cover-front">
            <CoverArt kind={look.art} accent={look.accent} />
            <strong>{course.title}</strong>
          </div>
          <div className="reader-cover-inside">
            <small>CloudLight Solutions · Book 0{index + 1}</small>
            <p>{course.category}</p>
            <h2>{course.headline}</h2>
          </div>
        </motion.div>
        <motion.div
          className="reader-page"
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <p className="reader-kicker">{course.category}</p>
          <h3>{course.title}</h3>
          <p className="reader-lead">{course.description}</p>
          <div className="reader-chips">
            {course.technologies.map((x) => (
              <span key={x}>{x}</span>
            ))}
          </div>
          <h4>Curriculum · {course.modules.length} modules</h4>
          <ol className="reader-modules">
            {course.modules.map((m, i) => (
              <li key={m.title}>
                <b>{String(i + 1).padStart(2, "0")}</b>
                <div>
                  <strong>{m.title}</strong>
                  <span>{m.topics.join(" · ")}</span>
                </div>
              </li>
            ))}
          </ol>
          <h4>Learning roadmap</h4>
          <p className="reader-path">{course.roadmap.join("  →  ")}</p>
          <h4>Curriculum project</h4>
          <p>
            <strong>{course.project.title}.</strong> {course.project.problem}
          </p>
          <p className="reader-note">Curriculum project • illustrative preview</p>
          <h4>Who this is for</h4>
          <p>{course.audience.join(" · ")}</p>
          <h4>What you need</h4>
          <p>{course.prerequisites.join(" · ")}</p>
          <p className="reader-note">For fees and upcoming batches, speak with our team.</p>
          <div className="reader-actions">
            <Link className="button" to={`/courses/${course.slug}`} onClick={onClose}>
              Explore full program <ArrowUpRight size={16} />
            </Link>
            <Link className="button secondary" to={`/contact?course=${course.slug}`} onClick={onClose}>
              Talk to a mentor
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}

export default function BookShelf() {
  // Desktop: Salesforce opens by default. Phones: every book starts closed.
  const [mobile] = useState(() => matchMedia("(max-width: 767px)").matches);
  const [active, setActive] = useState<number | null>(mobile ? null : 0);
  const [open, setOpen] = useState<number | null>(null);
  const closeBook = useCallback(() => setOpen(null), []);
  const course = active === null ? null : courses[active];
  return (
    <div className={`bookshelf ${active === null ? "is-closed" : ""}`}>
      <div className="shelf-wrap">
        <div className="shelf" role="list" aria-label="Courses">
          {courses.map((c, i) => (
            <div role="listitem" key={c.slug}>
              <Book
                course={c}
                index={i}
                active={active === i}
                onActive={() => !mobile && setActive(i)}
                onOpen={() => (mobile && active !== i ? setActive(i) : setOpen(i))}
              />
            </div>
          ))}
        </div>
        <div className="shelf-board" aria-hidden="true" />
      </div>
      <AnimatePresence mode="wait">
        {!course ? (
          <motion.div
            key="prompt"
            className="shelf-caption shelf-prompt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="shelf-kicker">{courses.length} programs</p>
            <h3>Pick a book.</h3>
            <p>Tap a spine to see what's inside, then open it for the full curriculum.</p>
          </motion.div>
        ) : (
        <motion.div
          key={course.slug}
          className="shelf-caption"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          <p className="shelf-kicker">
            0{active! + 1} · {course.category}
            {active === 0 && <em> · Our flagship program</em>}
          </p>
          <h3>{course.title}</h3>
          <p>{course.description}</p>
          <div className="shelf-chips">
            {course.technologies.slice(0, 4).map((x) => (
              <span key={x}>{x}</span>
            ))}
          </div>
          <div className="shelf-actions">
            <button type="button" className="button" onClick={() => setOpen(active)}>
              <BookOpen size={16} /> Open the book
            </button>
            <Link className="text-link" to={`/courses/${course.slug}`} onClick={() => track("course_cta_click", { course: course.slug })}>
              Explore program <ArrowUpRight size={16} />
            </Link>
          </div>
        </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {open !== null && <Reader course={courses[open]} index={open} onClose={closeBook} />}
      </AnimatePresence>
    </div>
  );
}
