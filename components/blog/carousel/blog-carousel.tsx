import BlogCard from '@/components/blog/carousel/blog-card';
import { BlogMetaData } from '@/app/blog/[slug]/page';

export default async function BlogCarousel() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs?limit=3`,
        {
            cache: 'no-store',
        }
    );

    if (!res.ok) throw new Error('Failed to fetch blogs');

    const { items }: { items: BlogMetaData[] } = await res.json();

    return (
        <div className="flex flex-col items-center space-y-4">
            {items.length > 0 && (
                <div className="grid grid-cols-3 gap-10 p-5">
                    {items.map((blog, index) => {
                        return <BlogCard blog={blog} key={index} />;
                    })}
                </div>
            )}
        </div>
    );
}
