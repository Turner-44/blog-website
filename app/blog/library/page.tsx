import BlogGrid from '@/components/blog/library/blog-grid';
import getBlogs from '@/lib/api/blog/get/get-blogs';
import { BlogMetaData } from '@/types/blog';

export default async function BlogLibrary() {
    const blogs = await getBlogs(30);

    return (
        <div className="p-10">
            <BlogGrid blogs={blogs} />
        </div>
    );
}
