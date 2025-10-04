import fs from 'fs';
import {
  BlogsPostResponse,
  ImagePostResponse,
  MarkdownPostResponse,
} from '@/types/api';
import { request } from '@playwright/test';
import testData from './data/.temp/test-blog-data.json';
import { deleteBlogPost } from './support/api/blog';

export default async function globalTeardown() {
  console.log('🧹 Running global teardown...');

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

  for (let i = 0; i < createdData.length; i++) {
    const blog = createdData[i];

    await deleteBlogPost(apiContext, blog.blogMetaData);

    console.log('Blog deleted' + blog.blogMetaData.item.title);
  }

  await apiContext.dispose();
}
