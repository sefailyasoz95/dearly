import { NextResponse } from "next/server";
import { createClient } from "@/lib/server";

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, password } = await request.json();
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });
    console.log("data: ", data);
    console.log("error: ", error);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ user: data.user });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
