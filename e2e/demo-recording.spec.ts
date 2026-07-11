import { test, expect } from "@playwright/test";
import path from "node:path";

/**
 * Records a short Folio walkthrough video under test-results/demo/.
 * Run: npx playwright test e2e/demo-recording.spec.ts --project=chromium
 */
test.use({
  video: {
    mode: "on",
    size: { width: 1280, height: 720 },
  },
  viewport: { width: 1280, height: 720 },
});

test.describe("Folio demo recording", () => {
  test("walk through spreads and a case study", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /James Duong/i })).toBeVisible();
    await page.waitForTimeout(1200);

    await page.getByRole("button", { name: /Flip page → Work/i }).click();
    await expect(page).toHaveURL(/#work/);
    await page.waitForTimeout(1200);

    const caseStudy = page.getByRole("link", { name: /Read Case Study/i }).first();
    await expect(caseStudy).toBeVisible();
    await caseStudy.click();
    await expect(page).toHaveURL(/\/projects\/.+/);
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
    await page.waitForTimeout(1500);

    await page.getByRole("link", { name: /Flip back to work index/i }).click();
    await expect(page).toHaveURL(/\/?#work/);
    await page.waitForTimeout(1000);

    // Keep a stable copy path note in the report
    test.info().annotations.push({
      type: "demo",
      description: path.join("test-results", "demo video is attached to this test"),
    });
  });
});
