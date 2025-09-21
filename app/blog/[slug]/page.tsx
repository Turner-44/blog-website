import Blog from '@/components/blog/blog';
import { Suspense } from 'react';

export interface BlogMetaData {
    summary: string;
    imageKey: string;
    publishedAt: Date;
    slug: string;
    SK: string;
    markdownKey: string;
    id: string;
    PK: string;
    tags: string[];
    title: string;
}

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
