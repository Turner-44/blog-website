import PostBlogForm from '@/components/blog/admin/post-form';

export default function CreateBlogPage() {
  return (
    <main className="narrow-page-format">
      <div>
        <h1 className="text-center" data-testid="header-page-title">
          Create a New Blog Post
        </h1>
        <PostBlogForm />
      </div>
    </main>
  );
}
