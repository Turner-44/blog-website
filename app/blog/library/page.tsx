import BlogGrid from '@/components/blog/catalog/blog-grid';
import { getBlogList } from '@/lib/api/blog/get-blogs';

export const dynamic = 'force-dynamic';

export default async function BlogLibrary() {
  const result = await getBlogList(10);

  return (
    <main className="narrow-page-format">
      {result.blogPosts.length === 0 ? (
        <p>No blogs available.</p>
      ) : (
        <BlogGrid
          initialBlogs={result.blogPosts}
          initialCursor={result.nextCursor}
        />
      )}
    </main>
  );
}
