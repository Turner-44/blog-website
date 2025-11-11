import { validateUserSession } from '@/lib/auth/validate-user-session';
import GenerateQuestionForm from '@/components/question/generate-question-form';
import { getLatestQuestion } from '@/lib/api/question/get-latest-question';

export default async function AdminPage() {
  await validateUserSession('UI');
  const data = await getLatestQuestion();

  return (
    <main className="flex flex-col w-full">
      <GenerateQuestionForm currentQuestion={data.question} />
    </main>
  );
}
