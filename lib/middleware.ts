import { createBrowserClient, createServerClient } from "@supabase/ssr";
import { type CookieOptions } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Middleware client
export const createMiddleware = async (context: { cookies: any }) => {
	const cookieStore = context.cookies();

	return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
		cookies: {
			get(name: string) {
				return cookieStore.get(name)?.value;
			},
			set(name: string, value: string, options: CookieOptions) {
				try {
					cookieStore.set(name, value, options);
				} catch (error) {}
			},
			remove(name: string, options: CookieOptions) {
				try {
					cookieStore.set(name, "", { ...options, maxAge: -1 });
				} catch (error) {}
			},
		},
	});
};
