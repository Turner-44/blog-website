'use server';

import { CustomiseQuestionFormData } from '@/types/api/question';
import { cookies } from 'next/headers';
import { postJsonRequest } from '../common/post';
import { QuestionGenerationResponses } from '@/types/api/question-generation';

export const generateQuestionRequest = async (
  payload: CustomiseQuestionFormData
) => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  return await postJsonRequest<QuestionGenerationResponses['Post']>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/question/generator`,
    { payload },
    cookieHeader
  );
};
