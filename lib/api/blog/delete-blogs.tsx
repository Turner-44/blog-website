'use server';

import { cookies } from 'next/headers';
import { BlogPost } from '@/types/blog';
import { BlogsRequestBody } from '@/types/api/blogs';
import { MarkdownResponses } from '@/types/api/markdown';
import { deleteRequest } from '../common/delete';
import z from 'zod';
import { FieldSchemas } from '@/lib/zod/field-schema';

const deleteMarkdown = async (
  blogId: z.infer<typeof FieldSchemas.id>,
  markdownKey: z.infer<typeof FieldSchemas.markdownKey>,
  cookieHeader: string
) => {
  return deleteRequest<MarkdownResponses['Delete']>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${blogId}/markdown?markdownKey=${encodeURIComponent(markdownKey)}`,
    cookieHeader
  );
};

const deleteImage = async (
  blogId: z.infer<typeof FieldSchemas.id>,
  imageKey: z.infer<typeof FieldSchemas.imageKey>,
  cookieHeader: string
) => {
  return deleteRequest<MarkdownResponses['Delete']>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${blogId}/image?imageKey=${encodeURIComponent(imageKey)}`,
    cookieHeader
  );
};

const deleteBlogPost = async (
  sk: z.infer<typeof FieldSchemas.sk>,
  cookieHeader: string
) => {
  return deleteRequest<MarkdownResponses['Delete']>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs?sk=${encodeURIComponent(sk)}`,
    cookieHeader
  );
};

export const cleanupOnFailure = async (
  blog: BlogsRequestBody['Post'],
  cookieHeader: string
) => {
  await Promise.allSettled([
    deleteMarkdown(blog.id, blog.markdownKey, cookieHeader),
    deleteImage(blog.id, blog.featureImageKey, cookieHeader),
    deleteImage(blog.id, blog.previewImageKey, cookieHeader),
  ]);
};

export async function deleteCompleteBlogPost(blog: BlogPost) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  try {
    const [markdownRes, imageFeatureRes, imagePreviewRes, blogPostRes] =
      await Promise.all([
        deleteMarkdown(blog.id, blog.markdownKey, cookieHeader),
        deleteImage(blog.id, blog.featureImageKey, cookieHeader),
        deleteImage(blog.id, blog.previewImageKey, cookieHeader),
        deleteBlogPost(blog.SK, cookieHeader),
      ]);

    if (
      !markdownRes.success ||
      !imageFeatureRes.success ||
      !imagePreviewRes.success ||
      !blogPostRes.success
    ) {
      throw new Error('Failed to delete one or more blog components');
    }

    return { success: true };
  } catch (error) {
    console.error('Delete error:', error);
    throw new Error(
      error instanceof Error ? error.message : 'An unknown error occurred'
    );
  }
}
