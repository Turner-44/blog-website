import BlogCard from '@/components/blog/carousel/blog-card';
import { getBlogList } from '@/lib/api/blog/get-blogs';
import { Suspense } from 'react';
import BlogCardSkeleton from './loading-skeleton';
import Link from 'next/link';
import { Button } from '@/components/shared-components/button';

export default async function BlogCarousel() {
  const result = await getBlogList(3);

  return (
    <div data-testid="blog-carousel" className="py-10 px-5 md:px-20">
      {result.blogPosts.length === 0 ? (
        <p>No blogs available.</p>
      ) : (
        <div>
          <div className="pb-10">
            <header className="text-3xl font-bold md:text-4xl font-poppins text-center">
              Welcome to the blog
              <div className="mx-auto w-3/4 mt-0.5 duration-500 border-b-2 border-black rounded" />
            </header>
          </div>
          <div className="flex flex-col justify-center gap-10">
            <Suspense
              fallback={
                <div className="flex flex-col gap-10">
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
          <div className="mt-10 flex justify-center">
            <Link href="/blog/library">
              <Button
                size={'extraWide'}
                className="Button-primary"
                data-testid="btn-show-all-blogs"
              >
                Find More
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
