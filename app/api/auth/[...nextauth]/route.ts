import NextAuth from 'next-auth';
import { buildAuthOptions } from '@/lib/auth/next-auth-options';
import { NextRequest, NextResponse } from 'next/server';

// const handler = NextAuth(await authOptions());

const handler = async (
  req: NextRequest,
  context: { params: Promise<{ nextauth: string[] }> }
) => {
  try {
    console.log('NextAuth initialized');
    const options = await buildAuthOptions();
    return NextAuth(req, context, options);
  } catch (err) {
    console.error('Failed initializing NextAuth:', err);
    return NextResponse.error();
  }
};

export { handler as GET, handler as POST };
