import { test, expect } from "@playwright/test";

test.describe("Portfolio E2E", () => {
  test("homepage renders Folio identity spread", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/James Duong/);
    await expect(page.getByRole("region", { name: /Portfolio magazine/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /James Duong/i })).toBeVisible();
  });

  test("flip to work and open a case study", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: /Flip page → Work/i }).click();
    await expect(page).toHaveURL(/#work/);

    const caseStudyLink = page.getByRole("link", { name: /Read Case Study/i }).first();
    await expect(caseStudyLink).toBeVisible();
    await caseStudyLink.click();

    await expect(page).toHaveURL(/\/projects\/.+/);
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Flip back to work index/i })).toBeVisible();
  });

  test("invalid project slug renders Folio not-found page", async ({ page }) => {
    await page.goto("/projects/this-does-not-exist");
    await expect(page.getByRole("heading", { level: 1, name: /Page Not Found/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Return Home/i })).toBeVisible();
  });

  test("mobile stack shows about and contact sections", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    await expect(page.getByRole("heading", { name: /About/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Say hello/i })).toBeVisible();
  });

  test("work index rows open case studies", async ({ page }) => {
    await page.goto("/#work");

    const indexLink = page.getByRole("link", { name: /Open case study/i }).first();
    await expect(indexLink).toBeVisible();
    await indexLink.click();
    await expect(page).toHaveURL(/\/projects\/.+/);
  });
});
