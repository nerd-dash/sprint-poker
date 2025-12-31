import { test, expect } from '@playwright/test';

test('home page loads and shows app root', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/SprintPokerApp/);
  await expect(page.locator('app-root')).toBeVisible();
});
