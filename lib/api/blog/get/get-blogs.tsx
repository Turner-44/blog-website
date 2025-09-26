import { BlogMetaData } from '@/types/blog';

export default async function getBlogs(limit: number = 30) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs?limit=${limit}`
  );

  if (!res.ok) throw new Error('Failed to fetch blogs');

  const { items }: { items: BlogMetaData[] } = await res.json();

  return items;
}
