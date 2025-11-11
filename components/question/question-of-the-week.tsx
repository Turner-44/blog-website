export default function QuestionOfTheWeek({ question }: { question: string }) {
  return (
    <div className="flex flex-col mx-auto">
      <h2 className="mb-2 pl-2">Question of the week?</h2>

      <div className="flex flex-col md:flex-row mx-auto space-y-5 md:space-y-0 md:space-x-10 items-center rounded-2xl bg-green-200 p-5 shadow-md">
        <p className="" data-testid="question">
          {question}
        </p>
      </div>
    </div>
  );
}
