'use server';

import { BlogsRequestBody, BlogsResponses } from '@/types/api/blogs';
import { ImageResponses } from '@/types/api/image';
import { MarkdownResponses } from '@/types/api/markdown';
import { postForm, postJson } from '../../common/post';
import { cleanupOnFailure } from '../delete-blogs';
import { revalidateBlogCache } from '../../common/revalidate-cache';
import { createUIErrorResponse } from '@/lib/error-handling/ui';
import { BlogFormData } from '@/types/blog';
import { cookies } from 'next/headers';
import { ApiResponse } from '@/types/api/common';

export type MarkdownResult = ApiResponse<MarkdownResponses['Post']>;
export type ImageResult = ApiResponse<ImageResponses['Post']>;
export type BlogPostResult = ApiResponse<BlogsResponses['Post']>;

export const storeBlogPost = async (
  blogPost: BlogsRequestBody['Post'],
  cookieHeader: string
): Promise<BlogPostResult> => {
  const blogResponse = await postJson<BlogsResponses['Post']>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs`,
    blogPost,
    cookieHeader
  );

  if (!blogResponse.success) {
    await cleanupOnFailure(blogPost, cookieHeader);
  }

  return blogResponse;
};

export const storeFile = async (
  id: string,
  slug: string,
  file: File,
  category: 'feature' | 'preview',
  cookie: string
): Promise<ImageResult> => {
  const form = new FormData();
  form.append('blogId', id);
  form.append('slug', slug);
  form.append('image', file);
  form.append('category', category);
  return await postForm<ImageResponses['Post']>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${id}/image`,
    form,
    cookie
  );
};

export const storeMarkdown = async (
  blogId: string,
  markdown: string,
  cookieHeader: string
): Promise<MarkdownResult> => {
  return postJson<MarkdownResponses['Post']>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${blogId}/markdown`,
    { blogId, markdown },
    cookieHeader
  );
};

export async function storeCompleteBlogPost(values: BlogFormData) {
  try {
    const {
      title,
      slug,
      summary,
      markdown,
      featureImage,
      previewImage,
      tags,
      publishedAt,
    } = values;

    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const id = crypto.randomUUID();

    const markdownResult: MarkdownResult = await storeMarkdown(
      id,
      markdown,
      cookieHeader
    );
    if (!markdownResult.success) return markdownResult;

    const featureImageResult: ImageResult = await storeFile(
      id,
      slug,
      featureImage,
      'feature',
      cookieHeader
    );
    if (!featureImageResult.success) return featureImageResult;

    const previewImageResult: ImageResult = await storeFile(
      id,
      slug,
      previewImage,
      'preview',
      cookieHeader
    );
    if (!previewImageResult.success) return previewImageResult;

    const blogPost = {
      id: id,
      title: title,
      slug: slug,
      summary: summary,
      featureImageKey: featureImageResult.data.imageKey,
      previewImageKey: previewImageResult.data.imageKey,
      markdownKey: markdownResult.data.markdownKey,
      publishedAt: publishedAt,
      tags: tags,
    };

    const blogResult = await storeBlogPost(blogPost, cookieHeader);
    if (!blogResult.success) return blogResult;

    revalidateBlogCache(slug);

    return {
      success: true,
      message: 'Blog created!',
    };
  } catch (error) {
    console.error('Error creating blog:', error);
    return createUIErrorResponse('An unexpected error occurred.');
  }
}
