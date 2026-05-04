import { createAuthClient } from "@neondatabase/auth/next";

// Singleton client for use in client components.
// Connects to the Neon Auth handler at /api/auth/[...path].
export const authClient = createAuthClient();
