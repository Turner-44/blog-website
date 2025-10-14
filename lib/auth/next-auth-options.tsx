import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { getAuthSecrets } from '../api/aws/secrets-manager';

let cachedSecrets: {
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  NEXTAUTH_SECRET: string;
} | null = null;

export const authOptions = async (): Promise<NextAuthOptions> => {
  let GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
  let GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;
  let NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET as string;

  if (!NEXTAUTH_SECRET) {
    if (!cachedSecrets) {
      try {
        const secrets = await getAuthSecrets();
        cachedSecrets = secrets;
      } catch (err) {
        console.error('Failed to fetch secrets', err);
        throw err;
      }
      GOOGLE_CLIENT_ID = cachedSecrets.GOOGLE_CLIENT_ID as string;
      GOOGLE_CLIENT_SECRET = cachedSecrets.GOOGLE_CLIENT_SECRET as string;
      NEXTAUTH_SECRET = cachedSecrets.NEXTAUTH_SECRET as string;
    } else {
      console.log('Using cached secrets');
    }
  }

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
