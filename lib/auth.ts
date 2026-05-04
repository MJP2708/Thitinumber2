import "server-only";

import { createNeonAuth } from "@neondatabase/auth/next/server";

type AuthInstance = ReturnType<typeof createNeonAuth>;

// Lazy singleton — createNeonAuth validates its config on construction,
// so we must NOT call it at module-evaluation time (breaks `next build`
// when env vars aren't present locally). Only instantiate on first request.
let _auth: AuthInstance | null = null;

function getAuth(): AuthInstance {
  if (!_auth) {
    _auth = createNeonAuth({
      baseUrl: process.env.NEON_AUTH_BASE_URL!,
      cookies: { secret: process.env.NEON_AUTH_COOKIE_SECRET! },
    });
  }
  return _auth;
}

export function getAuthHandler(): ReturnType<AuthInstance["handler"]> {
  return getAuth().handler();
}

export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}

export async function requireAdmin(): Promise<void> {
  const { data: session } = await getAuth().getSession();
  if (!session?.user) throw new UnauthorizedError();
}
