// app/dashboard/logout/page.tsx
"use client";

import { createClient, supabase } from "@/lib/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function LogoutPage() {
	const router = useRouter();

	const handleLogout = async () => {
		await supabase.auth.signOut();
		window.location.reload();
	};

	return (
		<div className='container flex flex-col items-center justify-center min-h-[70vh] gap-6'>
			<h1 className='text-2xl font-bold'>Are you sure you want to log out?</h1>
			<div className='flex gap-4'>
				<Button variant='destructive' onClick={handleLogout}>
					Yes, Log Out
				</Button>
				<Button variant='outline' onClick={() => router.back()}>
					Cancel
				</Button>
			</div>
		</div>
	);
}
