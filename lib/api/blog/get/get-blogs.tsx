import { BlogMetaData } from '@/types/blog';

export default async function getBlogs(limit: number = 30) {
  console.log('🔍 NEXT_PUBLIC_BASE_URL:', process.env.NEXT_PUBLIC_BASE_URL);
  console.log(
    '🔍 Full URL:',
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs?limit=${limit}`
  );

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs?limit=${limit}`
  );

  if (!res.ok) throw new Error('Failed to fetch blogs');

  const { items }: { items: BlogMetaData[] } = await res.json();

  return items;
}
