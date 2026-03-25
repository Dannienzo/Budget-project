import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

export const categoryOptions = [
  'Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Health', 'Education', 'Travel', 'Housing', 'Technology', 'Sport', 'Other'
]

export const iconOptions = [
  '🍔', '🚗', '🎬', '🛍️', '💡', '🏥', '📚', '✈️', '🏠', '💻', '⚽', '🎯'
];

export const incomeCategories = [
  'Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Refund', 'Bonus', 'Other Income'
]

export const incomeCategoryIcons = [
  '💰', '💼', '🏢', '📈', '🎁', '↩️', '🎉', '💵'
];

export const getCategoryIcon = (category) => {
  let categoryName = ''
  if (!category) return '🎯'
  else if (typeof category === 'string') categoryName = category
  else categoryName = String(category)

  const index = categoryOptions.findIndex(
    cat => cat?.toLowerCase() === categoryName?.toLowerCase()
  );
  return index !== -1 ? iconOptions[index] : '🎯'
}

export const getIncomeCategoryIcon = (category) => {
  let categoryName = ''
  if (!category) return '💵'
  if (typeof category === 'object' && category.name) categoryName = category.name
  else if (typeof category === 'string') categoryName = category
  else categoryName = String(category)

  const index = incomeCategories.findIndex(
    cat => cat?.toLowerCase() === categoryName?.toLowerCase()
  );
  return index !== -1 ? incomeCategoryIcons[index] : '💵';
};

export const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const { api, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({
    monthlyData: [],
    categoryData: [],
    avgMonthlyInflow: 0,
    avgMonthlyOutflow: 0,
    savingsRate: 0,
    spendingTrend: null,
  })

  const genId = () => Date.now()

  const [newTransaction, setNewTransaction] = useState({
    type: "expense",
    category: "",
    amount: "",
    description: "",
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const [serverTotals, setServerTotals] = useState({
    totalIncome: null,
    totalExpenses: null,
    balance: null,
    totalBudget: null,
    recentTransactions: null,
  });

  const formatCurrency = useCallback((amount) => {
    if (amount == null || Number.isNaN(Number(amount))) return formatCurrency.fallback(amount);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(amount));
  }, []);

  formatCurrency.fallback = (amt) => {
    try { return String(amt ?? ""); } catch { return ""; }
  };

  const toNumber = (v) => {
    if (v == null) return 0;
    if (typeof v === "number") return v;
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const localTotalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + toNumber(t.amount), 0);

  const localTotalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + toNumber(t.amount), 0);

  const localBalance = localTotalIncome - localTotalExpenses;

  const totalIncome = serverTotals.totalIncome !== null ? toNumber(serverTotals.totalIncome) : localTotalIncome;
  const totalExpenses = serverTotals.totalExpenses !== null ? toNumber(serverTotals.totalExpenses) : localTotalExpenses;
  const balance = serverTotals.balance !== null ? toNumber(serverTotals.balance) : localBalance;
  const totalBudget = serverTotals.totalBudget !== null ? toNumber(serverTotals.totalBudget) : budgets.reduce((s, b) => s + (b.budget || 0), 0);

  const pendingTransactions = transactions.filter((t) => t.status === "pending").length;
  const avgMonthlyExpenses = totalExpenses;
  const spendingRate = totalIncome > 0 ? ((totalExpenses / totalIncome) * 100) : 0;
  const budgetAdherence = budgets.length > 0 ? ((budgets.filter(b => b.spent <= b.budget).length / budgets.length) * 100) : 0;
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = totalBudget - totalSpent;

  const fetchTransactions = useCallback(async () => {
    if (!api || !isAuthenticated) return;
    try {
      setLoading(true);
      const resp = await api.get("transactions/");
      if (resp?.data) {
        const list = Array.isArray(resp.data) ? resp.data : (resp.data.results ?? resp.data);
        if (Array.isArray(list)) setTransactions(list);
      }
    } catch (err) {
      console.warn("fetchTransactions failed", err);
    } finally {
      setLoading(false);
    }
  }, [api, isAuthenticated]);

  const fetchDashboardData = useCallback(async () => {
    if (!api || !isAuthenticated) return;
    try {
      setLoading(true);
      const resp = await api.get("dashboard/");
      if (resp?.data) {
        const d = resp.data;
        setServerTotals({
          totalIncome: d.total_income ?? null,
          totalExpenses: d.total_expense ?? null,
          balance: d.balance ?? null,
          totalBudget: d.total_budget ?? null,
          recentTransactions: Array.isArray(d.recent_transactions) ? d.recent_transactions : null,
        });
        if (Array.isArray(d.recent_transactions)) {
          setTransactions((prev) => {
            const ids = new Set(prev.map((t) => t.id));
            const merged = [...d.recent_transactions, ...prev.filter((p) => !ids.has(p.id))];
            return merged;
          });
        }
      }
    } catch (err) {
      console.warn("fetchDashboardData failed", err);
    } finally {
      setLoading(false);
    }
  }, [api, isAuthenticated]);

  const fetchBudgets = useCallback(async () => {
    if (!api || !isAuthenticated) return;
    try {
      setLoading(true);
      const resp = await api.get("budgets/");
      const list = Array.isArray(resp.data) ? resp.data : resp.data.results ?? [];
      const mapped = list.map((b) => ({
        id: b.id,
        category: b.name ?? b.category ?? "Unknown",
        budget: Number(b.amount ?? b.budget ?? 0),
        spent: Number(b.spent ?? 0),
        icon: b.icon ?? "🏷️",
      }));
      setBudgets(mapped);
    } catch (err) {
      console.warn("fetchBudgets failed", err);
      toast.error("Failed to load budgets");
    } finally {
      setLoading(false);
    }
  }, [api, isAuthenticated]);

  const handleAddTransaction = useCallback(async (overrideTransaction) => {
    const tx = overrideTransaction ?? newTransaction;
    if (!tx.type || !tx.amount) return { ok: false, error: "Missing fields" };

    const payload = {
      type: tx.type,
      amount: parseFloat(tx.amount),
      description: tx.description ?? "",
      date: tx.date || new Date().toISOString().split("T")[0],
    };

    const tempId = Date.now() * -1;
    const optimisticTx = { id: tempId, ...payload, status: tx.status ?? "completed", type: tx.type };
    setTransactions((prev) => [optimisticTx, ...prev]);

    if (!api) {
      setNewTransaction({ type: "expense", category: "", amount: "", description: "" });
      setShowAddForm(false);
      toast.success("Transaction added (local)");
      return { ok: true, data: optimisticTx };
    }

    try {
      if (tx.category && tx.category !== "") {
        if (typeof tx.category === "number") {
          payload.category = tx.category;
        } else if (!Number.isNaN(Number(tx.category)) && String(tx.category).trim() !== "") {
          payload.category = Number(tx.category);
        } else {
          let categoryId = null;
          try {
            const searchQ = encodeURIComponent(String(tx.category).trim());
            let listResp = null;
            try {
              listResp = await api.get(`categories/?search=${searchQ}`);
            } catch {
              listResp = await api.get("categories/");
            }
            const listData = Array.isArray(listResp.data) ? listResp.data : listResp.data.results ?? [];
            const match = listData.find(
              (c) => String(c.name).toLowerCase() === String(tx.category).trim().toLowerCase()
            );
            if (match) {
              categoryId = match.id;
            } else {
              const createResp = await api.post("categories/", { name: tx.category, description: "" });
              categoryId = createResp.data.id;
            }
          } catch (catErr) {
            console.warn("Category lookup/create failed", catErr);
          }
          if (categoryId !== null) payload.category = categoryId;
        }
      } else {
        payload.category = null;
      }

      const resp = await api.post("transactions/", payload);
      const created = resp.data;
      setTransactions((prev) => {
        const withoutTemp = prev.filter((p) => p.id !== tempId);
        return [created, ...withoutTemp];
      });
      await fetchDashboardData();
      await fetchTransactions();
      await fetchBudgets();
      setNewTransaction({ type: "expense", category: "", amount: "", description: "", date: "" });
      setShowAddForm(false);
      toast.success("Transaction added");
      return { ok: true, data: created };
    } catch (err) {
      console.error("Add transaction failed", err);
      const serverMsg = err?.response?.data;
      if (serverMsg && typeof serverMsg === "object") {
        const parts = Object.entries(serverMsg).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`);
        toast.error(parts.join(' — '));
      } else {
        toast.error(err.message || "Failed to add transaction");
      }
      setTransactions((prev) => prev.filter((p) => p.id !== tempId));
      return { ok: false, error: err };
    }
  }, [api, newTransaction, fetchDashboardData, fetchTransactions, fetchBudgets]);

  const addBudget = useCallback(async (payload) => {
    const normalizedPayload = {
      category: payload.category || payload.name,
      budget: payload.budget ?? payload.amount,
      icon: payload.icon || "🏷️",
      spent: payload.spent || 0
    };
    const temp = { id: genId(), ...normalizedPayload };
    setBudgets((s) => [temp, ...s]);

    if (!api) {
      toast.success("Budget Added (local)");
      return { ok: true, data: temp };
    }

    const snapshot = budgets;
    try {
      let categoryId = null;
      if (typeof temp.category === 'number') {
        categoryId = temp.category;
      } else if (typeof temp.category === 'string') {
        try {
          const categoriesResp = await api.get('categories/');
          const categories = Array.isArray(categoriesResp.data) ? categoriesResp.data : categoriesResp.data.results ?? [];
          const existingCategory = categories.find(c => c.name.toLowerCase() === temp.category.toLowerCase());
          if (existingCategory) {
            categoryId = existingCategory.id;
          } else {
            const newCategoryResp = await api.post('categories/', { name: temp.category, description: `Budget category: ${temp.category}` });
            categoryId = newCategoryResp.data.id;
          }
        } catch (catErr) {
          console.error('Category lookup/create failed', catErr);
          toast.error('Failed to process category');
          setBudgets(snapshot);
          return { ok: false, error: catErr };
        }
      }

      if (!categoryId) {
        toast.error('Invalid category');
        setBudgets(snapshot);
        return { ok: false, error: 'No category ID' };
      }

      const resp = await api.post('budgets/', { category: categoryId, amount: Number(temp.budget), icon: temp.icon });
      const created = resp.data;
      setBudgets((prev) =>
        prev.map((b) => b.id === temp.id ? {
          ...b,
          id: created.id,
          category: created.name ?? b.category,
          budget: Number(created.amount ?? b.budget),
          spent: Number(created.spent ?? b.spent),
          icon: created.icon ?? b.icon
        } : b)
      );
      await fetchBudgets();
      toast.success('Budget Added Successfully');
      return { ok: true, data: created };
    } catch (err) {
      console.error('addBudget failed', err);
      setBudgets(snapshot);
      const serverMsg = err?.response?.data;
      if (serverMsg && typeof serverMsg === "object") {
        const parts = Object.entries(serverMsg).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`);
        toast.error(`Failed: ${parts.join(' — ')}`);
      } else {
        toast.error('Failed to add Budget');
      }
      return { ok: false, error: err };
    }
  }, [api, budgets, fetchBudgets]);

  const updateBudget = useCallback(async (id, updates) => {
    const snapshot = budgets;
    setBudgets((prevList) => prevList.map((b) => (b.id === id ? { ...b, ...updates } : b)));

    if (!api) {
      toast.success("Budget updated (local)");
      return { ok: true };
    }

    try {
      const payload = {}
      if (updates.category) payload.name = updates.category;
      if (updates.budget !== undefined) payload.amount = Number(updates.budget);
      if (updates.icon) payload.icon = updates.icon;
      if (updates.spent !== undefined) payload.spent = Number(updates.spent);

      const resp = await api.patch(`budgets/${id}/`, payload);
      setBudgets((prev) =>
        prev.map((b) => b.id === id ? {
          ...b,
          category: resp.data.name ?? b.category,
          budget: Number(resp.data.amount ?? b.budget),
          spent: Number(resp.data.spent ?? b.spent),
          icon: resp.data.icon ?? b.icon
        } : b)
      );
      await fetchBudgets();
      toast.success("Budget Updated");
      return { ok: true };
    } catch (err) {
      console.error("Update failed", err);
      setBudgets(snapshot);
      toast.error("Failed to update Budget");
      return { ok: false, error: err };
    }
  }, [api, budgets, fetchBudgets]);

  const deleteBudget = useCallback(async (id) => {
    const snapshot = budgets;
    setBudgets((s) => s.filter((b) => b.id !== id));

    if (!api) {
      toast.success("Budget removed (local)");
      return { ok: true };
    }

    try {
      await api.delete(`budgets/${id}/`);
      await fetchBudgets();
      toast.success("Budget removed");
      return { ok: true };
    } catch (err) {
      console.error("deleteBudget failed", err);
      setBudgets(snapshot);
      toast.error("Failed to delete budget");
      return { ok: false, error: err };
    }
  }, [api, budgets, fetchBudgets]);

  const fetchAnalytics = useCallback(async () => {
    if (!api || !isAuthenticated) return;
    try {
      setLoading(true);
      const resp = await api.get('analytics/');
      if (resp?.data) {
        const data = resp.data;
        setAnalyticsData({
          monthlyData: data.monthly_data || data.monthlyData || [],
          categoryData: data.category_data || data.categoryData || [],
          avgMonthlyInflow: data.avg_monthly_inflow || data.avgMonthlyInflow || 0,
          avgMonthlyOutflow: data.avg_monthly_outflow || data.avgMonthlyOutflow || 0,
          savingsRate: data.savings_rate || data.SavingsRate || 0,
          spendingTrend: data.spending_trend || data.spendingTrend || null,
        });
      }
    } catch (err) {
      console.warn("Fetching analytics failed", err);
    } finally {
      setLoading(false);
    }
  }, [api, isAuthenticated]);

  const exportTransactionsCSV = useCallback(async (filters = {}) => {
    if (!api || !isAuthenticated) { toast.error('Please login to export file'); return { ok: false }; }
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.startDate) params.append('start_date', filters.startDate);
      if (filters.endDate) params.append('end_date', filters.endDate);
      if (filters.type) params.append('type', filters.type);
      const response = await api.get(`reports/export/csv/?${params.toString()}`, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('✅ CSV downloaded successfully');
      return { ok: true };
    } catch (error) {
      console.error('CSV export failed:', error);
      toast.error('Failed to export CSV');
      return { ok: false, error };
    } finally {
      setLoading(false);
    }
  }, [api, isAuthenticated]);

  const exportTransactionsExcel = useCallback(async (filters = {}) => {
    if (!api || !isAuthenticated) { toast.error('Please login before you can upload'); return { ok: false }; }
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.startDate) params.append('start_date', filters.startDate);
      if (filters.endDate) params.append('end_date', filters.endDate);
      if (filters.type) params.append('type', filters.type);
      const response = await api.get(`reports/export/excel/?${params.toString()}`, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `transactions_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('✅ Excel file downloaded successfully!');
      return { ok: true };
    } catch (error) {
      console.error('Excel export failed:', error);
      toast.error('Failed to export Excel');
      return { ok: false, error };
    } finally {
      setLoading(false);
    }
  }, [api, isAuthenticated]);

  const generateMonthlyPDF = useCallback(async (month = null, year = null) => {
    if (!api || !isAuthenticated) { toast.error('Please login to generate report'); return { ok: false }; }
    try {
      setLoading(true);
      const currentDate = new Date();
      const reportMonth = month || currentDate.getMonth() + 1;
      const reportYear = year || currentDate.getFullYear();
      const response = await api.get(`reports/monthly-pdf/?month=${reportMonth}&year=${reportYear}`, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `monthly_report_${reportYear}_${reportMonth.toString().padStart(2, '0')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('✅ PDF report generated successfully!');
      return { ok: true };
    } catch (error) {
      console.error('Generate PDF failed:', error);
      toast.error('Failed to generate PDF report');
      return { ok: false, error };
    } finally {
      setLoading(false);
    }
  }, [api, isAuthenticated]);

  const previewBankCSV = useCallback(async (file) => {
    if (!api || !isAuthenticated) { toast.error('Please login to preview CSV'); return { ok: false }; }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('reports/import/preview/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      return { ok: true, data: response.data };
    } catch (error) {
      console.error('Preview CSV failed:', error);
      toast.error(error?.response?.data?.error || 'Failed to preview CSV');
      return { ok: false, error };
    } finally {
      setLoading(false);
    }
  }, [api, isAuthenticated]);

  const importBankCSV = useCallback(async (file, bankType = 'generic') => {
    if (!api || !isAuthenticated) { toast.error('Please login to import CSV'); return { ok: false }; }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bank_type', bankType);
      const response = await api.post('reports/import/upload/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      const { created, duplicates, errors } = response.data;
      toast.success(`✅ Import complete! ${created} created, ${duplicates} duplicates skipped, ${errors} errors`, { autoClose: 5000 });
      if (fetchTransactions) await fetchTransactions();
      return { ok: true, data: response.data };
    } catch (error) {
      console.error('Import CSV failed:', error);
      toast.error(error?.response?.data?.error || 'Failed to import CSV');
      return { ok: false, error };
    } finally {
      setLoading(false);
    }
  }, [api, isAuthenticated, fetchTransactions]);

  useEffect(() => {
    if (!isAuthenticated) {
      setBudgets([]);
      setTransactions([]);
      setAnalyticsData({
        monthlyData: [],
        categoryData: [],
        avgMonthlyInflow: 0,
        avgMonthlyOutflow: 0,
        savingsRate: 0,
        spendingTrend: null,
      });
      setServerTotals({
        totalIncome: null,
        totalExpenses: null,
        balance: null,
        totalBudget: null,
        recentTransactions: null,
      });
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!api || !isAuthenticated) return;
    fetchDashboardData();
    fetchTransactions();
    fetchBudgets();
    fetchAnalytics();
  }, [api, isAuthenticated, fetchDashboardData, fetchTransactions, fetchBudgets, fetchAnalytics]);

  return (
    <BudgetContext.Provider
      value={{
        transactions,
        setTransactions,
        handleAddTransaction,
        budgets,
        setBudgets,
        addBudget,
        updateBudget,
        deleteBudget,
        newTransaction,
        setNewTransaction,
        showAddForm,
        setShowAddForm,
        totalIncome,
        totalExpenses,
        balance,
        totalBudget,
        totalSpent,
        totalRemaining,
        avgMonthlyExpenses,
        formatCurrency,
        categoryOptions,
        iconOptions,
        incomeCategories,
        incomeCategoryIcons,
        getCategoryIcon,
        getIncomeCategoryIcon,
        pendingTransactions,
        loading,
        spendingRate,
        budgetAdherence,
        fetchBudgets,
        fetchDashboardData,
        fetchTransactions,
        analyticsData,
        api,
        fetchAnalytics,
        exportTransactionsCSV,
        exportTransactionsExcel,
        generateMonthlyPDF,
        previewBankCSV,
        importBankCSV,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => useContext(BudgetContext);