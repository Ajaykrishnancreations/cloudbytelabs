import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  Globe2,
  Phone,
  ArrowUpRight,
  MessageCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { languages } from "../../../shared/config";
import { courses, site, track } from "../data/site";
import { courseIcons } from "./UI";
import ThemeToggle from "./ThemeToggle";
export function Logo() {
  return (
    <Link className="logo" to="/" aria-label="CloudLight Solutions home">
      <span className="logo-mark">
        <img
          src="/brand/cloudlight-mark-128.webp"
          alt=""
          width="128"
          height="87"
        />
        <i className="logo-spark" aria-hidden="true" />
      </span>
      <span className="logo-word">
        <span>
          Cloud<span className="logo-light">Light</span>
        </span>
        <small>Solutions</small>
      </span>
    </Link>
  );
}
const nav = [
  ["/", "home"],
  ["/courses", "courses"],
  ["/how-we-teach", "teaching"],
  ["/projects", "projects"],
  ["/career-support", "career"],
  ["/about", "about"],
] as const;
export function Header() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    setOpen(false);
    setMega(false);
  }, [location.pathname]);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", f);
    return () => window.removeEventListener("scroll", f);
  }, []);
  useEffect(() => {
    if (!open) return;
    const prior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    menuRef.current?.querySelector<HTMLElement>("a,button")?.focus();
    function key(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === "Tab") {
        const nodes =
          menuRef.current?.querySelectorAll<HTMLElement>("a,button,select");
        if (!nodes?.length) return;
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    window.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = prior;
      window.removeEventListener("keydown", key);
    };
  }, [open]);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className={`header ${scrolled ? "scrolled" : ""}`}>
        <div className="header-inner">
          <Logo />
          <nav aria-label="Main navigation" className="desktop-nav">
            {nav.map(([path, label]) =>
              label === "courses" ? (
                <div
                  className="course-nav"
                  key={path}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setMega(false);
                  }}
                >
                  <div>
                    <NavLink to={path}>
                      {({ isActive }) => (
                        <>
                          {t(label)}
                          {isActive && <motion.span layoutId="nav-indicator" className="nav-indicator" />}
                        </>
                      )}
                    </NavLink>
                    <button
                      aria-label="Open course menu"
                      aria-expanded={mega}
                      onClick={() => setMega(!mega)}
                    >
                      <ChevronDown size={12} />
                    </button>
                  </div>
                  {mega && (
                    <>
                      <button
                        className="menu-dismiss"
                        aria-label="Close course menu"
                        onClick={() => setMega(false)}
                      />
                      <div className="mega-menu">
                        {courses.map((c, i) => {
                          const Icon = courseIcons[i];
                          return (
                            <Link to={`/courses/${c.slug}`} key={c.slug}>
                              <Icon />
                              <span>
                                <strong>{c.title}</strong>
                                <small>{c.technologies.join(" · ")}</small>
                              </span>
                              <ArrowUpRight size={16} />
                            </Link>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <NavLink key={path} end={path === "/"} to={path}>
                  {({ isActive }) => (
                    <>
                      {t(label)}
                      {isActive && <motion.span layoutId="nav-indicator" className="nav-indicator" />}
                    </>
                  )}
                </NavLink>
              ),
            )}
          </nav>
          <div className="header-actions">
            <ThemeToggle />
            <label className="language-picker">
              <Globe2 size={15} />
              <select
                aria-label="Language"
                value={i18n.language}
                onChange={(e) => {
                  i18n.changeLanguage(e.target.value);
                  track("language_change", { language: e.target.value });
                }}
              >
                {languages.map((l) => (
                  <option value={l.code} key={l.code}>
                    {l.code === "en" ? "EN" : l.label}
                  </option>
                ))}
              </select>
            </label>
            <Link className="header-cta" to="/contact">
              {t("mentor")}
              <ArrowUpRight size={15} />
            </Link>
            <button
              ref={toggleRef}
              className="mobile-toggle icon-button"
              aria-label="Open navigation"
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              <Menu />
            </button>
          </div>
        </div>
      </header>
      {open && (
        <div
          className="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
          ref={menuRef}
        >
          <div className="mobile-menu-heading">
            <Logo />
            <button
              className="icon-button"
              onClick={() => {
                setOpen(false);
                toggleRef.current?.focus();
              }}
              aria-label={t("close")}
            >
              <X />
            </button>
          </div>
          <nav>
            {nav.map(([path, label]) => (
              <NavLink key={path} to={path}>
                {t(label)}
                <ArrowUpRight size={20} />
              </NavLink>
            ))}
            <NavLink to="/contact">{t("contact")}</NavLink>
          </nav>
          <Link className="button" to="/courses">
            {t("explore")}
          </Link>
          <a
            className="button secondary"
            href={site.whatsapp}
            target="_blank"
            rel="noreferrer"
          >
            {t("whatsapp")}
            <MessageCircle size={18} />
          </a>
          <a className="button secondary" href={`tel:${site.phone}`}>
            {t("call")}
            <Phone size={18} />
          </a>
        </div>
      )}
    </>
  );
}
export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Logo />
          <p>{t("footer")}</p>
          <span>{t("follow")}</span>
        </div>
        <div>
          <h3>{t("courses")}</h3>
          {courses.map((c) => (
            <Link key={c.slug} to={`/courses/${c.slug}`}>
              {c.title}
            </Link>
          ))}
        </div>
        <div>
          <h3>{t("company")}</h3>
          {[
            ["about", "about"],
            ["trainers", "trainers"],
            ["projects", "projects"],
            ["career-support", "career"],
            ["testimonials", "testimonials"],
          ].map(([path, k]) => (
            <Link key={path} to={`/${path}`}>
              {t(k)}
            </Link>
          ))}
        </div>
        <div>
          <h3>{t("support")}</h3>
          {[
            ["faq", "faq"],
            ["contact", "contact"],
            ["privacy", "privacy"],
            ["terms", "terms"],
          ].map(([path, k]) => (
            <Link key={path} to={`/${path}`}>
              {t(k)}
            </Link>
          ))}
        </div>
        <div>
          <h3>{t("contact")}</h3>
          <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a>
          <a href={site.whatsapp} target="_blank" rel="noreferrer">
            {t("whatsapp")} ↗
          </a>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          {site.demoContact && <small>{t("demo")}</small>}
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} CloudLight Solutions. All rights reserved.
        </span>
        <span className="footer-motto">People · Technology · Growth together</span>
      </div>
    </footer>
  );
}
