import { BlogPost } from '@/types/blog';
import { notFound } from 'next/navigation';
import getBlogMarkdown from './get-markdown';
import { SlugResponses } from '@/types/api/blogs-slug';
import { ApiResponse } from '@/types/api/common';
import { BlogsResponses } from '@/types/api/blogs';
import { NotFoundError } from '@/errors/api-errors';
import { getRequest } from '../common/get';
import { fetchOptions } from '../common/caching';

export async function getBlogList(
  limit: number = 10,
  cursor?: string | undefined
): Promise<BlogsResponses['Get']> {
  //TODO Fixing type is a future problem
  const query = new URLSearchParams({ limit: String(limit) });
  if (cursor) query.append('cursor', cursor);

  const blogPostRes = await getRequest<BlogsResponses['Get']>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs?${query.toString()}`,
    fetchOptions.blogPost
  );

  if (!blogPostRes.success) {
    const validationError = new NotFoundError('Not blog posts found', {
      blogPostRes,
    });
    validationError.log();
    notFound();
  }

  const { blogPosts, nextCursor } = blogPostRes.data;

  return {
    blogPosts,
    nextCursor,
  };
}

export async function getBlogBySlug(
  slug: string
): Promise<ApiResponse<SlugResponses['Get']> | void> {
  const blogPostRes = await getRequest<SlugResponses['Get']>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/slug/${encodeURIComponent(slug)}`,
    fetchOptions.blogPost
  );

  if (!blogPostRes.success) {
    const validationError = new NotFoundError('Blog post not found', {
      slugProvided: slug,
      blogPostRes,
    });
    validationError.log();
    notFound();
  }

  return blogPostRes;
}

export async function getBlogPosts(slug: string) {
  const result = await getBlogBySlug(slug);
  if (!result || !result.success) {
    return notFound();
  }

  const blogPosts = result.data;

  const markdown = await getBlogMarkdown(blogPosts.blogPost);

  return { blogPosts, markdown };
}
