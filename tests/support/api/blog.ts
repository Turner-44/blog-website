import { CreateBlogPostDataAPI } from '@/tests/data/create-blog';
import { ImageResponses } from '@/types/api/image';
import { BlogsResponses } from '@/types/api/blogs';
import { MarkdownResponses } from '@/types/api/markdown';
import { APIRequestContext } from '@playwright/test';

export const storeBlogPost = async (
  apiContext: APIRequestContext,
  blogPost: CreateBlogPostDataAPI,
  featureImageJson: ImageResponses['Post'],
  previewImageJson: ImageResponses['Post'],
  markdownJson: MarkdownResponses['Post']
): Promise<BlogsResponses['Post']> => {
  const blogPostBody = JSON.stringify({
    id: blogPost.id,
    title: blogPost.title,
    slug: blogPost.slug,
    summary: blogPost.summary,
    featureImageKey: featureImageJson.imageKey,
    previewImageKey: previewImageJson.imageKey,
    markdownKey: markdownJson.markdownKey,
    publishedAt: blogPost.publishedAt,
    tags: blogPost.tags,
  });

  const blogPostRes = await apiContext.post(`/api/blogs`, {
    data: blogPostBody,
  });
  const resJson = await blogPostRes.json();
  return resJson;
};

export const deleteBlogPost = async (
  apiContext: APIRequestContext,
  blogPost: BlogsResponses['Post']
): Promise<BlogsResponses['Delete']> => {
  const blogMetaRes = await apiContext.delete(
    `/api/blogs?sk=${encodeURIComponent(blogPost.SK)}`
  );
  return await blogMetaRes.json();
};
