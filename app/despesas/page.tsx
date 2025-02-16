"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExpensesTable } from "../components/expenses-table"
import { LoadingState } from "../components/loading-state"
import type { Expense } from "../types"

export default function DespesasPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchExpenses() {
      try {
        const response = await fetch("/api/expenses")
        const data = await response.json()
        setExpenses(data.expenses)
      } catch (error) {
        console.error("Erro ao buscar despesas:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchExpenses()
  }, [])

  if (loading) {
    return <LoadingState />
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Despesas</CardTitle>
        </CardHeader>
        <CardContent>
          <ExpensesTable expenses={expenses} />
        </CardContent>
      </Card>
    </div>
  )
}

