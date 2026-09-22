import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
const id = import.meta.env.VITE_GA_ID as string | undefined;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
export default function Analytics() {
  const [choice, setChoice] = useState<string | null>(() => {
    try {
      return localStorage.getItem("cloudbyte-analytics");
    } catch {
      return "no";
    }
  });
  const { pathname } = useLocation();
  useEffect(() => {
    if (!id || choice !== "yes") return;
    if (!document.getElementById("ga-script")) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer!.push(arguments);
      };
      window.gtag("js", new Date());
      window.gtag("config", id, { send_page_view: false });
      const script = document.createElement("script");
      script.id = "ga-script";
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
      script.async = true;
      document.head.appendChild(script);
    }
    window.gtag?.("event", "page_view", { page_path: pathname });
  }, [choice, pathname]);
  function select(value: string) {
    setChoice(value);
    try {
      localStorage.setItem("cloudbyte-analytics", value);
    } catch {}
  }
  if (!id || choice) return null;
  return (
    <aside className="cookie-note" aria-label="Analytics preferences">
      <p>
        Allow optional analytics to help us understand how this site is used?
        Your choice does not affect course access.
      </p>
      <button onClick={() => select("yes")}>Accept</button>
      <button onClick={() => select("no")}>Decline</button>
    </aside>
  );
}
