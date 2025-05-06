"use client"

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type Album = {
  id: string;
  name: string;
};

interface AlbumFilterProps {
  albums: Album[];
  activeAlbum: string;
  setActiveAlbum: (id: string) => void;
}

export function AlbumFilter({ albums, activeAlbum, setActiveAlbum }: AlbumFilterProps) {
  return (
    <div className="space-y-1">
      {albums.map((album) => (
        <Button
          key={album.id}
          variant="ghost"
          className={cn(
            "w-full justify-start relative",
            activeAlbum === album.id 
              ? "bg-accent text-accent-foreground font-medium" 
              : "hover:bg-accent/50"
          )}
          onClick={() => setActiveAlbum(album.id)}
        >
          {activeAlbum === album.id && (
            <motion.div 
              className="absolute left-0 w-1 h-4/5 bg-primary rounded-r-full"
              layoutId="activeAlbumIndicator"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
          <span className="ml-2">{album.name}</span>
        </Button>
      ))}
    </div>
  );
}