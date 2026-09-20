// src/lib/auth.config.js
import GoogleProvider from "next-auth/providers/google";

const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

      // Mos e aktivizo pa nevojë.
      // allowDangerousEmailAccountLinking: true,
    }),
  ],

  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/error",
    newUser: "/register",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;

        token.role = user.role;
        token.avatar = user.avatar || user.image || null;
        token.image = user.image || user.avatar || null;
        token.emailVerified = user.emailVerified;
      }

      if (trigger === "update" && session) {
        token.name = session.name ?? token.name;
        token.email = session.email ?? token.email;
        token.avatar = session.avatar ?? token.avatar; // ← SHTO
        token.image = session.image ?? token.image; // ← SHTO
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.avatar = token.avatar || token.image || null;
        session.user.image = token.image || token.avatar || null;
        session.user.emailVerified = token.emailVerified;
      }

      return session;
    },
  },
};

export default authConfig;
