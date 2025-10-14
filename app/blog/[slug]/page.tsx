import Blog from '@/components/blog/blog';
import { getBlogPosts } from '@/lib/api/blog/get-blogs';
import { estimateReadTime } from '@/lib/utils/read-time';
import { Suspense } from 'react';
import { Metadata } from 'next';
import { generateBlogMetadata } from '@/lib/utils/seo';
import { SlugResponses } from '@/types/api/blogs-slug';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const {
    blogPosts,
    markdown,
  }: { blogPosts: SlugResponses['Get']; markdown: string } =
    await getBlogPosts(slug);

  const readTime = estimateReadTime(markdown);
  return generateBlogMetadata(blogPosts.blogPost, readTime);
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main className="narrow-page-format">
      <Suspense fallback={<div>Loading...</div>}>
        <Blog slug={slug} />
      </Suspense>
    </main>
  );
}
