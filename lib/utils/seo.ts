import { BlogPost } from '@/types/blog';

export const generateBlogMetadata = (blogPost: BlogPost, readTime: number) => {
  const blogPostUrl = `${liveSiteUrl}/blog/${blogPost.slug}`;
  const blogPostFeatureImage = `https://${process.env.NEXT_PUBLIC_S3_CDN_HOST_NAME}/${blogPost.featureImageKey}`;

  return {
    title: blogPost.title,
    description: blogPost.summary,
    openGraph: {
      title: blogPost.title,
      siteName: siteName,
      description: blogPost.summary,
      url: blogPostUrl,
      type: 'article',
      publishedTime: blogPost.publishedAt,
      modifiedTime: blogPost.publishedAt,
      authors: ['Matthew Turner'],
      images: [
        {
          url: blogPostFeatureImage,
          alt: blogPost.title,
          width: 900,
          height: 600,
        },
      ],
    },
    alternates: {
      canonical: blogPostUrl,
    },
    other: {
      readTime: readTime,
      isPublished: 'true',
    },
  };
};

export const siteName = 'Becoming Matthew';
export const liveSiteUrl =
  process.env.NEXT_PUBLIC_BASE_URL ?? 'https://becomingmatthew.com';
