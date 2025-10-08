import { blogMetaDataSchema, blogSchema } from '@/utils/zod-schemas';
import z from 'zod';

export type BlogFormData = z.infer<typeof blogSchema>;
export type BlogMetaData = z.infer<typeof blogMetaDataSchema>;
