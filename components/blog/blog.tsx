import Image from 'next/image';
import BlogContent from './blog-markdown';
import { getBlogPosts } from '@/lib/api/blog/get-blogs';
import NextPrevBlog from '../navigation/next-prev-blog';

export default async function Blog({ slug }: { slug: string }) {
  const { blogPosts, markdown } = await getBlogPosts(slug);
  return (
    <div>
      <h1
        className="tracking-tight text-center py-2"
        data-testid="header-blog-title"
      >
        {blogPosts.blogPost.title}
      </h1>
      <p className="text-center text-md" data-testid="text-blog-publish-date">
        {new Date(blogPosts.blogPost.publishedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>
      <div className="relative h-full aspect-[3/2] w-full max-w-4xl mx-auto mt-2 mb-5 rounded-2xl overflow-hidden">
        <Image
          src={`https://${process.env.NEXT_PUBLIC_S3_CDN_HOST_NAME}/${blogPosts.blogPost.featureImageKey}`}
          alt={blogPosts.blogPost.title || 'Blog image'}
          className="object-cover object-center rounded-2xl"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          fill
          data-testid="img-blog-feature"
        />
      </div>
      <BlogContent markdown={markdown} />
      <NextPrevBlog blogPosts={blogPosts} />
    </div>
  );
}
