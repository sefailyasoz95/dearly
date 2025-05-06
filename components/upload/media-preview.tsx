"use client"

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface MediaPreviewProps {
  files: File[];
  onRemove: (index: number) => void;
}

export function MediaPreview({ files, onRemove }: MediaPreviewProps) {
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    // Create object URLs for the files
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviews(urls);

    // Clean up the object URLs when the component unmounts or when files change
    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [files]);

  if (files.length === 0) {
    return (
      <div className="text-center py-6 border-2 border-dashed border-border rounded-lg">
        <p className="text-sm text-muted-foreground">No files selected</p>
      </div>
    );
  }

  return (
    <>
      {previews.map((preview, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative rounded-md overflow-hidden border border-border group"
        >
          {files[index].type.startsWith('video/') ? (
            <video
              src={preview}
              className="w-full h-auto object-cover"
              style={{ maxHeight: "180px" }}
              controls
            />
          ) : (
            <img
              src={preview}
              alt={`Preview ${index}`}
              className="w-full h-auto object-cover"
              style={{ maxHeight: "180px" }}
            />
          )}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="destructive"
              size="icon"
              className="h-6 w-6 rounded-full"
              onClick={() => onRemove(index)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <div className="p-2 text-xs truncate">
            {files[index].name}
          </div>
        </motion.div>
      ))}
    </>
  );
}