import { betterAuth, BetterAuthOptions } from "better-auth";
import { openAPI } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";

import { Pool } from "pg";
import { sendEmail } from "@/actions/email";

export const auth = betterAuth({
  plugins: [openAPI(), nextCookies()],
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  }),
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ user, newEmail, url }) => {
        await sendEmail({
          to: user.email,
          subject: "Verify your email change",
          text: `Click the following link to verify your new email address: ${url}\nThe new email address: ${newEmail}\n\nIf you didn't request this change, please contact us immediately.`,
        });
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the following link to reset your password: ${url}`,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, token }) => {
      const verificationUrl = `${process.env.BETTER_AUTH_URL}/api/auth/verify-email?token=${token}&callbackURL=${process.env.EMAIL_VERIFICATION_CALLBACK_URL}`;

      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        text: `Click the following link to verify your email address: ${verificationUrl}`,
      });
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
  },
} satisfies BetterAuthOptions);

export type Session = typeof auth.$Infer.Session;
