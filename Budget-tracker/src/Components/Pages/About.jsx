import React, { useState } from 'react'
import Budgeting from '../../assets/budgeting.png'
import { motion } from "framer-motion"
import { Target, Users, TrendingUp, Heart, Twitter, Linkedin, Instagram, Dribbble } from "lucide-react"

function About() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(formData)
  }

  const values = [
    { icon: Target, title: "Mission-Driven", description: "We believe everyone deserves access to powerful financial tools, regardless of their background." },
    { icon: Users, title: "User-First", description: "Every feature we build starts with understanding real user pain points and needs." },
    { icon: TrendingUp, title: "Continuous Growth", description: "We're constantly improving our platform based on user feedback and emerging technologies." },
    { icon: Heart, title: "Transparency", description: "No hidden fees, no data selling. Your financial data is yours and always will be." },
  ]

  const stats = [
    { value: "50k+", label: "Active Users" },
    { value: "$10M+", label: "Money Managed So Far" },
    { value: "4.9/5", label: "User Rating" },
  ]

  const socialIcons = [
    { icon: Twitter, label: "Twitter" },
    { icon: Linkedin, label: "LinkedIn" },
    { icon: Instagram, label: "Instagram" },
    { icon: Dribbble, label: "Dribbble" },
  ]

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white">

      {/* Hero + Values Section */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-3xl text-center mb-20"
          >
            <h1 className="text-4xl font-bold text-foreground sm:text-5xl mb-6">
              About <span className="text-primary">Smart Budget</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We started Smart Budget & Expenses with a simple belief: managing money shouldn't be complicated.
              Our platform empowers individuals and businesses to track, budget, and grow their finances with confidence.
            </p>
          </motion.div>

          {/* Values Grid */}
          <div className="grid gap-6 sm:grid-cols-2">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-border/60 bg-card p-8"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <v.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{v.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-3">Our Impact in Numbers</h2>
          <p className="text-sm text-[#6d7a73] mb-12">
            We Have Strived Very Hard To Make Sure All Our Users Have A Great Experience And Our Numbers Keep Increasing
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-full sm:w-44 px-6 py-6 rounded-2xl bg-[rgba(154,233,197,0.05)] hover:shadow-[0_0_20px_rgba(84,163,135,0.1)] transition-shadow duration-300"
              >
                <h2 className="text-4xl font-bold text-primary mb-1">{stat.value}</h2>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-[rgb(15,16,16)] rounded-3xl px-8 py-12 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 md:ml-8">
              <h3 className="text-2xl font-bold mb-6">Our Story</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Every great journey begins with a single step — and ours started with a simple goal:
                to empower everyday people to take control of their financial future. We realized how overwhelming
                budgeting, saving, and investing could be — especially without the right tools or guidance.
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                So, we built a platform that makes managing money smart, simple, and stress-free.
                Today, we help thousands of users stay on top of their finances, make better decisions, and reach their goals faster.
                Whether you're planning your first budget or optimizing a six-figure portfolio, we're here for you — every step of the way.
              </p>
              <button className="mt-2 px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors">
                Learn More
              </button>
            </div>
            <div className="flex-1">
              <img
                src={Budgeting}
                alt="Team working on a project"
                className="w-full rounded-2xl object-cover max-h-[400px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 md:pl-16">
          <div className="mb-12">
            <h2 className="text-5xl font-bold mb-6" style={{ fontFamily: 'cursive' }}>
              Trying to reach us
            </h2>
            <p className="text-muted-foreground">
              Please feel free to contact us and we <br /> will get back to you as soon as we can.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-12">

            {/* Form */}
            <div className="flex-1 max-w-xl">
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { type: 'text', placeholder: 'Name', key: 'name' },
                  { type: 'email', placeholder: 'Email', key: 'email' },
                ].map((field) => (
                  <div key={field.key} className="flex items-center border border-white/15 rounded-xl bg-white/5 overflow-hidden">
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={formData[field.key]}
                      onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                      className="w-full bg-transparent text-white placeholder-white/70 px-4 py-3 outline-none text-[0.95rem]"
                    />
                  </div>
                ))}
                <div className="flex items-start border border-white/15 rounded-xl bg-white/5 overflow-hidden">
                  <textarea
                    rows={4}
                    placeholder="Message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-transparent text-white placeholder-white/70 px-4 py-3 outline-none text-[0.95rem] resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-10 py-3 bg-white text-black font-semibold text-lg hover:bg-white/90 transition-colors"
                >
                  Send
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="md:mt-4 md:pl-12">
              <h5 className="text-xs font-bold uppercase tracking-widest mb-3">Visit us</h5>
              <p className="text-muted-foreground mb-6">263 Homebush Road<br />Strathfield South 2136</p>

              <h5 className="text-xs font-bold uppercase tracking-widest mb-3">Talk to us</h5>
              <p className="text-muted-foreground mb-1">+61 421 307 998</p>
              <p className="text-muted-foreground mb-6">helena@helenarvan.com</p>

              <div className="flex gap-4 text-muted-foreground">
                {socialIcons.map(({ icon: Icon, label }) => (
                  <Icon
                    key={label}
                    className="h-5 w-5 hover:text-primary cursor-pointer transition-colors"
                  />
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}

export default About