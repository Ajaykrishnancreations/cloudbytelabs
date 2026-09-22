import rawCourses from "../../../shared/courses.json";
export const courses = rawCourses;
const phone = import.meta.env.VITE_PHONE || "+916382124970";
export const site = {
  phone,
  phoneDisplay: phone === "+916382124970" ? "+91 63821 24970" : phone,
  email: import.meta.env.VITE_CONTACT_EMAIL || "hello@example.com",
  address:
    import.meta.env.VITE_CONTACT_ADDRESS ||
    "123 Example Street, Chennai, Tamil Nadu",
  demoContact:
    !import.meta.env.VITE_CONTACT_EMAIL ||
    import.meta.env.VITE_CONTACT_EMAIL.endsWith("@example.com"),
  url: import.meta.env.VITE_SITE_URL || "https://cloudbytelabs.com",
  whatsapp: `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent("Hi CloudByteLabs, I'm interested in learning more about your courses.")}`,
};
export { default as faqs } from "../../../shared/faqs.json";
export const learningSteps = [
  "Choose your goal",
  "Get your learning roadmap",
  "Join live training",
  "Practise every concept",
  "Build assignments",
  "Develop real projects",
  "Receive code reviews",
  "Prepare your portfolio",
  "Mock interviews",
  "Career support",
];
export function track(event: string, parameters: Record<string, string> = {}) {
  window.dispatchEvent(
    new CustomEvent("cloudbyte:analytics", {
      detail: { event, ...parameters },
    }),
  );
  const w = window as typeof window & { gtag?: (...args: unknown[]) => void };
  w.gtag?.("event", event, parameters);
}
