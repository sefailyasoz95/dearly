"use client";

import { createRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Plus, MoreHorizontal, MapPin, Camera, Heart, Music, Star, Coffee, Plane } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Album } from "@/types/supabase";

const albumIcons = [
	{ icon: MapPin, color: "from-red-500/20 to-orange-500/20" },
	{ icon: Camera, color: "from-blue-500/20 to-cyan-500/20" },
	{ icon: Heart, color: "from-pink-500/20 to-rose-500/20" },
	{ icon: Music, color: "from-purple-500/20 to-violet-500/20" },
	{ icon: Star, color: "from-yellow-500/20 to-amber-500/20" },
	{ icon: Coffee, color: "from-orange-500/20 to-amber-500/20" },
	{ icon: Plane, color: "from-sky-500/20 to-blue-500/20" },
];

// Demo albums
const demoAlbums = [
	{
		id: "japan-2024",
		name: "Japan 2024",
		count: 83,
		icon: Plane,
		gradientColor: "from-red-500/20 to-pink-500/20",
	},
	{
		id: "paris-2024",
		name: "Paris 2024",
		count: 62,
		icon: MapPin,
		gradientColor: "from-blue-500/20 to-indigo-500/20",
	},
	{
		id: "amsterdam-2024",
		name: "Amsterdam 2024",
		count: 68,
		icon: Star,
		gradientColor: "from-orange-500/20 to-amber-500/20",
	},
	{
		id: "other",
		name: "Other Photos",
		count: 247,
		icon: Camera,
		gradientColor: "from-green-500/20 to-emerald-500/20",
	},
];

export default function AlbumsPage() {
	const [newAlbumName, setNewAlbumName] = useState("");
	const [selectedIcon, setSelectedIcon] = useState(0);
	const [searchQuery, setSearchQuery] = useState("");
	const [albums, setAlbums] = useState<Album[]>([]);
	const uploadRef = createRef<HTMLInputElement>();
	const handleCreateAlbum = () => {
		console.log("Creating new album:", { name: newAlbumName, icon: selectedIcon });
		setNewAlbumName("");
		setSelectedIcon(0);
	};
	const getAlbums = async () => {
		try {
			const response = await fetch("/api/albums");
			const data = await response.json();
			setAlbums(data.albums);
		} catch (error) {}
	};
	useEffect(() => {
		getAlbums();
	}, []);

	return (
		<div className='container py-6 md:py-10'>
			<div className='flex flex-col gap-6'>
				<motion.div
					className='flex flex-col sm:flex-row justify-between gap-4'
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}>
					<div className='flex-1'>
						<h1 className='text-3xl font-bold mb-1'>Your Albums</h1>
						<p className='text-muted-foreground'>Organize your memories into collections</p>
					</div>

					<div className='flex gap-2 items-start'>
						<Dialog>
							<DialogTrigger asChild>
								<Button>
									<Plus className='mr-2 h-4 w-4' />
									New Album
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Create a new album</DialogTitle>
								</DialogHeader>
								<div className='space-y-4 py-2'>
									<div className='space-y-2'>
										<Label htmlFor='album-name'>Album Name</Label>
										<Input
											id='album-name'
											placeholder='Enter album name'
											value={newAlbumName}
											onChange={(e) => setNewAlbumName(e.target.value)}
										/>
									</div>
									<div className='space-y-2'>
										<input className='hidden' ref={uploadRef} type='image/*' />
										<Button
											onClick={() => {
												uploadRef.current?.click();
											}}>
											Upload Photo
										</Button>
									</div>
									<div className='flex justify-end'>
										<Button onClick={handleCreateAlbum} disabled={!newAlbumName.trim()}>
											Create Album
										</Button>
									</div>
								</div>
							</DialogContent>
						</Dialog>
					</div>
				</motion.div>

				<div className='relative max-w-sm'>
					<Input
						type='search'
						placeholder='Search albums...'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>

				<motion.div
					className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.4, delay: 0.1 }}>
					{albums.map((album, index) => {
						return (
							<motion.div
								key={album.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}>
								<Link href={`/dashboard/gallery?album=${album.id}`}>
									<Card className='group relative overflow-hidden border-border/40 hover:bg-accent/50 transition-colors'>
										<div
											className={cn(
												"absolute inset-0 bg-cover bg-center opacity-50",
												!album.cover_image && "from-blue-500/20 to-indigo-500/20"
											)}
											style={{ backgroundImage: `url(${album.cover_image})` }}
										/>
										<div className='relative p-6'>
											<div className='flex justify-between items-start'>
												{/* <div className='bg-background/80 backdrop-blur-sm rounded-full p-3'>
													<Icon className='h-6 w-6' />
												</div> */}
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant='ghost' size='icon' className='h-8 w-8'>
															<MoreHorizontal className='h-4 w-4' />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align='end'>
														<DropdownMenuItem>Rename</DropdownMenuItem>
														<DropdownMenuItem>Share Album</DropdownMenuItem>
														<DropdownMenuSeparator />
														<DropdownMenuItem className='text-destructive'>Delete</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</div>
											<div className='mt-4'>
												<h3 className='font-medium text-lg'>{album.name}</h3>
												{/* <p className='text-sm text-muted-foreground'>{album.count} photos</p> */}
											</div>
										</div>
									</Card>
								</Link>
							</motion.div>
						);
					})}
				</motion.div>
			</div>
		</div>
	);
}
