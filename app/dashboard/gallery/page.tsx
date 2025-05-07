"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageGallery } from "@/components/gallery/image-gallery";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Plus, Grid, List } from "lucide-react";
import Link from "next/link";

export default function GalleryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewType, setViewType] = useState<"grid" | "list">("grid");

  return (
    <div className="container py-6 md:py-10">
      <div className="flex flex-col gap-6">
        <motion.div
          className="flex flex-col md:flex-row justify-between gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-1">Your Gallery</h1>
            <p className="text-muted-foreground">
              Browse and manage your memories
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Link href="/upload">
              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Add Memory
              </Button>
            </Link>
          </div>
        </motion.div>

        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search memories..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Tabs
            defaultValue="grid"
            value={viewType}
            onValueChange={(e) => setViewType(e as any)}
          >
            <TabsList>
              <TabsTrigger value="grid">
                <Grid className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="list">
                <List className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={viewType}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ImageGallery viewType={viewType} searchQuery={searchQuery} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
