import BlogCard from '@/components/blog/carousel/blog-card';
import { getBlogList } from '@/lib/api/blog/get-blogs';

export default async function BlogCarousel() {
  const blogs = await getBlogList(3);

  return (
    <div data-testid="blog-carousel">
      {blogs.length === 0 ? (
        <p>No blogs available.</p>
      ) : (
        <div className="grid grid-cols-3 gap-10 p-5">
          {blogs.map((blog, index) => {
            return <BlogCard blog={blog} key={index} />;
          })}
        </div>
      )}
    </div>
  );
}
