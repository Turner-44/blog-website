import { revalidatePath } from 'next/cache';

// Revalidates all relevant paths to fetch the latest blog data
export const revalidateBlogCache = (slug: string = '') => {
  revalidatePath('/', 'page');
  revalidatePath('/blog/library');
  revalidatePath('/admin/delete-blog');
  if (slug) {
    revalidatePath(`/blog/${slug}`);
  }
};
