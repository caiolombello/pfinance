"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExpenseList } from "../components/expense-list"
import { LoadingState } from "../components/loading-state"
import type { Expense } from "../types"

export default function DespesasPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchExpenses()
  }, [])

  async function fetchExpenses() {
    try {
      const response = await fetch("/api/expenses")
      const data = await response.json()
      setExpenses(data.expenses)
    } catch (error) {
      console.error("Erro ao buscar despesas:", error)
      alert("Erro ao carregar despesas")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateExpense = async (updatedExpense: Expense) => {
    try {
      const response = await fetch(`/api/expenses/${updatedExpense.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedExpense)
      })

      if (!response.ok) throw new Error("Falha ao atualizar despesa")
      
      await fetchExpenses() // Recarrega a lista após atualizar
      alert("Despesa atualizada com sucesso")
    } catch (error) {
      console.error("Erro ao atualizar despesa:", error)
      alert("Erro ao atualizar despesa")
    }
  }

  const handleDeleteExpense = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta despesa?")) return

    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: "DELETE"
      })

      if (!response.ok) throw new Error("Falha ao excluir despesa")
      
      await fetchExpenses() // Recarrega a lista após excluir
      alert("Despesa excluída com sucesso")
    } catch (error) {
      console.error("Erro ao excluir despesa:", error)
      alert("Erro ao excluir despesa")
    }
  }

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
          <ExpenseList 
            expenses={expenses} 
            onUpdate={handleUpdateExpense}
            onDelete={handleDeleteExpense}
          />
        </CardContent>
      </Card>
    </div>
  )
}

