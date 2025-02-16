"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "./components/overview"
import { RecentExpenses } from "./components/recent-expenses"
import { CreditCardUsage } from "./components/credit-card-usage"
import { Loader2 } from "lucide-react"

interface DashboardData {
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

// Formato JSON esperado da API:
/*
{
  "totalExpenses": number,
  "expenseChange": number,
  "biggestExpense": {
    "category": string,
    "amount": number
  },
  "mostUsedCard": {
    "name": string,
    "usage": number
  },
  "savings": {
    "amount": number,
    "change": number
  },
  "monthlyOverview": [
    { "month": string, "expenses": number }
  ],
  "recentExpenses": [
    {
      "id": number,
      "description": string,
      "amount": number,
      "date": string
    }
  ],
  "creditCardUsage": [
    {
      "name": string,
      "limit": number,
      "used": number
    }
  ]
}
*/

export default function Home() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setIsLoading(true)
        const response = await fetch("/api/dashboard")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setDashboardData(data)
      } catch (err) {
        setError("Erro ao carregar os dados do dashboard. Por favor, tente novamente mais tarde.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return <div>{error}</div>
  }

  if (!dashboardData) {
    return <div>Nenhum dado disponível</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos Totais</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {dashboardData.totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.expenseChange > 0 ? "+" : ""}
              {dashboardData.expenseChange.toFixed(1)}% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maior Gasto</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.biggestExpense.category}</div>
            <p className="text-xs text-muted-foreground">R$ {dashboardData.biggestExpense.amount.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cartão Mais Usado</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.mostUsedCard.name}</div>
            <p className="text-xs text-muted-foreground">{dashboardData.mostUsedCard.usage}% dos gastos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Economia</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {dashboardData.savings.amount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.savings.change > 0 ? "+" : ""}
              {dashboardData.savings.change.toFixed(1)}% em relação à meta
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Visão Geral</CardTitle>
            <CardDescription>
              Visão geral dos seus gastos nos últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview 
              data={dashboardData.monthlyOverview} 
              totalExpenses={dashboardData.totalExpenses}
              expenseChange={dashboardData.expenseChange}
              topCategory={{
                name: dashboardData.biggestExpense.category,
                amount: dashboardData.biggestExpense.amount
              }}
              creditCards={dashboardData.creditCardUsage.map(card => ({
                bank: card.name.split(' ')[0],
                lastFour: card.name.split(' ')[1] || '0000',
                limit: card.limit,
                currentSpending: card.used
              }))}
            />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Despesas Recentes</CardTitle>
            <CardDescription>Você teve {dashboardData.recentExpenses.length} despesas este mês.</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentExpenses expenses={dashboardData.recentExpenses} />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Uso dos Cartões de Crédito</CardTitle>
          <CardDescription>Acompanhe o uso dos seus cartões de crédito.</CardDescription>
        </CardHeader>
        <CardContent>
          <CreditCardUsage data={dashboardData.creditCardUsage} />
        </CardContent>
      </Card>
    </div>
  )
}

