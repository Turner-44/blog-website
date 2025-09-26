import { test, expect } from '@playwright/test';
import { createBlogData } from './data/create-blog';
import path from 'path';

test.describe.serial('Create and delete blog', () => {
  const blogData = createBlogData;

  test('Create Blog', async ({ page, browser }) => {
    await page.goto('/admin');

    await page.getByLabel('Username').fill('test');
    await page.getByRole('button', { name: 'Sign in with Test User' }).click();

    await expect(
      await page.getByTestId('banner-environment-notification')
    ).toContainText('YOU ARE USING TEST VARIABLES.');

    await page.goto('/admin');

    await page.getByTestId('btn-admin-create-blog').click();

    await page.getByTestId('input-blog-title').fill(blogData.title);
    await page.getByTestId('input-blog-slug').fill(blogData.slug);
    await page.getByTestId('input-blog-summary').fill(blogData.summary);
    await page.getByTestId('input-blog-markdown').fill(blogData.markdown);

    await page
      .getByTestId('input-blog-feature-image')
      .setInputFiles(path.join(__dirname, blogData.featureImagePath));

    await page.getByTestId('input-blog-tags').fill(blogData.tags.join(','));

    await page.getByTestId('btn-blog-publish').click();

    await expect(
      await page.getByText('Blog submitted successfully!')
    ).toBeVisible();
  });

  test('View Blog', async ({ page, browser }) => {
    await page.goto(`/blog/${blogData.slug}`);

    await expect(await page.getByTestId('header-blog-title')).toContainText(
      blogData.title
    );

    await expect(await page.getByTestId('img-blog-feature')).toHaveAttribute(
      'alt',
      blogData.title
    );
  });

  test('Delete Blog', async ({ page, browser }) => {
    page.on('dialog', (dialog) => dialog.accept());

    await page.goto('/admin');

    await page.getByLabel('Username').fill('test');
    await page.getByRole('button', { name: 'Sign in with Test User' }).click();

    await expect(
      await page.getByTestId('banner-environment-notification')
    ).toContainText('YOU ARE USING TEST VARIABLES.');

    await page.goto('/admin');

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
