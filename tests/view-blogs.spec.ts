import test, { expect } from '@playwright/test';

test('View Blogs', async ({ page }) => {
  await page.goto('/');
  await expect(
    await page.getByRole('heading', { name: 'This is TEST.' })
  ).toBeVisible();
});
