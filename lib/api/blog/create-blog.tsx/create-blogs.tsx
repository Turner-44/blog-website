'use server';

import { cookies } from 'next/headers';
import { createUIErrorResponse } from '../../../error-handling/ui';
import {
  storeFile,
  storeMarkdown,
  storeBlogPost,
  MarkdownResult,
  ImageResult,
} from './store-data';
import { revalidateBlogCache } from '@/lib/api/common/revalidate-cache';
import { BlogFormData } from '@/types/blog';

export async function createBlog(values: BlogFormData) {
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
