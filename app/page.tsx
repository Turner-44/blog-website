import BlogCarousel from '@/components/blog/carousel/blog-carousel';
import { Metadata } from 'next';
import { liveSiteUrl, siteName } from '@/utils/seo';

export const dynamic = 'force-dynamic';

const pageTitle = 'Home';
const pageDescription =
  'Welcome to Becoming Matthew - A blog about my journey to become the best version of myself.';

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: liveSiteUrl,
  },
  openGraph: {
    title: `${siteName} | ${pageTitle}`,
    description: pageDescription,
    url: liveSiteUrl,
    type: 'website',
  },
};

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center">
      <BlogCarousel />
    </main>
  );
}
