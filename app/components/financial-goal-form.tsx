"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { FinancialGoal } from "@/app/types"

interface FinancialGoalFormProps {
  onSubmit: (goalData: Omit<FinancialGoal, "id">) => Promise<void>
  initialValues?: Partial<FinancialGoal>
}

export function FinancialGoalForm({ onSubmit, initialValues }: FinancialGoalFormProps) {
  const [formData, setFormData] = useState<Omit<FinancialGoal, "id" | "createdAt" | "updatedAt">>({
    name: initialValues?.name || "",
    targetAmount: initialValues?.targetAmount || 0,
    currentAmount: initialValues?.currentAmount || 0,
    deadline: initialValues?.deadline || new Date().toISOString().split('T')[0],
    category: initialValues?.category || ""
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await onSubmit(formData)
      // Resetar o formulário após o envio bem-sucedido
      setFormData({
        name: "",
        targetAmount: 0,
        currentAmount: 0,
        deadline: new Date().toISOString().split('T')[0],
        category: ""
      })
    } catch (error) {
      console.error("Erro ao criar meta:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Nome da meta"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <Input
        type="number"
        placeholder="Valor alvo"
        value={formData.targetAmount}
        onChange={(e) => setFormData({ ...formData, targetAmount: Number(e.target.value) })}
        required
      />
      <Input
        type="number"
        placeholder="Valor atual"
        value={formData.currentAmount}
        onChange={(e) => setFormData({ ...formData, currentAmount: Number(e.target.value) })}
        required
      />
      <Input
        type="date"
        value={formData.deadline}
        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
        required
      />
      <Input
        placeholder="Categoria"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        required
      />
      <Button type="submit">
        Salvar Meta
      </Button>
    </form>
  )
}

