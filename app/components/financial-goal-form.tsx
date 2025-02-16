"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { FinancialGoal } from "../types"

interface FinancialGoalFormProps {
  onSubmit: (goal: Omit<FinancialGoal, "id">) => void
  initialValues?: FinancialGoal
}

export function FinancialGoalForm({ onSubmit, initialValues }: FinancialGoalFormProps) {
  const [formData, setFormData] = useState<Omit<FinancialGoal, "id">>({
    name: initialValues?.name || "",
    targetAmount: initialValues?.targetAmount || 0,
    currentAmount: initialValues?.currentAmount || 0,
    deadline: initialValues?.deadline || new Date().toISOString().split('T')[0],
    category: initialValues?.category || "",
    createdAt: initialValues?.createdAt || new Date(),
    updatedAt: initialValues?.updatedAt || new Date()
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    if (!initialValues) {
      setFormData({
        name: "",
        targetAmount: 0,
        currentAmount: 0,
        deadline: new Date().toISOString().split('T')[0],
        category: "",
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nome da Meta</Label>
        <Input 
          id="name" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          required 
        />
      </div>
      <div>
        <Label htmlFor="targetAmount">Valor Alvo</Label>
        <Input 
          id="targetAmount" 
          name="targetAmount" 
          type="number" 
          value={formData.targetAmount} 
          onChange={handleChange} 
          required 
          min={0} 
          step="0.01"
        />
      </div>
      <div>
        <Label htmlFor="currentAmount">Valor Atual</Label>
        <Input 
          id="currentAmount" 
          name="currentAmount" 
          type="number" 
          value={formData.currentAmount} 
          onChange={handleChange} 
          required 
          min={0} 
          step="0.01"
        />
      </div>
      <div>
        <Label htmlFor="deadline">Data Limite</Label>
        <Input 
          id="deadline" 
          name="deadline" 
          type="date" 
          value={formData.deadline.toString().split('T')[0]} 
          onChange={handleChange} 
          required 
        />
      </div>
      <div>
        <Label htmlFor="category">Categoria</Label>
        <Input 
          id="category" 
          name="category" 
          value={formData.category} 
          onChange={handleChange} 
          required 
        />
      </div>
      <Button type="submit">
        {initialValues ? "Atualizar Meta" : "Criar Meta"}
      </Button>
    </form>
  )
}

