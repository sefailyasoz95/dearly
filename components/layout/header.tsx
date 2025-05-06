"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
	{ href: "/", label: "Home" },
	{ href: "/gallery", label: "Gallery" },
	{ href: "/albums", label: "Albums" },
	{ href: "/upload", label: "Upload" },
];

export default function Header() {
	const pathname = usePathname();

	return (
		<header className='sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
			<div className='container flex h-16 items-center justify-between mx-auto'>
				<Link href='/' className='flex items-center gap-2 font-semibold'>
					<div className='rounded-lg bg-gradient-to-br from-primary/80 to-primary p-1.5'>
						<span className='text-lg text-primary-foreground'>D</span>
					</div>
					<span className='hidden sm:inline-block'>Dearly</span>
				</Link>

				<nav className='hidden md:flex gap-6 mx-6'>
					{navItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								"text-sm font-medium transition-colors hover:text-primary relative py-1.5",
								pathname === item.href ? "text-foreground" : "text-muted-foreground"
							)}>
							{item.label}
							{pathname === item.href && (
								<motion.span
									className='absolute bottom-0 left-0 h-0.5 w-full bg-primary'
									layoutId='underline'
									transition={{ type: "spring", stiffness: 380, damping: 30 }}
								/>
							)}
						</Link>
					))}
				</nav>

				<div className='flex items-center gap-2'>
					<ThemeToggle />
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
										className={cn(
											"text-sm font-medium transition-colors hover:text-primary",
											pathname === item.href ? "text-foreground" : "text-muted-foreground"
										)}>
										{item.label}
									</Link>
								))}
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
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	);
}
