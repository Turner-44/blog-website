import { z } from 'zod';
import { FieldSchemas } from './field-schema';

export const createImageSchema = z.object({
  blogId: FieldSchemas.id,
  slug: FieldSchemas.slug,
  image: FieldSchemas.image,
  category: FieldSchemas.imageCategory,
});
