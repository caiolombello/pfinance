"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ExpenseForm } from "./expense-form"
import type { Expense } from "@/app/types"

interface AddExpenseModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onExpenseAdded?: () => void
}

export function AddExpenseModal({ open, onOpenChange, onExpenseAdded }: AddExpenseModalProps) {
  const handleSubmit = async (expenseData: Omit<Expense, "id">) => {
    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expenseData),
      })

      if (!response.ok) throw new Error("Falha ao adicionar despesa")
      await response.json()
      
      onOpenChange(false)
      onExpenseAdded?.()
    } catch (error) {
      console.error("Erro ao adicionar despesa:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Despesa</DialogTitle>
        </DialogHeader>
        <ExpenseForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
}

