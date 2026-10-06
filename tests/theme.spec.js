import { test, expect } from '@playwright/test';

test.describe('Theme Toggle', () => {
  test('should toggle dark mode on click', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const html = page.locator('html');
    const toggle = page.locator('#darkToggle');

    // Initial state should not have dark-mode class
    await expect(html).not.toHaveClass(/dark-mode/);

    // Click to enable dark mode
    await toggle.click();
    await expect(html).toHaveClass(/dark-mode/);

    // Click again to disable dark mode
    await toggle.click();
    await expect(html).not.toHaveClass(/dark-mode/);
  });

  test('should persist theme in localStorage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const toggle = page.locator('#darkToggle');

    // Enable dark mode
    await toggle.click();

    // Check localStorage
    const theme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(theme).toBe('dark');

    // Reload and verify persistence
    await page.reload();
    await page.waitForLoadState('networkidle');

    const html = page.locator('html');
    await expect(html).toHaveClass(/dark-mode/);
  });

  test('should respect prefers-color-scheme on first visit', async ({ page }) => {
    // Set dark mode preference
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const html = page.locator('html');
    await expect(html).toHaveClass(/dark-mode/);
  });

  test('should have aria-pressed on toggle', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const toggle = page.locator('#darkToggle');
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  });

  test('should take screenshot in light mode', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'tests/screenshots/light-mode.png', fullPage: true });
  });

  test('should take screenshot in dark mode', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.locator('#darkToggle').click();
    await page.screenshot({ path: 'tests/screenshots/dark-mode.png', fullPage: true });
  });
});
