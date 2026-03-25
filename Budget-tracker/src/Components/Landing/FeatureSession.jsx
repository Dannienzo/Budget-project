import React from 'react'
import { motion } from "framer-motion";
import { PieChart, TrendingUp, Wallet, Target, Bell, FileText } from "lucide-react";

const features = [
  { icon: Wallet, title: "Expense Tracking", description: "Log every transaction with smart categorization. See where your money goes at a glance." },
  { icon: PieChart, title: "Visual Analytics", description: "Interactive charts and graphs that make understanding your finances effortless." },
  { icon: Target, title: "Budget Goals", description: "Set monthly budgets per category and track progress with visual indicators." },
  { icon: TrendingUp, title: "Income Tracking", description: "Monitor multiple income streams and see your net worth grow over time." },
  { icon: Bell, title: "Smart Alerts", description: "Get notified when you're approaching budget limits or unusual spending is detected." },
  { icon: FileText, title: "Reports & Export", description: "Generate detailed reports and export to CSV or Excel for your records." },
];

const FeaturesSection = () => (
  <section className="py-20 lg:py-32">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-2xl text-center mb-16"
      >
        <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
          Everything You Need to{" "}
          <span className="text-primary">Manage Finances</span>
        </h2>
        <p className="mt-4 text-muted-foreground">
          A comprehensive suite of tools designed to simplify your financial life.
        </p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border border-border/60 bg-card p-6 transition-all hover:border-primary/30"
          >
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
              <feature.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;