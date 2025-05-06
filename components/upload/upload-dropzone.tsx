"use client"

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Image, Film } from "lucide-react";

interface UploadDropzoneProps {
  onDrop: (acceptedFiles: File[]) => void;
}

export function UploadDropzone({ onDrop }: UploadDropzoneProps) {
  const onDropCallback = useCallback(
    (acceptedFiles: File[]) => {
      onDrop(acceptedFiles);
    },
    [onDrop]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropCallback,
    accept: {
      'image/*': [],
      'video/*': []
    }
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-primary/50 hover:bg-muted/50"
    >
      <input {...getInputProps()} />
      <AnimatePresence mode="wait">
        {isDragActive ? (
          <motion.div
            key="dragging"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex flex-col items-center"
          >
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <p className="text-lg font-medium text-primary">Drop your files here</p>
          </motion.div>
        ) : (
          <motion.div 
            key="idle"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex flex-col items-center"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="rounded-full bg-primary/10 p-2">
                <Image className="h-5 w-5 text-primary" />
              </div>
              <div className="rounded-full bg-primary/10 p-2">
                <Film className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="font-medium mb-1">Drag & drop your photos and videos here</p>
            <p className="text-sm text-muted-foreground mb-4">Or click to browse your files</p>
            <p className="text-xs text-muted-foreground">
              Supports images (JPG, PNG, GIF) and videos (MP4, MOV)
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}