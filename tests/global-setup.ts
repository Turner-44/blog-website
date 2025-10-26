import { request, chromium } from '@playwright/test';
import fs from 'fs/promises';
import { storeBlogPost } from './support/api/blog';
import { createBlogPostDataAPI } from './data/create-blog';
import { storeMarkdown } from './support/api/markdown';
import { storeImage } from './support/api/image';
import { resolveFromRoot, TEST_PATHS } from '@/utils/paths';
import { test as setup } from '@playwright/test';

setup('Create blogs', async ({}) => {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL!;

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(`${baseURL}/admin`);
  await page.getByLabel('Username').fill('test');
  await page.getByRole('button', { name: 'Sign in with Test User' }).click();
  await page.waitForSelector('[data-testid="banner-environment-notification"]');

  // Save cookies and local storage for reuse in tests
  await context.storageState({
    path: resolveFromRoot(TEST_PATHS.testAuth + '/cookies.json'),
  });
  await browser.close();

  const apiContext = await request.newContext({
    baseURL,
    storageState: resolveFromRoot(TEST_PATHS.testAuth + '/cookies.json'),
  });

  const testData = [
    createBlogPostDataAPI(),
    createBlogPostDataAPI(),
    createBlogPostDataAPI(),
  ];

  testData.forEach((blog, index) => {
    // Set publishedAt to now, incremented by 100ms per blog - Stop blogs clashing with same date value
    blog.publishedAt = new Date(Date.now() + index * 100).toISOString();
  });

  const createdData = await Promise.all(
    testData.map(async (blog) => {
      const { data: markdownJson } = await storeMarkdown(apiContext, blog);
      const { data: featureImageJson } = await storeImage(
        apiContext,
        blog,
        'feature'
      );
      const { data: previewImageJson } = await storeImage(
        apiContext,
        blog,
        'preview'
      );

      const { data: blogPost } = await storeBlogPost(
        apiContext,
        blog,
        featureImageJson,
        previewImageJson,
        markdownJson
      );
      return {
        blogPost,
        featureImageJson,
        previewImageJson,
        markdownJson,
      };
    })
  );

  await fs.writeFile(
    resolveFromRoot(TEST_PATHS.testsDataTemp + '/test-blog-data.json'),
    JSON.stringify(createdData, null, 2)
  );

  await apiContext.dispose();
});
