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
    await expect(page.getByRole('heading', { level: 2, name: /Not Found|404/i })).toBeVisible();
  });
});
