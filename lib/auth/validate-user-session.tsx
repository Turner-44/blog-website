import { StatusCodes } from 'http-status-codes';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { createErrorResponse } from '../error-handling/api';
import { ErrorResponse } from '@/types/api/common';
import { NextResponse } from 'next/server';
import { buildAuthOptions } from './next-auth-options';

type ValidationLocation = 'UI' | 'API';

export const validateUserSession = async (
  validationLocation: ValidationLocation
): Promise<NextResponse<ErrorResponse> | void> => {
  const session = await getServerSession(await buildAuthOptions());

  if (validationLocation === 'UI') {
    if (!session) {
      redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/signin`);
    }

    if (session.user?.email !== process.env.ADMIN_EMAIL) {
      redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/403`);
    }
  } else {
    if (!session)
      return NextResponse.json<ErrorResponse>(
        createErrorResponse('Unauthorized'),
        {
          status: StatusCodes.UNAUTHORIZED,
        }
      );
    if (session.user?.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json<ErrorResponse>(
        createErrorResponse('Forbidden'),
        {
          status: StatusCodes.FORBIDDEN,
        }
      );
    }
  }
};
