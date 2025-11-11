'use server';
import { cookies } from 'next/headers';
import { postJsonRequest } from '../common/post';

export const storeQuestion = async (question: string) => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const questionResponse = await postJsonRequest(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/question`,
    { question },
    cookieHeader
  );

  return questionResponse;
};
