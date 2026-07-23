import { test, expect } from "@playwright/test";

test.describe("Portfolio E2E", () => {
  test("cover renders and opens the contents spread", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/James Duong/);
    await expect(
      page.getByRole("region", { name: /Portfolio magazine/i }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: /James Duong/i })).toBeVisible();

    await page.getByRole("button", { name: /Open the issue/i }).first().click();
    await expect(page.getByRole("heading", { name: /^About$/ })).toBeVisible();
    await expect(page).toHaveURL(/#contents/);
  });

  test("works index flips to an in-book case study", async ({ page }) => {
    await page.goto("/#works");
    await page.setViewportSize({ width: 1280, height: 800 });

    const indexRow = page
      .getByRole("button", { name: /Flip to case study/i })
      .first();
    await expect(indexRow).toBeVisible();
    await indexRow.click();

    await expect(page).toHaveURL(/#project-/);
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Previous page/i }).first(),
    ).toBeVisible();
  });

  test("invalid project slug renders Folio not-found page", async ({ page }) => {
    await page.goto("/projects/this-does-not-exist");
    await expect(
      page.getByRole("heading", { level: 1, name: /Page Not Found/i }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /Return Home/i })).toBeVisible();
  });

  test("legacy project route redirects into the book", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/projects/aztec-assess");
    await expect(page).toHaveURL(/#project-aztec-assess/);
    await expect(
      page.getByRole("heading", { name: /Aztec Assess/i }).first(),
    ).toBeVisible({ timeout: 15000 });
  });

  test("mobile stack shows about me and the contact form", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    await expect(page.getByRole("heading", { name: /^About$/ })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Send a message/i }),
    ).toBeVisible();

    await page.getByRole("button", { name: /Open the issue/i }).first().click();
    await expect(page).toHaveURL(/#contents/);
    await expect(page.getByRole("heading", { name: /^About$/ })).toBeInViewport();
  });

  test("flipping advances from works index into case studies", async ({ page }) => {
    await page.goto("/");
    await page.setViewportSize({ width: 1280, height: 800 });

    await page.getByRole("button", { name: /Open the issue/i }).first().click();
    await expect(page).toHaveURL(/#contents/);

    for (let i = 0; i < 16; i += 1) {
      const catalog = page.getByRole("button", {
        name: /Flip to case study/i,
      });
      if (await catalog.first().isVisible().catch(() => false)) break;
      await page
        .getByRole("button", { name: /Turn the page|Flip →/i })
        .first()
        .click();
      await page.waitForTimeout(1100);
    }

    await expect(
      page.getByRole("button", { name: /Flip to case study/i }).first(),
    ).toBeVisible();

    await page
      .getByRole("button", { name: /Flip → Case studies/i })
      .first()
      .click();
    await page.waitForTimeout(1100);

    await expect(page).toHaveURL(/#project-/);
    await expect(page.getByText(/CASE STUDY/i).first()).toBeVisible();
  });
});
