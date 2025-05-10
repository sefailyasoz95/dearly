// app/api/albums/route.ts
import { NextResponse } from "next/server";
import { createServer } from "@/lib/client";
import { cookies } from "next/headers";

// GET - List albums
export async function GET(request: Request) {
	try {
		// Initialize Supabase client
		const supabase = await createServer({ cookies });

		// Check if user is authenticated
		const { data: sessionData } = await supabase.auth.getSession();
		if (!sessionData.session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		const family_id = (
			await supabase.from("profiles").select("family_id").eq("id", sessionData.session.user.id).single()
		).data?.family_id;
		// Execute query
		const { data, error } = await supabase.from("albums").select("*").eq("family_id", family_id);
		console.log("error: ", error);
		console.log("data: ", data);

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}

		return NextResponse.json({ albums: data });
	} catch (error) {
		console.error("Error fetching albums:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

// POST - Create new album
export async function POST(request: Request) {
	try {
		const { name, familyId, parentAlbumId, coverImage } = await request.json();

		// Input validation
		if (!name || !familyId) {
			return NextResponse.json({ error: "Album name and family ID are required" }, { status: 400 });
		}

		// Initialize Supabase client
		const supabase = await createServer({ cookies });

		// Check if user is authenticated
		const { data: sessionData } = await supabase.auth.getSession();
		if (!sessionData.session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Verify user belongs to the specified family
		const { data: profileData } = await supabase
			.from("profiles")
			.select("family_id")
			.eq("id", sessionData.session.user.id)
			.single();

		if (!profileData || profileData.family_id !== familyId) {
			return NextResponse.json(
				{ error: "You don't have permission to create albums for this family" },
				{ status: 403 }
			);
		}

		// Create the album
		const { data, error } = await supabase
			.from("albums")
			.insert([
				{
					name,
					family_id: familyId,
					parent_album_id: parentAlbumId || null,
					cover_image: coverImage || null,
					is_active: true,
				},
			])
			.select();

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}

		return NextResponse.json({ album: data[0] }, { status: 201 });
	} catch (error) {
		console.error("Error creating album:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
