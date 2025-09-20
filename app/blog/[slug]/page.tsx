import { notFound } from 'next/navigation';
import Image from 'next/image';

import BlogContent from '@/components/blog/blog-markdown';
import fetchBlog from '@/components/blog/fetch-blog';

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

export default async function Page({ params }: { params: { slug: string } }) {
    const { metaData, markdown }: { metaData: BlogMetaData; markdown: string } =
        await fetchBlog(params.slug);

    if (!metaData || !markdown) return notFound();

    return (
        <main className="mx-auto max-w-3xl px-4 py-8 space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">
                {metaData.title}
            </h1>
            <div className="relative h-100 aspect-w-1 aspect-h-1">
                <Image
                    src={`https://becomingmatthew-blog-bucket.s3.us-east-1.amazonaws.com/${metaData.imageKey}`}
                    alt={metaData.title || 'Blog image'}
                    className="object-cover object-center rounded-2xl"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    fill
                />
            </div>

            <BlogContent markdown={markdown} />
        </main>
    );
}
