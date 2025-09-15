// app/blog/[id]/page.tsx
import BlogContent from '@/app/ui/blog/BlogContent';
import { notFound } from 'next/navigation';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function getBlog(slug: string) {
    const metaDataRes = await fetch(
        `${baseUrl}/api/blogs?slug=${encodeURIComponent(slug)}`,
        {
            // pick one strategy:
            // next: { revalidate: 60 }, // ISR (good if content changes occasionally)
            cache: 'no-store', // always fresh (good while developing)
        }
    );

    if (!metaDataRes.ok) return null;
    const metaData = await metaDataRes.json().then((r) => r.items[0]);

    console.log('Meta data:', metaData);

    const markdownRes = await fetch(
        `${baseUrl}/api/blogs/${metaData.id}/markdown?markdownKey=${encodeURIComponent(metaData.markdownKey)}`,
        {
            // pick one strategy:
            // next: { revalidate: 60 }, // ISR (good if content changes occasionally)
            cache: 'no-store', // always fresh (good while developing)
        }
    );

    if (!markdownRes.ok) return null;

    const featureImageRes = await fetch(
        `${baseUrl}/api/blogs/${metaData.id}/images?imageKey=${encodeURIComponent(metaData.imageKey)}`,
        {
            // pick one strategy:
            // next: { revalidate: 60 }, // ISR (good if content changes occasionally)
            cache: 'no-store', // always fresh (good while developing)
        }
    );

    if (!featureImageRes.ok) return null;

    const markdown = await markdownRes.json();
    const markdownContent = markdown.results?.[0]?.content || null;
    const featureImageJson = await featureImageRes.json();
    const featureImageBase64 = featureImageJson.results?.[0]?.image || null;

    return {
        id: metaData.id,
        slug: metaData.slug,
        title: metaData.title,
        markdown: markdownContent,
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

            {/* Simple next/prev nav (optional) */}
        </main>
    );
}
