import { notFound } from 'next/navigation';

import Image from 'next/image';
import BlogContent from './blog-markdown';

export default async function Blog({ slug }: { slug: string }) {
    const metaDataRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs?slug=${encodeURIComponent(slug)}`
    );

    if (metaDataRes.status !== 200) {
        console.error('Failed to fetch blog metadata:', metaDataRes.statusText);
        return notFound();
    }

    const metaDataResJson = await metaDataRes.json();

    const metaData = metaDataResJson.items[0];

    const markdownRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${metaData.id}/markdown?markdownKey=${encodeURIComponent(metaData.markdownKey)}`
    );

    if (!markdownRes.ok) {
        console.error('Failed to fetch blog markdown:', markdownRes.statusText);
        return notFound();
    }

    const { markdown } = await markdownRes.json();

    return (
        <main className="mx-auto max-w-3xl px-4 py-5 space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-center">
                {metaData.title}
            </h1>
            <p className="text-center text-md">
                {new Date(metaData.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                })}
            </p>
            <div className="relative h-100 aspect-w-1 aspect-h-1">
                <Image
                    src={`https://cdn.becomingmatthew.com/${metaData.imageKey}`}
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
