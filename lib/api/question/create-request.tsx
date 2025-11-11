'use server';

import { CustomiseQuestionFormData } from '@/types/api/question';
import { cookies } from 'next/headers';
import { postJsonRequest } from '../common/post';

export const generateQuestionRequest = async (
  payload: CustomiseQuestionFormData
) => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  return await postJsonRequest<any>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/question/generator`,
    { payload },
    cookieHeader
  );
};
