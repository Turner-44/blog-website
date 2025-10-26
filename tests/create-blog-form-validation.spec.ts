import { BlogsResponses } from '@/types/api/blogs';
import { ImageResponses } from '@/types/api/image';
import { MarkdownResponses } from '@/types/api/markdown';
import { test, expect } from '@playwright/test';
import testData from './data/.temp/test-blog-data.json';
import path from 'path';
import { resolveFromRoot, TEST_PATHS } from '@/utils/paths';
import { createBlogPostDataUI } from './data/create-blog';
import { errorMessages } from '@/lib/api/blog/create-blog/create-blogs';

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
        errorMessages.fixErrorsAbove,
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
          .getByText('Tags must contain at least 1 item')
      ).toBeVisible();
    });

    test('Check error shown for existing slug', async ({ page }) => {
      const blogPosts = testData as {
        blogPost: BlogsResponses['Post'];
        featureImageJson: ImageResponses['Post'];
        previewImageJson: ImageResponses['Post'];
        markdownJson: MarkdownResponses['Post'];
      }[];

      const { blogPost } = blogPosts[0];
      const blogPostData = createBlogPostDataUI();

      await page.goto('/admin', { waitUntil: 'domcontentloaded' });
      await expect(
        page.getByTestId('banner-environment-notification')
      ).toContainText('YOU ARE USING TEST VARIABLES.');
      await page.getByTestId('btn-admin-create-blog').click();

      await expect(page.getByTestId('header-page-title')).toBeVisible();
      await expect(page.getByTestId('btn-blog-publish')).toBeVisible();

      await page.getByTestId('input-blog-title').fill(blogPost.title);
      await page.getByTestId('input-blog-slug').fill(blogPost.slug);
      await page.getByTestId('input-blog-summary').fill(blogPost.summary);
      await page.getByTestId('input-blog-markdown').fill(blogPostData.markdown);

      await expect(async () => {
        await page
          .locator('input[name="featureImage"]')
          .setInputFiles(
            resolveFromRoot(
              path.join(
                TEST_PATHS.testsDataFeatureImages,
                blogPostData.featureImageFileName
              )
            )
          );

        await page
          .locator('input[name="previewImage"]')
          .setInputFiles(
            resolveFromRoot(
              path.join(
                TEST_PATHS.testsDataPreviewImages,
                blogPostData.previewImageFileName
              )
            )
          );
      }).toPass();

      await page.getByTestId('input-blog-tags').fill(blogPost.tags.join(','));

      await page.getByTestId('btn-blog-publish').click();

      await expect(page.getByTestId('form-error-message')).toContainText(
        errorMessages.fixErrorsAbove,
        {
          timeout: 30000,
        }
      );

      await expect(
        page.getByTestId('field-blog-slug').getByText(errorMessages.slugExists)
      ).toBeVisible();
    });
  }
);
