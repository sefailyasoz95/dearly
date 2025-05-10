// app/api/albums/[id]/route.ts
import { NextResponse } from "next/server";
import { createServer } from "@/lib/client";
import { cookies } from "next/headers";

// GET - Fetch a single album by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
	try {
		const id = params.id;

		// Initialize Supabase client
		const supabase = await createServer({ cookies });

		// Check if user is authenticated
		const { data: sessionData } = await supabase.auth.getSession();
		if (!sessionData.session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Fetch the album
		const { data, error } = await supabase
			.from("albums")
			.select("*, profiles!albums_family_id_fkey(id, first_name, last_name)")
			.eq("id", id)
			.single();

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}

		if (!data) {
			return NextResponse.json({ error: "Album not found" }, { status: 404 });
		}

		// Check if user has access to this album's family
		const { data: userProfile } = await supabase
			.from("profiles")
			.select("family_id")
			.eq("id", sessionData.session.user.id)
			.single();

		if (!userProfile || userProfile.family_id !== data.family_id) {
			return NextResponse.json({ error: "You don't have permission to view this album" }, { status: 403 });
		}

		// Fetch child albums if any
		const { data: childAlbums } = await supabase
			.from("albums")
			.select("id, name, cover_image")
			.eq("parent_album_id", id)
			.eq("is_active", true);

		// Fetch media items in this album
		const { data: mediaItems } = await supabase.from("media").select("*").eq("album_id", id).eq("is_active", true);

		return NextResponse.json({
			album: data,
			childAlbums: childAlbums || [],
			mediaItems: mediaItems || [],
		});
	} catch (error) {
		console.error("Error fetching album:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

// PATCH - Update an album
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
	try {
		const id = params.id;
		const { name, parentAlbumId, coverImage } = await request.json();

		// Initialize Supabase client
		const supabase = await createServer({ cookies });

		// Check if user is authenticated
		const { data: sessionData } = await supabase.auth.getSession();
		if (!sessionData.session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Fetch the album to check permissions
		const { data: album, error: fetchError } = await supabase.from("albums").select("family_id").eq("id", id).single();

		if (fetchError || !album) {
			return NextResponse.json({ error: fetchError?.message || "Album not found" }, { status: fetchError ? 400 : 404 });
		}

		// Check if user has access to this album's family
		const { data: userProfile } = await supabase
			.from("profiles")
			.select("family_id")
			.eq("id", sessionData.session.user.id)
			.single();

		if (!userProfile || userProfile.family_id !== album.family_id) {
			return NextResponse.json({ error: "You don't have permission to update this album" }, { status: 403 });
		}

		// Prepare update data
		const updateData: any = {};
		if (name !== undefined) updateData.name = name;
		if (parentAlbumId !== undefined) updateData.parent_album_id = parentAlbumId;
		if (coverImage !== undefined) updateData.cover_image = coverImage;

		// Update the album
		const { data, error } = await supabase.from("albums").update(updateData).eq("id", id).select();

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}

		return NextResponse.json({ album: data[0] });
	} catch (error) {
		console.error("Error updating album:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

// DELETE - Soft delete an album (set is_active to false)
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
	try {
		const id = params.id;

		// Initialize Supabase client
		const supabase = await createServer({ cookies });

		// Check if user is authenticated
		const { data: sessionData } = await supabase.auth.getSession();
		if (!sessionData.session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Fetch the album to check permissions
		const { data: album, error: fetchError } = await supabase.from("albums").select("family_id").eq("id", id).single();

		if (fetchError || !album) {
			return NextResponse.json({ error: fetchError?.message || "Album not found" }, { status: fetchError ? 400 : 404 });
		}

		// Check if user has access to this album's family
		const { data: userProfile } = await supabase
			.from("profiles")
			.select("family_id")
			.eq("id", sessionData.session.user.id)
			.single();

		if (!userProfile || userProfile.family_id !== album.family_id) {
			return NextResponse.json({ error: "You don't have permission to delete this album" }, { status: 403 });
		}

		// Soft delete the album (set is_active to false)
		const { data, error } = await supabase.from("albums").update({ is_active: false }).eq("id", id).select();

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}

		// Also soft delete all child albums recursively
		await softDeleteChildAlbums(supabase, id);

		return NextResponse.json({ message: "Album successfully deleted" });
	} catch (error) {
		console.error("Error deleting album:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

// Helper function to recursively soft delete child albums
async function softDeleteChildAlbums(supabase: any, parentId: string) {
	// Find all child albums
	const { data: childAlbums } = await supabase
		.from("albums")
		.select("id")
		.eq("parent_album_id", parentId)
		.eq("is_active", true);

	if (!childAlbums || childAlbums.length === 0) return;

	// Get array of child album IDs
	const childIds = childAlbums.map((album: any) => album.id);

	// Soft delete all child albums
	await supabase.from("albums").update({ is_active: false }).in("id", childIds);

	// Recursively delete their children
	for (const childId of childIds) {
		await softDeleteChildAlbums(supabase, childId);
	}
}
