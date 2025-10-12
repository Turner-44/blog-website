import BlogCard from '@/components/blog/carousel/blog-card';
import { getBlogList } from '@/lib/api/blog/get-blogs';
import { Suspense } from 'react';
import BlogCardSkeleton from './loading-skeleton';

export default async function BlogCarousel() {
  const result = await getBlogList(3);

  return (
    <div data-testid="blog-carousel" className="w-full">
      {result.blogPosts.length === 0 ? (
        <p>No blogs available.</p>
      ) : (
        <div className="mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 p-5">
          <Suspense
            fallback={
              <div>
                <BlogCardSkeleton />
                <BlogCardSkeleton />
                <BlogCardSkeleton />
              </div>
            }
          >
            {result.blogPosts.map((blog, index) => {
              return <BlogCard blog={blog} key={index} />;
            })}
          </Suspense>
        </div>
      )}
    </div>
  );
}
