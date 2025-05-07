"use client";

import {
  Cloud,
  Image,
  Lock,
  Smartphone,
  Share2,
  Search,
  Album,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: <Cloud className="h-6 w-6" />,
    title: "Cloud Storage",
    description:
      "Free up your device storage while keeping all your memories accessible anytime.",
  },
  {
    icon: <Lock className="h-6 w-6" />,
    title: "Secure & Private",
    description:
      "Your memories are encrypted and visible only to those you choose to share them with.",
  },
  {
    icon: <Smartphone className="h-6 w-6" />,
    title: "Device Independent",
    description:
      "Access your memories from any device, regardless of platform or operating system.",
  },
  {
    icon: <Album className="h-6 w-6" />,
    title: "Smart Albums",
    description:
      "Organize your memories into albums for birthdays, vacations, and special occasions.",
  },
  {
    icon: <Calendar className="h-6 w-6" />,
    title: "Timeline View",
    description:
      "See your memories organized chronologically to relive moments as they happened.",
  },
  {
    icon: <Search className="h-6 w-6" />,
    title: "Quick Search",
    description:
      "Find specific memories fast with our powerful search and filtering tools.",
  },
  {
    icon: <Image className="h-6 w-6" />,
    title: "HD Quality",
    description:
      "Store high-definition photos and videos without compromising on quality.",
  },
  {
    icon: <Share2 className="h-6 w-6" />,
    title: "Easy Sharing",
    description:
      "Share memories with family members while maintaining full control over privacy.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-muted/50 rounded-lg drop-shadow-lg">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need for Your Family Memories
          </h2>
          <p className="text-muted-foreground text-lg">
            Designed specifically for parents who want to preserve precious
            moments without technical hassle.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mx-2">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <Card className="h-full border-border/50 bg-card/50 rounded-lg backdrop-blur-sm hover:bg-card/80 transition-colors">
                <CardHeader>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
