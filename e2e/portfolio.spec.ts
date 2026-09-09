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

    const projectHash = new URL(page.url()).hash;
    await page
      .locator(projectHash)
      .getByRole("button", { name: /Previous page/i })
      .click();
    await expect(page).toHaveURL(/#works$/);
    await expect(page.locator("#works-catalog")).toBeInViewport();
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

    await page.getByRole("button", { name: /Turn the page.*Works/i }).click();
    await expect(page).toHaveURL(/#works$/);
    await expect(page.locator("#works")).toBeInViewport();

    // The URL must remain stable after the old smooth-scroll duration; it
    // previously overshot into the first project while the page was moving.
    await page.waitForTimeout(1200);
    await expect(page).toHaveURL(/#works$/);
    await expect(page.locator("#works")).toBeInViewport();
  });

  test("mobile direct hashes land on the requested leaf", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    await page.goto("/#project-harbor-risk");
    await expect(page).toHaveURL(/#project-harbor-risk$/);
    await expect(page.locator("#project-harbor-risk")).toBeInViewport();

    await page.goto("/#contact");
    await expect(page).toHaveURL(/#contact$/);
    await expect(page.locator("#contact")).toBeInViewport();
  });

  test("desktop keyboard navigation and reduced motion stay functional", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    const magazine = page.getByRole("region", { name: /Portfolio magazine/i });
    await magazine.focus();
    await page.keyboard.press("ArrowRight");
    await expect(page).toHaveURL(/#contents$/);
    await page.waitForTimeout(1100);

    await page.emulateMedia({ reducedMotion: "reduce" });
    await magazine.focus();
    await page.keyboard.press("ArrowRight");
    await expect(page).toHaveURL(/#works$/);
    await expect(page.locator('[class*="flipStage"]')).toHaveCount(0);
  });

  test("cover promises only content that is available", async ({ page }) => {
    await page.goto("/");
    const hasHobbyPage = (await page.locator('[id^="hobby-"]').count()) > 0;

    await expect(
      page.getByText(hasHobbyPage ? "About & hobbies" : "About & skills", {
        exact: true,
      }),
    ).toBeVisible();
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
