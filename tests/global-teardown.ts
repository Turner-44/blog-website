import fs from 'fs';
import { ImageResponses } from '@/types/api/image';
import { BlogsResponses } from '@/types/api/blogs';
import { MarkdownResponses } from '@/types/api/markdown';
import { request } from '@playwright/test';
import testData from './data/.temp/test-blog-data.json';
import { deleteBlogPost } from './support/api/blog';
import { resolveFromRoot, TEST_PATHS } from '@/lib/utils/paths';
import { test as teardown } from '@playwright/test';

teardown('Delete blogs', async ({}) => {
  console.log('🧹 Running global teardown...');

  const cookieJson = JSON.parse(
    fs.readFileSync(
      resolveFromRoot(TEST_PATHS.testAuth + '/cookies.json'),
      'utf-8'
    )
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
    blogMetaData: BlogsResponses['Post'];
    featureImageJson: ImageResponses['Post'];
    previewImageJson: ImageResponses['Post'];
    markdownJson: MarkdownResponses['Post'];
  }[];

  for (let i = 0; i < createdData.length; i++) {
    const blog = createdData[i];

    await deleteBlogPost(apiContext, blog.blogMetaData);

    console.log('Blog deleted ' + blog.blogMetaData.item.title);
  }

  await apiContext.dispose();
});
