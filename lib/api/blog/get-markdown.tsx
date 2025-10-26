import { revalidateIn1Year } from '@/utils/dates';
import { BlogPost } from '@/types/blog';
import { notFound } from 'next/navigation';

export default async function getBlogMarkdown(blogPost: BlogPost) {
  const markdownRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${blogPost.id}/markdown?markdownKey=${encodeURIComponent(blogPost.markdownKey)}`,
    { next: { revalidate: revalidateIn1Year, tags: ['markdown'] } }
  );

  if (!markdownRes.ok) {
    return notFound();
  }

  const {
    data: { markdown },
  } = await markdownRes.json();

  return markdown;
}
