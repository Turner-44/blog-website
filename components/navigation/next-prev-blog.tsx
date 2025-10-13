import { SlugResponses } from '@/types/api/blogs-slug';
import Link from 'next/link';

export default function NextPrevBlog(blogPosts: {
  blogPosts: SlugResponses['Get'];
}) {
  const {
    blogPosts: { prevBlogPost, nextBlogPost },
  } = blogPosts;

  return (
    <div className="flex justify-between mt-6">
      <div className="w-full sm:w-auto text-left">
        {prevBlogPost ? (
          <Link
            href={`/blog/${prevBlogPost.slug}`}
            className="hover:text-black hover:underline"
            data-testid="link-prev-blog"
          >
            ← {prevBlogPost.title}
          </Link>
        ) : null}
      </div>
      <div className="w-full sm:w-auto text-right">
        {nextBlogPost ? (
          <Link
            href={`/blog/${nextBlogPost.slug}`}
            className="hover:text-black hover:underline"
            data-testid="link-next-blog"
          >
            {nextBlogPost.title} →
          </Link>
        ) : null}
      </div>
    </div>
  );
}
