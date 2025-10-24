import { CreateBlogPostDataAPI } from '@/tests/data/create-blog';
import { ImageResponses } from '@/types/api/image';
import { BlogsResponses } from '@/types/api/blogs';
import { MarkdownResponses } from '@/types/api/markdown';
import { APIRequestContext } from '@playwright/test';
import { BlogCreationError } from '@/errors/api-errors';
import { SuccessResponse } from '@/lib/api/common/response-structures';

export const storeBlogPost = async (
  apiContext: APIRequestContext,
  blogPost: CreateBlogPostDataAPI,
  featureImageJson: ImageResponses['Post'],
  previewImageJson: ImageResponses['Post'],
  markdownJson: MarkdownResponses['Post']
): Promise<SuccessResponse<BlogsResponses['Post']>> => {
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

  const blogPostRes = await apiContext.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs`,
    {
      data: blogPostBody,
    }
  );

  const blogPostJson = await blogPostRes.json();

  if (!blogPostJson.success) {
    throw new BlogCreationError(blogPostJson.error.message);
  }

  return blogPostJson;
};

export const deleteBlogPost = async (
  apiContext: APIRequestContext,
  blogPost: BlogsResponses['Post']
): Promise<BlogsResponses['Delete']> => {
  const blogPostRes = await apiContext.delete(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs?sk=${encodeURIComponent(blogPost.SK)}`
  );
  const blogPostJson = await blogPostRes.json();

  if (!blogPostJson.success) {
    throw new Error(
      `Failed to delete blog post: ${blogPostRes.status} ${blogPostRes.statusText}`
    );
  }

  return blogPostJson;
};
