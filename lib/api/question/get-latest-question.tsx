import { fetchOptions } from '@/lib/api/common/caching';
import { getRequest } from '@/lib/api/common/get';
import { Question, QuestionResponses } from '@/types/api/question';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@/errors/api-errors';

// TODO: Make return object type for Question

export const getLatestQuestion = async (): Promise<Question> => {
  const questionRes = await getRequest<QuestionResponses['Get']>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/question?`,
    fetchOptions.question
  );

  if (!questionRes.success) {
    const validationError = new NotFoundError('No questions found', {
      questionRes,
    });
    validationError.log();
    notFound();
  }

  return (
    questionRes.data.questions[0] ?? {
      question: 'Waiting for you to generate a question',
    }
  );
};
