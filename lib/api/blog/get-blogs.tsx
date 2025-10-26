import { BlogPost } from '@/types/blog';
import { notFound } from 'next/navigation';
import getBlogMarkdown from './get-markdown';
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { validateResponseStatus } from '@/lib/error-handling/api';
import { SlugResponses } from '@/types/api/blogs-slug';
import { ApiResponse } from '@/types/api/common';
import { BlogsResponses } from '@/types/api/blogs';
import { NotFoundError } from '@/errors/api-errors';

export async function getBlogList(
  limit: number = 10,
  cursor?: string | undefined
): Promise<BlogsResponses['Get']> {
  //TODO Fixing type is a future problem
  const query = new URLSearchParams({ limit: String(limit) });
  if (cursor) query.append('cursor', cursor);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs?${query.toString()}`,
    { cache: 'no-store', next: { revalidate: 0 } }
  );

  const responseError = validateResponseStatus(
    res.status,
    StatusCodes.OK,
    'Failed to fetch blogs'
  );
  //TODO: Need to handle valid response when there are no blog posts
  if (responseError)
    return {
      blogPosts: [] as BlogPost[],
      nextCursor: null,
    };

  const resJson = await res.json();

  const { blogPosts, nextCursor } = resJson.data;

  return {
    blogPosts,
    nextCursor,
  };
}

export async function getBlogBySlug(
  slug: string
): Promise<ApiResponse<SlugResponses['Get']> | void> {
  const blogPostRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/slug/${encodeURIComponent(slug)}`,
    { cache: 'no-store', next: { revalidate: 0 } }
  );

  const blogPostResJson: ApiResponse<SlugResponses['Get']> =
    await blogPostRes.json();

  if (!blogPostResJson.success) {
    const validationError = new NotFoundError('Blog post not found', {
      slugProvided: slug,
      blogPostResJson,
    });
    validationError.log();
    return;
  }

  return blogPostResJson;
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
