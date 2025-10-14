import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { getAuthSecrets } from '../api/aws/secrets-manager';

let GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
let GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;
let NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET as string;

if (!NEXTAUTH_SECRET) {
  // Lazy-load once, but synchronously for NextAuth
  // Use a top-level await if your Node version supports it (Node 18+)
  const secrets = await getAuthSecrets();
  GOOGLE_CLIENT_ID = secrets.GOOGLE_CLIENT_ID as string;
  GOOGLE_CLIENT_SECRET = secrets.GOOGLE_CLIENT_SECRET as string;
  NEXTAUTH_SECRET = secrets.NEXTAUTH_SECRET as string;
}

export const authOptions = async (): Promise<NextAuthOptions> => {
  return {
    providers: [
      process.env.NEXT_PUBLIC_POINTED_AT_TEST
        ? CredentialsProvider({
            name: 'Test User',
            credentials: {
              username: { label: 'Username', type: 'text' },
            },
            async authorize(credentials) {
              if (credentials?.username === 'test') {
                return {
                  id: 'test-user',
                  name: 'Test User',
                  email: process.env.ADMIN_EMAIL,
                };
              }
              return null;
            },
          })
        : GoogleProvider({
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
          }),
    ],
    secret: NEXTAUTH_SECRET,
    session: { strategy: 'jwt' },
    callbacks: {
      session: ({ session }) => {
        return session;
      },
      jwt: ({ token }) => {
        return token;
      },
    },
  };
};
