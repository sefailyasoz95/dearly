"use client"

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UploadDropzone } from "@/components/upload/upload-dropzone";
import { MediaPreview } from "@/components/upload/media-preview";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  description: z.string().optional(),
  album: z.string().min(1, { message: "Please select an album." }),
  date: z.string().min(1, { message: "Please select a date." }),
});

// Demo albums for the form
const albums = [
  { id: "family", name: "Family" },
  { id: "vacation", name: "Vacation 2023" },
  { id: "birthday", name: "Birthday Party" },
  { id: "holidays", name: "Holidays" },
  { id: "school", name: "School Events" },
];

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      album: "",
      date: new Date().toISOString().split('T')[0],
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Filter for image and video files
    const mediaFiles = acceptedFiles.filter(file => 
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );
    
    setFiles(prev => [...prev, ...mediaFiles]);
  }, []);

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one photo or video to upload.",
        variant: "destructive",
      });
      return;
    }
    
    setUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setUploading(false);
      toast({
        title: "Upload successful",
        description: `${files.length} ${files.length === 1 ? 'file' : 'files'} uploaded to ${values.album}.`,
      });
      router.push("/gallery");
    }, 2000);
    
    console.log(values, files);
  }

  return (
    <div className="container py-6 md:py-10">
      <motion.div 
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1">Upload Memories</h1>
          <p className="text-muted-foreground">Add new photos and videos to your collection</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter a title for these memories" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Add some details about these memories" 
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Describe these memories to help you find them later.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="album"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Album</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an album" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {albums.map(album => (
                                <SelectItem key={album.id} value={album.id}>
                                  {album.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="pt-2">
                    <UploadDropzone onDrop={onDrop} />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit" disabled={uploading}>
                      {uploading ? "Uploading..." : "Upload Memories"}
                    </Button>
                  </div>
                </form>
              </Form>
            </motion.div>
          </div>
          
          <div>
            <h3 className="font-medium mb-3">Selected Media ({files.length})</h3>
            <div className="space-y-2 overflow-auto max-h-[calc(100vh-300px)] pr-2">
              <MediaPreview files={files} onRemove={removeFile} />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}