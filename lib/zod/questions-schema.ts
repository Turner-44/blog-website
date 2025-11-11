import { z } from 'zod';
import { FieldSchemas } from './field-schema';

export const storeQuestionSchema = z.object({
  PK: z.literal('QUESTION'),
  SK: FieldSchemas.sk,
  id: FieldSchemas.id,
  question: FieldSchemas.question,
  createdAt: FieldSchemas.createdAt,
});

export const questionUiFormSchema = z.object({
  customiseQuestion: FieldSchemas.customiseQuestion,
});
