import test, { expect } from '@playwright/test';

test.describe('Smoke Test', { tag: '@smoke' }, () => {
  test('Check site is running', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('navigation-bar')).toContainText('Blog');
    await expect(page.getByTestId('navigation-bar')).toContainText('About');
    await expect(page.getByTestId('navigation-bar')).toContainText('Contact');

    await expect(
      page.getByTestId('banner-environment-notification')
    ).toHaveCount(0);
  });
  test('Check user cannot access admin', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.getByText('Sign in with Google')).toBeVisible();
  });
});
