import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth/next-auth-options';

const handler = NextAuth(await authOptions());
export { handler as GET, handler as POST };
