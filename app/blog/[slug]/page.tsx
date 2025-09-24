import Blog from '@/components/blog/blog';
import { Suspense } from 'react';

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <Blog slug={slug} />
            </Suspense>
        </div>
    );
}
