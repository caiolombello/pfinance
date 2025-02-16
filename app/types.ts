export interface Expense {
  id: number
  description: string
  amount: number
  installmentAmount: number
  date: string
  bank: string | null
  cardLastFour: string | null
  category: string
  installments: number
  installmentNumber: number | null
  currentInstallment: number
  type: string | null
  createdAt: Date
  updatedAt: Date
  cardId: number | null
}

export type CreditCard = {
  id: string
  bank: string
  lastFour: string
  limit: number
  currentSpending: number
}

export type MonthlyExpenses = {
  [key: string]: number
}

export type YearlyExpenses = {
  [key: string]: MonthlyExpenses
}

export type FinancialGoal = {
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
    category: string
  }>
  creditCardUsage: Array<{
    name: string
    limit: number
    used: number
  }>
}

