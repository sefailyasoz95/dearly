"use client";

import { supabase } from "@/lib/client";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect } from "react";

// Create context
export const AuthContext = createContext(null);

// Hook to use the auth context
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === null) {
		throw new Error("useAuth must be used within a AuthProvider");
	}
	return context;
};

// Provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const router = useRouter();

	useEffect(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event) => {
			if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
				// Refresh the page to update server data
				router.refresh();
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	}, [router]);

	return <>{children}</>;
};
