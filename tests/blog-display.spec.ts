import test, { expect } from '@playwright/test';
import testData from './data/.temp/test-blog-data.json';
import {
  BlogsPostResponse,
  ImagePostResponse,
  MarkdownPostResponse,
} from '@/types/api';

test.use({ storageState: 'tests/.auth/cookies.json' });

test.describe('Check carousel and blog display', { tag: '@e2e' }, () => {
  test('Validate blogs display as expected', async ({ page, context }) => {
    const createdData = testData as {
      blogMetaData: BlogsPostResponse;
      imageJson: ImagePostResponse;
      markdownJson: MarkdownPostResponse;
    }[];

    await expect(async () => {
      await page.goto('/');

      for (let i = 0; i < createdData.length; i++) {
        const blog = createdData[i];
        await expect(
          page.getByTestId(
            `header-blog-card-title-${blog.blogMetaData.item.slug}`
          )
        ).toContainText(blog.blogMetaData.item.title);
        await expect(
          page.getByTestId(
            `text-blog-card-summary-${blog.blogMetaData.item.slug}`
          )
        ).toContainText(blog.blogMetaData.item.summary);
      }
    }).toPass();

    for (let i = 0; i < createdData.length; i++) {
      const blog = createdData[i];
      await page.goto(`/blog/${blog.blogMetaData.item.slug}`);
      await expect(page.getByTestId('header-blog-title')).toHaveText(
        blog.blogMetaData.item.title
      );
    }

    await context.close();
  });
});
