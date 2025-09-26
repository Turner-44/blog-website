import { BlogMetaData } from '@/types/blog';
import { notFound } from 'next/navigation';

export default async function getBlogMarkdown(blogMetaData: BlogMetaData) {
  const markdownRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${blogMetaData.id}/markdown?markdownKey=${encodeURIComponent(blogMetaData.markdownKey)}`
  );

  if (!markdownRes.ok) {
    console.error('Failed to fetch blog markdown:', markdownRes.statusText);
    return notFound();
  }

  const { markdown } = await markdownRes.json();

  return markdown;
}
