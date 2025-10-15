import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth/next-auth-options';

// const handler = NextAuth(await authOptions());

let handler: any;

try {
  const options = await authOptions();
  console.log('✅ NextAuth initialized');
  handler = NextAuth(options);
} catch (err) {
  console.error('❌ Failed initializing NextAuth:', err);
  // temporary fallback
  handler = (_req: any, res: any) => {
    res
      .status(500)
      .json({ error: 'NextAuth init failed', message: String(err) });
  };
}
export { handler as GET, handler as POST };
