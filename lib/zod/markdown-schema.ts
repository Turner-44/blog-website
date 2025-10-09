import { z } from 'zod';
import { FieldSchemas } from './field-schema';

export const createMarkdownSchema = z.object({
  blogId: FieldSchemas.id,
  markdown: FieldSchemas.markdown,
});
