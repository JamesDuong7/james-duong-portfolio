import { test, expect } from '@playwright/test';

test.describe('Portfolio E2E', () => {
  test('homepage renders correctly and nav works', async ({ page }) => {
    await page.goto('/');
    
    // Verify title
    await expect(page).toHaveTitle(/James Duong/);
    
    // Verify Hero
    await expect(page.getByRole('heading', { name: /James Duong/i })).toBeVisible();
  });

  test('featured project cards link to valid project pages', async ({ page }) => {
    await page.goto('/');
    
    // Find first case study link
    const caseStudyLink = page.getByRole('link', { name: /Read Case Study/i }).first();
    await expect(caseStudyLink).toBeVisible();
    
    // Check navigation
    await caseStudyLink.click();
    
    // Should be on a project page (URL contains /projects/)
    await expect(page).toHaveURL(/\/projects\/.+/);
    
    // Expect project heading
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('invalid project slug renders not-found page', async ({ page }) => {
    await page.goto('/projects/this-does-not-exist');
    await expect(page.getByRole('heading', { level: 1, name: /Page Not Found/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Return Home/i })).toBeVisible();
  });

  test('folio flip affordance moves to work spread', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: /Flip page → Work/i }).click();
    await expect(page.getByRole('heading', { name: /Aztec Assess|Featured|Projects coming soon/i }).first()).toBeVisible();
  });

  test('mobile stack shows about and contact sections', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /About/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Say hello/i })).toBeVisible();
  });
});
