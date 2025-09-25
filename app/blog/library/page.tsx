import BlogGrid from '@/components/blog/library/blog-grid';
import getBlogs from '@/lib/api/blog/get/get-blogs';

export const dynamic = 'force-dynamic';

export default async function BlogLibrary() {
    const blogs = await getBlogs(30);

    return (
        <main className="narrow-page-format">
            <BlogGrid blogs={blogs} />
        </main>
    );
}
