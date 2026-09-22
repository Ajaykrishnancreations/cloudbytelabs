import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Header, Footer } from "./components/Layout";
import Home from "./pages/Home";
import Analytics from "./components/Analytics";
import AgentTools from "./components/AgentTools";
import { site } from "./data/site";
const Pages = lazy(() => import("./pages/Pages"));
const Contact = lazy(() => import("./pages/Contact"));
const Chat = lazy(() => import("./components/Chat"));
export default function App() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    const name =
      location.pathname === "/"
        ? "Practical technology training"
        : location.pathname
            .split("/")
            .filter(Boolean)
            .at(-1)!
            .replaceAll("-", " ");
    document.title = `${name.charAt(0).toUpperCase() + name.slice(1)} | CloudByteLabs`;
    const description = `${name} at CloudByteLabs. Practical Salesforce, MERN Stack, UI/UX and Python training, real projects, mentor guidance and career preparation.`;
    for (const [attr, key, value] of [
      ["name", "description", description],
      ["property", "og:title", document.title],
      ["property", "og:description", description],
      ["property", "og:url", `${site.url}${location.pathname}`],
      ["property", "og:type", "website"],
      ["name", "twitter:card", "summary"],
      ["name", "twitter:title", document.title],
      ["name", "twitter:description", description],
    ]) {
      let el = document.head.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", value);
    }
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `${site.url}${location.pathname}`);
  }, [location.pathname]);
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1}>
        <Suspense
          fallback={
            <div className="page-loading" role="status">
              Loading your learning path…
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Pages />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <Analytics />
      <AgentTools />
      <Suspense fallback={null}>
        <Chat />
      </Suspense>
    </>
  );
}
