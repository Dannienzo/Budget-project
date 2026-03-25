import React from 'react'
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Shield, Zap } from "lucide-react"
import { Button } from '../ui/Button';

const HeroSection = () => (
  <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
            <Zap className="h-3.5 w-3.5" />
            Smart Financial Management
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-tight">
            Master Your Money with{" "}
            <span className="text-primary">Smart Budgeting</span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Track expenses, set budgets, analyze spending patterns, and achieve your financial goals — all in one powerful dashboard.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base px-8 h-12 gap-2">
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="text-base px-8 h-12 border-border hover:bg-secondary">
                Learn More
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 grid grid-cols-3 gap-8"
        >
          {[
            { value: "50K+", label: "Active Users" },
            { value: "$2.5M+", label: "Tracked Monthly" },
            { value: "99.9%", label: "Uptime" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="mt-20 grid gap-6 md:grid-cols-3"
      >
        {[
          {
            icon: BarChart3,
            title: "Real-time Analytics",
            description: "Deep insights into spending patterns with interactive charts and visual reports.",
            color: "text-green-400",
          },
          {
            icon: Shield,
            title: "Budget Protection",
            description: "Set spending limits by category and get alerts before you overspend.",
            color: "text-primary",
          },
          {
            icon: Zap,
            title: "Smart Tracking",
            description: "Automatically categorize transactions and track your financial goals effortlessly.",
            color: "text-purple-400",
          },
        ].map((feature) => (
          <div
            key={feature.title}
            className="group rounded-xl border border-border/60 bg-card p-6 transition-all hover:border-primary/40 hover:shadow-[0_0_30px_-10px_hsl(155_100%_50%/0.15)]"
          >
            <feature.icon className={`h-10 w-10 ${feature.color} mb-4`} />
            <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default HeroSection;