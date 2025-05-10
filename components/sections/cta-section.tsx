"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function CallToActionSection() {
	return (
		<section className='py-20 relative overflow-hidden'>
			{/* Gradient background */}
			<div className='absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background'>
				<div className='absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]' />
			</div>

			<motion.div
				className='absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-bl from-chart-4/20 to-chart-2/20 blur-3xl'
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				transition={{ duration: 1 }}
				viewport={{ once: true }}
			/>

			<div className='container relative z-10'>
				<div className='max-w-3xl mx-auto text-center'>
					<motion.h2
						className='text-3xl md:text-4xl font-bold mb-6'
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}>
						Start Preserving Your Family Memories Today
					</motion.h2>

					<motion.p
						className='text-muted-foreground text-lg mb-8'
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.1 }}
						viewport={{ once: true }}>
						Join thousands of parents who trust us with their precious memories. Sign up today and get started with 5GB
						of free storage.
					</motion.p>

					<motion.div
						className='flex flex-col sm:flex-row justify-center gap-4'
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						viewport={{ once: true }}>
						<Link href='/signup'>
							<Button size='lg' className='w-full sm:w-auto'>
								Get Started For Free
							</Button>
						</Link>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
