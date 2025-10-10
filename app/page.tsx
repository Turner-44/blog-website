import Link from 'next/link';
import { Suspense } from 'react';

import BlogCarousel from '@/components/blog/carousel/blog-carousel';
import { Button } from '@/components/shared-components/button';
import BlogCardSkeleton from '@/components/blog/carousel/loading-skeleton';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center py-5">
      <h1 className="text-center py-5">Welcome to my blog!</h1>
      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 p-5">
            <BlogCardSkeleton />
            <BlogCardSkeleton />
            <BlogCardSkeleton />
          </div>
        }
      >
        <BlogCarousel />
      </Suspense>

      <Link href="/blog/library">
        <Button className="Button-primary" data-testid="btn-show-all-blogs">
          Find More
        </Button>
      </Link>
    </main>
  );
}
