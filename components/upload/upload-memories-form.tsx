// components/upload/upload-memories-form.tsx
"use client";

import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { UploadDropzone } from "@/components/upload/upload-dropzone";
import { MediaPreview } from "@/components/upload/media-preview";
import { ArrowUp, Loader2 } from "lucide-react";
import { Album } from "@/types/supabase";

interface UploadMemoriesFormProps {
  albums: Album[];
  familyId: string;
  userId: string;
}

export function UploadMemoriesForm({
  albums,
  familyId,
  userId,
}: UploadMemoriesFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState<{
    title: string;
    description: string;
    albumId: string;
    date: string;
  }>({
    title: "",
    description: "",
    albumId: "",
    date: new Date().toISOString().split("T")[0],
  });
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const onDrop = (acceptedFiles: File[]) => {
    // Filter for image and video files
    const mediaFiles = acceptedFiles.filter(
      (file) => file.type.startsWith("image/") || file.type.startsWith("video/")
    );

    setFiles((prev) => [...prev, ...mediaFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { name: string; value: string }
  ) => {
    const { name, value } = "target" in e ? e.target : e;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // if (files.length === 0) {
    //   toast({
    //     title: "No files selected",
    //     description: "Please select at least one photo or video to upload.",
    //     variant: "destructive",
    //   });
    //   return;
    // }

    // if (!formState.title || !formState.albumId) {
    //   toast({
    //     title: "Missing information",
    //     description: "Please fill in all required fields.",
    //     variant: "destructive",
    //   });
    //   return;
    // }

    // Create FormData
    const formData = new FormData();
    formData.append("title", formState.title);
    formData.append("description", formState.description);
    formData.append("albumId", formState.albumId);
    formData.append("date", formState.date);
    formData.append("familyId", familyId);
    formData.append("userId", userId);

    // Append files
    files.forEach((file, index) => {
      formData.append(`file-${index}`, file);
    });

    // Submit with server action
    startTransition(async () => {
      //   const result = await uploadMediaAction({
      //     success: false,
      //     message: '',
      //     error: false
      //   }, formData);
      //   if (result.success) {
      //     // toast({
      //     //   title: "Upload successful",
      //     //   description: `${result.uploadedCount} ${result.uploadedCount === 1 ? 'file' : 'files'} uploaded.`,
      //     // });
      //     // Reset form
      //     setFiles([]);
      //     setFormState({
      //       title: "",
      //       description: "",
      //       albumId: "",
      //       date: new Date().toISOString().split('T')[0],
      //     });
      //     formRef.current?.reset();
      //     // Redirect
      //     if (result.redirectTo) {
      //       router.push(result.redirectTo);
      //     }
      //   } else {
      //     toast({
      //       title: "Upload failed",
      //       description: result.message || "There was an error uploading your files.",
      //       variant: "destructive",
      //     });
      //   }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
      <Card className="bg-card text-card-foreground">
        <CardContent className="pt-6">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title <span className="text-destructive">*</span>
              </label>
              <Input
                id="title"
                name="title"
                placeholder="Enter a title for these memories"
                value={formState.title}
                onChange={handleChange}
                required
                className="w-full bg-background border-input"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                placeholder="Add some details about these memories"
                value={formState.description}
                onChange={handleChange}
                className="resize-none bg-background border-input"
              />
              <p className="text-xs text-muted-foreground">
                Describe these memories to help you find them later.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="albumId" className="text-sm font-medium">
                  Album <span className="text-destructive">*</span>
                </label>
                <Select
                  value={formState.albumId}
                  onValueChange={(value) =>
                    handleSelectChange("albumId", value)
                  }
                >
                  <SelectTrigger className="bg-background border-input">
                    <SelectValue placeholder="Select an album" />
                  </SelectTrigger>
                  <SelectContent>
                    {albums.map((album) => (
                      <SelectItem key={album.id} value={album.id}>
                        {album.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="date" className="text-sm font-medium">
                  Date
                </label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formState.date}
                  onChange={handleChange}
                  className="bg-background border-input"
                />
              </div>
            </div>

            <div className="pt-2">
              <UploadDropzone onDrop={onDrop} />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isPending}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <ArrowUp className="mr-2 h-4 w-4" />
                    Upload Memories
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div>
        <h3 className="font-medium mb-3">Selected Media ({files.length})</h3>
        <div className="space-y-2 overflow-auto max-h-[calc(100vh-300px)] pr-2">
          <MediaPreview files={files} onRemove={removeFile} />
        </div>
      </div>
    </div>
  );
}
