import { BlogPost } from '@/types/blog';

export interface BlogMetaData {
  slug: string; //  from API
  title: string; //  from API
  description: string; //  from API (used for meta + summaries)
  category: string; //  add manually / or map from your content pillar
  tags: string[]; //  already available, may need updating
  featuredImage: string; //  have file path, may store full URL
  canonicalUrl: string; //  explained below
  author: {
    name: string; //  hardcode
  };
  publishedAt: string; // from API
  updatedAt?: string; //  default = publishedAt or today if migrated
  readTime?: number; //  calculated automatically
  isPublished: boolean; //  default true (no drafts yet)
}

// export const generateBlogSEOData = (blogPost: BlogPost) => ({
//   slug: blogPost.slug,
//   title: blogPost.title,
//   description: blogPost.description,
//   category: blogPost.category,
//   tags: blogPost.tags,
//   featuredImage: blogPost.featuredImage,
//   canonicalUrl: blogPost.canonicalUrl,
//   author: {
//     name: 'Matthew Turner',
//   },
//   publishedAt: blogPost.publishedAt,
//   updatedAt: blogPost.updatedAt,
//   readTime: blogPost.readTime,
//   isPublished: true,
// });
