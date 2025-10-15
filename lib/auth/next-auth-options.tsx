import { AuthOptions, type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { AuthSecrets } from '@/types/secrets-manager';
import { getAuthSecrets } from '../api/aws/secrets-manager';

export const authOptions = async (
  secrets: AuthSecrets
): Promise<NextAuthOptions> => {
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
            clientId: secrets.GOOGLE_CLIENT_ID,
            clientSecret: secrets.GOOGLE_CLIENT_SECRET,
          }),
    ],
    secret: secrets.NEXTAUTH_SECRET,
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

export async function buildAuthOptions(): Promise<AuthOptions> {
  // Try local environment variables first
  let secrets: AuthSecrets = {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || '',
  };

  // Fallback: fetch from AWS Secrets Manager (Amplify runtime)
  if (
    secrets.GOOGLE_CLIENT_ID === '' ||
    secrets.GOOGLE_CLIENT_SECRET === '' ||
    secrets.NEXTAUTH_SECRET === ''
  ) {
    try {
      secrets = (await getAuthSecrets()) ?? {};
      if (!secrets || Object.keys(secrets).length === 0) {
        console.error('No secrets found');
        throw new Error('Auth configuration error: could not load secrets.');
      }
    } catch (err) {
      console.error('Failed to load auth secrets:', err);
      throw new Error('Auth configuration error: could not load secrets.');
    }
  }

  return await authOptions(secrets);
}
