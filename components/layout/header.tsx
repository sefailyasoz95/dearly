// app/components/header.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { headers } from "next/headers";
import { getSession } from "@/lib/auth-utils";

const navItems = [
	{ href: "/dashboard/gallery", label: "Gallery" },
	{ href: "/dashboard/albums", label: "Albums" },
	{ href: "/dashboard/upload", label: "Upload" },
];

export default async function Header() {
	// Use the cached getSession function - will be re-evaluated when auth changes
	const session = await getSession();
	const headersList = await headers();
	const pathname = headersList.get("x-current-path");

	return (
		<header className='sticky top-0 py-3 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
			<div className='container flex h-16 items-center justify-between mx-auto'>
				<Link href='/' className='flex items-center gap-2 font-semibold'>
					<div className='rounded-lg'>
						<Image src={"./Dearly_Logo.png"} alt='logo' width={100} height={100} />
					</div>
				</Link>

				{session && (
					<nav className='hidden md:flex gap-6 mx-6'>
						{navItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									"text-sm font-medium transition-colors hover:text-primary relative py-1.5",
									pathname?.includes(item.href) ? "text-foreground" : "text-muted-foreground"
								)}>
								{item.label}
							</Link>
						))}
					</nav>
				)}

				<div className='flex items-center gap-2'>
					<ThemeToggle />
					{!session && (
						<div className='hidden md:flex gap-2'>
							<Link href='/login'>
								<Button variant='ghost' size='sm'>
									Login
								</Button>
							</Link>
							<Link href='/signup'>
								<Button size='sm'>Sign Up</Button>
							</Link>
						</div>
					)}
					{session && (
						<div className='hidden md:flex gap-2'>
							<Link href='/dashboard/logout'>
								<Button variant='ghost' size='sm'>
									Log out
								</Button>
							</Link>
						</div>
					)}
					<Sheet>
						<SheetTrigger asChild className='md:hidden'>
							<Button variant='ghost' size='icon'>
								<Menu className='h-5 w-5' />
							</Button>
						</SheetTrigger>
						<SheetContent side='right' className='w-[80%] sm:w-[350px]'>
							<div className='flex flex-col gap-6 mt-6'>
								{navItems.map((item) => (
									<Link
										key={item.href}
										href={item.href}
										className='text-sm font-medium transition-colors hover:text-primary'>
										{item.label}
									</Link>
								))}
								{!session && (
									<div className='flex flex-col gap-2 mt-4'>
										<Link href='/login'>
											<Button variant='outline' className='w-full' size='sm'>
												Login
											</Button>
										</Link>
										<Link href='/signup'>
											<Button className='w-full' size='sm'>
												Sign Up
											</Button>
										</Link>
									</div>
								)}
								{session && (
									<div className='flex flex-col gap-2 mt-4'>
										<Link href='/dashboard/logout'>
											<Button variant='outline' className='w-full' size='sm'>
												Log out
											</Button>
										</Link>
									</div>
								)}
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	);
}
