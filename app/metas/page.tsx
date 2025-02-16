"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FinancialGoalForm } from "../components/financial-goal-form"
import { FinancialGoalList } from "../components/financial-goal-list"
import { LoadingState } from "../components/loading-state"
import type { FinancialGoal } from "../types"

// Formato JSON esperado da API:
/*
{
  "goals": [
    {
      "id": string,
      "name": string,
      "targetAmount": number,
      "currentAmount": number,
      "deadline": string,
      "category": string
    }
  ]
}
*/

export default function MetasPage() {
  const [goals, setGoals] = useState<FinancialGoal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    fetchGoals()
  }, [])

  const fetchGoals = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/financial-goals")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setGoals(data.goals)
    } catch (err) {
      setError("Erro ao carregar as metas financeiras. Por favor, tente novamente mais tarde.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddGoal = async (newGoal: Omit<FinancialGoal, "id">) => {
    try {
      const response = await fetch("/api/financial-goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newGoal),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const addedGoal = await response.json()
      setGoals([...goals, addedGoal])
      setShowAddForm(false) // Esconde o formulário após adicionar
    } catch (err) {
      console.error("Erro ao adicionar meta:", err)
    }
  }

  const handleUpdateGoal = async (updatedGoal: FinancialGoal) => {
    try {
      const response = await fetch(`/api/financial-goals/${updatedGoal.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedGoal),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      setGoals(goals.map((goal) => (goal.id === updatedGoal.id ? updatedGoal : goal)))
    } catch (err) {
      console.error("Erro ao atualizar meta:", err)
    }
  }

  const handleDeleteGoal = async (goalId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta meta?")) return

    try {
      const response = await fetch(`/api/financial-goals/${goalId}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      setGoals(goals.filter((goal) => goal.id !== goalId))
    } catch (err) {
      console.error("Erro ao excluir meta:", err)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <LoadingState />
      </div>
    )
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Metas Financeiras</h1>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Cancelar" : "Nova Meta"}
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Nova Meta</CardTitle>
            <CardDescription>
              Defina os detalhes da sua meta financeira
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FinancialGoalForm onSubmit={handleAddGoal} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Suas Metas</CardTitle>
          <CardDescription>
            Acompanhe o progresso das suas metas financeiras
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FinancialGoalList 
            goals={goals} 
            onUpdate={handleUpdateGoal} 
            onDelete={handleDeleteGoal} 
          />
        </CardContent>
      </Card>
    </div>
  )
}

