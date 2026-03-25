import React from 'react'
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  { name: "Sarah Johnson", role: "Freelancer", content: "This app completely transformed how I manage my freelance income and expenses. The analytics are incredible!" },
  { name: "Michael Chen", role: "Small Business Owner", content: "Finally a budgeting tool that's both powerful and easy to use. The export feature saves me hours every month." },
  { name: "Emily Rodriguez", role: "Student", content: "As a student on a tight budget, this app helped me save 30% more each month. The budget alerts are a lifesaver!" },
];

const TestimonialsSection = () => (
  <section className="py-20 lg:py-32 border-t border-border/30">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-2xl text-center mb-16"
      >
        <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
          Loved by <span className="text-primary">Thousands</span>
        </h2>
        <p className="mt-4 text-muted-foreground">See what our users have to say about Smart Budget.</p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="rounded-xl border border-border/60 bg-card p-6"
          >
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, j) => (
                <Star key={j} className="h-4 w-4 fill-primary text-primary" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{t.content}"</p>
            <div>
              <p className="text-sm font-semibold text-foreground">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;