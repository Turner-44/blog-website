import { z } from 'zod';
import { storeQuestionSchema } from '@/lib/zod/questions-schema';
import { FieldSchemas } from '@/lib/zod';

export type Question = z.infer<typeof storeQuestionSchema>;

export type CustomiseQuestionFormData = {
  customiseQuestion: z.infer<typeof FieldSchemas.customiseQuestion>;
};

export type StoreQuestionFormData = {
  question: z.infer<typeof FieldSchemas.question>;
};

export type QuestionResponses = {
  // Post: ;
  Get: QuestionGetResponse;
  Delete: QuestionDeleteResponse;
};

interface QuestionGetResponse {
  questions: Question[];
}

interface QuestionDeleteResponse {
  message: string;
  PK: string;
  SK: string;
}
