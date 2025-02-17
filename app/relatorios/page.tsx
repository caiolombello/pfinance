"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GastosPorCategoria } from "../components/gastos-por-categoria"
import { GastosMensais } from "../components/gastos-mensais"
import { EstatisticasGerais } from "../components/estatisticas-gerais"
import { GastosPorCartao } from "../components/gastos-por-cartao"
import type { Expense } from "../types"
import { Loader2 } from "lucide-react"

// Formato JSON esperado da API:
/*
{
  "expenses": [
    {
      "id": number,
      "description": string,
      "amount": number,
      "date": string,
      "bank": string,
      "cardLastFour": string,
      "category": string
    }
  ]
}
*/

export default function RelatoriosPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchExpenses() {
      try {
        setIsLoading(true)
        const response = await fetch("/api/expenses")
        const data = await response.json()
        setExpenses(data.expenses)
      } catch (error) {
        console.error("Erro ao buscar despesas:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchExpenses()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!expenses.length) {
    return <div>Nenhuma despesa encontrada</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Relatórios</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Gastos por Categoria</CardTitle>
            <CardDescription>Distribuição dos seus gastos por categoria</CardDescription>
          </CardHeader>
          <CardContent>
            <GastosPorCategoria expenses={expenses} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Gastos Mensais</CardTitle>
            <CardDescription>Visão geral dos seus gastos mensais</CardDescription>
          </CardHeader>
          <CardContent>
            <GastosMensais expenses={expenses} />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas Gerais</CardTitle>
          <CardDescription>Resumo geral das suas despesas</CardDescription>
        </CardHeader>
        <CardContent>
          <EstatisticasGerais expenses={expenses} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Gastos por Cartão</CardTitle>
          <CardDescription>Distribuição dos seus gastos por cartão de crédito</CardDescription>
        </CardHeader>
        <CardContent>
          <GastosPorCartao expenses={expenses} />
        </CardContent>
      </Card>
    </div>
  )
}

