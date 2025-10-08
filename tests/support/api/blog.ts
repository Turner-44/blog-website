import { CreateBlogDataAPI } from '@/tests/data/create-blog';
import { ImageResponses } from '@/types/api/image';
import { BlogsResponses } from '@/types/api/blogs';
import { MarkdownResponses } from '@/types/api/markdown';
import { APIRequestContext } from '@playwright/test';

export const storeBlogMetaData = async (
  apiContext: APIRequestContext,
  blogData: CreateBlogDataAPI,
  featureImageJson: ImageResponses['Post'],
  previewImageJson: ImageResponses['Post'],
  markdownJson: MarkdownResponses['Post']
): Promise<BlogsResponses['Post']> => {
  const metaDataBody = JSON.stringify({
    id: blogData.id,
    title: blogData.title,
    slug: blogData.slug,
    summary: blogData.summary,
    featureImageKey: featureImageJson.imageKey,
    previewImageKey: previewImageJson.imageKey,
    markdownKey: markdownJson.markdownKey,
    publishedAt: blogData.publishedAt,
    tags: blogData.tags,
  });

  const blogMetaRes = await apiContext.post(`/api/blogs`, {
    data: metaDataBody,
  });

  return await blogMetaRes.json();
};

export const deleteBlogPost = async (
  apiContext: APIRequestContext,
  blog: BlogsResponses['Post']
) => {
  const blogMetaRes = await apiContext.delete(
    `/api/blogs?sk=${encodeURIComponent(blog.item.SK)}`
  );
  return await blogMetaRes.json();
};
