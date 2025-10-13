import { blogSchema, blogUiFormSchema } from '@/lib/zod';
import z from 'zod';

export type BlogFormData = z.infer<typeof blogUiFormSchema>;
export type BlogPost = z.infer<typeof blogSchema>;
