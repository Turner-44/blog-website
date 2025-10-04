import { test, expect } from '@playwright/test';
import { createBlogDataUI, resolveFromRoot } from './data/create-blog';

test.use({ storageState: 'tests/.auth/cookies.json' });

test.describe.serial('Create and delete blog', () => {
  const blogData = createBlogDataUI();

  test('Create Blog', async ({ page }) => {
    await page.goto('/admin');

    await expect(
      await page.getByTestId('banner-environment-notification')
    ).toContainText('YOU ARE USING TEST VARIABLES.');

    await page.getByTestId('btn-admin-create-blog').click();

    await page.getByTestId('input-blog-title').fill(blogData.title);
    await page.getByTestId('input-blog-slug').fill(blogData.slug);
    await page.getByTestId('input-blog-summary').fill(blogData.summary);
    await page.getByTestId('input-blog-markdown').fill(blogData.markdown);

    await page
      .getByTestId('input-blog-feature-image')
      .setInputFiles(
        resolveFromRoot('tests/data/' + blogData.featureImagePath)
      );

    await page.getByTestId('input-blog-tags').fill(blogData.tags.join(','));

    await page.getByTestId('btn-blog-publish').click();

    await expect(
      await page.getByText('Blog submitted successfully!')
    ).toBeVisible();
  });

  test('View Blog', async ({ page }) => {
    await expect(async () => {
      await page.goto(`/blog/${blogData.slug}`);

      await expect(page.getByTestId('header-blog-title')).toContainText(
        blogData.title
      );
    }).toPass();

    await expect(page.getByTestId('img-blog-feature')).toHaveAttribute(
      'alt',
      blogData.title
    );
  });

  test('Delete Blog', async ({ page }) => {
    page.on('dialog', (dialog) => dialog.accept());

    await page.goto('/admin');

    await expect(
      await page.getByTestId('banner-environment-notification')
    ).toContainText('YOU ARE USING TEST VARIABLES.');

    await page.getByTestId('btn-admin-delete-blog').click();

    await expect(
      await page.getByTestId(`row-blog-deletion-grid-${blogData.slug}`)
    ).toBeVisible();

    await expect(
      await page.getByTestId(`header-blog-deletion-row-title-${blogData.slug}`)
    ).toContainText(blogData.title);

    await expect(
      await page.getByTestId(`text-blog-deletion-row-summary-${blogData.slug}`)
    ).toContainText(blogData.summary);

    await page
      .getByTestId(`btn-blog-deletion-row-delete-${blogData.slug}`)
      .click();

    await expect(
      await page.getByTestId(`row-blog-deletion-grid-${blogData.slug}`)
    ).toHaveCount(0);
  });
});
