import type { DefaultSession } from "next-auth";
import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Discord],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.id = account.providerAccountId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        // NextAuth の JWT token 型には `id` プロパティが定義されていないため、
        // module augmentation で完全に対応するには NextAuth 内部型の拡張が必要。
        // 現状は `as string` で対応。
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
