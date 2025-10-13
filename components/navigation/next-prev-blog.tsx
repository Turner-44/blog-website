import { SlugResponses } from '@/types/api/blogs-slug';
import Link from 'next/link';

export default function NextPrevBlog(blogMetaData: {
  blogMetaData: SlugResponses['Get'];
}) {
  const {
    blogMetaData: { prevBlogPost, nextBlogPost },
  } = blogMetaData;

  return (
    <div className="flex justify-between mt-6">
      <div className="w-full sm:w-auto text-left">
        {prevBlogPost ? (
          <Link
            href={`/blog/${prevBlogPost.slug}`}
            className="hover:text-black hover:underline"
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
          >
            {nextBlogPost.title} →
          </Link>
        ) : null}
      </div>
    </div>
  );
}
