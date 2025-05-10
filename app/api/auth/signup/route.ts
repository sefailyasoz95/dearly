import { NextResponse } from "next/server";
import { createServerAdmin } from "@/lib/client";
import { cookies } from "next/headers";

export async function POST(request: Request) {
	try {
		const { firstName, lastName, email, password, familyName, country, city, birthDate } = await request.json();
		const supabase = await createServerAdmin({ cookies });

		// Step 1: Sign up the user with Supabase Auth
		const { data: authData, error: authError } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					first_name: firstName,
					last_name: lastName,
				},
			},
		});

		if (authError) {
			return NextResponse.json({ error: authError.message }, { status: 400 });
		}

		const userId = authData.user?.id;

		if (!userId) {
			return NextResponse.json({ error: "Failed to create user" }, { status: 400 });
		}

		// Step 2: Create a new family record
		const { data: familyData, error: familyError } = await supabase
			.from("families")
			.insert([
				{
					family_name: familyName || `${lastName} Family`,
				},
			])
			.select();

		if (familyError) {
			// Attempt to clean up the auth user if family creation fails
			await supabase.auth.admin.deleteUser(userId);
			return NextResponse.json({ error: familyError.message }, { status: 400 });
		}

		const familyId = familyData[0].id;

		// Step 3: Create a profile record
		const { data: profileData, error: profileError } = await supabase
			.from("profiles")
			.insert([
				{
					id: userId,
					first_name: firstName,
					last_name: lastName,
					email: email,
					birth_date: birthDate || null,
					country: country || null,
					city: city || null,
					family_id: familyId,
					is_paying: true,
					is_active: true,
				},
			])
			.select();

		if (profileError) {
			// Clean up if profile creation fails
			await supabase.from("families").delete().eq("id", familyId);
			await supabase.auth.admin.deleteUser(userId);
			return NextResponse.json({ error: profileError.message }, { status: 400 });
		}

		return NextResponse.json({
			user: authData.user,
			profile: profileData[0],
			family: familyData[0],
		});
	} catch (error) {
		console.error("Registration error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
