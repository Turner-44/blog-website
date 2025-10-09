import z from 'zod';

export const validateBlogFormSchema = (
  data: FormData,
  schema: z.ZodSchema
): {
  success: boolean;
  message: string;
  fieldErrors: z.core.$ZodErrorTree<typeof schema>;
  payload: FormData | z.infer<typeof schema>;
} => {
  const formData = Object.fromEntries(data.entries());
  const formDataFixes = {
    ...formData,
    tags: (formData.tags as string)
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t !== ''),
  };

  const result = schema.safeParse(formDataFixes);

  if (!result.success) {
    console.error('Validation errors:', result.error);
    return {
      success: false,
      message: 'Validation failed',
      fieldErrors: z.treeifyError(result.error),
      payload: data,
    };
  }

  return {
    success: true,
    message: 'Validation successful',
    fieldErrors: { errors: [], properties: {} } as z.core.$ZodErrorTree<
      typeof schema
    >,
    payload: result.data as z.infer<typeof schema>,
  };
};

export const createUIErrorResponse = (message: string, payload: FormData) => ({
  message,
  payload: payload,
  success: false,
});
