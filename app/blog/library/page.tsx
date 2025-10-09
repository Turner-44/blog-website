import BlogGrid from '@/components/blog/catalog/blog-grid';
import { getBlogList } from '@/lib/api/blog/get-blogs';

export const dynamic = 'force-dynamic';

export default async function BlogLibrary() {
  const blogs = await getBlogList(30);

  return (
    <main className="narrow-page-format">
      {blogs.length === 0 ? (
        <p>No blogs available.</p>
      ) : (
        <BlogGrid blogs={blogs} />
      )}
    </main>
  );
}
