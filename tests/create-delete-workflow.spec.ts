import { test, expect } from '@playwright/test';
import { createBlogPostDataUI } from './data/create-blog';
import { TEST_PATHS, resolveFromRoot } from '@/lib/utils/paths';
import path from 'path';

test.use({ storageState: 'tests/.auth/cookies.json' });

test.describe.serial(
  'Check blog creation and deletion user workflow',
  { tag: '@e2e' },
  () => {
    const blogPostData = createBlogPostDataUI();

    test('Create Blog', async ({ page }) => {
      await page.goto('/admin', { waitUntil: 'domcontentloaded' });

      await expect(
        page.getByTestId('banner-environment-notification')
      ).toContainText('YOU ARE USING TEST VARIABLES.');

      await page.getByTestId('btn-admin-create-blog').click();

      await expect(page.getByTestId('header-page-title')).toBeVisible();

      // Wait for form to be fully loaded and visible before filling inputs
      await expect(page.getByTestId('input-blog-title')).toBeVisible();
      await expect(page.getByTestId('input-blog-slug')).toBeVisible();

      await page.getByTestId('input-blog-title').fill(blogPostData.title);
      await page.getByTestId('input-blog-slug').fill(blogPostData.slug);
      await page.getByTestId('input-blog-summary').fill(blogPostData.summary);
      await page.getByTestId('input-blog-markdown').fill(blogPostData.markdown);

      await expect(async () => {
        await page
          .getByTestId('input-blog-feature-image')
          .setInputFiles(
            resolveFromRoot(
              path.join(
                TEST_PATHS.testsDataFeatureImages,
                blogPostData.featureImageFileName
              )
            )
          );

        await expect(
          page.getByText(`Feature Image: ${blogPostData.featureImageFileName}`)
        ).toHaveCount(1);

        await page
          .getByTestId('input-blog-preview-image')
          .setInputFiles(
            resolveFromRoot(
              path.join(
                TEST_PATHS.testsDataPreviewImages,
                blogPostData.previewImageFileName
              )
            )
          );

        await expect(
          page.getByText(`Preview Image: ${blogPostData.previewImageFileName}`)
        ).toHaveCount(1);
      }).toPass();

      await page
        .getByTestId('input-blog-tags')
        .fill(blogPostData.tags.join(','));

      await page.getByTestId('btn-blog-publish').click();

      await expect(page.getByTestId('form-success-message')).toContainText(
        'Blog submitted successfully!',
        { timeout: 30000 }
      );
    });

    test('View Blog', async ({ page }) => {
      await expect(async () => {
        await page.goto(`/blog/${blogPostData.slug}`, {
          waitUntil: 'domcontentloaded',
        });

        await expect(page.getByTestId('header-blog-title')).toContainText(
          blogPostData.title
        );
      }).toPass();

      await expect(page.getByTestId('img-blog-feature')).toHaveAttribute(
        'alt',
        blogPostData.title
      );
    });

    test('Delete Blog', async ({ page }) => {
      page.on('dialog', (dialog) => dialog.accept());

      await page.goto('/admin', { waitUntil: 'domcontentloaded' });

      await expect(
        page.getByTestId('banner-environment-notification')
      ).toContainText('YOU ARE USING TEST VARIABLES.');

      await page.getByTestId('btn-admin-delete-blog').click();

      await expect(
        page.getByTestId(`row-blog-deletion-grid-${blogPostData.slug}`)
      ).toBeVisible();

      await expect(
        page.getByTestId(`header-blog-deletion-row-title-${blogPostData.slug}`)
      ).toContainText(blogPostData.title);

      await expect(
        page.getByTestId(`text-blog-deletion-row-summary-${blogPostData.slug}`)
      ).toContainText(blogPostData.summary);

      await page
        .getByTestId(`btn-blog-deletion-row-delete-${blogPostData.slug}`)
        .click();

      await page.waitForSelector(
        `[data-testid="row-blog-deletion-grid-${blogPostData.slug}"]`,
        { state: 'detached', timeout: 10000 }
      );

      await expect(
        page.getByTestId(`row-blog-deletion-grid-${blogPostData.slug}`)
      ).toHaveCount(0);

      await page.reload();

      await expect(
        page.getByTestId(`row-blog-deletion-grid-${blogPostData.slug}`),
        'Delete blog still visible, potential cache issue'
      ).toHaveCount(0);
    });
  }
);
