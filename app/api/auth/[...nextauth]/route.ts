import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth/next-auth-options';
import { NextRequest, NextResponse } from 'next/server';

// const handler = NextAuth(await authOptions());

const handler = async (req: NextRequest) => {
  try {
    console.log('✅ NextAuth initialized');
    const options = await authOptions();
    return NextAuth(options)(req);
  } catch (err) {
    console.error('❌ Failed initializing NextAuth:', err);
    return NextResponse.error();
  }
};

export { handler as GET, handler as POST };
