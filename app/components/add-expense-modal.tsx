"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ExpenseForm } from "./expense-form"
import { useModal } from "../contexts/ModalContext"
import type { Expense } from "../types"

export function AddExpenseModal() {
  const { isOpen, closeModal } = useModal()

  const handleAddExpense = async (newExpense: Omit<Expense, "id">) => {
    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newExpense),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const addedExpense = await response.json()
      closeModal()
      window.location.reload() // Recarrega a página para atualizar a lista
    } catch (err) {
      console.error("Erro ao adicionar despesa:", err)
      // Adicione tratamento de erro adequado aqui
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Nova Despesa</DialogTitle>
          <DialogDescription>
            Preencha os detalhes da nova despesa abaixo.
          </DialogDescription>
        </DialogHeader>
        <ExpenseForm onSubmit={handleAddExpense} />
      </DialogContent>
    </Dialog>
  )
}

