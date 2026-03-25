import React, { useState } from 'react';
import { useBudget } from '../../Context/Context';
import { toast } from 'react-toastify';
import { Target, Plus, Edit3, Trash2, DollarSign, TrendingDown, TrendingUp, AlertCircle, CheckCircle, Zap, X, Loader2 } from 'lucide-react';

function Budgeting() {
  const { 
    budgets, 
    formatCurrency, 
    totalBudget, 
    totalSpent, 
    totalRemaining, 
    addBudget, 
    updateBudget, 
    deleteBudget, 
    loading, 
    categoryOptions, 
    iconOptions 
  } = useBudget();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newBudget, setNewBudget] = useState({ category: '', budget: '', icon: iconOptions[0] });
  const [editingBudget, setEditingBudget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // All to fall back to zero
  const totalB = Number(totalBudget || 0);
  const totalS = Number(totalSpent || 0);
  const totalR = Number(totalRemaining || (totalB - totalS));

  const handleAddBudget = async () => {
    if (!newBudget.category || !newBudget.budget) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);

    try {
      if (editingBudget) {
        const updates = {
          category: newBudget.category,
          budget: parseFloat(newBudget.budget),
          icon: newBudget.icon
        };

        const result = await updateBudget(editingBudget.id, updates);
        
        if (result.ok) {
          setShowAddModal(false);
          setEditingBudget(null);
          setNewBudget({ category: '', budget: '', icon: iconOptions[0] });
        } else {
          toast.error('Failed to update budget');
        }
      } else {

        const newCategory = String(newBudget.category || '').toLowerCase().trim()

        const existingBudget = budgets.find(b => {
          const budgetCategory = String(b.category || '').toLowerCase().trim()
          return budgetCategory === newCategory
        });

        if (existingBudget) {
          toast.warning(`A budget for "${newBudget.category}" already exists. Try editing it instead.`);
          setSubmitting(false);
          return;
        }

        const payload = {
          category: newBudget.category,
          budget: parseFloat(newBudget.budget),
          icon: newBudget.icon,
          spent: 0
        };

        const result = await addBudget(payload);
        
        if (result.ok) {
          setShowAddModal(false);
          setNewBudget({ category: '', budget: '', icon: iconOptions[0] });
        } else {
          toast.error('Failed to add budget');
        }
      }
    } catch (error) {
      console.error('Budget operation failed:', error);
      toast.error(error.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditBudget = (budget) => {
    setEditingBudget(budget);
    setNewBudget({
      category: budget.category,
      budget: budget.budget.toString(),
      icon: budget.icon
    });
    setShowAddModal(true);
  };

  const handleDeleteBudget = async (id) => {
    if (!window.confirm('Are you sure you want to delete this budget?')) return;
    
    setSubmitting(true);
    try {
      const result = await deleteBudget(id);
      if (!result.ok) {
        toast.error('Failed to delete budget');
      }
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingBudget(null);
    setNewBudget({ category: '', budget: '', icon: iconOptions[0] });
  };

  const isCreateDisabled = !newBudget.category || !newBudget.budget || submitting;

  return (
    <div className='min-h-screen text-white bg-[#0b0b0f]'>
      {/* Header - Mobile Responsive */}
      <div className='border-b border-[#2F2F2F] p-4 sm:p-6'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              <h1 className='text-2xl sm:text-3xl font-bold text-white'>Budget Management</h1>
            </div>
            <p className='text-gray-400 text-sm sm:text-base'>
              Track your spending limits and manage your budgets
            </p>
          </div>

          <button 
            onClick={() => setShowAddModal(true)}
            disabled={loading}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg flex items-center gap-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base self-start sm:self-auto"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            Add Budget
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* Summary Cards - Mobile Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-[#111111] border border-primary/20 rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm mb-2">Total Budget</p>
            <p className="text-xl sm:text-2xl font-bold text-white truncate">{formatCurrency(totalB)}</p>
            <p className="text-primary text-xs mt-2">Across {budgets.length} categories</p>
          </div>

          <div className="bg-[#111111] border border-red-500/20 rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm mb-2">Total Spent</p>
            <p className="text-xl sm:text-2xl font-bold text-red-400 truncate">{formatCurrency(totalS)}</p>
            <p className="text-gray-400 text-xs mt-2">
              {((totalS / (totalB || 1)) * 100).toFixed(1)}% of budget
            </p>
          </div>

          <div className="bg-[#111111] border border-green-500/20 rounded-xl p-4 sm:p-6 sm:col-span-2 md:col-span-1">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm mb-2">Remaining</p>
            <p className="text-xl sm:text-2xl font-bold text-green-400 truncate">{formatCurrency(totalR)}</p>
            <p className="text-green-400 text-xs mt-2">Available to spend</p>
          </div>
        </div>

        {/* Overall Progress - Mobile Responsive */}
        <div className="bg-[#111111] border border-[#2F2F2F] rounded-xl p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2">
            <h2 className="text-lg sm:text-xl font-semibold text-white">Overall Progress</h2>
            <span className="text-gray-400 text-xs sm:text-sm">
              {formatCurrency(totalS)} / {formatCurrency(totalB)}
            </span>
          </div>
          <div className="w-full bg-[#1C1C1C] rounded-full h-2 sm:h-3 overflow-hidden">
            <div 
              className={`h-2 sm:h-3 rounded-full transition-all duration-1000 ease-out ${
                totalS > totalB 
                  ? 'bg-linear-to-r from-red-500 to-red-400' 
                  : 'bg-linear-to-r from-blue-500 to-blue-400'
              }`}
              style={{ width: `${Math.min((totalS / (totalB || 1)) * 100, 100)}%` }}
            ></div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2 sm:mt-3 gap-2">
            <span className="text-gray-400 text-xs sm:text-sm">
              {((totalS / (totalB || 1)) * 100).toFixed(1)}% used
            </span>
            <span className={`text-xs sm:text-sm font-medium ${
              totalS > totalB ? 'text-red-400' : 'text-green-400'
            }`}>
              {totalS > totalB 
                ? `Over by ${formatCurrency(totalS - totalB)}` 
                : `${formatCurrency(totalR)} remaining`}
            </span>
          </div>
        </div>

        {/* Budget Categories - Mobile Responsive */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Budget Categories</h2>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : budgets.length === 0 ? (
            <div className="bg-[#111111] border border-[#2F2F2F] rounded-xl p-8 sm:p-12 text-center">
              <Target className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-400 mb-2">No budgets yet</h3>
              <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">Create your first budget to start tracking your spending</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-primary hover:bg-primary/90 text-white rounded-lg inline-flex items-center gap-2 font-medium transition-all duration-200 text-sm sm:text-base"
              >
                <Plus className="w-4 h-4" />
                Add Your First Budget
              </button>
            </div>
          ) : (
            <div className="grid gap-3 sm:gap-4">
              {budgets.map((budget) => {
                const percentage = budget.budget ? (budget.spent / budget.budget) * 100 : 0;
                const isOverBudget = budget.spent > budget.budget;
                const isNearLimit = percentage >= 80 && !isOverBudget;
                
                return (
                  <div
                    key={budget.id}
                    className="bg-[#111111] border border-[#2F2F2F] rounded-xl p-4 sm:p-6 hover:border-primary/30 hover:bg-[#151515] transition-all duration-300 group"
                  >
                    {/* Mobile: Stack vertically, Desktop: Side by side */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      {/* Left side */}
                      <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                        <div className="p-2 sm:p-3 rounded-xl bg-[#1a1a1a] border border-[#333] shrink-0">
                          <span className="text-xl sm:text-2xl">{budget.icon}</span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                            <h3 className="text-base sm:text-lg font-semibold text-white truncate">{budget.category}</h3>
                            {isOverBudget && (
                              <div className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 self-start">
                                Over Budget
                              </div>
                            )}
                            {isNearLimit && (
                              <div className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 self-start">
                                Almost There
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-gray-400">
                            <span>
                              Spent: <span className="font-medium text-white">{formatCurrency(budget.spent)}</span>
                            </span>
                            <span className="hidden sm:inline">•</span>
                            <span>
                              Budget: <span className="font-medium text-white">{formatCurrency(budget.budget)}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right side */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                        <div className="text-left sm:text-right">
                          <p className={`text-base sm:text-lg font-bold ${
                            isOverBudget ? 'text-red-400' : 'text-green-400'
                          }`}>
                            {isOverBudget 
                              ? `+${formatCurrency(budget.spent - budget.budget)}` 
                              : formatCurrency(budget.budget - budget.spent)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {isOverBudget ? 'over' : 'left'}
                          </p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleEditBudget(budget)} 
                            disabled={submitting}
                            className="p-1.5 sm:p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteBudget(budget.id)} 
                            disabled={submitting}
                            className="p-1.5 sm:p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {submitting ? (
                              <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="w-full bg-[#1C1C1C] rounded-full h-1.5 sm:h-2 overflow-hidden">
                        <div 
                          className={`h-1.5 sm:h-2 rounded-full transition-all duration-1000 ease-out ${
                            isOverBudget 
                              ? 'bg-linear-to-r from-red-500 to-red-400' 
                              : isNearLimit
                              ? 'bg-linear-to-r from-yellow-500 to-yellow-400'
                              : 'bg-linear-to-r from-green-500 to-green-400'
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-gray-400">
                          {percentage.toFixed(1)}% used
                        </span>
                        <div className="flex items-center space-x-1">
                          {isOverBudget ? (
                            <>
                              <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
                              <span className="text-red-400 font-medium">Exceeded</span>
                            </>
                          ) : isNearLimit ? (
                            <>
                              <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                              <span className="text-yellow-400 font-medium">Nearing limit</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                              <span className="text-green-400 font-medium">On track</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Tip - Mobile Responsive */}
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 sm:p-4">
          <div className="flex items-start space-x-2 sm:space-x-3">
            <Target className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-primary font-medium mb-1 text-sm sm:text-base">Pro Tip</p>
              <p className="text-gray-300 text-xs sm:text-sm">
                Set realistic budgets based on your spending patterns. Review and adjust them monthly for better financial control.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal - Mobile Responsive */}
      {showAddModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleCloseModal}
        >
          <div 
            className="relative bg-[#1a1a1a] border border-[#333] rounded-2xl p-4 sm:p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <div className="p-1.5 sm:p-2 bg-primary/20 rounded-lg shrink-0">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-semibold text-white">
                    {editingBudget ? 'Edit Budget' : 'Add New Budget'}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    {editingBudget ? 'Update your spending limit' : 'Set a spending limit for a category'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-[#333] rounded-lg transition-all duration-200 shrink-0"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-3 sm:space-y-4">
              {/* Category Selection */}
              <div>
                <label className="block text-gray-300 text-xs sm:text-sm font-medium mb-2">Category</label>
                <select
                  value={newBudget.category}
                  onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                  disabled={submitting}
                  className="w-full bg-[#2a2a2a] border border-[#444] rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50"
                >
                  <option value="">Select a category</option>
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Icon Selection */}
              <div>
                <label className="block text-gray-300 text-xs sm:text-sm font-medium mb-2">Choose Icon</label>
                <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setNewBudget({ ...newBudget, icon })}
                      disabled={submitting}
                      className={`p-2 sm:p-3 rounded-lg text-xl sm:text-2xl transition-all duration-200 disabled:opacity-50 ${
                        newBudget.icon === icon ? 'bg-primary scale-110' : 'bg-[#2a2a2a] hover:bg-[#333]'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Amount */}
              <div>
                <label className="block text-gray-300 text-xs sm:text-sm font-medium mb-2">Monthly Budget Limit</label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    placeholder="500"
                    step="50"
                    value={newBudget.budget}
                    onChange={(e) => setNewBudget({ ...newBudget, budget: e.target.value })}
                    disabled={submitting}
                    className="w-full bg-[#2a2a2a] border border-[#444] rounded-lg pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50"
                  />
                </div>
                <p className="text-gray-500 text-xs mt-2">Set how much you want to spend in this category per month</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={submitting}
                  className="flex-1 bg-[#2a2a2a] hover:bg-[#333] text-gray-300 font-medium rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base transition-all duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddBudget}
                  disabled={isCreateDisabled}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {editingBudget ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editingBudget ? 'Update Budget' : 'Create Budget'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Budgeting;