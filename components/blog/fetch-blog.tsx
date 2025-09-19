import { notFound } from 'next/navigation';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export default async function fetchBlog(slug: string) {
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

    if (!markdownRes.ok) {
        console.error('Failed to fetch blog markdown:', markdownRes.statusText);
        return notFound();
    }

    const markdownJson = await markdownRes.json();

    return {
        metaData,
        markdown: markdownJson.markdown,
    };
}
