import PostBlogForm from '@/components/blog/admin/post-form';

export default function CreateBlogPage() {
  return (
    <main className="standard-page-format">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-center">Create a New Blog Post</h1>
        <PostBlogForm />
      </div>
    </main>
  );
}
