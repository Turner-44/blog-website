import { BlogsRequestBody, BlogsResponses } from '@/types/api/blogs';
import { Result } from '@/types/api/common';
import { ImageResponses } from '@/types/api/image';
import { MarkdownResponses } from '@/types/api/markdown';
import { postForm, postJson } from '../../common/post';
import { cleanupOnFailure } from '../delete-blogs';

export type MarkdownResult = Result<MarkdownResponses['Post']>;
export type ImageResult = Result<ImageResponses['Post']>;
export type BlogPostResult = Result<BlogsResponses['Post']>;

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
