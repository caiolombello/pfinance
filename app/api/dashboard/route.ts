import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { DashboardData } from "../types"

export async function GET() {
  try {
    // Buscar todas as despesas
    const expenses = await prisma.expense.findMany({
      orderBy: { date: "desc" }
    })

    // Buscar cartões de crédito
    const creditCards = await prisma.creditCard.findMany()

    // Calcular gastos totais do mês atual
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    const currentMonthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate.getMonth() === currentMonth && 
             expenseDate.getFullYear() === currentYear
    })

    const totalExpenses = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0)

    // Calcular gastos do mês anterior para comparação
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

    const lastMonthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate.getMonth() === lastMonth && 
             expenseDate.getFullYear() === lastMonthYear
    })

    const lastMonthTotal = lastMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    const expenseChange = lastMonthTotal ? ((totalExpenses - lastMonthTotal) / lastMonthTotal) * 100 : 0

    // Encontrar maior gasto por categoria (apenas do mês atual)
    const expensesByCategory = currentMonthExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    }, {} as Record<string, number>)

    const biggestExpenseCategory = Object.entries(expensesByCategory).reduce(
      (max, [category, amount]) => 
        amount > max.amount ? { category, amount } : max,
      { category: "", amount: 0 }
    )

    // Calcular cartão mais usado
    const expensesByCard = expenses.reduce((acc, expense) => {
      if (expense.bank && expense.cardLastFour) {
        const cardKey = `${expense.bank}-${expense.cardLastFour}`
        acc[cardKey] = (acc[cardKey] || 0) + expense.amount
      }
      return acc
    }, {} as Record<string, number>)

    let mostUsedCard = { name: "", usage: 0 }
    if (Object.keys(expensesByCard).length > 0) {
      const [cardKey, amount] = Object.entries(expensesByCard).reduce(
        (max, [key, sum]) => (sum > max[1] ? [key, sum] : max),
        ["", 0]
      )
      const [bank, cardLastFour] = cardKey.split("-")
      const card = creditCards.find(c => c.bank === bank && c.lastFour === cardLastFour)
      if (card) {
        mostUsedCard = {
          name: `${card.bank} (${card.lastFour})`,
          usage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
        }
      }
    }

    // Calcular visão geral mensal (últimos 6 meses)
    const monthlyOverview = Array.from({ length: 6 }, (_, i) => {
      const month = new Date()
      month.setMonth(month.getMonth() - i)
      
      const monthExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date)
        return expenseDate.getMonth() === month.getMonth() &&
               expenseDate.getFullYear() === month.getFullYear()
      })

      const total = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0)

      return {
        month: month.toLocaleString('pt-BR', { month: 'short' }).toUpperCase(),
        expenses: total
      }
    }).reverse()

    // Buscar todas as metas financeiras
    const goals = await prisma.financialGoal.findMany()
    
    // Calcular economia total (soma dos valores atuais de todas as metas)
    const totalSavings = goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
    
    // Calcular total alvo (soma dos valores alvo de todas as metas)
    const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0)
    
    // Calcular porcentagem em relação à meta total
    const savingsChange = totalTarget > 0 
      ? (totalSavings / totalTarget) * 100 
      : 0

    // Preparar despesas recentes (apenas as do mês atual)
    const recentExpenses = currentMonthExpenses
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
      .map(e => ({
        id: e.id,
        description: e.description,
        amount: e.amount,
        date: e.date.toISOString(),
        category: e.category
      }))

    const dashboardData: DashboardData = {
      totalExpenses,
      expenseChange,
      biggestExpense: biggestExpenseCategory,
      mostUsedCard,
      savings: {
        amount: totalSavings,
        change: savingsChange
      },
      monthlyOverview,
      recentExpenses,
      creditCardUsage: creditCards.map(card => ({
        name: `${card.bank} (${card.lastFour})`,
        limit: card.limit,
        used: card.currentSpending
      }))
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json(
      { error: "Erro ao buscar dados do dashboard" },
      { status: 500 }
    )
  }
} 