// auth.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const MOCK_USERS = [
  { email: 'john@example.com', password: 'password123', name: 'John Doe' },
  { email: 'jane@example.com', password: 'password123', name: 'Jane Smith' },
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please add valid email and password!');
        }

        const user = MOCK_USERS.find(
          (u) => u.email === credentials.email && u.password === credentials.password
        );

        if (user) {
          return {
            id: user.email,
            email: user.email,
            name: user.name,
          };
        }

        return null; // Return null in v5 if authentication fails
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'default-secret-key',
});