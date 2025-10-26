import { createSuccessResponse } from '@/lib/api/common/response-helper';
import { genericCatchError } from '@/lib/error-handling/api';
import { StatusCodes } from 'http-status-codes';

export async function GET() {
  try {
    return createSuccessResponse(
      { Matthew: 'We running boys!' },
      'Health check passed',
      StatusCodes.OK
    );
  } catch (err: Error | unknown) {
    return genericCatchError(err);
  }
}
