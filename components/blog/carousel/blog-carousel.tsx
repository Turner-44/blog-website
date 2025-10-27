import BlogCard from '@/components/blog/carousel/blog-card';
import { getBlogList } from '@/lib/api/blog/get-blogs';
import { Suspense } from 'react';
import BlogCardSkeleton from './loading-skeleton';

export default async function BlogCarousel() {
  const result = await getBlogList(3);

  return (
    <div data-testid="blog-carousel" className="mx-auto max-w-10xl px-4 py-5">
      {result.blogPosts.length === 0 ? (
        <p>No blogs available.</p>
      ) : (
        <div className="flex flex-col gap-10 2xl:gap-20 xl:flex-row xl:flex-wrap justify-around w-full">
          <Suspense
            fallback={
              <>
                <BlogCardSkeleton />
                <BlogCardSkeleton />
                <BlogCardSkeleton />
              </>
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
