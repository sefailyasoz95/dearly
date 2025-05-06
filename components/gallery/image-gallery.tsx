"use client"

import { useState } from "react";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Heart, MoreHorizontal, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Demo data
const demoImages = [
  {
    id: "1",
    src: "https://images.pexels.com/photos/1661004/pexels-photo-1661004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    alt: "Family at the beach",
    title: "Summer vacation",
    date: new Date("2023-07-15"),
    favorite: true
  },
  {
    id: "2",
    src: "https://images.pexels.com/photos/3933281/pexels-photo-3933281.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    alt: "Birthday cake",
    title: "Emma's 5th birthday",
    date: new Date("2023-03-22"),
    favorite: false
  },
  // ... rest of the demo images
];

interface ImageGalleryProps {
  viewType: "grid" | "list";
  searchQuery: string;
}

export function ImageGallery({ viewType, searchQuery }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<typeof demoImages[0] | null>(null);
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>(
    demoImages.reduce((acc, img) => ({ ...acc, [img.id]: img.favorite }), {})
  );

  const filteredImages = demoImages.filter(img => {
    const matchesSearch = searchQuery === "" || 
      img.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.alt.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  const toggleFavorite = (id: string) => {
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (viewType === "grid") {
    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              className="overflow-hidden rounded-lg border border-border/40 bg-card/30 hover:bg-card/60 transition-colors group"
            >
              <div className="relative cursor-pointer" onClick={() => setSelectedImage(image)}>
                <AspectRatio ratio={4/3}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform group-hover:scale-105 duration-300"
                  />
                </AspectRatio>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 w-full p-3">
                    <p className="text-white font-medium line-clamp-1">{image.title}</p>
                    <p className="text-white/80 text-xs">{format(image.date, 'MMM d, yyyy')}</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center p-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(image.id);
                  }}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      favorites[image.id] ? "fill-red-500 text-red-500" : "text-muted-foreground"
                    }`}
                  />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" /> Download
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2 className="mr-2 h-4 w-4" /> Share
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.div>
          ))}
        </div>
        
        <Dialog open={selectedImage !== null} onOpenChange={(open) => !open && setSelectedImage(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedImage?.title}</DialogTitle>
            </DialogHeader>
            {selectedImage && (
              <div className="relative rounded-lg overflow-hidden">
                <AspectRatio ratio={16/9}>
                  <Image
                    src={selectedImage.src}
                    alt={selectedImage.alt}
                    fill
                    className="object-contain"
                  />
                </AspectRatio>
              </div>
            )}
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">
                  {selectedImage && format(selectedImage.date, 'MMMM d, yyyy')}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" /> Download
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => selectedImage && toggleFavorite(selectedImage.id)}
                >
                  <Heart
                    className={`mr-2 h-4 w-4 ${
                      selectedImage && favorites[selectedImage.id] ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                  {selectedImage && favorites[selectedImage.id] ? "Favorited" : "Favorite"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }
  
  // List view
  return (
    <div className="space-y-3">
      {filteredImages.map((image, index) => (
        <motion.div
          key={image.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="group"
        >
          <Card className="overflow-hidden transition-colors hover:bg-accent/30">
            <CardContent className="p-0">
              <div className="flex items-center">
                <div className="w-20 h-20 sm:w-28 sm:h-28 relative shrink-0 cursor-pointer" onClick={() => setSelectedImage(image)}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 p-3 sm:p-4">
                  <div className="flex justify-between">
                    <div className="mr-4">
                      <h3 className="font-medium line-clamp-1 cursor-pointer" onClick={() => setSelectedImage(image)}>
                        {image.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">{format(image.date, 'MMM d, yyyy')}</p>
                    </div>
                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleFavorite(image.id)}
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            favorites[image.id] ? "fill-red-500 text-red-500" : "text-muted-foreground"
                          }`}
                        />
                      </Button>
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-auto p-2">
                          <p className="text-xs">Share this memory</p>
                        </HoverCardContent>
                      </HoverCard>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" /> Download
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
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
      
      <Dialog open={selectedImage !== null} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedImage?.title}</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="relative rounded-lg overflow-hidden">
              <AspectRatio ratio={16/9}>
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  fill
                  className="object-contain"
                />
              </AspectRatio>
            </div>
          )}
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">
                {selectedImage && format(selectedImage.date, 'MMMM d, yyyy')}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" /> Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => selectedImage && toggleFavorite(selectedImage.id)}
              >
                <Heart
                  className={`mr-2 h-4 w-4 ${
                    selectedImage && favorites[selectedImage.id] ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                {selectedImage && favorites[selectedImage.id] ? "Favorited" : "Favorite"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}