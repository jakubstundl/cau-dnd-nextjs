/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth, { type NextAuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import GoogleProvider from 'next-auth/providers/google';
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { env } from '../../../env/server';
import { prisma } from '../../../server/db/client';
import CredentialsProvider from 'next-auth/providers/credentials';
import { User, Prisma } from '@prisma/client';
import { generateTokens, hashToken, expiresAt } from './jwt';
import { randomBytes, randomUUID } from 'crypto';



export const authOptions: NextAuthOptions = {
  // Include user.id on session

  pages: {
    signIn: '/login',
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      //type: "credentials",
      //id: "domain-login",

      name: 'Credentials',
      async authorize(
        credentials: Record<'email' | 'password', string> | undefined,
      ) {
        const payload = {
          email: credentials?.email,
          password: credentials?.password,
        };

        const user: User = (await prisma.user.findUnique({
          where: { email: payload.email },
        })) as User;

        if (
          user.password == hashToken(payload.password as string)
        ) {
          return user;
        } else {
          return null;
        }
      },
      credentials: {
        email: { label: 'E-mail', type: 'text ' },
        password: { label: 'Password', type: 'password' },
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        const st = (): string => {
          return randomUUID?.() ?? randomBytes(32).toString('hex');
        };
        session.user.id = token.sub as string;

        const verif = await prisma.user.findUnique({
          where: {
            id: session.user.id
          },
          select: {
            emailVerified: true,
            premium: true
          }
        })
       
        // updates session
        session.user.emailVerified = verif?.emailVerified ? true : false
        session.user.premium = verif?.premium ? true : false

        const s: Prisma.BatchPayload = await prisma.session.updateMany({
          where: { userId: token.sub },
          data: {
            sessionToken: st(),
            expires: new Date(Number(token.exp) * 1000),
          },
        });
        const tokens = generateTokens(token);

        const a: Prisma.BatchPayload = await prisma.account.updateMany({
          where: { userId: token.sub },
          data: {
            access_token: tokens.accessToken,
            refresh_token: tokens.refreshToken,
            expires_at: expiresAt(tokens.accessToken),
            id_token: token.jti as string,
          },
        });
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
   session: {
    // Set to jwt in order to CredentialsProvider works properly
    strategy: 'jwt',
  },
};

export default NextAuth(authOptions);
