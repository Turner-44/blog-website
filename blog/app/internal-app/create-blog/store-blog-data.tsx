'use server';

type CreateBlogForm = {
    title: string;
    slug: string;
    shortBlurb: string;
    markdownContent: string;
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
        shortBlurb: formData.get('shortBlurb') as string,
        markdownContent: formData.get('markdownContent') as string,
        featureImage: formData.get('featureImage') as File,
        tags: (formData.get('tags') as string).split(',').map((t) => t.trim()),
    };

    const id = crypto.randomUUID();

    // 1. Upload markdown
    const markdownContent = blogFormData.markdownContent;
    const markdownResp = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${id}/markdown`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                blogId: id,
                markdownContent,
            }),
        }
    ).then((r) => r.json());

    // 2. Upload image
    const imageFormData = new FormData();
    imageFormData.append('blogId', id);
    imageFormData.append('slug', blogFormData.slug);
    imageFormData.append('featureImage', blogFormData.featureImage); // File object

    const imageResp = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${id}/images`,
        {
            method: 'POST',
            body: imageFormData,
            // Do NOT set Content-Type header; browser will set it for FormData
        }
    ).then((r) => r.json());

    // 3. Save metadata
    const meta = {
        id: markdownResp.blogId,
        markdownId: markdownResp.markdownId,
        title: blogFormData.title,
        slug: blogFormData.slug,
        shortBlurb: blogFormData.shortBlurb,
        publishedAt: new Date().toISOString(),
        markdownKey: markdownResp.markdownKey,
        featureImageKey: imageResp.imageKey,
        tags: blogFormData.tags,
    };

    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(meta),
    });

    return { success: true, message: 'Blog created!' };
}
