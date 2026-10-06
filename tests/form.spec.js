import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
  test('should show error for empty fields', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.locator('#submitBtn').click();

    const message = page.locator('#formMessage');
    await expect(message).toBeVisible();
  });

  test('should show error for invalid email', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.locator('#nombre').fill('Test User');
    await page.locator('#email').fill('invalid-email');
    await page.locator('#mensaje').fill('This is a test message');

    await page.locator('#submitBtn').click();

    const message = page.locator('#formMessage');
    await expect(message).toBeVisible();
  });

  test('should show error for short message', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.locator('#nombre').fill('Test User');
    await page.locator('#email').fill('test@example.com');
    await page.locator('#mensaje').fill('Short');

    await page.locator('#submitBtn').click();

    const message = page.locator('#formMessage');
    await expect(message).toBeVisible();
  });

  test('should have honeypot field', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const honeypot = page.locator('#honeypot');
    await expect(honeypot).toBeAttached();
    await expect(honeypot).toHaveAttribute('aria-hidden', 'true');
  });

  test('should have proper input types', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const emailInput = page.locator('#email');
    await expect(emailInput).toHaveAttribute('type', 'email');
  });
});
