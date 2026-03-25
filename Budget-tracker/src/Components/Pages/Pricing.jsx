/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { Wallet, BarChart, Briefcase, Bot, BrainCircuit, RefreshCw, BookKey, ArrowUp, ArrowDown } from 'lucide-react'

const questions = [
  { id: 1, question: 'What is this platform about?', answer: 'Our platform helps you plan, track, and achieve your financial goals. Whether you\'re budgeting, saving, or investing, we provide tools and insights to make your money work smarter.' },
  { id: 2, question: 'How much does it cost?', answer: 'We offer three pricing tiers: Basic (Free), Pro ($4.99/month), and Ultimate ($7.99/month). Each plan is designed to fit different needs and budgets.' },
  { id: 3, question: 'Is my financial data secure?', answer: 'Absolutely! We use bank-grade encryption and industry-leading security standards to protect your data. Your privacy and security are our top priorities.' },
  { id: 4, question: 'Can I cancel my subscription anytime?', answer: 'Yes, you can cancel your subscription at any time. There are no long-term commitments, and you\'ll retain access until the end of your billing period.' },
  { id: 5, question: 'Do you offer a free trial?', answer: 'Yes! Our Basic plan is completely free forever. For Pro and Ultimate plans, you can try them risk-free with our 14-day money-back guarantee.' },
  { id: 6, question: 'Can I upgrade or downgrade my plan?', answer: 'Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades will apply at the start of your next billing cycle.' },
  { id: 7, question: 'What payment methods do you accept?', answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual subscriptions.' },
]

const features = [
  { icon: BrainCircuit, label: 'Smart Insights' },
  { icon: RefreshCw, label: 'Real-Time Sync' },
  { icon: BookKey, label: 'Bank-Grade Security' },
  { icon: Bot, label: 'AI Integrations' },
]

// Reusable card style
const cardBase = `
  backdrop-blur-lg bg-[rgba(18,18,18,0.75)] rounded-2xl p-8 w-full
  border border-white/10 text-white
  [background-image:radial-gradient(ellipse_at_top_right,rgba(0,255,178,0.2),transparent_10%),radial-gradient(circle_at_bottom_left,rgba(0,255,178,0.2),transparent_20%)]
`

const planFeatureList = (items) => (
  <ul className="mt-4 space-y-2">
    {items.map((item, i) => (
      <li key={i} className="text-sm text-white/80">{item}</li>
    ))}
  </ul>
)

function Pricing() {
  const [activeQuestion, setActiveQuestion] = useState(null)

  return (
    <div className="min-h-screen text-white pt-44 bg-background [background-image:radial-gradient(ellipse_at_top,rgba(0,255,178,0.1),transparent_50%)]">

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h5 className="text-[#79b897] font-semibold tracking-wide mb-2">Pricing</h5>
        <h1 className="text-5xl font-bold leading-tight mb-4" style={{ fontFamily: "'Trebuchet MS', sans-serif" }}>
          Budgeting. Control. Freedom. <br /> For Everyone.
        </h1>
        <p className="text-[#98989a] max-w-2xl mx-auto">
          Select the plan that fits your lifestyle and business and take charge of your finances effortlessly with the help of Tracker.
        </p>
      </div>

      {/* Feature Icons */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex flex-wrap justify-center gap-8">
          {features.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <Icon strokeWidth={0.75} size={22} className="text-white/70" />
              <p className="text-[10px] font-medium text-white/70">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Plans Title */}
      <div className="text-center mb-8">
        <p className="text-2xl font-bold" style={{ fontFamily: "'Courier New', monospace" }}>Monthly plans</p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

          {/* Basic */}
          <div className={`${cardBase} shadow-none`}>
            <Wallet size={44} strokeWidth={1} className="mb-4 text-white/80" />
            <h5 className="text-lg font-semibold mb-1">Basic Plan</h5>
            <p className="text-sm text-white/60 mb-4">Perfect for individuals starting their financial journey.</p>
            <h3 className="text-3xl font-bold mb-4">Free</h3>
            <button className="w-full py-2 rounded-lg border border-white/30 text-white hover:bg-white/10 transition-colors mb-4">
              Try Now
            </button>
            <p className="text-xs text-white/50 mb-2">Includes</p>
            {planFeatureList(['✅ Budget planner & tracker', '✅ Up to 3 financial goals', '✅ Monthly spending analysis', '✅ Email support'])}
          </div>

          {/* Pro — featured, taller */}
          <div className={`${cardBase} shadow-[0_0_30px_rgba(0,0,0,0.2)] ring-1 ring-primary/30 md:-mt-6`}>
            <div className="text-right text-yellow-400 text-xs font-bold mb-2">⭐ Best Offer</div>
            <BarChart size={44} strokeWidth={1} className="mb-4 text-white/80" />
            <h5 className="text-lg font-semibold mb-1">Pro Plan</h5>
            <p className="text-sm text-white/60 mb-4">Designed for users who want more control over their finances.</p>
            <div className="flex items-end gap-1 mb-4">
              <h3 className="text-3xl font-bold">$4.99</h3>
              <span className="text-xs text-white/50 mb-1">/ Month</span>
            </div>
            <button className="w-full py-2 rounded-lg border border-white/30 text-white hover:bg-white/10 transition-colors mb-4">
              Try Now
            </button>
            <p className="text-xs text-white/50 mb-2">Includes everything in Basic, plus:</p>
            {planFeatureList([
              '✅ Unlimited budget categories',
              '✅ Bill reminders & recurring payments',
              '✅ Export data to CSV/Excel',
              '✅ Set savings targets',
              '✅ Track income & expenses',
              '✅ Secure data encryption',
            ])}
          </div>

          {/* Ultimate */}
          <div className={`${cardBase} shadow-none`}>
            <Briefcase size={44} strokeWidth={1} className="mb-4 text-white/80" />
            <h5 className="text-lg font-semibold mb-1">Ultimate Plan</h5>
            <p className="text-sm text-white/60 mb-4">For families or advanced users managing multiple incomes.</p>
            <div className="flex items-end gap-1 mb-4">
              <h3 className="text-3xl font-bold">$7.99</h3>
              <span className="text-xs text-white/50 mb-1">/ Month</span>
            </div>
            <button className="w-full py-2 rounded-lg border border-white/30 text-white hover:bg-white/10 transition-colors mb-4">
              Try Now
            </button>
            <p className="text-xs text-white/50 mb-2">Includes everything in Pro, plus:</p>
            {planFeatureList([
              '✅ Family/Joint budgeting (up to 5 users)',
              '✅ Customizable financial reports',
              '✅ Advanced goal tracking & projections',
              '✅ In-app chat support',
              '✅ Smart financial insight',
              '✅ AI-powered financial suggestions',
              '✅ 24/7 premium support',
              '✅ Real-time sync across devices',
            ])}
          </div>

        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-7xl mx-auto px-4 pb-32 text-center">
        <h5 className="text-[#79b897] font-semibold tracking-wide mb-2">FAQ</h5>
        <h1 className="text-5xl font-bold mb-3" style={{ fontFamily: "'Trebuchet MS', sans-serif" }}>
          Frequently Asked Questions.
        </h1>
        <p className="text-[#98989a] mb-12">Got questions? We've got answers. Find everything you need to know below.</p>

        <div className="flex flex-col items-center gap-3">
          {questions.map((q) => (
            <div key={q.id} className="w-full max-w-2xl rounded-xl bg-[#09110d] overflow-hidden">
              <button
                className="w-full flex justify-between items-center px-5 py-4 text-left text-base font-semibold text-[#e8fff6] hover:bg-black/10 transition-colors"
                onClick={() => setActiveQuestion(activeQuestion === q.id ? null : q.id)}
              >
                <span>{q.question}</span>
                {activeQuestion === q.id ? <ArrowUp className="h-4 w-4 shrink-0" /> : <ArrowDown className="h-4 w-4 shrink-0" />}
              </button>
              <AnimatePresence>
                {activeQuestion === q.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="px-5 pb-4 text-left text-[#c0d1cc] text-sm leading-relaxed">{q.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Pricing