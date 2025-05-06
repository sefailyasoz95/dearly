"use client"

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    description: "Perfect for getting started",
    price: "0",
    features: [
      "Store 10 images",
      "512 MB storage space",
      "Basic organization features",
      "Web access",
      "Standard support"
    ]
  },
  {
    name: "Single",
    description: "For individual memory keepers",
    price: "7.99",
    features: [
      "Store 100 images",
      "Store 5 videos",
      "5 GB storage space",
      "Advanced organization",
      "Priority support"
    ]
  },
  {
    name: "Dual",
    description: "Share memories with your partner",
    price: "14.99",
    features: [
      "Store 250 images",
      "Store 10 videos",
      "10 GB storage space",
      "Invite one person",
      "Premium support"
    ],
    popular: true
  },
  {
    name: "Family",
    description: "Perfect for the whole family",
    price: "29.99",
    features: [
      "Store 500 images",
      "Store 20 videos",
      "15 GB storage space",
      "Unlimited family access",
      "24/7 Priority support"
    ]
  },
  {
    name: "God's Plan",
    description: "Ultimate freedom for your memories",
    price: "99.99",
    features: [
      "Unlimited images",
      "Unlimited videos",
      "Unlimited storage",
      "Unlimited sharing",
      "Concierge support"
    ]
  }
];

export function PricingSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background">
        <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      </div>
      
      <motion.div 
        className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-chart-1/20 to-chart-5/20 blur-3xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      />
      
      <div className="container relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Choose Your Perfect Plan
          </motion.h2>
          <motion.p 
            className="text-muted-foreground text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Select a plan that fits your needs and start preserving your precious memories today
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <Card className={`relative h-full ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-0 right-0 mx-auto w-fit px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-primary mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/signup" className="w-full">
                    <Button 
                      className="w-full" 
                      variant={plan.popular ? "default" : "outline"}
                    >
                      Get Started
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}