import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
});
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle" });
await page.screenshot({ path: "/tmp/cloudbyte-desktop.png", fullPage: false });
const routes = [
  "/",
  "/courses",
  "/courses/salesforce",
  "/courses/mern-stack",
  "/courses/ui-ux",
  "/courses/python",
  "/about",
  "/how-we-teach",
  "/trainers",
  "/projects",
  "/career-support",
  "/testimonials",
  "/contact",
  "/faq",
  "/privacy",
  "/terms",
  "/missing",
];
for (const route of routes) {
  await page.goto("http://127.0.0.1:5173" + route);
  await page.waitForSelector("h1");
  const h1 = await page.locator("h1").innerText();
  console.log(route, h1.slice(0, 70));
}
for (const width of [320, 360, 375, 390, 412, 430, 768, 1024, 1440]) {
  await page.setViewportSize({ width, height: 900 });
  for (const route of ["/", "/courses/salesforce", "/contact", "/projects"]) {
    await page.goto("http://127.0.0.1:5173" + route);
    await page.waitForSelector("h1");
    const over = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    }));
    if (over.scroll > over.client + 1)
      errors.push(`Overflow at ${width} ${route}: ${over.scroll}`);
  }
}
await page.setViewportSize({ width: 390, height: 844 });
await page.goto("http://127.0.0.1:5173/");
await page.waitForTimeout(400);
await page.screenshot({ path: "/tmp/cloudbyte-mobile.png" });
await page.getByRole("button", { name: "Open navigation" }).click();
await page
  .getByRole("dialog", { name: "Navigation" })
  .getByRole("link", { name: "Courses", exact: true })
  .click();
await page.waitForURL("**/courses");
await page.getByLabel("Language", { exact: true }).selectOption("ta");
await page.reload();
if ((await page.locator("html").getAttribute("lang")) !== "ta")
  errors.push("language persistence failed");
await page.getByLabel("Language", { exact: true }).selectOption("en");
await page.getByRole("button", { name: "Chat with us" }).click();
await page.getByRole("button", { name: "Salesforce", exact: true }).click();
await page.waitForFunction(
  () => document.querySelector(".chat-messages")?.textContent?.includes("Apex"),
  { timeout: 15000 },
);
await page.getByRole("button", { name: "Close", exact: true }).click();
await page.goto("http://127.0.0.1:5173/contact?course=python");
await page
  .getByRole("button", { name: "Request a callback", exact: true })
  .click();
if ((await page.locator(".error-text").count()) < 3)
  errors.push("required validation missing");
console.log(JSON.stringify({ errors }));
await browser.close();
if (errors.length) process.exitCode = 1;
