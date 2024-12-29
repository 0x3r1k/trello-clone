import { createAuthClient } from "better-auth/client";

const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
});

const signIn = async () => {
  const { data, error } = await authClient.signIn.social({
    provider: "google",
  });

  return { data, error };
};

const signOut = async () => {
  return await authClient.signOut();
};

export { signIn, signOut, authClient };
