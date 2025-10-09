import { blogSchema, blogUiFormSchema, createBlogSchema } from '@/lib/zod';
import z from 'zod';

export type BlogFormData = z.infer<typeof blogUiFormSchema>;
export type BlogMetaData = z.infer<typeof blogSchema>;


