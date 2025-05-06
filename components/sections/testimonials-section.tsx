"use client"

import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

const testimonials = [
  {
    quote: "This app has been a lifesaver for our family memories. No more worrying about running out of space on our phones!",
    author: "Sarah J.",
    role: "Mother of 2",
    initials: "SJ",
    avatarUrl: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150"
  },
  {
    quote: "I've tried many apps, but this is the only one that makes organizing family photos actually enjoyable. The interface is beautiful and easy to use.",
    author: "Michael T.",
    role: "Father of 3",
    initials: "MT",
    avatarUrl: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150"
  },
  {
    quote: "Being able to access our memories from any device is fantastic. When I got a new phone, everything was there waiting for me.",
    author: "Emily R.",
    role: "Mother of 1",
    initials: "ER",
    avatarUrl: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150"
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by Parents</h2>
          <p className="text-muted-foreground text-lg">
            Join thousands of parents who preserve their precious family memories with us.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <Card className="h-full border-border/60 bg-background">
                <CardContent className="pt-6 flex flex-col justify-between h-full">
                  <div>
                    <div className="mb-4 text-muted-foreground">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-chart-4">★</span>
                      ))}
                    </div>
                    <p className="mb-6 italic text-foreground/90">"{testimonial.quote}"</p>
                  </div>
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3 border-2 border-primary/10">
                      <AvatarImage src={testimonial.avatarUrl} alt={testimonial.author} />
                      <AvatarFallback>{testimonial.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{testimonial.author}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}