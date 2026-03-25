import React, { useMemo, useCallback } from 'react';
import { useBudget } from '../../Context/Context';
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer } from 'recharts';

ChartJS.register(ArcElement, Tooltip, Legend);

const DonutChart = ({ values = [20, 50, 20] }) => {
  const data = {
    labels: ["Earn", "Expenses", "remaining"],
    datasets: [
      {
        data: values,
        backgroundColor: ["#3bf544", "#f53b4a", "#eff53b"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: "75%",
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className='w-24 h-24 sm:w-32 sm:h-32'>
      <Doughnut data={data} options={options} />
    </div>
  )
};

// Mini chart for cards
const MiniChart = ({ color = 'bg-white/30' }) => (
  <div className="flex items-end space-x-0.5 sm:space-x-1 h-6 sm:h-8">
    {[...Array(8)].map((_, i) => (
      <div
        key={i}
        className={`w-0.5 sm:w-1 ${color} opacity-70`}
        style={{ height: `${Math.random() * 100 + 20}%` }}
      />
    ))}
  </div>
);

const FinanceDashboard = ({ data }) => {
  const {
    balance: ctxBalance,
    totalIncome: ctxIncome,
    totalExpenses: ctxExpenses,
    transactions: ctxTransactions,
    formatCurrency: ctxFormatCurrency,
    totalBudget: ctxTotalBudget,
  } = useBudget();

  const server = data ?? {};

  const formatCurrency = useCallback((val) => {
    const fn = ctxFormatCurrency;
    if (typeof fn === 'function') return fn(val);
    try {
      return Number(val).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    } catch {
      return String(val);
    }
  }, [ctxFormatCurrency]);

  const toNumber = (v) => {
    if (v == null) return 0;
    if (typeof v === 'number') return v;
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const income = toNumber( ctxIncome  ?? server.total_income ?? 0);
  const expense = toNumber( ctxExpenses ?? server.total_expense ?? 0);
  const balanceVal = toNumber(ctxBalance ?? server.balance ?? (income - expense)) || 0;
  const budgetvalue = ctxTotalBudget ?? server.total_budget ?? 0;

  // Top card Details
  const accountCards = useMemo(() => ([
    {
      title: 'Balance',
      value: formatCurrency(balanceVal),
      change: balanceVal > 0 ? '+12%' : '-5%',
      status: 'Available',
      color: balanceVal > 0 ? 'from-green-300 to-green-950' : 'from-red-400 to-red-600',
      chartColor: balanceVal > 0 ? 'bg-green-300' : 'bg-red-300'
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(expense),
      change: '-8.2%',
      status: 'This Month debit',
      color: 'from-red-500 to-red-800',
      chartColor: 'bg-red-950'
    },
    {
      title: 'Total Income',
      value: formatCurrency(income),
      change: '+15.56',
      status: 'Earning This Month',
      color: 'from-blue-500 to-purple-600',
      chartColor: 'bg-primary'
    },
    {
      title: 'Budgeting use',
      value: formatCurrency(budgetvalue),
      change: '1',
      status: 'Saving',
      color: 'from-slate-300 to-slate-600',
      chartColor: 'bg-orange-300'
    }
  ]), [income, expense, balanceVal, budgetvalue, formatCurrency]);

  const rawRecent = useMemo(() => {
    if (Array.isArray(ctxTransactions) && ctxTransactions.length) {
    return ctxTransactions;
    }

    if (Array.isArray(server.recent_transactions) && server.recent_transactions.length) {
    return server.recent_transactions;
  }
  return []
  }, [ctxTransactions, server])

  const getCategoryName = (c) => {
    if (!c) return '—';
    if (typeof c === 'string') return c;
    if (typeof c === 'number') return String(c)
    if (typeof c === 'object') return c.name ?? (c.category ?? '—');
    return String(c);
  };

  const recentActivities = useMemo(() => {
    if (!Array.isArray(rawRecent)) return [];
    return rawRecent.slice(0, 3).map((transaction) => {
      const date = transaction.date || transaction.created_at || null;
      const time = date
        ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : '';
      const categoryName = getCategoryName(transaction.category);
      return {
        time,
        title: categoryName,
        description: transaction.description || '',
        icon: transaction.type === 'income' ? '💰' : '💳',
        iconBg: transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500',
      };
    });
  }, [rawRecent]);

  const recentTransactions = useMemo(() => {
    if (!Array.isArray(rawRecent)) return []
    return rawRecent.slice(0, 5).map((transaction) => {
      const amt = toNumber(transaction.amount);
      const isIncome = transaction.type === 'income';
      const amountDisplay = `${isIncome ? '+' : '-'}${formatCurrency(Math.abs(amt))}`;
      return {
        id: transaction.id,
        description: transaction.description || getCategoryName(transaction.category),
        category: getCategoryName(transaction.category),
        amount: amountDisplay,
        status: transaction.status ?? 'Completed',
        statusColor: (transaction.status === 'pending') ? 'bg-yellow-500' : 'bg-green-500',
        date: transaction.date ?? transaction.created_at ?? '',
        isIncome,
      };
    })
  }, [rawRecent, formatCurrency]);

  // Chart Activities Details
  const chartdata = [
    { name: 'Jan', value: 1500 }, { name: 'Feb', value: 3000 }, { name: 'Mar', value: 1800 },
    { name: 'Apr', value: 2780 }, { name: 'May', value: 1890 }, { name: 'Jun', value: 2390 },
    { name: 'Jul', value: 3090 }, { name: 'Aug', value: 1490 }, { name: 'Sep', value: 490 },
    { name: 'Oct', value: 5090 }, { name: 'Nov', value: 2390 }, { name: 'Dec', value: 3490 }
  ];

  const donutValues = useMemo(() => [income, expense, Math.max(0, income - expense)], [income, expense]);

  return (
    <div>
      <main className="flex-1 overflow-auto space-y-4 sm:space-y-6">

        {/* Account Cards - Mobile Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {accountCards.map((card, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${card.color} p-4 sm:p-6 rounded-xl text-white`}
            >
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <div>
                  <p className="text-white/80 text-xs sm:text-sm">{card.title}</p>
                  <p className="text-xs text-white/60 mt-1">{card.status}</p>
                </div>
                <span className="text-white/80 text-xs sm:text-sm">{card.change}</span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-white/60 mb-1">Current Value</p>
                  <p className="text-lg sm:text-2xl font-bold truncate">{card.value}</p>
                </div>
                <MiniChart color={card.chartColor} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Wallet Analytics - Mobile Responsive */}
          <div className="lg:col-span-2 bg-[#252525] rounded-xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
              <h2 className="text-lg sm:text-xl font-semibold">Budget Analytics</h2>
              
              {/* Period Buttons - Horizontal scroll on mobile */}
              <div className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                {['1D', '3D', '7D', '14D', '1M', '3M', '6M', '1Y'].map((period) => (
                  <button
                    key={period}
                    className="px-2 sm:px-3 py-1 text-xs rounded text-gray-400 hover:text-white whitespace-nowrap shrink-0"
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart - Responsive height */}
            <div className="relative h-48 sm:h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartdata}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#888" 
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    stroke="#888" 
                    orientation="right" 
                    tick={{ fontSize: 12 }}
                  />
                  <ReTooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Traffic Chart - Mobile Responsive */}
          <div className="bg-[#252525] rounded-xl p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Analyze Money Out</h2>
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <div className="relative">
                <DonutChart values={donutValues} />
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                  <span className="text-xs sm:text-sm">Expenses</span>
                </div>
                <span className="text-xs sm:text-sm font-semibold">
                  {income ? Math.round((expense / (income || 1)) * 100) + '%' : '-'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full"></div>
                  <span className="text-xs sm:text-sm">Cash Out</span>
                </div>
                <span className="text-xs sm:text-sm font-semibold">55%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-full"></div>
                  <span className="text-xs sm:text-sm">Remaining</span>
                </div>
                <span className="text-xs sm:text-sm font-semibold">12%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 sm:gap-6">
          {/* Recent Activities - Mobile Responsive */}
          <div className="lg:col-span-4 bg-[#252525] rounded-xl p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Recent Activities</h2>
            <div className="space-y-3 sm:space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 sm:space-x-4 p-2 sm:p-3 rounded-lg hover:bg-[#2a2a2a] transition-colors"
                >
                  <div className="text-xs sm:text-sm text-gray-400 w-16 sm:w-20 shrink-0">
                    {activity.time}
                  </div>
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 ${activity.iconBg} rounded-full flex items-center justify-center text-white text-xs sm:text-sm shrink-0`}
                  >
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm sm:text-base truncate">{activity.title}</p>
                    <p className="text-xs sm:text-sm text-gray-400 truncate">{activity.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transactions Table - Mobile Responsive */}
          <div className="bg-[#252525] rounded-xl p-4 sm:p-6 lg:col-span-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
              <h2 className="text-lg sm:text-xl font-semibold">Transactions</h2>
              <p className="text-xs sm:text-sm text-gray-400">Overview of last 7 Days</p>
            </div>

            {/* Mobile: Card View, Desktop: Table View */}
            <div className="block sm:hidden space-y-3">
              {recentTransactions.map((transaction, index) => (
                <div
                  key={index}
                  className="bg-[#2a2a2a] rounded-lg p-3 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{transaction.description}</p>
                      <p className="text-xs text-gray-500">{transaction.category}</p>
                    </div>
                    <span
                      className={`${transaction.statusColor} text-white px-2 py-0.5 rounded-full text-xs font-medium ml-2 shrink-0`}
                    >
                      {transaction.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{transaction.date}</span>
                    <p
                      className={`text-sm font-semibold ${
                        transaction.amount.startsWith("+")
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {transaction.amount}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2F2F2F]">
                    <th className="text-left py-3 text-gray-400 text-xs sm:text-sm">DESCRIPTION</th>
                    <th className="text-left py-3 text-gray-400 text-xs sm:text-sm">CATEGORY</th>
                    <th className="text-right py-3 text-gray-400 text-xs sm:text-sm">AMOUNT</th>
                    <th className="text-center py-3 text-gray-400 text-xs sm:text-sm">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((transaction, index) => (
                    <tr
                      key={index}
                      className="border-b border-[#2F2F2F] hover:bg-[#2F2F2F] transition-colors"
                    >
                      <td className="py-3 sm:py-4 font-medium text-xs sm:text-sm">{transaction.description}</td>
                      <td className="py-3 sm:py-4 text-gray-500 text-xs sm:text-sm">{transaction.category}</td>
                      <td
                        className={`py-3 sm:py-4 text-right font-semibold text-xs sm:text-sm ${
                          transaction.amount.startsWith("+")
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {transaction.amount}
                      </td>
                      <td className="py-3 sm:py-4 text-center">
                        <span
                          className={`${transaction.statusColor} text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium inline-block`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default FinanceDashboard