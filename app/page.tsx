import Link from 'next/link';
import { Suspense } from 'react';

import BlogCarousel from '@/components/blog/carousel/blog-carousel';
import { Button } from '@/components/shared-components/button';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center py-5">
      <h1 className="text-center py-5">
        I&apos;m Matthew
        <br />
        Welcome to my blog!
      </h1>
      <Suspense fallback={<div>Loading...</div>}>
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
