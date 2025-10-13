import { BlogMetaData } from '@/types/blog';
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
    { cache: 'no-store' }
  );

  const responseError = validateResponse(
    res.status,
    StatusCodes.OK,
    'Failed to fetch blogs'
  );
  if (responseError)
    return {
      blogPosts: [] as BlogMetaData[],
    };

  const {
    blogPosts,
    nextCursor,
  }: { blogPosts: BlogMetaData[]; nextCursor?: string | undefined } =
    await res.json();

  return {
    blogPosts: (blogPosts ?? []) as BlogMetaData[],
    nextCursor: nextCursor ?? undefined,
  };
}

export async function getBlogBySlug(slug: string) {
  const metaDataRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/slug/${encodeURIComponent(slug)}`
  );

  if (metaDataRes.status !== StatusCodes.OK) {
    console.error('Failed to fetch blog metadata:', metaDataRes.statusText);
    return notFound();
  }

  const metaDataResJson: SlugResponses['Get'] = await metaDataRes.json();

  return metaDataResJson;
}

export async function getAllBlogData(slug: string) {
  const blogMetaData: SlugResponses['Get'] = await getBlogBySlug(slug);

  const markdown = await getBlogMarkdown(blogMetaData.blogPost);

  return { blogMetaData, markdown };
}
