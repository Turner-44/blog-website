import test, { expect } from '@playwright/test';
import testData from './data/.temp/test-blog-data.json';
import { BlogsResponses } from '@/types/api/blogs';
import { MarkdownResponses } from '@/types/api/markdown';
import { ImageResponses } from '@/types/api/image';

test.use({ storageState: 'tests/.auth/cookies.json' });

test.describe('Check carousel and blog display', { tag: '@e2e' }, () => {
  test('Validate blogs display as expected', async ({ page, context }) => {
    const createdData = testData as {
      blogMetaData: BlogsResponses['Post'];
      featureImageJson: ImageResponses['Post'];
      previewImageJson: ImageResponses['Post'];
      markdownJson: MarkdownResponses['Post'];
    }[];

    await expect(async () => {
      await page.goto('/', { waitUntil: 'domcontentloaded' });

      for (let i = 0; i < createdData.length; i++) {
        const blog = createdData[i];
        await expect(
          page.getByTestId(
            `header-blog-card-title-${blog.blogMetaData.blogPost.slug}`
          )
        ).toContainText(blog.blogMetaData.blogPost.title);
        await expect(
          page.getByTestId(
            `text-blog-card-summary-${blog.blogMetaData.blogPost.slug}`
          )
        ).toContainText(blog.blogMetaData.blogPost.summary);
      }
    }).toPass();

    for (let i = 0; i < createdData.length; i++) {
      const blog = createdData[i];
      await page.goto(`/blog/${blog.blogMetaData.blogPost.slug}`, {
        waitUntil: 'domcontentloaded',
      });
      await expect(page.getByTestId('header-blog-title')).toHaveText(
        blog.blogMetaData.blogPost.title
      );
    }

    await context.close();
  });
});
