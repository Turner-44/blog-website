'use client';
import { BlogCreationError } from '@/errors/api-errors';
import { CustomiseQuestionFormData } from '@/types/api/question';
import { UseFormReturnType } from '@mantine/form';
import { errorMessages } from '../blog/create-blog/create-blogs';
import { generateQuestionRequest } from './create-request';
interface QuestionHandlers {
  form: UseFormReturnType<CustomiseQuestionFormData>;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setQuestion: React.Dispatch<React.SetStateAction<string>>;
}

const handleFormValid = (
  { form, setSuccess, setQuestion }: QuestionHandlers,
  result: string
): void => {
  setSuccess(true);
  setQuestion(result);
  form.reset();
};

const handleFormError = (
  { form, setSuccess }: QuestionHandlers,
  result: { message?: string }
): void => {
  setSuccess(false);
  form.setFieldError('root', result.message ?? errorMessages.unknownError);
};

export async function generateQuestion(
  values: CustomiseQuestionFormData,
  form: UseFormReturnType<CustomiseQuestionFormData>,
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>,
  setQuestion: React.Dispatch<React.SetStateAction<string>>
): Promise<void> {
  const handlers: QuestionHandlers = { form, setSuccess, setQuestion };
  try {
    const result = await generateQuestionRequest(values);

    if (result.success) {
      handleFormValid(handlers, result.data.question);
    } else {
      handleFormError(handlers, result);
    }
  } catch (error) {
    const unknownError = new BlogCreationError('Failed to generate question', {
      error,
      timestamp: new Date().toISOString(),
    });
    unknownError.log();

    form.setFieldError('root', errorMessages.tryAgain);
    setSuccess(false);
  }
}
