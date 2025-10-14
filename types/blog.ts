import { blogSchema, blogUiFormSchema } from '@/lib/zod';
import z from 'zod';

export type BlogFormData = z.infer<typeof blogUiFormSchema>;
export type BlogPost = z.infer<typeof blogSchema>;

//TODO: Placeholder for categories and tags - will refactor approach in future
type ParentCategory = 'Blog Post' | 'Tutorial' | 'Case Study';
type SubCategory =
  | 'Career Development'
  | 'Communication'
  | 'Learning'
  | 'Life Lessons'
  | 'Self-Awareness';
