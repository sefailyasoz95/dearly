import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/layout/header";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/components/auth-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Dearly - Family Memories Archive",
	description: "Store and treasure your family memories forever",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body className={cn(inter.className, "min-h-screen bg-background")}>
				<AuthProvider>
					<ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
						<div className='relative flex min-h-screen flex-col items-center'>
							<Header />
							<main className='flex-1'>{children}</main>
							<Toaster />
						</div>
					</ThemeProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
