import BlogGrid from '@/components/blog/library/blog-grid';
import { BlogMetaData } from '../[slug]/page';

export default async function BlogLibrary() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs?limit=30`
    );

    if (!res.ok) throw new Error('Failed to fetch blogs');

    const { items }: { items: BlogMetaData[] } = await res.json();

    return (
        <div className="p-10">
            <BlogGrid blogs={items} />
        </div>
    );
}
