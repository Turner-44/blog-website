import Link from 'next/link';
import { Suspense } from 'react';

import BlogCarousel from '@/components/blog/carousel/blog-carousel';
import { Button } from '@/components/shared-components/button';

export default function Home() {
    return (
        <main className="flex flex-col items-center justify-center gap-8 p-8 sm:p-10">
            <p className="text-2xl sm:text-3xl font-medium text-center">
                I&apos;m <span className="font-bold">Matthew</span>
                <br />
                Welcome to my blog!
            </p>
            <Suspense fallback={<div>Loading...</div>}>
                <BlogCarousel />
            </Suspense>

            <Link href="/blog/library">
                <Button className="Button-primary">Find More</Button>
            </Link>
        </main>
    );
}
