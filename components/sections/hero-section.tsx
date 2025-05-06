"use client"

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function HeroSection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <section className="relative overflow-hidden py-20 md:py-28 lg:py-32">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background">
        <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      </div>
      
      {/* Floating shapes */}
      <motion.div 
        className="absolute top-1/4 left-10 lg:left-40 w-72 h-72 rounded-full bg-gradient-to-tr from-chart-1/20 to-chart-5/30 blur-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />
      <motion.div 
        className="absolute bottom-10 right-10 lg:right-20 w-80 h-80 rounded-full bg-gradient-to-bl from-chart-2/20 to-chart-4/30 blur-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.2 }}
      />
      
      <div className="container relative z-10">
        <motion.div 
          className="flex flex-col items-center text-center max-w-4xl mx-auto"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item} className="mb-2 rounded-full bg-muted px-4 py-1.5 text-sm font-medium">
            Your memories, forever treasured
          </motion.div>
          
          <motion.h1 variants={item} className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Keep your family memories 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-chart-4 via-chart-1 to-chart-2"> safe forever</span>
          </motion.h1>
          
          <motion.p variants={item} className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8">
            Never worry about losing precious family moments again. Upload, organize, and treasure your memories in one secure place, accessible anytime, anywhere.
          </motion.p>
          
          <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Start For Free
              </Button>
            </Link>
            <Link href="/gallery">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Browse Examples
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}