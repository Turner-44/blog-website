import { test, expect } from '@playwright/test';

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

      await expect(page.getByTestId('header-page-title')).toBeVisible();
      await expect(page.getByTestId('btn-blog-publish')).toBeVisible();

      await page.getByTestId('btn-blog-publish').click();

      await expect(page.getByTestId('form-error-message')).toContainText(
        'Please fix the errors above.',
        {
          timeout: 30000,
        }
      );

      await expect(
        page
          .getByTestId('field-blog-title')
          .getByText('Title must be at least 3 characters long')
      ).toBeVisible();

      await expect(
        page
          .getByTestId('field-blog-slug')
          .getByText(
            'Slug must contain only lowercase letters, numbers, and hyphens'
          )
      ).toBeVisible();

      await expect(
        page
          .getByTestId('field-blog-summary')
          .getByText('Summary must be at least 10 characters long')
      ).toBeVisible();

      await expect(
        page
          .getByTestId('field-blog-markdown')
          .getByText('Markdown must be at least 10 characters long')
      ).toBeVisible();

      await expect(
        page
          .getByTestId('field-blog-preview-image')
          .getByText('Image must be a PNG or JPEG file')
      ).toBeVisible();

      await expect(
        page
          .getByTestId('field-blog-feature-image')
          .getByText('Image must be a PNG or JPEG file')
      ).toBeVisible();

      await expect(
        page
          .getByTestId('field-blog-tags')
          .getByText('At least one tag is required')
      ).toBeVisible();
    });
  }
);
