import { test, expect } from '@playwright/test';

test.describe('Feature: Home Page', () => {
  test.describe('Background: User navigates to the application', () => {
    test('Scenario: When user visits home page, Then the application loads successfully', async ({
      page,
    }) => {
      await test.step('Given the application is running', async () => {
        // Setup is handled by Playwright
      });

      await test.step('When the user navigates to the home page', async () => {
        await page.goto('/');
      });

      await test.step('Then the page title should contain "SprintPokerApp"', async () => {
        await expect(page).toHaveTitle(/SprintPokerApp/);
      });

      await test.step('And the app root component should be visible', async () => {
        await expect(page.locator('app-root')).toBeVisible();
      });
    });
  });
});
