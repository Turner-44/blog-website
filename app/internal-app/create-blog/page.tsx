import PostBlogForm from '@/components/blog/upload/post-form';

export default function CreateBlogPage() {
    return (
        <main className="flex flex-col items-center justify-center gap-8 p-8 sm:p-10">
            <p className="text-2xl sm:text-3xl font-medium text-center">
                Create a New Blog Post
            </p>
            <PostBlogForm />
        </main>
    );
}
