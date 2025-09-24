import BlogCard from '@/components/blog/carousel/blog-card';
import getBlogs from '@/lib/api/blog/get/get-blogs';

export default async function BlogCarousel() {
    const blogs = await getBlogs(3);

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
