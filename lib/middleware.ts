import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Accepts a raw cookie string and returns a Supabase middleware client.
 */
export const createMiddleware = async ({
  cookies,
}: {
  cookies: () => string;
}) => {
  let cookieHeader = cookies();

  // Store updated cookies here to be set later in the middleware response
  const updatedCookies: Record<string, string> = {};

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string) {
        const match = cookieHeader.match(new RegExp(`${name}=([^;]*)`));
        return match?.[1];
      },
      set(name: string, value: string, options?: CookieOptions) {
        // Store the cookie update (you can set this on the response if needed)
        const serialized = `${name}=${value}`;
        updatedCookies[name] = serialized;
      },
      remove(name: string, options?: CookieOptions) {
        // Invalidate the cookie
        updatedCookies[name] = `${name}=; Max-Age=0`;
      },
    },
  });
};
