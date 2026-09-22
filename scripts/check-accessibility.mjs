import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
});
const page = await context.newPage();
for (const route of ["/", "/contact", "/courses/salesforce"]) {
  await page.goto("http://127.0.0.1:5173" + route);
  await page.waitForSelector("h1");
  await page.waitForTimeout(600);
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  console.log(
    JSON.stringify({
      route,
      violations: results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        nodes: v.nodes
          .slice(0, 8)
          .map((n) => ({ target: n.target, summary: n.failureSummary })),
      })),
    }),
  );
}
await browser.close();
