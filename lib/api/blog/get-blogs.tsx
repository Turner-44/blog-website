import { BlogMetaData } from '@/types/blog';
import { notFound } from 'next/navigation';
import getBlogMarkdown from './get-markdown';
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';

export async function getBlogList(limit: number = 30) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs?limit=${limit}`
  );

  if (!res.ok) throw new Error('Failed to fetch blogs');

  const { items }: { items: BlogMetaData[] } = await res.json();

  return items;
}

export async function getBlogBySlug(slug: string) {
  const metaDataRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs?slug=${encodeURIComponent(slug)}`
  );

  if (metaDataRes.status !== StatusCodes.OK) {
    console.error('Failed to fetch blog metadata:', metaDataRes.statusText);
    return notFound();
  }

  const metaDataResJson = await metaDataRes.json();

  return metaDataResJson.items[0];
}

export async function getAllBlogData(slug: string) {
  const blogMetaData = await getBlogBySlug(slug);

  const markdown = await getBlogMarkdown(blogMetaData);

  return { blogMetaData, markdown };
}
