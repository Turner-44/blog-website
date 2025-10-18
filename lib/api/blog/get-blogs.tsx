import { BlogPost } from '@/types/blog';
import { notFound } from 'next/navigation';
import getBlogMarkdown from './get-markdown';
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { validateResponse } from '@/lib/error-handling/api';
import { SlugResponses } from '@/types/api/blogs-slug';

export async function getBlogList(
  limit: number = 10,
  cursor?: string | undefined
) {
  const query = new URLSearchParams({ limit: String(limit) });
  if (cursor) query.append('cursor', cursor);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs?${query.toString()}`,
    { cache: 'no-store', next: { revalidate: 0 } }
  );

  const responseError = validateResponse(
    res.status,
    StatusCodes.OK,
    'Failed to fetch blogs'
  );
  if (responseError)
    return {
      blogPosts: [] as BlogPost[],
    };

  const {
    blogPosts,
    nextCursor,
  }: { blogPosts: BlogPost[]; nextCursor?: string | undefined } =
    await res.json();

  return {
    blogPosts: (blogPosts ?? []) as BlogPost[],
    nextCursor: nextCursor ?? undefined,
  };
}

export async function getBlogBySlug(slug: string) {
  const blogPostRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/slug/${encodeURIComponent(slug)}`,
    { cache: 'no-store', next: { revalidate: 0 } }
  );

  if (blogPostRes.status !== StatusCodes.OK) {
    console.error('Failed to fetch blog post:', blogPostRes.statusText);
    return notFound();
  }

  const blogPostResJson: SlugResponses['Get'] = await blogPostRes.json();

  return blogPostResJson;
}

export async function getBlogPosts(slug: string) {
  const blogPosts: SlugResponses['Get'] = await getBlogBySlug(slug);

  const markdown = await getBlogMarkdown(blogPosts.blogPost);

  return { blogPosts, markdown };
}
