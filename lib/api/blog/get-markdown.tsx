import { revalidateIn1Year, revalidateIn7Days } from '@/lib/utils/dates';
import { BlogPost } from '@/types/blog';
import { notFound } from 'next/navigation';

export default async function getBlogMarkdown(blogPost: BlogPost) {
  const markdownRes = await fetch(
    `/api/blogs/${blogPost.id}/markdown?markdownKey=${encodeURIComponent(blogPost.markdownKey)}`,
    { next: { revalidate: revalidateIn1Year, tags: ['markdown'] } }
  );

  if (!markdownRes.ok) {
    console.error('Failed to fetch blog markdown:', markdownRes.statusText);
    return notFound();
  }

  const { markdown } = await markdownRes.json();

  return markdown;
}
