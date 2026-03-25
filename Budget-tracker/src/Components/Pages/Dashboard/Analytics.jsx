import React, { useState, useEffect } from 'react';
import { useBudget } from '../../Context/Context';
import { ArrowDownRight, ArrowUpRight, TrendingUp, TrendingDown, Target, Activity, BarChart3, Loader2, RefreshCw } from 'lucide-react';
import { Area, AreaChart, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts'

// Simple Animated Counter
const AnimatedCounter = ({ value, duration = 1000, formatter }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const startTime = performance.now();

    const step = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      const currentValue = Math.floor(start + (end - start) * easeOut);

      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [value, duration]);

  return (
    <span>
      {formatter ? formatter(count) : count}
    </span>
  );
};

function Analytics() {
  const { 
    formatCurrency, 
    avgMonthlyExpenses, 
    totalIncome, 
    budgetAdherence, 
    spendingRate, 
    analyticsData, 
    loading, 
    fetchAnalytics 
  } = useBudget();

  const defaultMonthlyData = [
    { month: 'Jan', income: 2800, expenses: 2100, savings: 700 },
    { month: 'Feb', income: 3200, expenses: 2400, savings: 800 },
    { month: 'Mar', income: 3500, expenses: 2800, savings: 700 },
    { month: 'Apr', income: 3100, expenses: 2200, savings: 900 },
    { month: 'May', income: 3300, expenses: 2600, savings: 700 },
    { month: 'Jun', income: 3800, expenses: 3100, savings: 700 },
  ]

  const defaultCategoryData = [
    { category: 'Food', spending: 450, budget: 500 },
    { category: 'Transport', spending: 200, budget: 250 },
    { category: 'Entertainment', spending: 180, budget: 200 },
    { category: 'Shopping', spending: 320, budget: 300 },
    { category: 'Bills', spending: 350, budget: 400 },
    { category: 'Health', spending: 150, budget: 200 },
  ]

  // Fixed: Check for monthlyData (lowercase)
  const MonthlyData = (() => {
    if (analyticsData?.monthlyData && Array.isArray(analyticsData.monthlyData) && analyticsData.monthlyData.length > 0) {
      return analyticsData.monthlyData.map((m) => ({
        month: m.month ? String(m.month).slice(0, 3) : (m.label || '').slice(0, 3),
        income: Number(m.income ?? m.total_income ?? 0),
        expenses: Number(m.expense ?? m.expenses ?? m.total_expense ?? 0),
        savings: Number(m.savings ?? ((m.income ?? 0) - (m.expense ?? m.expenses ?? 0))),
      }))
    }
    return defaultMonthlyData
  })();

  const CategoryData = (() => {
    if (analyticsData?.categoryData && Array.isArray(analyticsData.categoryData) && analyticsData.categoryData.length > 0) {
      return analyticsData.categoryData.map((c) => ({
        category: c.category || c.name || c.label || 'Other',
        spending: Number(c.total ?? c.spending ?? c.spent ?? 0),
        budget: Number(c.budget ?? c.amount ?? 0),
      }))
    }
    return defaultCategoryData;
  })();

  // Fixed: Use correct property names from analyticsData
  const avgMonthlyInflow = analyticsData?.avgMonthlyInflow || 0;
  const avgMonthlyOutflow = analyticsData?.avgMonthlyOutflow || avgMonthlyExpenses || 0;
  const spendingTrend = analyticsData?.spendingTrend || 'stable';

  return (
    <div className='min-h-screen text-white bg-[#0b0b0f]'>
      {/* Clean Header - Mobile Responsive */}
      <div className='border-b border-[#2F2F2F] p-4 sm:p-6'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              <h1 className='text-2xl sm:text-3xl font-bold text-white'>Analytics Dashboard</h1>
            </div>
            <p className='text-gray-400 text-sm sm:text-base'>
              Deep track into your spending patterns and financial insights
            </p>
          </div>

          <div className='flex items-center gap-3'>
            <button
              onClick={fetchAnalytics}
              disabled={loading}
              className='p-2 bg-[#252525] rounded-xl border border-[#333] hover:bg-[#2a2a2a] transition-colors disabled:opacity-50'
              title='Refresh Analytics'
            >
              <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 text-primary ${loading ? 'animate-spin' : ''}`} />
            </button>

            <div className="px-3 sm:px-4 py-2 bg-[#252525] rounded-xl border border-[#333]">
              <span className="text-primary font-medium text-xs sm:text-sm">Live Data</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards - Mobile Responsive */}
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          
          {/* Monthly Average */}
          <div className="relative p-4 sm:p-6 rounded-2xl bg-linear-to-br from-pink-500/10 to-pink-500/5 border border-pink-500/20 hover:border-pink-500/40 hover:shadow-lg hover:shadow-pink-500/10 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400" />
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
            </div>
            <p className="text-pink-400 text-xs sm:text-sm font-medium mb-2">Monthly Average</p>
            <p className="text-xl sm:text-2xl font-bold text-white mb-1">
              {loading ? (
                <Loader2 className='w-5 h-5 sm:w-6 sm:h-6 animate-spin inline' />
              ) : (
                <AnimatedCounter value={avgMonthlyExpenses} formatter={formatCurrency} />
              )}
            </p>
            <p className="text-gray-400 text-xs">12% higher than last month</p>
          </div>

          {/* Total Income */}
          <div className="relative p-4 sm:p-6 rounded-2xl bg-linear-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            </div>
            <p className="text-purple-400 text-xs sm:text-sm font-medium mb-2">Total Income</p>
            <p className="text-xl sm:text-2xl font-bold text-white mb-1">
              {loading ? (
                <Loader2 className='w-5 h-5 sm:w-6 sm:h-6 animate-spin inline' />
              ) : (
                <AnimatedCounter value={totalIncome} formatter={formatCurrency} />
              )}
            </p>
            <p className="text-gray-400 text-xs">Based on your earning</p>
          </div>

          {/* Spending Rate */}
          <div className="p-4 sm:p-6 rounded-2xl bg-linear-to-br from-green-500/10 to-green-500/5 border border-green-500/20 hover:border-green-500/40 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <p className="text-green-400 text-xs sm:text-sm font-medium mb-2">Spending Rate</p>
            <div className="flex items-center space-x-2 mb-1">
              {loading ? (
                <Loader2 className='w-5 h-5 sm:w-6 sm:h-6 animate-spin' />
              ) : (
                <>
                  <p className='text-xl sm:text-2xl font-bold text-white'>{spendingRate.toFixed(1)}%</p>
                  {spendingRate < 80 ? (
                    <TrendingDown className='w-4 h-4 sm:w-5 sm:h-5 text-green-400' />
                  ) : (
                    <TrendingUp className='w-4 h-4 sm:w-5 sm:h-5 text-red-400' />
                  )}
                </>
              )}
            </div>
            <p className='text-gray-400 text-xs'>
              {spendingRate < 80 ? 'Healthy spending' : 'High spending rate'}
            </p>
          </div>

          {/* Budget Adherence */}
          <div className="p-4 sm:p-6 rounded-2xl bg-linear-to-br from-blue-500/10 to-blue-500/5 border border-primary/20 hover:border-primary/40 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            </div>
            <p className="text-primary text-xs sm:text-sm font-medium mb-2">Budget Adherence</p>
            <p className={`text-xl sm:text-2xl font-bold mb-1 ${budgetAdherence >= 50 ? "text-green-400" : "text-red-400"}`}>
              {loading ? (
                <Loader2 className='w-5 h-5 sm:w-6 sm:h-6 animate-spin inline' />
              ) : (
                `${budgetAdherence.toFixed(0)}%`
              )}
            </p>
            <p className="text-gray-400 text-xs">
              {budgetAdherence >= 50 ? "Staying on track" : "Needs attention"}
            </p>
          </div>
        </div>
      </div>

      {/* Chart Section - Mobile Responsive */}
      <div className='px-4 sm:px-6'>
        <div className='grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8'>
          {/* Financial Trends Chart */}
          <div className='lg:col-span-3 bg-[#111111] border border-[#2F2F2F] rounded-xl p-4 sm:p-6'>
            <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3'>
              <div>
                <h2 className='text-lg sm:text-xl font-semibold text-white'>Financial Trends</h2>
                <p className="text-gray-400 text-xs sm:text-sm">Income, expenses, and savings</p>
              </div>
              
              {/* Legend - Horizontal scroll on mobile */}
              <div className="flex items-center space-x-3 sm:space-x-4 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                <div className="flex items-center space-x-2 shrink-0">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full"></div>
                  <span className="text-xs sm:text-sm text-gray-400">Income</span>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-400 rounded-full"></div>
                  <span className="text-xs sm:text-sm text-gray-400">Expenses</span>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-primary rounded-full"></div>
                  <span className="text-xs sm:text-sm text-gray-400">Savings</span>
                </div>
              </div>
            </div>

            {/* Responsive Chart Height */}
            <div className="h-64 sm:h-80 md:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MonthlyData}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2F2F2F" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#888" 
                    fontSize={10}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis 
                    stroke="#888" 
                    fontSize={10}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Area type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} fill="url(#colorIncome)" />
                  <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} fill="url(#colorExpenses)" />
                  <Area type="monotone" dataKey="savings" stroke="#3b82f6" strokeWidth={2} fill="url(#colorSavings)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Radar Chart - Mobile Responsive */}
          <div className="lg:col-span-2 bg-[#111111] border border-[#2F2F2F] rounded-xl p-4 sm:p-6">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-white">Category Analysis</h2>
              <p className="text-gray-400 text-xs sm:text-sm">Spending vs budget by category</p>
            </div>

            <div className="h-64 sm:h-80 md:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={CategoryData}>
                  <PolarGrid stroke="#2F2F2F" />
                  <PolarAngleAxis 
                    dataKey="category" 
                    stroke="#888" 
                    fontSize={9}
                    tick={{ fontSize: 9 }}
                  />
                  <PolarRadiusAxis stroke="#888" fontSize={9} />
                  <Radar
                    name='Budget'
                    dataKey="budget"
                    stroke='#3b82f6'
                    fill='#3b82f6'
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Radar
                    name="Spending"
                    dataKey="spending"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.5}
                    strokeWidth={2}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '11px'
                    }}
                  />
                  <Legend
                    wrapperStyle={{
                      paddingTop: '10px',
                      fontSize: '11px'
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Cash Flow Summary - Mobile Responsive */}
      <div className='px-4 sm:px-6 pb-6 sm:pb-8'>
        <h3 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 text-white">
          Cash Flow Summary
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Average Monthly Inflow */}
          <div className="bg-[#111111] border border-green-500/20 rounded-xl p-4 sm:p-6 hover:border-green-500/40 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-green-400 font-medium text-sm sm:text-base mb-2">Average Monthly Inflow</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-400 truncate">
                  {loading ? (
                    <Loader2 className='w-6 h-6 sm:w-8 sm:h-8 animate-spin' />
                  ) : (
                    formatCurrency(avgMonthlyInflow)
                  )}
                </p>
                <p className='text-green-400/70 text-xs sm:text-sm mt-1'>
                  {spendingTrend === 'up' ? '↗ Trending up' : spendingTrend === 'down' ? '↘ Trending down' : '→ Stable'}
                </p>
              </div>

              <div className="p-3 sm:p-4 rounded-xl bg-green-500/10 shrink-0 ml-3">
                <ArrowUpRight className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
              </div>
            </div>
          </div>

          {/* Average Monthly Outflow */}
          <div className="bg-[#111111] border border-red-500/20 rounded-xl p-4 sm:p-6 hover:border-red-500/40 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-red-400 font-medium text-sm sm:text-base mb-2">Average Monthly Outflow</p>
                <p className="text-2xl sm:text-3xl font-bold text-red-400 truncate">
                  {loading ? (
                    <Loader2 className='w-6 h-6 sm:w-8 sm:h-8 animate-spin' />
                  ) : (
                    formatCurrency(avgMonthlyOutflow)
                  )}
                </p>
                <p className='text-red-400/70 text-xs sm:text-sm mt-1'>
                  {avgMonthlyOutflow > avgMonthlyInflow * 0.8 ? '⚠ Monitor spending' : '✓ Healthy'}
                </p>
              </div>

              <div className="p-3 sm:p-4 rounded-xl bg-red-500/10 shrink-0 ml-3">
                <ArrowDownRight className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;