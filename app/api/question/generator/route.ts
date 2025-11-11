import { createSuccessResponse } from '@/lib/api/common/response-helper';
import { validateUserSession } from '@/lib/auth/validate-user-session';
import { genericCatchError } from '@/lib/error-handling/api';
import { FieldSchemas } from '@/lib/zod';
import { StatusCodes } from 'http-status-codes';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  try {
    const authResponse = await validateUserSession('API');
    if (authResponse instanceof NextResponse) return authResponse;

    const reqData = await req.json();

    const client = new OpenAI();

    const prompt = `Write a one-sentence question that encourages 
    the person answering it to look at the problem or topic from a new 
    direction. Topics and problems should be related to life and 
    encourage people to ask themselves the big questions that help 
    us make our lives better. These can be related to general happiness, 
    life purpose, career, relationships, etc. If provided, also consider 
    this: ${reqData.payload.customiseQuestion}
    
    Ensure that the question is open-ended and thought-provoking.
    Also that it respects the question rules of ${JSON.stringify(FieldSchemas.question)}`;

    const response = await client.responses.create({
      model: 'gpt-5-nano',
      input: prompt,
    });

    return createSuccessResponse(
      {
        question: response.output_text,
      },
      'Retrieved',
      StatusCodes.OK
    );
  } catch (err: Error | unknown) {
    return genericCatchError(err);
  }
}
