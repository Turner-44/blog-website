import test, { expect } from '@playwright/test';

test('View Blogs', async ({ page, baseURL }) => {
  await page.goto('/');
  await expect(
    await page.getByRole('heading', { name: "I'm Matthew Welcome to my" })
  ).toBeVisible();
});
