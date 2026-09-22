import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import "dotenv/config";
const courses = JSON.parse(await readFile("shared/courses.json", "utf8"));
const faqs = JSON.parse(await readFile("shared/faqs.json", "utf8"));
const origin = (
  process.env.VITE_SITE_URL || "https://cloudbytelabs.com"
).replace(/\/$/, "");
const routes = [
  [
    "/",
    "Practical technology training",
    "Learn Salesforce, MERN Stack, UI/UX and Python through practical training, real-world projects and industry mentorship.",
  ],
  [
    "/courses",
    "Technology courses",
    "Explore four practical learning paths: Salesforce, MERN Stack, UI/UX Design and Python.",
  ],
  ...courses.map((c) => [
    `/courses/${c.slug}`,
    `${c.title} training`,
    c.description,
  ]),
  [
    "/about",
    "About CloudByteLabs",
    "Practical technology training built around real industry experience.",
  ],
  [
    "/how-we-teach",
    "How we teach",
    "Live training, hands-on practice, code reviews, project development and mentor guidance.",
  ],
  [
    "/trainers",
    "Industry mentorship",
    "Explore CloudByteLabs mentorship in Salesforce, MERN, UI/UX and Python.",
  ],
  [
    "/projects",
    "Learn by building",
    "Explore the capstone projects in every CloudByteLabs technology learning path.",
  ],
  [
    "/career-support",
    "Career support",
    "Build your resume, portfolio and interview confidence with practical career guidance.",
  ],
  [
    "/testimonials",
    "Learner stories",
    "Discover our learning approach and upcoming verified learner stories.",
  ],
  [
    "/contact",
    "Contact CloudByteLabs",
    "Call +91 63821 24970 or request a callback to discuss your next learning step.",
  ],
  [
    "/faq",
    "Frequently asked questions",
    "Find answers about courses, eligibility, live classes, projects and career support.",
  ],
  [
    "/privacy",
    "Privacy",
    "How CloudByteLabs handles contact information, chat messages and optional analytics.",
  ],
  ["/terms", "Terms", "Website information and course enquiry terms."],
];
const escape = (s) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const template = await readFile("frontend/dist/index.html", "utf8");
for (const [path, name, description] of routes) {
  const title = `${name} | CloudByteLabs`;
  const graph = [
    {
      "@type": "Organization",
      "@id": `${origin}/#organization`,
      name: "CloudByteLabs",
      url: origin,
      telephone: process.env.VITE_PHONE || "+916382124970",
    },
  ];
  if (path !== "/")
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: origin },
        { "@type": "ListItem", position: 2, name, item: `${origin}${path}` },
      ],
    });
  const course = courses.find((c) => path === `/courses/${c.slug}`);
  if (course)
    graph.push({
      "@type": "Course",
      name: course.title,
      description: course.description,
      provider: { "@id": `${origin}/#organization` },
      url: `${origin}${path}`,
      syllabusSections: course.modules.map((m) => ({
        "@type": "Syllabus",
        name: m.title,
        description: m.topics.join(", "),
      })),
    });
  if (path === "/faq")
    graph.push({
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  const metadata = `<link rel="canonical" href="${origin}${path}"/><meta property="og:type" content="website"/><meta property="og:title" content="${escape(title)}"/><meta property="og:description" content="${escape(description)}"/><meta property="og:url" content="${origin}${path}"/><meta name="twitter:card" content="summary"/><meta name="twitter:title" content="${escape(title)}"/><meta name="twitter:description" content="${escape(description)}"/><script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c")}</script>`;
  const html = template
    .replace(/<title>.*?<\/title>/, `<title>${escape(title)}</title>`)
    .replace(
      /<meta name="description"[^>]*\/>/,
      `<meta name="description" content="${escape(description)}"/>`,
    )
    .replace("</head>", `${metadata}</head>`);
  const dir = path === "/" ? "frontend/dist" : join("frontend/dist", path);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, "index.html"), html);
}
await writeFile(
  "frontend/dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(([path]) => `<url><loc>${origin}${path}</loc></url>`).join("")}</urlset>`,
);
await writeFile(
  "frontend/dist/robots.txt",
  `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${origin}/sitemap.xml\n`,
);
console.log(`Generated SEO documents for ${routes.length} routes.`);
