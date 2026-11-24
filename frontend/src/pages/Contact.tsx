import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useSearchParams } from "react-router-dom";
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  CheckCircle,
  ArrowUpRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Backdrop3D } from "../three/Scenes";
import { Bot3D } from "../components/FloatingActions";
import { leadSchema, type Lead } from "../../../shared/validation";
import { courses, site, track } from "../data/site";
import { z } from "zod";
export default function Contact() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const selected = params.get("course");
  const [done, setDone] = useState(false);
  const [failure, setFailure] = useState("");
  const [started, setStarted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<z.input<typeof leadSchema>, unknown, Lead>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      course: courses.some((c) => c.slug === selected)
        ? (selected as Lead["course"])
        : "not-sure",
      profileType: "student",
      preferredTime: "flexibleTime",
      source: params.get("source") || selected || "contact",
      message: "",
      website: "",
      consent: false,
    },
  });
  async function submit(data: Lead) {
    setFailure("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(15000),
      });
      const body = await res.json();
      if (!res.ok)
        throw new Error(
          body.error || "We could not save your request. Please try again.",
        );
      setDone(true);
      track("contact_form_submit", { course: data.course });
    } catch (e) {
      setFailure(
        e instanceof Error
          ? e.message
          : "Please try again or contact us directly.",
      );
    }
  }
  return (
    <div className="page-enter">
      <section className="page-hero">
        <Backdrop3D variant="mentor" />
        <div className="container">
          <p className="eyebrow">{t("contact")}</p>
          <h1>{t("contactTitle")}</h1>
          <p>{t("contactDescription")}</p>
        </div>
      </section>
      <section className="section container contact-layout">
        {done ? (
          <div className="success-panel" role="status">
            <CheckCircle size={40} />
            <h2>{t("formSuccess")}</h2>
            <p>{t("fees")}</p>
            <button
              className="button"
              onClick={() => {
                setDone(false);
                reset();
              }}
            >
              Send another enquiry
            </button>
          </div>
        ) : (
          <form
            className="contact-form"
            onSubmit={handleSubmit(submit)}
            onFocus={() => {
              if (!started) {
                track("contact_form_start");
                setStarted(true);
              }
            }}
            noValidate
          >
            {(["name", "email", "phone"] as const).map((key) => (
              <div className="field" key={key}>
                <label htmlFor={key}>{t(key)} *</label>
                <input
                  id={key}
                  type={
                    key === "email" ? "email" : key === "phone" ? "tel" : "text"
                  }
                  autoComplete={
                    key === "name" ? "name" : key === "phone" ? "tel" : "email"
                  }
                  {...register(key)}
                  aria-invalid={!!errors[key]}
                  aria-describedby={errors[key] ? `${key}-error` : undefined}
                />
                {errors[key] && (
                  <span role="alert" id={`${key}-error`} className="error-text">
                    {errors[key]?.message}
                  </span>
                )}
              </div>
            ))}
            <div className="field">
              <label htmlFor="course">{t("course")}</label>
              <select id="course" {...register("course")}>
                <option value="not-sure">{t("notSure")}</option>
                {courses.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="status">{t("status")}</label>
              <select id="status" {...register("profileType")}>
                {[
                  "student",
                  "graduate",
                  "professional",
                  "switcher",
                  "other",
                ].map((k) => (
                  <option key={k} value={k}>
                    {t(k)}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="timing">{t("timing")}</label>
              <select id="timing" {...register("preferredTime")}>
                {["morning", "evening", "weekend", "flexibleTime"].map((k) => (
                  <option key={k} value={k}>
                    {t(k)}
                  </option>
                ))}
              </select>
            </div>
            <div className="field full-width">
              <label htmlFor="message">{t("message")}</label>
              <textarea
                id="message"
                {...register("message")}
                maxLength={3000}
              />
              {errors.message && (
                <span className="error-text">{errors.message.message}</span>
              )}
            </div>
            <div
              style={{ position: "absolute", left: "-10000px" }}
              aria-hidden="true"
            >
              <label htmlFor="website">Leave this empty</label>
              <input
                id="website"
                tabIndex={-1}
                autoComplete="off"
                {...register("website")}
              />
            </div>
            <div className="full-width">
              <label className="consent">
                <input type="checkbox" {...register("consent")} />
                <span>
                  {t("consent")} <Link to="/privacy">{t("privacy")}</Link>
                </span>
              </label>
              {errors.consent && (
                <span className="error-text" role="alert">
                  {errors.consent.message}
                </span>
              )}
            </div>
            {failure && (
              <p className="error-text full-width" role="alert">
                {failure}
              </p>
            )}
            <button
              className="button full-width"
              disabled={isSubmitting}
              type="submit"
            >
              {t(isSubmitting ? "sending" : "send")}
              <ArrowUpRight size={18} />
            </button>
          </form>
        )}
        <aside className="contact-info">
          <div className="mentor-3d" aria-hidden="true">
            <Bot3D wave size={3} />
          </div>
          <h2>{t("mentor")}</h2>
          <div className="contact-method">
            <Phone />
            <div>
              <strong>{t("call")}</strong>
              <a href={`tel:${site.phone}`} onClick={() => track("call_click")}>
                {site.phoneDisplay}
              </a>
            </div>
          </div>
          <div className="contact-method">
            <MessageCircle />
            <div>
              <strong>{t("whatsapp")}</strong>
              <a
                href={site.whatsapp}
                onClick={() => track("whatsapp_click")}
                target="_blank"
                rel="noreferrer"
              >
                {site.phoneDisplay} ↗
              </a>
            </div>
          </div>
          <div className="contact-method">
            <Mail />
            <div>
              <strong>{t("email")}</strong>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </div>
          </div>
          <div className="contact-method">
            <MapPin />
            <div>
              <strong>Learning, wherever you are.</strong>
              <span>{site.address}</span>
            </div>
          </div>
          {site.demoContact && (
            <p className="notice">
              {t("demo")} The phone and WhatsApp number are supplied by
              CloudLight Solutions.
            </p>
          )}
          <p className="notice">{t("fees")}</p>
        </aside>
      </section>
    </div>
  );
}
