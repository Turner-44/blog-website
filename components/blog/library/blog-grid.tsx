import Link from 'next/link';
import Image from 'next/image';

import { BlogMetaData } from '@/types/blog';

export default function BlogGrid({ blogs }: { blogs: BlogMetaData[] }) {
    return (
        <ul className="space-y-4">
            {blogs.map((blog) => (
                <li
                    key={blog.id}
                    className="hover:scale-105 opacity-90 max-w-3xl mx-auto"
                >
                    <Link href={`/blog/${blog.slug}`}>
                        <article className="flex items-start space-x-4 max-w-4xl mx-auto">
                            <div className="w-48 h-32 flex-shrink-0 relative">
                                <Image
                                    src={`https://cdn.becomingmatthew.com/${blog.imageKey}`}
                                    alt={blog.title || 'Blog image'}
                                    className=" object-cover object-center rounded-2xl"
                                    fill
                                />
                            </div>
                            <div className="flex-1 h-32 flex flex-col justify-center space-y-2">
                                <h2 className="text-xl font-semibold">
                                    {blog.title}
                                </h2>
                                <p>{blog.summary}</p>
                            </div>
                        </article>
                    </Link>
                </li>
            ))}
        </ul>
    );
}
