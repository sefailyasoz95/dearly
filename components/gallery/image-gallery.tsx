"use client";

import { useState } from "react";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  Heart,
  MoreHorizontal,
  Download,
  Share2,
  Calendar,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Demo data
const demoImages = [
  {
    id: "1",
    src: "https://images.pexels.com/photos/3933281/pexels-photo-3933281.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    alt: "Family at the beach",
    title: "Summer vacation",
    date: new Date("2023-07-15"),
    favorite: true,
  },
  {
    id: "2",
    src: "https://images.pexels.com/photos/3933281/pexels-photo-3933281.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    alt: "Birthday cake",
    title: "Emma's 5th birthday",
    date: new Date("2023-03-22"),
    favorite: false,
  },
  // ... rest of the demo images
];

interface ImageGalleryProps {
  viewType: "grid" | "list";
  searchQuery: string;
}

export function ImageGallery({ viewType, searchQuery }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<
    (typeof demoImages)[0] | null
  >(null);
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>(
    demoImages.reduce((acc, img) => ({ ...acc, [img.id]: img.favorite }), {})
  );

  const filteredImages = demoImages.filter((img) => {
    const matchesSearch =
      searchQuery === "" ||
      img.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.alt.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const emptyState = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center h-64 text-center p-4"
    >
      <div className="text-muted-foreground mb-2 rounded-full bg-muted/30 p-6">
        <Calendar className="h-10 w-10" />
      </div>
      <h3 className="font-medium text-lg mt-4">No memories found</h3>
      <p className="text-muted-foreground max-w-md mt-2">
        {searchQuery
          ? `No results found for "${searchQuery}". Try another search term.`
          : "Your memories will appear here once you add some photos."}
      </p>
    </motion.div>
  );

  if (filteredImages.length === 0) {
    return emptyState;
  }

  if (viewType === "grid") {
    return (
      <>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
        >
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="overflow-hidden rounded-xl border border-border/40 dark:border-border/20 bg-card/30 dark:bg-card/20 hover:bg-card/60 dark:hover:bg-card/40 transition-all duration-300 group relative shadow-sm hover:shadow-md"
            >
              <div
                className="relative cursor-pointer overflow-hidden"
                onClick={() => setSelectedImage(image)}
              >
                <AspectRatio ratio={10 / 11}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105 w-full h-full"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    priority={index < 4}
                  />
                </AspectRatio>
                {/* Permanent gradient overlay with title always visible */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col justify-end p-4">
                  <p className="text-white font-medium text-base sm:text-lg line-clamp-1">
                    {image.title}
                  </p>
                  <div className="flex items-center mt-1 text-white/80 text-xs">
                    <Calendar className="h-3 w-3 mr-1" />
                    {format(image.date, "MMM d, yyyy")}
                  </div>
                </div>

                {/* Action buttons overlay - only visible on hover */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(image.id);
                    }}
                  >
                    <Heart
                      className={cn(
                        "h-5 w-5 transition-all",
                        favorites[image.id]
                          ? "fill-red-500 text-red-500"
                          : "text-white"
                      )}
                    />
                    <span className="sr-only">Favorite</span>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                      >
                        <MoreHorizontal className="h-5 w-5 text-white" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-48 rounded-lg"
                    >
                      <DropdownMenuItem className="cursor-pointer">
                        <Download className="mr-2 h-4 w-4" /> Download
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Share2 className="mr-2 h-4 w-4" /> Share
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive cursor-pointer">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <AnimatePresence>
          {selectedImage && (
            <Dialog
              open={selectedImage !== null}
              onOpenChange={(open) => !open && setSelectedImage(null)}
            >
              <DialogContent className="max-w-4xl overflow-hidden rounded-xl border-border/60 p-0">
                <div className="relative">
                  <AspectRatio
                    ratio={16 / 9}
                    className="bg-black/20 dark:bg-black/40"
                  >
                    <Image
                      src={selectedImage.src}
                      alt={selectedImage.alt}
                      fill
                      priority
                      className="object-contain"
                    />
                  </AspectRatio>
                </div>
                <div className="p-4 sm:p-6">
                  <DialogHeader className="pb-3">
                    <DialogTitle className="text-xl">
                      {selectedImage.title}
                    </DialogTitle>
                    <DialogDescription>
                      {format(selectedImage.date, "MMMM d, yyyy")}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-2">
                    <p className="text-sm text-muted-foreground">
                      {selectedImage.alt}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <Download className="h-4 w-4" /> Download
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <Share2 className="h-4 w-4" /> Share
                      </Button>
                      <Button
                        variant={
                          favorites[selectedImage.id] ? "secondary" : "outline"
                        }
                        size="sm"
                        className={cn(
                          "gap-1.5",
                          favorites[selectedImage.id] &&
                            "bg-rose-500/10 hover:bg-rose-500/20 dark:bg-rose-500/20 dark:hover:bg-rose-500/30 border-rose-200 dark:border-rose-800"
                        )}
                        onClick={() => toggleFavorite(selectedImage.id)}
                      >
                        <Heart
                          className={cn(
                            "h-4 w-4 transition-all",
                            favorites[selectedImage.id]
                              ? "fill-rose-500 text-rose-500"
                              : ""
                          )}
                        />
                        {favorites[selectedImage.id] ? "Favorited" : "Favorite"}
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>
      </>
    );
  }

  // List view
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-3.5"
    >
      {filteredImages.map((image, index) => (
        <motion.div
          key={image.id}
          variants={itemVariants}
          whileHover={{ x: 2 }}
          className="group"
        >
          <Card className="overflow-hidden transition-all duration-300 hover:bg-accent/20 dark:hover:bg-accent/10 border-border/40 dark:border-border/20 shadow-sm hover:shadow">
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center">
                <div
                  className="w-full sm:w-28 sm:h-28 relative cursor-pointer group-hover:opacity-95 transition-opacity overflow-hidden"
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="aspect-video sm:aspect-square w-full">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 112px"
                    />
                  </div>
                </div>
                <div className="flex-1 p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row justify-between gap-2">
                    <div className="mr-4">
                      <h3
                        className="font-medium text-base sm:text-lg line-clamp-1 cursor-pointer hover:text-primary/80 transition-colors"
                        onClick={() => setSelectedImage(image)}
                      >
                        {image.title}
                      </h3>
                      <div className="flex items-center mt-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(image.date, "MMMM d, yyyy")}
                      </div>
                    </div>
                    <div className="flex items-center mt-2 sm:mt-0 gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => toggleFavorite(image.id)}
                      >
                        <Heart
                          className={cn(
                            "h-4 w-4 transition-all",
                            favorites[image.id]
                              ? "fill-red-500 text-red-500"
                              : "text-muted-foreground"
                          )}
                        />
                        <span className="sr-only">Favorite</span>
                      </Button>
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                          >
                            <Share2 className="h-4 w-4" />
                            <span className="sr-only">Share</span>
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-auto p-2 rounded-lg">
                          <p className="text-xs">Share this memory</p>
                        </HoverCardContent>
                      </HoverCard>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More options</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 rounded-lg"
                        >
                          <DropdownMenuItem className="cursor-pointer">
                            <Download className="mr-2 h-4 w-4" /> Download
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive cursor-pointer">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      <AnimatePresence>
        {selectedImage && (
          <Dialog
            open={selectedImage !== null}
            onOpenChange={(open) => !open && setSelectedImage(null)}
          >
            <DialogContent className="max-w-4xl overflow-hidden rounded-xl border-border/60 p-0">
              <div className="relative">
                <AspectRatio
                  ratio={16 / 9}
                  className="bg-black/20 dark:bg-black/40"
                >
                  <Image
                    src={selectedImage.src}
                    alt={selectedImage.alt}
                    fill
                    priority
                    className="object-contain"
                  />
                </AspectRatio>
              </div>
              <div className="p-4 sm:p-6">
                <DialogHeader className="pb-3">
                  <DialogTitle className="text-xl">
                    {selectedImage.title}
                  </DialogTitle>
                  <DialogDescription>
                    {format(selectedImage.date, "MMMM d, yyyy")}
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-2">
                  <p className="text-sm text-muted-foreground">
                    {selectedImage.alt}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Download className="h-4 w-4" /> Download
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Share2 className="h-4 w-4" /> Share
                    </Button>
                    <Button
                      variant={
                        favorites[selectedImage.id] ? "secondary" : "outline"
                      }
                      size="sm"
                      className={cn(
                        "gap-1.5",
                        favorites[selectedImage.id] &&
                          "bg-rose-500/10 hover:bg-rose-500/20 dark:bg-rose-500/20 dark:hover:bg-rose-500/30 border-rose-200 dark:border-rose-800"
                      )}
                      onClick={() => toggleFavorite(selectedImage.id)}
                    >
                      <Heart
                        className={cn(
                          "h-4 w-4 transition-all",
                          favorites[selectedImage.id]
                            ? "fill-rose-500 text-rose-500"
                            : ""
                        )}
                      />
                      {favorites[selectedImage.id] ? "Favorited" : "Favorite"}
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
