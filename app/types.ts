export type Expense = {
  id: number
  description: string
  amount: number
  installmentAmount: number
  date: string
  bank: string
  cardLastFour: string
  category: string
  installments: number
  currentInstallment: number
  installmentNumber: number | null
  type: string | null
  createdAt: Date
  updatedAt: Date
  creditCardId: number | null
}

export type CreditCard = {
  id: number
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
  }>
  creditCardUsage: Array<{
    name: string
    limit: number
    used: number
  }>
}

