import Link from 'next/link';
import Image from 'next/image';

import { formattedDate as formatDate } from '@/lib/utils/dates';
import { BlogMetaData } from '@/types/blog';

export default function BlogCard({ blog }: { blog: BlogMetaData }) {
  return (
    <Link href={`/blog/${blog.slug}`} className="no-underline">
      <div
        className="relative mx-auto max-w-[24rem] sm:max-w-[26rem]
          aspect-[3/2] bg-black rounded-2xl hover:scale-105"
        key={blog.id}
        data-testid={`blog-card-${blog.slug}`}
      >
        <div className="h-full relative">
          <Image
            src={`https://${process.env.NEXT_PUBLIC_S3_CDN_HOST_NAME}/${blog.previewImageKey}`}
            alt={blog.title || 'Blog image'}
            className="object-cover object-center rounded-2xl"
            fill
            data-testid={`img-blog-feature-${blog.slug}`}
          />
        </div>
        <div className="absolute h-full w-full top-0 flex flex-col">
          <div className="flex-1"></div>
          <div className="flex-1 flex flex-col px-5 py-5 bg-gradient-to-t from-black rounded-2xl">
            <div className="flex-1"></div>
            <div>
              <h2
                className="text-white"
                data-testid={`header-blog-card-title-${blog.slug}`}
              >
                {blog.title}
              </h2>
            </div>
            <div className="flex items-center justify-between text-gray-300 text-sm py-1">
              <p
                className="font-bold text-md"
                data-testid={`text-blog-card-publishedAt-date-${blog.slug}`}
              >
                {formatDate(blog.publishedAt)}
              </p>
            </div>
            <p
              className="text-sm font text-gray-300 text-md"
              data-testid={`text-blog-card-summary-${blog.slug}`}
            >
              {blog.summary}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
