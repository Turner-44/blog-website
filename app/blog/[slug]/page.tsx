import BlogContent from '@/app/ui/blog/BlogContent';
import { notFound } from 'next/navigation';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function getBlog(slug: string) {
    const metaDataRes = await fetch(
        `${baseUrl}/api/blogs?slug=${encodeURIComponent(slug)}`,
        {
            cache: 'no-store',
        }
    );

    if (metaDataRes.status !== 200) {
        console.error('Failed to fetch blog metadata:', metaDataRes.statusText);
        return notFound();
    }

    const metaDataResJson = await metaDataRes.json();

    const metaData = metaDataResJson.items[0];

    const markdownRes = await fetch(
        `${baseUrl}/api/blogs/${metaData.id}/markdown?markdownKey=${encodeURIComponent(metaData.markdownKey)}`,
        {
            cache: 'no-store',
        }
    );

    if (!markdownRes.ok) return null;
    const markdownJson = await markdownRes.json();

    const featureImageRes = await fetch(
        `${baseUrl}/api/blogs/${metaData.id}/image?imageKey=${encodeURIComponent(metaData.imageKey)}`,
        {
            cache: 'no-store',
        }
    );

    if (!featureImageRes.ok) return null;
    const featureImageJson = await featureImageRes.json();

    const featureImageBase64 = featureImageJson.image || null;

    return {
        id: metaData.id,
        slug: metaData.slug,
        title: metaData.title,
        markdown: markdownJson.markdown,
        featureImageBase64: featureImageBase64,
    };
}

export default async function Page({ params }: { params: { slug: string } }) {
    const blog = await getBlog(params.slug);
    if (!blog) return notFound();

    return (
        <main className="mx-auto max-w-3xl px-4 py-8 space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">{blog.title}</h1>
            <img
                src={`data:image/png;base64,${blog.featureImageBase64}`}
                alt={blog.title || 'Blog image'}
                className="object-cover object-center rounded-2xl h-full w-full"
            />
            <BlogContent markdown={blog.markdown} />
        </main>
    );
}
