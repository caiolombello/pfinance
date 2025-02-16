import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { FinancialGoalForm } from "./financial-goal-form"
import type { FinancialGoal } from "@/app/types"

interface FinancialGoalListProps {
  goals: FinancialGoal[]
  onUpdate: (goal: FinancialGoal) => void
  onDelete: (goalId: string) => void
}

export function FinancialGoalList({ goals, onUpdate, onDelete }: FinancialGoalListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  return (
    <div className="space-y-4">
      {goals.map((goal) => (
        <Card key={goal.id} className="p-4">
          {editingId === goal.id ? (
            <div className="space-y-4">
              <FinancialGoalForm 
                initialValues={goal} 
                onSubmit={(updatedGoal) => {
                  onUpdate({ ...updatedGoal, id: goal.id })
                  setEditingId(null)
                }} 
              />
              <Button 
                variant="outline" 
                onClick={() => setEditingId(null)}
              >
                Cancelar
              </Button>
            </div>
          ) : (
            <CardContent className="p-0">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    {goal.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(goal.currentAmount)} de {formatCurrency(goal.targetAmount)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Meta para: {formatDate(goal.deadline)}
                  </p>
                  <span className="inline-block px-2 py-1 mt-1 text-xs rounded-full bg-secondary">
                    {goal.category}
                  </span>
                </div>
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setEditingId(goal.id)}
                  >
                    Editar
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => onDelete(goal.id)}
                  >
                    Excluir
                  </Button>
                </div>
              </div>
              <Progress 
                value={(goal.currentAmount / goal.targetAmount) * 100} 
                className="h-2"
              />
              <p className="text-sm text-right mt-1">
                {((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)}% alcançado
              </p>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}

