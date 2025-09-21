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

export default function Page({ params }: { params: { slug: string } }) {
    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <Blog slug={params.slug} />
            </Suspense>
        </div>
    );
}
