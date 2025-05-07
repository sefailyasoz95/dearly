"use client";

import { X, FileVideo, FileImage } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";

interface MediaPreviewProps {
  files: File[];
  onRemove: (index: number) => void;
}

export function MediaPreview({ files, onRemove }: MediaPreviewProps) {
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    // Create object URLs for preview
    const objectUrls = files.map((file) => URL.createObjectURL(file));
    setPreviews(objectUrls);

    // Clean up function to revoke object URLs
    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  if (files.length === 0) {
    return (
      <div className="text-center p-4 border border-dashed rounded-lg bg-muted/20">
        <p className="text-sm text-muted-foreground">No files selected</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {files.map((file, index) => {
        const isImage = file.type.startsWith("image/");
        const isVideo = file.type.startsWith("video/");

        return (
          <Card key={index} className="relative overflow-hidden group">
            <div className="p-2 flex items-center gap-2">
              {isImage && previews[index] ? (
                <div className="relative w-full h-24 rounded-md overflow-hidden">
                  <Image
                    src={previews[index]}
                    alt={file.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : isVideo && previews[index] ? (
                <div className="rounded-md overflow-hidden bg-black w-full">
                  <video
                    src={previews[index]}
                    className="max-h-24 mx-auto"
                    controls={false}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileVideo className="h-10 w-10 text-primary-foreground opacity-70" />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full h-24 rounded-md bg-muted/20">
                  {isImage ? (
                    <FileImage className="h-8 w-8 text-muted-foreground" />
                  ) : (
                    <FileVideo className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
              )}

              <div className="absolute top-2 right-2">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onRemove(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="px-2 pb-2">
              <p className="text-xs truncate">{file.name}</p>
              <span className="text-xs text-muted-foreground">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
