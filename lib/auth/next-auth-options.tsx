import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { getAuthSecrets } from '../api/aws/secrets-manager';

export const authOptions = async (): Promise<NextAuthOptions> => {
  const secrets = await getAuthSecrets();
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
