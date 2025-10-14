import type { MetadataRoute } from 'next';
import { BlogPost } from '@/types/blog';
import { getBlogList } from '@/lib/api/blog/get-blogs';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ?? 'https://becomingmatthew.com';

  const blogListResult = await getBlogList(100);
  const blogs = (blogListResult?.blogPosts ?? []) as BlogPost[];

  const staticPages = ['/', '/about', '/contact', '/blog/library'].map(
    (path) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
    })
  );

  const blogPages =
    blogs?.map((blog) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: blog.publishedAt ? new Date(blog.publishedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })) || [];

  return [...staticPages, ...blogPages];
}
