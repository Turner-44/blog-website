import { request, chromium, FullConfig } from '@playwright/test';
import fs from 'fs/promises';
import path from 'path';
import { storeBlogMetaData } from './support/api/blog';
import { createBlogDataAPI } from './data/create-blog';
import { storeMarkdown } from './support/api/markdown';
import { storeImage } from './support/api/image';

export default async function globalSetup() {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL!;
  const testRootDir = path.resolve('tests');
  await fs.mkdir(testRootDir, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(`${baseURL}/admin`);
  await page.getByLabel('Username').fill('test');
  await page.getByRole('button', { name: 'Sign in with Test User' }).click();
  await page.waitForSelector('[data-testid="banner-environment-notification"]');

  // Save cookies and local storage for reuse in tests
  await context.storageState({
    path: `${testRootDir}/.auth/cookies.json`,
  });
  await browser.close();

  const apiContext = await request.newContext({
    baseURL,
    storageState: `${testRootDir}/.auth/cookies.json`,
  });

  const testData = [
    createBlogDataAPI(),
    createBlogDataAPI(),
    createBlogDataAPI(),
  ];

  const createdData = await Promise.all(
    testData.map(async (blog) => {
      const markdownJson = await storeMarkdown(apiContext, blog);
      const imageJson = await storeImage(apiContext, blog);
      const blogMetaData = await storeBlogMetaData(
        apiContext,
        blog,
        imageJson,
        markdownJson
      );
      return { blogMetaData, imageJson, markdownJson };
    })
  );

  // Save test data for later use
  await fs.writeFile(
    `${testRootDir}/data/seedBlogData.json`,
    JSON.stringify(createdData, null, 2)
  );

  await apiContext.dispose();
}
