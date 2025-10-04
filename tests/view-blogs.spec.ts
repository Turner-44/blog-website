import test, { expect, request } from '@playwright/test';
import { deleteBlogPost } from './support/api/blog';
import fs from 'fs';
import testData from './data/seedBlogData.json';
import {
  BlogsPostResponse,
  ImagePostResponse,
  MarkdownPostResponse,
} from '@/types/api';

test.use({ storageState: 'tests/.auth/cookies.json' });

test('View Blogs', async ({ page, context }) => {
  const cookieJson = JSON.parse(
    fs.readFileSync('tests/.auth/cookies.json', 'utf-8')
  );

  const cookieHeader = cookieJson.cookies
    .map((c: { name: string; value: string }) => `${c.name}=${c.value}`)
    .join('; ');

  const apiContext = await request.newContext({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    extraHTTPHeaders: {
      Cookie: cookieHeader,
    },
  });

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

    await deleteBlogPost(apiContext, blog.blogMetaData);
  }

  await context.close();
});
