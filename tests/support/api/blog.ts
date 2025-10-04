import { CreateBlogDataAPI } from '@/tests/data/create-blog';
import { APIRequestContext } from '@playwright/test';

//TODO Need to add response types to api

export const storeBlogMetaData = async (
  apiContext: APIRequestContext,
  blogData: CreateBlogDataAPI,
  imageJson: any,
  markdownJson: any
) => {
  const metaDataBody = JSON.stringify({
    id: blogData.id,
    title: blogData.title,
    slug: blogData.slug,
    summary: blogData.summary,
    imageKey: imageJson.imageKey,
    markdownKey: markdownJson.markdownKey,
    publishedAt: blogData.publishedAt,
    tags: blogData.tags,
  });

  const blogMetaRes = await apiContext.post(`/api/blogs`, {
    data: metaDataBody,
  });

  return await blogMetaRes.json();
};
