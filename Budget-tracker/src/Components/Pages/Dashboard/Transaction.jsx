import React, { useState, useEffect } from 'react'
import { useBudget } from '../../Context/Context'
import { toast } from 'react-toastify'
import { BanknoteArrowDown, Download, BanknoteArrowUp, ArrowUpRight, ArrowDownRight, ClockAlert, Edit3, Trash2, X, DollarSign, TrendingUp, TrendingDown, Loader2, FileSpreadsheet, FileDown } from "lucide-react"

const Transaction = () => {
  const { 
    formatCurrency, 
    totalIncome, 
    totalExpenses, 
    pendingTransactions, 
    fetchTransactions, 
    transactions,
    deleteTransaction,
    updateTransaction,
    categoryOptions,
    iconOptions,
    incomeCategories,
    incomeCategoryIcons,
    getCategoryIcon,
    exportTransactionsCSV,
    exportTransactionsExcel,
    Loading,
  } = useBudget();

  const [sortBy, setSortBy] = useState("date");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editForm, setEditForm] = useState({
    amount: '',
    description: '',
    category: '',
    type: 'expense'
  });

  const txList = Array.isArray(transactions) ? transactions : [];

  const sortTransactions = [...txList].sort((a, b) => {
    if (sortBy === 'date') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'amount') return b.amount - a.amount;
    if (sortBy === 'category') return String(a.category || '').localeCompare(String(b.category || ''));
    return 0;
  });

  const handleDelete = async (e, txn) => {
    e.stopPropagation();
    
    if (!txn || !txn.id) return;
    if (!window.confirm(`Delete transaction: ${txn.description || 'this transaction'}?`)) return;

    try {
      setLoading(true);
      const result = await deleteTransaction(txn.id);
      
      if (!result.ok) {
        toast.error(result.error || 'Delete failed');
      }
    } catch (err) {
      console.error('Delete failed', err);
      toast.error('Unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditModal = (e, txn) => {
    e.stopPropagation();
    setEditingTransaction(txn);
    setEditForm({
      amount: txn.amount.toString(),
      description: txn.description || '',
      category: txn.category || '',
      type: txn.type || 'expense'
    });
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingTransaction(null);
    setEditForm({
      amount: '',
      description: '',
      category: '',
      type: 'expense'
    });
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    
    if (!editingTransaction || !editingTransaction.id) return;

    const amount = parseFloat(editForm.amount);
    if (isNaN(amount) || amount <= 0) {
      return toast.error('Please enter a valid amount greater than 0');
    }

    if (!editForm.category) {
      return toast.error('Please select a category');
    }

    try {
      setLoading(true);
      
      const updates = {
        amount: amount,
        description: editForm.description.trim(),
        category: editForm.category,
        type: editForm.type
      };

      const result = await updateTransaction(editingTransaction.id, updates);
      
      if (result.ok) {
        handleCloseEditModal();
      } else {
        toast.error(result.error || 'Update failed');
      }
    } catch (err) {
      console.error('Edit failed', err);
      toast.error('Unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await fetchTransactions?.();
      } catch (err) {
        console.warn('fetchTransactions failed', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [fetchTransactions]);

  const categoryIcons = {
    Food: "🍔",
    Transport: "🚗",
    Entertainment: "🎬",
    Shopping: "🛍️",
    Bills: "💡",
    Health: "🏥",
    Education: "📚",
    Travel: "✈️",
    Housing: "🏠",
    Technology: "💻",
    Sports: "⚽",
    Other: "🎯",
    Salary: "💰",
    Freelance: "💼",
    Business: "🏢",
    Investment: "📈",
    Gift: "🎁",
    Refund: "↩️",
    Bonus: "🎉"
  };

  // Get appropriate categories based on transaction type
  const currentCategories = editForm.type === 'income' 
    ? incomeCategories 
    : categoryOptions;

  const currentIcons = editForm.type === 'income'
    ? incomeCategoryIcons
    : iconOptions;

  const selectedIcon = editForm.category 
    ? (editForm.type === 'income'
        ? incomeCategoryIcons[incomeCategories.indexOf(editForm.category)]
        : getCategoryIcon(editForm.category))
    : null;

  return (
    <div className='min-h-screen text-white bg-[#0b0b0f]'>
      {/* Header - Mobile Responsive */}
      <div className='border-b border-[#2F2F2F] p-4 sm:p-6'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div>
            <div className='flex items-center space-x-3 mb-2'>
              <BanknoteArrowDown className='w-5 h-5 sm:w-6 sm:h-6 text-green-400'/>
              <h1 className='text-2xl sm:text-3xl font-bold text-white'>Transactions</h1>
            </div>
            <p className='text-gray-400 text-sm sm:text-base'>Track all your transactions in detail</p>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => exportTransactionsCSV()}
              disabled={Loading}
              className="flex-1 sm:flex-initial px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 text-sm">
              {loading ? (
                <Loader2 className='w-4 h-4 animate-spin'/>
              ) : (
                <FileDown className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
              <span className="hidden sm:inline">CSV</span>
            </button>

            <button
              onClick={() => exportTransactionsExcel()}
              disabled={loading}
              className="flex-1 sm:flex-initial px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 text-sm"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileSpreadsheet className="w-4 h-4" />
              )}
              Excel
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards - Mobile Responsive */}
      <div className='p-4 sm:p-6 border-b border-[#2F2F2F]'>
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6'>
          <div className='bg-[#111111] border border-[#2F2F2F] rounded-xl p-3 sm:p-4'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
              <div className="flex-1">
                <p className='text-gray-400 text-xs sm:text-sm'>Total Transactions</p>
                <p className='text-xl sm:text-2xl font-bold text-white'>{txList.length}</p>
              </div>
              <div className='p-2 rounded-lg bg-primary/10 self-start sm:self-auto'>
                <BanknoteArrowUp className='w-4 h-4 sm:w-5 sm:h-5 text-primary' />
              </div>
            </div>
          </div>

          <div className="bg-[#111111] border border-green-500/20 rounded-xl p-3 sm:p-4">
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
              <div className="flex-1">
                <p className="text-gray-400 text-xs sm:text-sm">Total Income</p>
                <p className="text-xl sm:text-2xl font-bold text-green-400 truncate">{formatCurrency(totalIncome)}</p>
              </div>
              <div className="p-2 rounded-lg bg-green-500/10 self-start sm:self-auto">
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-[#111111] border border-red-500/20 rounded-xl p-3 sm:p-4">
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
              <div className="flex-1">
                <p className="text-gray-400 text-xs sm:text-sm">Total Expenses</p>
                <p className="text-xl sm:text-2xl font-bold text-red-400 truncate">{formatCurrency(totalExpenses)}</p>
              </div>
              <div className="p-2 rounded-lg bg-red-500/10 self-start sm:self-auto">
                <ArrowDownRight className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
              </div>
            </div>
          </div>

          <div className="bg-[#111111] border border-yellow-500/20 rounded-xl p-3 sm:p-4">
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
              <div className="flex-1">
                <p className="text-gray-400 text-xs sm:text-sm">Pending</p>
                <p className="text-xl sm:text-2xl font-bold text-yellow-400">{pendingTransactions}</p>
              </div>
              <div className="p-2 rounded-lg bg-yellow-500/10 self-start sm:self-auto">
                <ClockAlert className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sort Controls - Mobile Responsive */}
      <div className='p-4 sm:p-6 border-b border-[#2F2F2F]'>
        <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
          <div className='flex items-center space-x-2 w-full sm:w-auto'>
            <span className='text-xs sm:text-sm text-gray-400'>Sort By:</span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className='flex-1 sm:flex-none bg-[#252525] border border-[#333] rounded-lg px-3 py-2 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="category">Category</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List - Mobile Responsive */}
      <div className='p-4 sm:p-6'>
        {loading && txList.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-400 text-sm sm:text-base">Loading transactions...</div>
          </div>
        ) : txList.length === 0 ? (
          <div className="bg-[#111111] border border-[#2F2F2F] rounded-xl p-8 sm:p-12 text-center">
            <BanknoteArrowDown className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-400 mb-2">No transactions yet</h3>
            <p className="text-sm sm:text-base text-gray-500">Start adding transactions to track your finances</p>
          </div>
        ) : (
          <div className='space-y-3 sm:space-y-4'>
            {sortTransactions.map(txn => (
              <div
                key={txn.id}
                onClick={() => setSelectedTransaction(txn)}
                className='bg-[#111111] border border-[#2F2F2F] rounded-xl p-4 sm:p-6 hover:border-primary/30 hover:bg-[#151515] transition-all duration-300 group cursor-pointer'
              >
                {/* Mobile Layout: Stack vertically */}
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                  {/* Left Section */}
                  <div className='flex items-start sm:items-center space-x-3 sm:space-x-4 flex-1'>
                    <div className={`p-2 sm:p-3 rounded-xl border shrink-0 ${
                      txn.type === 'income' 
                        ? 'bg-green-500/10 border-green-500/20' 
                        : 'bg-red-500/10 border-red-500/20'
                    } group-hover:border-primary/30 transition-colors duration-300`}>
                      <span className="text-xl sm:text-2xl">
                        {categoryIcons[txn.category] || "📊"}
                      </span>
                    </div>

                    <div className='flex-1 min-w-0'>
                      <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2'>
                        <h3 className='font-semibold text-white text-base sm:text-lg truncate'>
                          {txn.description || 'No description'}
                        </h3>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium self-start ${
                          txn.status === 'completed' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {txn.status || 'completed'}
                        </div>
                      </div>
                      <p className='text-gray-400 text-xs sm:text-sm mt-1'>
                        {txn.category || 'Uncategorized'} • {txn.date}
                        {txn.time ? ` at ${txn.time}` : ''}
                      </p>
                    </div>
                  </div>

                  {/* Right Section */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                    <div className="flex-1 sm:flex-none sm:text-right">
                      <p className={`text-lg sm:text-xl font-bold ${
                        txn.type === 'income' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
                      </p>
                      <div className="flex items-center space-x-1 sm:justify-end mt-1">
                        {txn.type === 'income' ? (
                          <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
                        )}
                        <span className="text-gray-500 text-xs capitalize">
                          {txn.type}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={(e) => handleOpenEditModal(e, txn)} 
                        disabled={loading}
                        className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Edit transaction"
                      >
                        <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button 
                        onClick={(e) => handleDelete(e, txn)} 
                        disabled={loading}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete transaction"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination - Mobile Responsive */}
        {txList.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 sm:mt-8">
            <p className="text-gray-400 text-xs sm:text-sm">
              Showing {txList.length} of {txList.length} transactions
            </p>
            <div className="flex space-x-2">
              <button className="px-3 py-2 sm:px-4 sm:py-2 bg-[#252525] hover:bg-[#333] text-gray-300 rounded-lg transition-colors duration-200 disabled:opacity-50 text-xs sm:text-sm" disabled>
                Previous
              </button>
              <button className="px-3 py-2 sm:px-4 sm:py-2 bg-primary text-white rounded-lg text-xs sm:text-sm">
                1
              </button>
              <button className="px-3 py-2 sm:px-4 sm:py-2 bg-[#252525] hover:bg-[#333] text-gray-300 rounded-lg transition-colors duration-200 disabled:opacity-50 text-xs sm:text-sm" disabled>
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Transaction Modal - Mobile Responsive */}
      {showEditModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleCloseEditModal}
        >
          <div 
            className="relative bg-[#1a1a1a] border border-[#333] rounded-2xl p-4 sm:p-6 w-full max-w-md shadow-2xl transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header - Mobile Responsive */}
            <div className="flex items-start justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <div className="p-1.5 sm:p-2 bg-primary/20 rounded-lg shrink-0">
                  <Edit3 className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-semibold text-white">Edit Transaction</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">Update transaction details</p>
                </div>
              </div>
              <button
                onClick={handleCloseEditModal}
                className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-[#333] rounded-lg transition-all duration-200 shrink-0"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Edit Form - Mobile Responsive */}
            <form onSubmit={handleSubmitEdit} className="space-y-3 sm:space-y-4">
              {/* Type Selection */}
              <div>
                <label className="block text-gray-300 text-xs sm:text-sm font-medium mb-2">
                  Transaction Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditForm({ 
                      ...editForm, 
                      type: 'income',
                      category: '' 
                    })}
                    className={`p-2 sm:p-3 rounded-lg border transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base ${
                      editForm.type === 'income'
                        ? 'bg-green-600/20 border-green-500 text-green-300'
                        : 'bg-[#2a2a2a] border-[#444] text-gray-400 hover:bg-[#333]'
                    }`}
                  >
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                    Income
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditForm({ 
                      ...editForm, 
                      type: 'expense',
                      category: '' 
                    })}
                    className={`p-2 sm:p-3 rounded-lg border transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base ${
                      editForm.type === 'expense'
                        ? 'bg-red-600/20 border-red-500 text-red-300'
                        : 'bg-[#2a2a2a] border-[#444] text-gray-400 hover:bg-[#333]'
                    }`}
                  >
                    <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
                    Expense
                  </button>
                </div>
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-gray-300 text-xs sm:text-sm font-medium mb-2">Category</label>
                <div className="relative">
                  {selectedIcon && (
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lg sm:text-xl z-10">
                      {selectedIcon}
                    </span>
                  )}
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className={`w-full bg-[#2a2a2a] border border-[#444] rounded-lg ${
                      selectedIcon ? 'pl-10 sm:pl-12' : 'pl-3 sm:pl-4'
                    } pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                  >
                    <option value="">Select a category</option>
                    {currentCategories.map((cat, idx) => (
                      <option key={cat} value={cat}>
                        {currentIcons[idx]} {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-gray-300 text-xs sm:text-sm font-medium mb-2">Amount</label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    value={editForm.amount}
                    onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                    className="w-full bg-[#2a2a2a] border border-[#444] rounded-lg pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-300 text-xs sm:text-sm font-medium mb-2">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Add a note about this transaction"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full bg-[#2a2a2a] border border-[#444] rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-4">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  disabled={loading}
                  className="flex-1 bg-[#2a2a2a] hover:bg-[#333] text-gray-300 font-medium rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base transition-all duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !editForm.amount || !editForm.category}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Transaction