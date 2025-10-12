import { getBlogList } from '@/lib/api/blog/get-blogs';
import DeletionGrid from '@/components/blog/admin/deletion-grid';

// Make the page dynamic to avoid static generation issues
export const dynamic = 'force-dynamic';

export default async function DeleteBlogPage() {
  const result = await getBlogList(10);

  return (
    <main className="standard-page-format">
      <h1 className="text-2xl font-bold mb-6">Delete Blog Posts</h1>
      {result.blogPosts.length === 0 ? (
        <p>No blogs available.</p>
      ) : (
        <DeletionGrid blogPosts={result.blogPosts} />
      )}
    </main>
  );
}
