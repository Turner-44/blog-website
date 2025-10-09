import { genericCatchError } from '@/lib/api/error-handling/api';
import { StatusCodes } from 'http-status-codes';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json(
      {
        ok: true,
      },
      { status: StatusCodes.OK }
    );
  } catch (err: Error | unknown) {
    return genericCatchError(err);
  }
}
