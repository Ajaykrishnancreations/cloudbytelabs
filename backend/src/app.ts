import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { randomUUID } from "node:crypto";
import { mkdir, appendFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { MongoClient } from "mongodb";
import nodemailer from "nodemailer";
import { leadSchema, chatSchema, type Lead } from "../../shared/validation";
import courses from "../../shared/courses.json";
import faqs from "../../shared/faqs.json";
import { chatReply } from "./chat";
export const app = express();
app.disable("x-powered-by");
if (process.env.TRUST_PROXY === "1") app.set("trust proxy", 1);
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://www.googletagmanager.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https://www.google-analytics.com"],
        connectSrc: [
          "'self'",
          "https://www.google-analytics.com",
          "https://*.google-analytics.com",
          "https://www.googletagmanager.com",
        ],
        objectSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }),
);
const allowed = new Set([
  process.env.SITE_URL || "http://localhost:5173",
  "http://127.0.0.1:5173",
]);
app.use(
  cors({
    origin(origin, cb) {
      cb(null, !origin || allowed.has(origin));
    },
  }),
);
app.use("/api", (req, res, next) => {
  if (
    req.method === "POST" &&
    req.headers.origin &&
    !allowed.has(req.headers.origin)
  ) {
    res.status(403).json({ error: "Origin not allowed" });
    return;
  }
  next();
});
app.use(express.json({ limit: "24kb" }));
app.use(
  "/api",
  rateLimit({
    windowMs: 60000,
    limit: 60,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { error: "Too many requests. Please try again shortly." },
  }),
);
app.get("/api/health", (_req, res) =>
  res.json({
    status: "ok",
    storage: process.env.MONGODB_URI ? "mongodb" : "local",
    chat:
      process.env.AI_API_KEY && process.env.AI_MODEL ? "ai" : "course-guide",
  }),
);
app.get("/api/faqs", (_req, res) => res.json(faqs));
app.get("/api/trainers", (_req, res) => res.json([]));
app.get("/api/testimonials", (_req, res) => res.json([]));
app.get("/api/courses", (_req, res) => res.json(courses));
app.get("/api/courses/:slug", (req, res) => {
  const course = courses.find((c) => c.slug === req.params.slug);
  if (!course) {
    res.status(404).json({ error: "Course not found" });
    return;
  }
  res.json(course);
});
let mongo: Promise<MongoClient> | undefined;
export async function saveLead(lead: Lead) {
  const record = {
    ...lead,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };
  delete (record as Partial<Lead>).website;
  if (process.env.MONGODB_URI) {
    mongo ??= new MongoClient(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 7000,
    }).connect();
    const client = await mongo;
    await client
      .db(process.env.MONGODB_DATABASE || "cloudbytelabs")
      .collection("leads")
      .insertOne(record);
  } else {
    const directory =
      process.env.DATA_DIR ||
      fileURLToPath(new URL("../data/", import.meta.url));
    await mkdir(directory, { recursive: true, mode: 0o700 });
    await appendFile(
      `${directory}/leads.jsonl`,
      `${JSON.stringify(record)}\n`,
      { mode: 0o600 },
    );
  }
  return record;
}
async function notifyLead(lead: Lead) {
  if (
    !process.env.SMTP_HOST ||
    !process.env.LEAD_NOTIFY_EMAIL ||
    !process.env.SMTP_FROM
  )
    return;
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_PORT === "465",
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
    connectionTimeout: 8000,
  });
  await transport.sendMail({
    from: process.env.SMTP_FROM,
    to: process.env.LEAD_NOTIFY_EMAIL,
    replyTo: lead.email,
    subject: `CloudByteLabs enquiry: ${lead.course}`,
    text: JSON.stringify(lead, null, 2),
  });
}
const leadLimiter = rateLimit({
  windowMs: 15 * 60000,
  limit: 8,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many enquiries. Please call or WhatsApp our team." },
});
app.post(["/api/contact", "/api/leads"], leadLimiter, async (req, res) => {
  const parsed = leadSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({
        error: "Please check the form fields and your consent.",
        fields: parsed.error.flatten().fieldErrors,
      });
    return;
  }
  try {
    const record = await saveLead(parsed.data);
    res.status(201).json({ success: true, id: record.id });
    void notifyLead(parsed.data).catch(() =>
      console.error("Enquiry saved; email notification failed."),
    );
  } catch {
    res
      .status(503)
      .json({
        error:
          "We could not save your enquiry. Please try again or call our team.",
      });
  }
});
app.post(
  "/api/chat",
  rateLimit({
    windowMs: 60000,
    limit: 15,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { error: "Please wait a minute before sending more messages." },
  }),
  async (req, res) => {
    const parsed = chatSchema.safeParse(req.body);
    if (!parsed.success) {
      res
        .status(400)
        .json({
          error:
            "Please send a message of 1–1500 characters in a supported language.",
        });
      return;
    }
    try {
      res.json(await chatReply(parsed.data));
    } catch {
      res
        .status(503)
        .json({
          error:
            "The assistant is unavailable. Please call or WhatsApp our team.",
        });
    }
  },
);
app.use("/api", (_req, res) =>
  res.status(404).json({ error: "API route not found" }),
);
const dist = fileURLToPath(new URL("../../frontend/dist/", import.meta.url));
if (existsSync(`${dist}/index.html`)) {
  app.use(
    express.static(dist, { index: false, redirect: false, maxAge: "1h" }),
  );
  app.get("/{*path}", (req, res) => {
    const target = resolve(dist, `.${req.path}`, "index.html");
    if (target.startsWith(dist) && existsSync(target)) {
      res.sendFile(target);
      return;
    }
    res.status(404).sendFile(`${dist}/index.html`);
  });
}
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    const status =
      "status" in err && typeof err.status === "number" ? err.status : 500;
    res
      .status(status >= 400 && status < 600 ? status : 500)
      .json({
        error:
          status === 413
            ? "Request too large."
            : status === 400
              ? "Invalid JSON request."
              : "An unexpected error occurred.",
      });
  },
);
