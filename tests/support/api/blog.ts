import { CreateBlogDataAPI } from '@/tests/data/create-blog';
import {
  BlogsPostResponse,
  ImagePostResponse,
  MarkdownPostResponse,
} from '@/types/api';
import { APIRequestContext } from '@playwright/test';

export const storeBlogMetaData = async (
  apiContext: APIRequestContext,
  blogData: CreateBlogDataAPI,
  featureImageJson: ImagePostResponse,
  previewImageJson: ImagePostResponse,
  markdownJson: MarkdownPostResponse
): Promise<BlogsPostResponse> => {
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
  blog: BlogsPostResponse
) => {
  const blogMetaRes = await apiContext.delete(
    `/api/blogs?sk=${encodeURIComponent(blog.item.SK)}`
  );
  return await blogMetaRes.json();
};
