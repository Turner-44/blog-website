import type { MetadataRoute } from 'next';
import { BlogPost } from '@/types/blog';
import { dynamoDBClient, buildAllBlogsQuery } from '@/lib/api/aws/dynamo';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://becomingmatthew.com';

  //Buiild was failing in the pipeline when referencing internal api, so querying DynamoDB directly here instead
  const url = new URL(`${baseUrl}/api/blogs`);
  url.searchParams.set('limit', '100');
  const dynamodbRes = await dynamoDBClient.send(
    new QueryCommand(buildAllBlogsQuery(url, undefined))
  );

  const blogs = (dynamodbRes.Items ?? []) as BlogPost[];

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
