import { test, expect } from "@playwright/test";

test.describe("Portfolio E2E", () => {
  test("cover renders and opens the contents spread", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/James Duong/);
    await expect(
      page.getByRole("region", { name: /Portfolio magazine/i }),
    ).toBeVisible();
    // Magazine cover headline.
    await expect(page.getByRole("heading", { name: /James Duong/i })).toBeVisible();

    await page.getByRole("button", { name: /Open the issue/i }).first().click();
    await expect(page.getByRole("heading", { name: /^About$/ })).toBeVisible();
    await expect(page).toHaveURL(/#contents/);
  });

  test("featured work pages open a case study", async ({ page }) => {
    await page.goto("/#featured");

    const caseStudyLink = page
      .getByRole("link", { name: /Read Case Study/i })
      .first();
    await expect(caseStudyLink).toBeVisible();
    await caseStudyLink.click();

    await expect(page).toHaveURL(/\/projects\/.+/);
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Flip back to work index/i }),
    ).toBeVisible();
  });

  test("invalid project slug renders Folio not-found page", async ({ page }) => {
    await page.goto("/projects/this-does-not-exist");
    await expect(
      page.getByRole("heading", { level: 1, name: /Page Not Found/i }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /Return Home/i })).toBeVisible();
  });

  test("mobile stack shows about me and the contact form", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    await expect(page.getByRole("heading", { name: /^About$/ })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Send a message/i }),
    ).toBeVisible();
  });

  test("all works item pages open case studies", async ({ page }) => {
    await page.goto("/#works");

    const indexLink = page
      .getByRole("link", { name: /Open case study/i })
      .first();
    await expect(indexLink).toBeVisible();
    await indexLink.click();
    await expect(page).toHaveURL(/\/projects\/.+/);
  });

  test("flipping advances through continuous item pages", async ({ page }) => {
    await page.goto("/");
    await page.setViewportSize({ width: 1280, height: 800 });

    await page.getByRole("button", { name: /Open the issue/i }).first().click();
    await expect(page).toHaveURL(/#contents/);

    // From contents/about, keep flipping until a featured project leaf appears.
    for (let i = 0; i < 12; i += 1) {
      const caseStudy = page.getByRole("link", { name: /Read Case Study/i });
      if (await caseStudy.first().isVisible().catch(() => false)) break;
      await page.getByRole("button", { name: /Turn the page|Flip →/i }).first().click();
      await page.waitForTimeout(1100);
    }

    await expect(
      page.getByRole("link", { name: /Read Case Study/i }).first(),
    ).toBeVisible();
  });
});
