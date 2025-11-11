'use client';

import { TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { CustomiseQuestionFormData } from '@/types/api/question';
import { generateQuestion } from '@/lib/api/question/generate-question';
import { useState } from 'react';
import { errorMessages } from '@/lib/api/blog/create-blog/create-blogs';
import { questionUiFormSchema } from '@/lib/zod/questions-schema';
import { Button } from '../shared-components/button';
import GenerateQuestionResultDisplay from './generate-question-result-display';
import QuestionOfTheWeek from './question-of-the-week';

export default function GenerateQuestionForm({
  currentQuestion,
}: {
  currentQuestion: string;
}) {
  const form = useForm<CustomiseQuestionFormData>({
    initialValues: {
      customiseQuestion: '',
    },
    validate: zod4Resolver(questionUiFormSchema),
  });

  const [success, setSuccess] = useState(false);
  const [question, setQuestion] = useState<string>(currentQuestion);
  const [newQuestion, setNewQuestion] = useState('');
  useState(false);

  return (
    <div className="flex flex-col mx-auto my-3">
      <QuestionOfTheWeek question={question} />
      <div className="mx-auto w-1/3 duration-500 border-b-2 border-black rounded my-5" />
      {!newQuestion && (
        <div className="flex flex-col">
          <h3>Time for a new question?</h3>
          <form
            className="flex flex-col md:flex-row w-full mx-auto mt-2 space-y-5 md:space-y-0 md:space-x-1 md:items-end"
            onSubmit={form.onSubmit(
              async (values) => {
                await generateQuestion(
                  values,
                  form,
                  setSuccess,
                  setNewQuestion
                );
              },
              () => {
                form.setFieldError('root', errorMessages.fixErrorsAbove);
              }
            )}
          >
            <TextInput
              label="Customise your question prompt (optional):"
              name="customiseQuestion"
              wrapperProps={{ 'data-testid': 'field-customise-question' }}
              data-testid="input-customise-question"
              {...form.getInputProps('customiseQuestion')}
              className="flex-grow"
            />

            <Button
              type="submit"
              fontSize={'tiny'}
              className="Button-primary py-2.5"
              disabled={form.submitting}
              data-testid="btn-blog-publish"
            >
              {form.submitting ? 'Thinking...' : 'Generate'}
            </Button>
          </form>
        </div>
      )}
      {!success && (
        <p
          className="text-red-600 text-center mt-4"
          data-testid="form-error-message"
        >
          {form.errors.root}
        </p>
      )}
      {success && !form.submitting && newQuestion && (
        <GenerateQuestionResultDisplay
          newQuestion={newQuestion}
          setNewQuestion={setNewQuestion}
          setQuestion={setQuestion}
        />
      )}
    </div>
  );
}
