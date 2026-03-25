import React from 'react'
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

const CTASection = () => (
  <section className="py-20 lg:py-32">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background p-12 text-center lg:p-20"
      >
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
        <h2 className="text-3xl font-bold text-foreground sm:text-4xl mb-4">
          Ready to Take Control of Your Finances?
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-8">
          Join thousands of users who are already managing their money smarter. Start your free trial today.
        </p>
        <Link to="/signup">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base px-8 h-12 gap-2">
            Get Started Free
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </motion.div>
    </div>
  </section>
);

export default CTASection;