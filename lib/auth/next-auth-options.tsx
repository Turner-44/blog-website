import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
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
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
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
