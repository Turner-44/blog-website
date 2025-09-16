'use server';

type CreateBlogForm = {
    title: string;
    slug: string;
    summary: string;
    markdown: string;
    featureImage: File;
    tags: string[];
};

export async function createBlog(
    prevState: { success: boolean; message: string },
    formData: FormData
) {
    const blogFormData: CreateBlogForm = {
        title: formData.get('title') as string,
        slug: formData.get('slug') as string,
        summary: formData.get('summary') as string,
        markdown: formData.get('markdown') as string,
        featureImage: formData.get('featureImage') as File,
        tags: (formData.get('tags') as string).split(',').map((t) => t.trim()),
    };

    const id = crypto.randomUUID();

    const markdown = blogFormData.markdown;
    const markdownResp = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${id}/markdown`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                blogId: id,
                markdown,
            }),
        }
    ).then((r) => r.json());

    const imageFormData = new FormData();
    imageFormData.append('blogId', id);
    imageFormData.append('slug', blogFormData.slug);
    imageFormData.append('featureImage', blogFormData.featureImage);

    const imageResp = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${id}/image`,
        {
            method: 'POST',
            body: imageFormData,
        }
    ).then((r) => r.json());

    const meta = {
        id: id,
        title: blogFormData.title,
        slug: blogFormData.slug,
        summary: blogFormData.summary,
        imageKey: imageResp.imageKey,
        markdownKey: markdownResp.markdownKey,
        publishedAt: new Date().toISOString(),
        tags: blogFormData.tags,
    };

    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(meta),
    });

    return { success: true, message: 'Blog created!' };
}
