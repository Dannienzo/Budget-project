// src/Components/Navbarfiles/Header.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useBudget } from '../Context/Context';
import { toast } from 'react-toastify';
import { Bell, User, Search, ListPlus, CircleX, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';

const Header = ({ username, goToSettings, recentActivity = [] }) => {
  const {
    showAddForm,
    setShowAddForm,
    newTransaction,
    setNewTransaction,
    handleAddTransaction,
    categoryOptions,
    iconOptions,
    incomeCategories,
    incomeCategoryIcons,
    getCategoryIcon,
  } = useBudget();

  const { userProfile } = useAuth()
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e?.preventDefault?.();

    if (!newTransaction.category || !newTransaction.amount) {
      toast.error('Please provide category and amount.');
      return;
    }

    const amount = parseFloat(newTransaction.amount);
    if (isNaN(amount) || amount === 0) {
      toast.error('Enter a valid non-zero amount.');
      return;
    }

    setNewTransaction((prev) => ({ ...prev, amount }));

    try {
      const result = await handleAddTransaction();
      if (result?.ok) {
        setShowAddForm(false);
        setNewTransaction({
          type: 'expense',
          category: '',
          amount: '',
          description: ''
        });
      } else {
        const msg = result?.error?.message || result?.error || 'Failed to add transaction';
        toast.error(String(msg));
        console.warn('Add transaction failed', result?.error);
      }
    } catch (err) {
      console.error('Unexpected error adding Transaction', err);
      toast.error('Unexpected error. Please try again.');
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showAddForm) {
        setShowAddForm(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showAddForm, setShowAddForm]);

  const initial = username?.charAt(0).toUpperCase() || 'U';

  const currentCategories = newTransaction.type === 'income'
    ? incomeCategories
    : categoryOptions;

  const currentIcons = newTransaction.type === 'income'
    ? incomeCategoryIcons
    : iconOptions;

  const selectedIcon = newTransaction.category
    ? (newTransaction.type === 'income'
        ? incomeCategoryIcons[incomeCategories.indexOf(newTransaction.category)]
        : getCategoryIcon(newTransaction.category))
    : null;

  return (
    <div>
      <header className="bg-[#252525] border-b border-[#2F2F2F] px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          {/* Left Section - Welcome Message */}
          <div className="flex flex-col min-w-0 flex-1">
            <h1 className="text-base sm:text-xl font-semibold text-white truncate">
              Welcome {username ? username : 'User'}!
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm hidden sm:block">
              What are your earnings and plan to spend today?
            </p>
          </div>

          {/* Center Section - Search (Hidden on mobile, visible on md+) */}
          <div className="hidden md:flex items-center flex-1 justify-center max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search your items"
                className="bg-[#2F2F2F] text-white pl-9 sm:pl-10 pr-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm sm:text-base"
              />
            </div>
          </div>

           {/* Right Section - Actions */}
          <div className="flex items-center space-x-3 sm:space-x-5"> 
            {/* Add New Button */}
            <button
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-3 py-2 sm:px-6 sm:py-2.5 rounded-lg flex items-center gap-1 sm:gap-2 font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 text-sm sm:text-base"
              onClick={() => setShowAddForm(!showAddForm)}
              aria-expanded={showAddForm}
            >
              <ListPlus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Add New</span>
              <span className="sm:hidden">Add</span>
            </button>

            {/* Notification Bell Wrapper */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="p-1.5 sm:p-2 text-gray-400 hover:text-white transition-colors duration-200 relative focus:outline-none"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {recentActivity.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full border-2 border-[#252525]"></span>
                )}
              </button>

              {/* Dropdown Menu */}
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-2xl z-50 overflow-hidden transform opacity-100 scale-100 transition-all duration-200">
                  <div className="px-4 py-3 border-b border-[#333] flex justify-between items-center bg-[#252525]">
                    <h3 className="text-white font-semibold text-sm sm:text-base">Recent Activity</h3>
                    <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full shadow-sm">{recentActivity.length} New</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {recentActivity.length > 0 ? (
                      recentActivity.map((txn, idx) => (
                        <div key={txn.id || idx} className="px-4 py-3 border-b border-[#333] last:border-b-0 hover:bg-[#252525] transition-colors cursor-pointer group">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0 pr-2">
                              <p className="text-sm text-gray-200 font-medium truncate group-hover:text-blue-400 transition-colors">
                                {txn.description || (typeof txn.category === 'object' ? txn.category?.name : txn.category) || 'Transaction'}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {txn.date ? new Date(txn.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Just now'}
                              </p>
                            </div>
                            <div className={`text-sm font-semibold whitespace-nowrap ${txn.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                              {txn.type === 'income' ? '+' : '-'}₦{parseFloat(txn.amount || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-6 text-center text-gray-500">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                        <p className="text-sm">No recent activity</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

              {userProfile?.avatar ? (
                <img 
                  src={userProfile.avatar}
                  onClick={goToSettings}
                  alt="profile"
                  className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-primary hover:border-primary transition-all duration-200 cursor-pointer shadow-lg" 
                />
              ) : ( 
                <div 
                  onClick={goToSettings}
                  className="w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center hover:from-blue-600 hover:to-purple-600 transition-all duration-200 cursor-pointer shadow-lg"
                >
                  <span className='text-white text-sm sm:text-base font-bold'>{initial}</span>
                </div>
              )}
          </div>
        </div>

        {/* Mobile Search Bar - Visible only on mobile */}
        <div className="md:hidden mt-3">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search your items"
              className="bg-[#2F2F2F] text-white pl-9 pr-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm"
            />
          </div>
        </div>
      </header>

      {/* Add Transaction Modal - Mobile Responsive */}
      {showAddForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setShowAddForm(false)}
          role="dialog"
          aria-modal="true"
        >
         
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

        
          <div
            className="relative bg-[#1a1a1a] border border-[#333] rounded-2xl p-4 sm:p-6 w-full max-w-md shadow-2xl transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <div className="p-1.5 sm:p-2 bg-primary/20 rounded-lg shrink-0">
                  <ListPlus className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-200 text-lg sm:text-xl font-semibold">Add Transaction</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    Tell us what your income and expenses today
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-[#333] rounded-lg transition-all duration-200 shrink-0"
              >
                <CircleX className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {/* Type Selection */}
              <div>
                <label className="block text-gray-300 text-xs sm:text-sm font-medium mb-2">
                  Transaction Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewTransaction({ ...newTransaction, type: 'income', category: '' })}
                    className={`p-2 sm:p-3 rounded-lg border transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base ${
                      newTransaction.type === 'income'
                        ? 'bg-green-600/20 border-green-500 text-green-300'
                        : 'bg-[#2a2a2a] border-[#444] text-gray-400 hover:bg-[#333]'
                    }`}
                  >
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                    Income
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewTransaction({ ...newTransaction, type: 'expense', category: '' })}
                    className={`p-2 sm:p-3 rounded-lg border transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base ${
                      newTransaction.type === 'expense'
                        ? 'bg-red-600/20 border-red-500 text-red-300'
                        : 'bg-[#2a2a2a] border-[#444] text-gray-400 hover:bg-[#333]'
                    }`}
                  >
                    <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
                    Expense
                  </button>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-gray-300 text-xs sm:text-sm font-medium mb-2">Category</label>
                <div className='relative'>
                  {selectedIcon && (
                    <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-lg sm:text-xl z-10'>
                      {selectedIcon}
                    </span>
                  )}
                  <select 
                    value={newTransaction.category}
                    onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                    className={`w-full bg-[#2a2a2a] border border-[#444] rounded-lg ${
                      selectedIcon ? 'pl-10 sm:pl-12' : 'pl-3 sm:pl-4'
                    } pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                  >
                    <option value="">Select a Category</option>
                    {currentCategories.map((cat, idx) => (
                      <option key={cat} value={cat}>
                        {currentIcons[idx]} {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <p className='text-gray-500 text-xs mt-2'>
                  {newTransaction.type === 'expense'
                    ? 'Select an expense category to track your budget'
                    : 'Select your income source'}
                </p>
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
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                    className="w-full bg-[#2a2a2a] border border-[#444] rounded-lg pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                  className="w-full bg-[#2a2a2a] border border-[#444] rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-[#2a2a2a] hover:bg-[#333] text-gray-300 font-medium rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base transition-all duration-200"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!newTransaction.category || !newTransaction.amount}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;