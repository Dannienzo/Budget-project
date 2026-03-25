import React from 'react'
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Clock } from "lucide-react";

const posts = [
  { title: "10 Budgeting Tips That Actually Work in 2026", excerpt: "Discover practical budgeting strategies that help you save more without feeling restricted. From the 50/30/20 rule to zero-based budgeting.", date: "Mar 1, 2026", readTime: "5 min read", category: "Budgeting" },
  { title: "How to Track Expenses Without the Hassle", excerpt: "Learn how automated expense tracking can save you hours each month and give you better insights into your spending habits.", date: "Feb 20, 2026", readTime: "4 min read", category: "Tips & Tricks" },
  { title: "Understanding Your Spending Patterns with Analytics", excerpt: "Deep dive into how data visualization can reveal hidden spending patterns and help you make smarter financial decisions.", date: "Feb 12, 2026", readTime: "6 min read", category: "Analytics" },
  { title: "Setting Financial Goals You'll Actually Achieve", excerpt: "Goal-setting strategies backed by psychology that help you stay motivated and on track with your savings targets.", date: "Feb 5, 2026", readTime: "4 min read", category: "Goals" },
  { title: "The Complete Guide to Emergency Funds", excerpt: "Everything you need to know about building and maintaining an emergency fund that protects you from financial surprises.", date: "Jan 28, 2026", readTime: "7 min read", category: "Savings" },
  { title: "Smart Budget vs Traditional Spreadsheets", excerpt: "Why dedicated budgeting tools outperform spreadsheets and how to make the switch without losing your data.", date: "Jan 15, 2026", readTime: "5 min read", category: "Product" },
];

const Blog = () => (
  <div className="min-h-screen bg-background">
    <section className="pt-32 pb-20 lg:pt-40 lg:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground sm:text-5xl mb-4">
            Our <span className="text-primary">Blog</span>
          </h1>
          <p className="text-lg text-muted-foreground">Financial tips, product updates, and insights to help you manage money smarter.</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group rounded-xl border border-border/60 bg-card overflow-hidden transition-all hover:border-primary/30"
            >
              <div className="h-40 bg-gradient-to-br from-primary/20 via-secondary to-card flex items-center justify-center">
                <span className="text-xs font-medium text-primary bg-primary/10 rounded-full px-3 py-1">{post.category}</span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.date}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readTime}</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{post.excerpt}</p>
                <span className="inline-flex items-center gap-1 text-sm text-primary font-medium cursor-pointer hover:gap-2 transition-all">
                  Read More <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default Blog;