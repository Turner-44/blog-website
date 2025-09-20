import BlogCard from '@/components/blog/carousel/blog-card';
import { BlogMetaData } from '@/app/blog/[slug]/page';

export async function getBlogs() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs?limit=3`,
        {
            cache: 'no-store',
        }
    );

    if (!res.ok) throw new Error('Failed to fetch blogs');
    const { items } = await res.json();

    return items as BlogMetaData[];
}

export default async function BlogCarousel() {
    const blogs = await getBlogs();

    return (
        <div className="flex flex-col items-center space-y-4">
            {blogs.length > 0 && (
                <div className="grid grid-cols-3 gap-10 p-5">
                    {blogs.map((blog, index) => {
                        return <BlogCard blog={blog} key={index} />;
                    })}
                </div>
            )}
        </div>
    );
}
