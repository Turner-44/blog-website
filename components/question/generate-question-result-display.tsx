'use client';
import { storeQuestion } from '@/lib/api/question/store-question';
import { Button } from '../shared-components/button';
import { BiCheck } from 'react-icons/bi';
import { BiPencil } from 'react-icons/bi';
import { BiX } from 'react-icons/bi';
import { useState } from 'react';

export default function GenerateQuestionResultDisplay({
  newQuestion,
  setNewQuestion,
  setQuestion,
}: {
  newQuestion: string;
  setNewQuestion: (question: string) => void;
  setQuestion: (question: string) => void;
}) {
  const [success, setSuccess] = useState(false);
  const [editing, setEditing] = useState(false);

  return (
    <div className="flex flex-col mx-auto mt-5">
      <h4 className="mb-2 text-center">Do you want to use this question?</h4>
      <div className="flex flex-col md:flex-row mx-auto space-y-5 md:space-y-0 md:space-x-10 items-center">
        {!editing && (
          <p className="" data-testid="question">
            {newQuestion}
          </p>
        )}
        {editing && (
          <textarea
            defaultValue={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            rows={5}
            className="border p-2 rounded-md"
            data-testid="textarea-edit-question"
          />
        )}
        {!success && (
          <div className="flex items-end space-x-2">
            <Button
              onClick={async (event) => {
                event.preventDefault();
                const result = await storeQuestion(newQuestion);
                if (result.success) {
                  setSuccess(true);
                  setQuestion(newQuestion);
                  setNewQuestion('');
                }
              }}
            >
              <BiCheck className="" />
            </Button>
            <Button onClick={() => setEditing(true)}>
              <BiPencil className="" />
            </Button>
            <Button onClick={() => setNewQuestion('')}>
              <BiX className="" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
