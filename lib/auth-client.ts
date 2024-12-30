import { createAuthClient } from "better-auth/client";

const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
});

export { authClient };
