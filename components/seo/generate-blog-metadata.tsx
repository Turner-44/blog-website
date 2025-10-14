import { BlogPost } from '@/types/blog';

export const generateBlogMetadata = (blogPost: BlogPost, readTime: string) => {
  const blogPostUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${blogPost.slug}`;
  const blogPostFeatureImage = `${process.env.NEXT_PUBLIC_S3_CDN_HOST_NAME}/${blogPost.featureImageKey}`;

  return {
    title: blogPost.title,
    description: blogPost.summary,
    openGraph: {
      title: blogPost.title,
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
        },
      ],
    },
    alternates: {
      canonical: blogPostUrl,
    },
    readTime: readTime,
    isPublished: true,
  };
};
