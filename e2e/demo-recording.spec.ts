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
  test("walk through the magazine spreads and a case study", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /James Duong/i })).toBeVisible();
    await page.waitForTimeout(1200);

    await page.getByRole("button", { name: /Open the issue/i }).first().click();
    await expect(page).toHaveURL(/#contents/);
    await page.waitForTimeout(1200);

    await page.getByRole("button", { name: /Go to Works/i }).click();
    await expect(page).toHaveURL(/#works/);
    await page.waitForTimeout(1000);

    const caseStudy = page
      .getByRole("button", { name: /Flip to case study/i })
      .first();
    await expect(caseStudy).toBeVisible();
    await caseStudy.click();
    await expect(page).toHaveURL(/#project-/);
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
    await page.waitForTimeout(1500);

    await page.getByRole("button", { name: /Previous page/i }).first().click();
    await expect(page).toHaveURL(/\/?#works/);
    await page.waitForTimeout(1000);

    test.info().annotations.push({
      type: "demo",
      description: path.join("test-results", "demo video is attached to this test"),
    });
  });
});
