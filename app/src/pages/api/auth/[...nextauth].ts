import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import GoogleProvider from 'next-auth/providers/google';
import type { NextAuthOptions } from 'next-auth';


export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  // callbacks: {
  //   async jwt({ token, account }) {
  //     // Persist the access token in the token object
  //     if (account) {
  //       token.accessToken = account.access_token;
  //       token.provider = account.provider;
  //     }
  //     return token;
  //   },
  //   async session({ session, token }) {
  //     // Add accessToken to session
  //     session.accessToken = token.accessToken;
  //     session.provider = token.provider;
  //     return session;
  //   },
  // },

  // [TODO] Delete as it is used in debug mode, uncomment section above
  callbacks: {
  async jwt(params) {
    console.log('[JWT Callback]');
    console.log(JSON.stringify(params, null, 2));
    const { token, account } = params;

    // Persist the access token and provider
    if (account) {
      token.accessToken = account.access_token;
      token.provider = account.provider;
    }

    return token;
  },
  async session({ session, token }) {
    session.accessToken = token.accessToken;
    session.provider = token.provider;
    return session;
  },
},

};

export default NextAuth(authOptions);
