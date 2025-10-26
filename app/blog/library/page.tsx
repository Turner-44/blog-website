import BlogGrid from '@/components/blog/catalog/blog-grid';
import { getBlogList } from '@/lib/api/blog/get-blogs';
import { liveSiteUrl, siteName } from '@/utils/seo';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

const pageTitle = 'Blog Library';
const pageDescription = 'Explore all blog posts from Becoming Matthew';
export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: `${liveSiteUrl}/blog/library`,
  },
  openGraph: {
    title: `${siteName} | ${pageTitle}`,
    description: pageDescription,
    url: `${liveSiteUrl}/blog/library`,
  },
};

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
