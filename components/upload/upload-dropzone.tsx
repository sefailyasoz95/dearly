"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Cloud, File, Image } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
      "image/*": [],
      "video/*": [],
    },
    maxSize: 30 * 1024 * 1024, // 30MB
  });

  return (
    <Card
      className={`border-2 border-dashed rounded-lg ${
        isDragActive
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 bg-background hover:bg-muted/50"
      } transition-colors`}
    >
      <CardContent
        {...getRootProps()}
        className="flex flex-col items-center justify-center py-10 text-center cursor-pointer"
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center justify-center space-y-2">
          {isDragActive ? (
            <Cloud className="h-10 w-10 text-primary animate-bounce" />
          ) : (
            <div className="flex items-center justify-center">
              <Image className="h-8 w-8 text-muted-foreground mr-2" />
              <File className="h-8 w-8 text-muted-foreground" />
            </div>
          )}

          <div className="flex flex-col items-center">
            <p className="text-base font-medium">
              {isDragActive
                ? "Drop your files here"
                : "Drag & drop your files here"}
            </p>
            <p className="text-sm text-muted-foreground">
              or click to browse your device
            </p>
          </div>

          <p className="text-xs text-muted-foreground pt-2">
            Supports images and videos up to 30MB
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
