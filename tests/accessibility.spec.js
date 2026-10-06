import { test, expect } from '@playwright/test';
import AxeBuilder from 'axe-playwright';

test.describe('Accessibility (axe-core)', () => {
  test('should not have any automatically detectable accessibility violations', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper heading structure', async ({ page }) => {
    await page.goto('/');
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toContainText('Ali Valentin Tovar Morales');
  });

  test('should have skip link', async ({ page }) => {
    await page.goto('/');
    const skipLink = page.locator('.skip-link');
    await expect(skipLink).toHaveAttribute('href', '#about');
  });

  test('should have proper form labels', async ({ page }) => {
    await page.goto('/');
    const nameInput = page.locator('#nombre');
    const emailInput = page.locator('#email');
    const messageInput = page.locator('#mensaje');

    await expect(nameInput).toHaveAttribute('required');
    await expect(emailInput).toHaveAttribute('required');
    await expect(messageInput).toHaveAttribute('required');
  });

  test('should have honeypot field hidden', async ({ page }) => {
    await page.goto('/');
    const honeypot = page.locator('#honeypot');
    await expect(honeypot).toHaveAttribute('aria-hidden', 'true');
  });
});
