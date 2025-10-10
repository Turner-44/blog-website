import { test, expect } from '@playwright/test';
import { createBlogDataUI } from './data/create-blog';

test.use({ storageState: 'tests/.auth/cookies.json' });

test.describe(
  'Check form validation in create blog form',
  { tag: '@e2e' },
  () => {
    test('Check all field errors', async ({ page }) => {
      await page.goto('/admin', { waitUntil: 'domcontentloaded' });

      await expect(
        page.getByTestId('banner-environment-notification')
      ).toContainText('YOU ARE USING TEST VARIABLES.');

      await page.getByTestId('btn-admin-create-blog').click();

      await page.getByTestId('btn-blog-publish').click();

      await expect(page.getByText('Validation failed.')).toBeVisible({
        timeout: 30000,
      });

      await expect(page.getByTestId('input-blog-title-error')).toContainText(
        'Title must be at least 3 characters long'
      );

      await expect(page.getByTestId('input-blog-slug-error')).toContainText(
        'Slug must be at least 3 characters long'
      );

      await expect(page.getByTestId('input-blog-summary-error')).toContainText(
        'Summary must be at least 10 characters long'
      );

      await expect(page.getByTestId('input-blog-markdown-error')).toContainText(
        'Markdown must be at least 10 characters long'
      );

      await expect(
        page.getByTestId('input-blog-preview-image-error')
      ).toContainText('Image must be a PNG or JPEG file');

      await expect(
        page.getByTestId('input-blog-feature-image-error')
      ).toContainText('Image must be a PNG or JPEG file');

      await expect(page.getByTestId('input-blog-tags-error')).toContainText(
        'At least one tag is required'
      );
    });
  }
);
