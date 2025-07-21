// Import tools form react
import { createContext, useState, useContext, Children } from "react";

// creating the context
export const BudgetContext =createContext();

// Creating provider component
export const BudgetProvider =({children})=>{
    // creating the data for the provider
    const [income, setIncome] = useState(0);
    const [expenses, setExpenses] = useState([])
    const [budgetLimit, setBudgetLimit] = useState(0);

    // Add new Expense
    const addExpense = (expenses) => {
        setExpenses([...expenses, expense])
    };

// calculation the totals expenses
    const totalSpent = expenses.reduce((acc, item)=> acc + item.amount, 0);
// Subtracting the total spent from the budget 
    const remainingBudget = budgetLimit - totalSpent;

    return(
        <BudgetContext.Provider value={{
            income, setIncome, expenses, addExpense, budgetLimit, setBudgetLimit,totalSpent, remainingBudget
         }}> 
         {children}
         </BudgetContext.Provider>
    )
}

export const useBudget = () => useContext (BudgetContext)
