// src/lib/auth.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";

import authConfig from "./auth.config";
import dbConnect from "./db";
import User from "@/models/User";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,

  providers: [
    ...authConfig.providers,

    CredentialsProvider({
      name: "credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "email@example.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "******",
        },
      },

      async authorize(credentials) {
        const parsed = z
          .object({
            email: z.email("Email-i nuk është valid"),

            password: z
              .string()
              .min(6, "Fjalëkalimi duhet të jetë së paku 6 karaktere"),
          })
          .safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const email = parsed.data.email.toLowerCase().trim();
        const password = parsed.data.password;

        try {
          await dbConnect();

          const user = await User.findOne({ email }).select("+password");

          if (!user) {
            return null;
          }

          if (!user.password) {
            return null;
          }

          const isMatch = await bcrypt.compare(password, user.password);

          if (!isMatch) {
            return null;
          }

          if (!user.emailVerified) {
            return null;
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            emailVerified: user.emailVerified,
          };
        } catch (error) {
          console.error("[Auth authorize database error]", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    ...authConfig.callbacks,

    async signIn({ user, account }) {
      if (account?.provider !== "google") {
        return true;
      }

      if (!user.email) {
        return false;
      }

      const email = user.email.toLowerCase().trim();
      const googleAvatar = user.image || null;

      try {
        await dbConnect();

        // console.log("[Google signIn] Upsert user:", email);

        const dbUser = await User.findOneAndUpdate(
          { email },
          {
            $set: {
              name: user.name || "Google User",
              avatar: googleAvatar,
              emailVerified: user.emailVerified || new Date(),
            },
            // email vendoset automatikisht nga filtri gjatë insert-it
            $setOnInsert: {
              password: null,
              role: "customer",
            },
          },
          {
            upsert: true,
            returnDocument: "after",
            setDefaultsOnInsert: true,
          },
        );

        if (!dbUser) {
          console.error("[Google signIn] Upsert nuk ktheu asnjë user:", email); //
          return false;
        }

        // console.log(
        //   "[Google signIn] User u ruajt në DB:",
        //   dbUser._id.toString(),
        // ); //

        // Normalizo fushat e Auth.js me fushat custom të aplikacionit
        user.id = dbUser._id.toString();
        user.name = dbUser.name;
        user.email = dbUser.email;
        user.avatar = dbUser.avatar || googleAvatar;
        user.image = dbUser.avatar || googleAvatar;
        user.role = dbUser.role;
        user.emailVerified = dbUser.emailVerified;

        return true;
      } catch (error) {
        console.error("[Google signIn] Gabim gjatë ruajtjes në DB:", error);
        return false;
      }
    },
  },

  trustHost: true,

  debug: process.env.NODE_ENV === "development",

  logger: {
    error(code, ...metadata) {
      console.error(`[Auth Error] ${code}`, metadata);
    },

    warn(code) {
      console.warn(`[Auth Warning] ${code}`);
    },

    debug(code, ...metadata) {
      if (process.env.NODE_ENV === "development") {
        console.debug(`[Auth Debug] ${code}`, metadata);
      }
    },
  },
});
