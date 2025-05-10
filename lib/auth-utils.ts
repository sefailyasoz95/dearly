// app/utils/auth-utils.ts
import { createServer } from "@/lib/client";
import { cookies } from "next/headers";
import { cache } from "react";
export const getSession = async () => {
	// This will force dynamic rendering
	(await cookies()).getAll();
	const supabase = await createServer({ cookies });
	const {
		data: { session },
	} = await supabase.auth.getSession();
	return session;
};

// Create a cached function for getting the user profile
export const getUserProfile = cache(async () => {
	const session = await getSession();
	if (!session?.user) return null;

	const supabase = await createServer({ cookies });
	const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();

	return data;
});
