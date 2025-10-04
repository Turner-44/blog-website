import test, { expect, request } from '@playwright/test';
import { storeMarkdown } from './support/api/markdown';
import { storeImage } from './support/api/image';
import { storeBlogMetaData } from './support/api/blog';
import { CreateBlogDataAPI, createBlogDataAPI } from './data/create-blog';

test('View Blogs', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('/admin');

  await page.getByLabel('Username').fill('test');
  await page.getByRole('button', { name: 'Sign in with Test User' }).click();

  await expect(
    await page.getByTestId('banner-environment-notification')
  ).toContainText('YOU ARE USING TEST VARIABLES.');

  // await context.clearCookies();

  // console.log(await context.cookies());

  //TODO Why does it still create even after clearing cookies.

  const cookies = await context.cookies();

  const cookieHeader = cookies.map((c) => `${c.name}=${c.value}`).join('; ');

  const apiContext = await request.newContext({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    extraHTTPHeaders: {
      Cookie: cookieHeader,
    },
  });

  const testData = [
    createBlogDataAPI(),
    createBlogDataAPI(),
    createBlogDataAPI(),
  ];

  const createdData = await Promise.all(
    testData.map(async (blog: CreateBlogDataAPI) => {
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

  await page.goto('/');

  for (let i = 0; i > createdData.length; i++) {
    let blog = createdData[i];
    await expect(
      page.getByTestId(`header-blog-card-title-${blog.blogMetaData.item.slug}`)
    ).toContainText(blog.blogMetaData.item.title);
    await expect(
      page.getByTestId(`text-blog-card-summary-${blog.blogMetaData.item.slug}`)
    ).toContainText(blog.blogMetaData.item.summary);

    await page.goto(`/blog/${blog.blogMetaData.item.slug}`);
    await expect(page.getByTestId('header-blog-title')).toHaveText(
      blog.blogMetaData.item.title
    );
  }

  await context.close();
});
