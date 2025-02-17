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

    // Encontrar maior gasto por categoria
    const expensesByCategory = currentMonthExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    }, {} as Record<string, number>)

    const biggestExpense = Object.entries(expensesByCategory).reduce(
      (max, [category, amount]) => 
        amount > (max.amount || 0) ? { category, amount } : max,
      { category: "", amount: 0 }
    )

    // Calcular cartão mais usado
    const cardUsage = currentMonthExpenses.reduce((acc, expense) => {
      if (expense.bank && expense.cardLastFour) {
        const cardName = `${expense.bank} ${expense.cardLastFour}`
        acc[cardName] = (acc[cardName] || 0) + expense.amount
      }
      return acc
    }, {} as Record<string, number>)

    const mostUsedCard = Object.entries(cardUsage).reduce(
      (max, [name, amount]) => {
        const usage = (amount / totalExpenses) * 100
        return usage > (max.usage || 0) ? { name, usage } : max
      },
      { name: "", usage: 0 }
    )

    // Calcular visão mensal (últimos 6 meses)
    const monthlyOverview = Array.from({ length: 6 }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const month = date.toLocaleString('pt-BR', { month: 'short' })
      const monthExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date)
        return expenseDate.getMonth() === date.getMonth() &&
               expenseDate.getFullYear() === date.getFullYear()
      })
      const expenses_total = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
      return { month, expenses: expenses_total }
    }).reverse()

    const dashboardData: DashboardData = {
      totalExpenses,
      expenseChange,
      biggestExpense,
      mostUsedCard,
      savings: {
        amount: 0,
        change: 0
      },
      monthlyOverview,
      recentExpenses: currentMonthExpenses.slice(0, 5).map(expense => ({
        id: expense.id,
        description: expense.description,
        amount: expense.amount,
        date: expense.date.toISOString()
      })),
      creditCardUsage: creditCards.map(card => ({
        name: `${card.bank} ${card.lastFour}`,
        limit: card.limit,
        used: card.currentSpending
      }))
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error)
    return NextResponse.json(
      { error: "Erro ao buscar dados do dashboard" },
      { status: 500 }
    )
  }
} 