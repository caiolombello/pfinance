export interface Expense {
  id: number
  description: string
  amount: number
  date: string
  bank: string
  cardLastFour: string
  category: string
}

export interface CreditCard {
  id: string
  bank: string
  lastFour: string
  limit: number
  currentSpending: number
}

export interface FinancialGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: string
  category: string
}

export interface DashboardData {
  totalExpenses: number
  expenseChange: number
  biggestExpense: {
    category: string
    amount: number
  }
  mostUsedCard: {
    name: string
    usage: number
  }
  savings: {
    amount: number
    change: number
  }
  monthlyOverview: Array<{
    month: string
    expenses: number
  }>
  recentExpenses: Array<{
    id: number
    description: string
    amount: number
    date: string
  }>
  creditCardUsage: Array<{
    name: string
    limit: number
    used: number
  }>
} 